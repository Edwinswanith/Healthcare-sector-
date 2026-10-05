import { brand } from "@/content/site";

/** "Tech Cogniverse" wordmark: exact spelling and capitalisation. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`} aria-label={brand.name} role="img">
      <span className="wm-tech" aria-hidden="true">Tech</span>
      <span className="wm-cog" aria-hidden="true">Cogniverse</span>
    </span>
  );
}
