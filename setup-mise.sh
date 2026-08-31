#!/bin/sh
# Ensures mise is installed on any Unix-based machine (macOS, Linux glibc/musl),
# including Alpine Docker containers (busybox sh, no bash required).
set -eu

MISE_BIN_DIR="${MISE_INSTALL_DIR:-$HOME/.local/bin}"
MISE_BIN="$MISE_BIN_DIR/mise"

log() { printf '[mise-setup] %s\n' "$*"; }
die() { printf '[mise-setup] ERROR: %s\n' "$*" >&2; exit 1; }

already_installed() {
  command -v mise >/dev/null 2>&1 || [ -x "$MISE_BIN" ]
}

# ---------------------------------------------------------------------------
# 1. Skip if mise is already available
# ---------------------------------------------------------------------------
if already_installed; then
  log "mise is already installed ($("$MISE_BIN" --version 2>/dev/null || mise --version))"
  exit 0
fi

# ---------------------------------------------------------------------------
# 2. Install prerequisites (curl, tar, ca-certificates) via the local pkg mgr
# ---------------------------------------------------------------------------
is_alpine() { command -v apk >/dev/null 2>&1; }

install_prereqs() {
  if command -v apk >/dev/null 2>&1; then
    log "Alpine detected: installing prerequisites with apk"
    apk add --no-cache curl tar ca-certificates libgcc
  elif command -v apt-get >/dev/null 2>&1; then
    log "Debian/Ubuntu detected: installing prerequisites with apt"
    apt-get update -y && apt-get install -y curl tar ca-certificates
  elif command -v dnf >/dev/null 2>&1; then
    log "Fedora/RHEL detected: installing prerequisites with dnf"
    dnf install -y curl tar ca-certificates
  elif command -v zypper >/dev/null 2>&1; then
    log "openSUSE detected: installing prerequisites with zypper"
    zypper install -y curl tar ca-certificates
  elif command -v pacman >/dev/null 2>&1; then
    log "Arch detected: installing prerequisites with pacman"
    pacman -Sy --noconfirm curl tar ca-certificates
  elif command -v brew >/dev/null 2>&1; then
    log "macOS (Homebrew) detected: installing prerequisites with brew"
    brew install curl tar
  else
    log "No known package manager found; assuming curl/tar are present"
  fi
}

command -v curl >/dev/null 2>&1 || command -v tar >/dev/null 2>&1 || install_prereqs
command -v curl >/dev/null 2>&1 || install_prereqs
command -v curl >/dev/null 2>&1 || die "curl is required but could not be installed"

# ---------------------------------------------------------------------------
# 3. Install mise
#    First try the official installer, then fall back to a direct musl/glibc
#    tarball download from GitHub releases (needed for some Alpine images).
# ---------------------------------------------------------------------------
install_via_official_script() {
  log "Installing mise via mise.run"
  sh -c "curl -fsSL https://mise.run | sh" && [ -x "$MISE_BIN" ]
}

arch() {
  case "$(uname -m)" in
    aarch64|arm64) printf 'arm64' ;;
    x86_64|amd64)  printf 'x64' ;;
    armv7l|armv7)  printf 'arm' ;;
    *) die "unsupported architecture: $(uname -m)" ;;
  esac
}

libc() {
  # ldd exists everywhere; on Alpine it is busybox/musl
  case "$(ldd --version 2>&1 | head -n 1)" in
    *musl*) printf 'musl' ;;
    *)      printf 'glibc' ;;
  esac
}

install_via_github_tarball() {
  MISE_VERSION="$(curl -fsSL https://api.github.com/repos/jdx/mise/releases/latest | sed -n 's/.*"tag_name": *"\([^"]*\)".*/\1/p' | head -n 1)"
  [ -n "$MISE_VERSION" ] || die "could not determine latest mise release"
  MISE_URL="https://github.com/jdx/mise/releases/download/${MISE_VERSION}/mise-$(uname -s)-$(arch)-$(libc).tar.gz"
  log "Installing mise via direct download: $MISE_URL"
  mkdir -p "$MISE_BIN_DIR"
  curl -fsSL "$MISE_URL" | tar -xz -C "$MISE_BIN_DIR" mise
  chmod +x "$MISE_BIN"
}

if ! install_via_official_script; then
  log "Official installer failed; falling back to direct GitHub download"
  install_via_github_tarball
fi

[ -x "$MISE_BIN" ] || die "mise was not installed to $MISE_BIN"

# ---------------------------------------------------------------------------
# 4. Make mise available to this and future shells
# ---------------------------------------------------------------------------
log "Installed $("$MISE_BIN" --version) to $MISE_BIN"

# Current process
export PATH="$MISE_BIN_DIR:$PATH"

# Future login/interactive shells: prefer an rc file that exists
activate_line="export PATH=\"\$HOME/.local/bin:\$PATH\""
for rc in "$HOME/.profile" "$HOME/.bashrc" "$HOME/.zshrc"; do
  if [ -f "$rc" ] && ! grep -q '.local/bin' "$rc"; then
    printf '\n%s\n' "$activate_line" >> "$rc"
    log "Added ~/.local/bin to PATH in $rc"
    break
  fi
done

# Future login shells: put ~/.local/bin on PATH via profile.d when root
if [ "$(id -u)" = "0" ] && [ -d /etc/profile.d ]; then
  printf '%s\n' "$activate_line" > /etc/profile.d/mise.sh
  log "Wrote /etc/profile.d/mise.sh"
fi

# Container convenience: expose mise in a directory that is already on the
# parent shell's PATH, so sibling commands (e.g. `./setup-mise.sh && mise ...`)
# can find it without activation. Some build images (nixpacks/nix) exclude
# /usr/local/bin from PATH, so we probe the live PATH instead of assuming it.
if [ "$(id -u)" = "0" ]; then
  linked=""
  for dir in /usr/local/bin /usr/bin /bin; do
    case ":$PATH:" in
      *":$dir:"*) ;;
      *) continue ;;
    esac
    if [ -d "$dir" ] && [ -w "$dir" ] && ln -sf "$MISE_BIN" "$dir/mise" 2>/dev/null; then
      linked="$dir"
      break
    fi
  done
  if [ -z "$linked" ]; then
    # Fall back to the first writable directory actually present in PATH
    # (e.g. nix profile dirs like /root/.nix-profile/bin)
    oldIFS=$IFS
    IFS=:
    for dir in $PATH; do
      if [ -n "$dir" ] && [ -d "$dir" ] && [ -w "$dir" ] && ln -sf "$MISE_BIN" "$dir/mise" 2>/dev/null; then
        linked="$dir"
        break
      fi
    done
    IFS=$oldIFS
  fi
  if [ -n "$linked" ]; then
    log "Symlinked mise into $linked"
  else
    log "No writable PATH directory found; mise is at $MISE_BIN"
  fi
fi

log "Done. Activate in your current shell with:"
log "  export PATH=\"\$HOME/.local/bin:\$PATH\" && eval \"\$(mise activate sh)\""
