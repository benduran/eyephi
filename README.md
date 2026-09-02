# EyePhi

Get your brain and your eyeballs in-sync again by crafting your own vestibular rehabilitation program and completing exercises.

## Here to do some exercises?

Head to https://eyephi.benduran.com to get started crafting your own exercise program and start exercising your eyes!

---

## Getting started with development

### Prerequisites

- **Node.js 26.5.0** and **pnpm 11.24.0** (managed automatically via mise)

### 1. Install mise

```bash
./setup-mise.sh
```
This will install [mise](https://mise.jdx.dev), which makes it super easy to use the exact dependencies requried to build and run this project.
You can then either run [activate](https://mise.jdx.dev/cli/activate.html#mise-activate) or prefix all your commands with `mise x -- pnpm` or `mise x -- node`, etc, to ensure you're running with the correct versions of the toolchain.

### 2. Install dependencies

```bash
mise x -- pnpm install --frozen-lockfile
```

The `mise x --` prefix ensures commands use the project's pinned tool versions.

### 3. Run the development server

```bash
mise x -- pnpm dev
```

### 4. Visit the app in your browser

http://localhost:20202

---

## Available scripts

All commands should be prefixed with `mise x --` to use the correct tool versions:

| Command | Description |
|---------|-------------|
| `mise x -- pnpm dev` | Start development server on port 20202 |
| `mise x -- pnpm build` | Create production build |
| `mise x -- pnpm start` | Start production server |
| `mise x -- pnpm lint` | Run Biome linter |
| `mise x -- pnpm format` | Run Biome formatter with auto-fix |

---

## Architecture overview

EyePhi is a **client-side single-page application** built with Next.js App Router. Key architectural decisions:

- **URL-based state**: Exercise programs are serialized into the URL query string using a custom codec + lz-string compression, enabling zero-backend link sharing
- **No persistence**: Programs exist only in the URL or browser session (no user accounts or database is required with this iteration)
- **Canvas rendering**: Uses the [Kaplay](https://kaplayjs.com/) game engine for exercise animations, with a singleton pattern that parks the canvas between components
- **Monochrome design**: Deliberately restrained color palette to accommodate vestibular sensitivity

### Project structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components (one per file)
├── context/          # React context providers (state management)
├── lib/              # Pure functions (codec, difficulty scoring, etc.)
├── routing/          # URL route builders
├── schema/           # Zod schemas and derived TypeScript types
└── util/             # Small helper functions
```

---

## Deployment

Build for production:

```bash
mise x -- pnpm build
```

The build output is in `.next/` and can be deployed to any Next.js-compatible hosting platform (Vercel, Netlify, etc.) or run with `mise x -- pnpm start` on your own server (which is how I've opted to deploy to https://eyephi.benduran.com).

---

## Design rationale

For detailed information about the technical and design decisions behind EyePhi, see [docs/design-rationale.md](docs/design-rationale.md).

