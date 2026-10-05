/** Label that rolls up to a duplicate on hover/focus (duplicate is hidden from assistive tech). */
export function Roll({ children }: { children: React.ReactNode }) {
  return (
    <span className="roll">
      <span className="roll-a">{children}</span>
      <span className="roll-b" aria-hidden="true">{children}</span>
    </span>
  );
}
