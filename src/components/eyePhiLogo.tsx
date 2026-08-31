'use client';

export type EyePhiLogoProps = {
  className?: string | undefined;
  size?: number | undefined;
};

export function EyePhiLogo({ className, size = 26 }: EyePhiLogoProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      height={size}
      viewBox="0 0 26 26"
      width={size}
    >
      <ellipse
        cx="13"
        cy="13"
        fill="none"
        rx="12"
        ry="7.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="13"
        cy="13"
        fill="none"
        r="4.2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="13" cy="13" fill="currentColor" r="1.6" />
    </svg>
  );
}
