import { cn } from "@/lib/utils";

/**
 * Ingrid mark — three converging lines (inbound signal motif) + wordmark.
 * Token-pure: uses `currentColor` so the parent text color drives the mark.
 */
export function Logo({
  size = 24,
  showWord = true,
  className,
}: {
  size?: number;
  showWord?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="text-primary"
      >
        {/* converging inbound lines */}
        <path d="M3 5 L11 11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M3 12 L11 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M3 19 L11 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        {/* intake node */}
        <circle cx="14" cy="12" r="3" fill="currentColor" />
        {/* outbound */}
        <path d="M17 12 L21 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
      {showWord && (
        <span className="text-base font-semibold tracking-tight">Ingrid</span>
      )}
    </span>
  );
}