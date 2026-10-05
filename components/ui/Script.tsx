/* eslint-disable @next/next/no-img-element -- pre-processed transparent WebP lettering */

const SIZES: Record<string, [number, number]> = {
  madeclear: [1600, 556],
  plainenglish: [1600, 451],
  approved: [1600, 572],
  letstalk: [1600, 674],
  found: [1600, 639],
};

/** AI-generated brush lettering, revealed on scroll as if being written (left-to-right mask). */
export function Script({ name, tone = "signal", className = "", label }: { name: keyof typeof SIZES | string; tone?: "signal" | "paper"; className?: string; label?: string }) {
  const [w, h] = SIZES[name] ?? [1600, 600];
  return (
    <span className={`script ${className}`} data-script aria-hidden={label ? undefined : true} role={label ? "img" : undefined} aria-label={label}>
      <img src={`/media/script/${name}-${tone}.webp`} alt="" width={w} height={h} loading="lazy" decoding="async" />
    </span>
  );
}
