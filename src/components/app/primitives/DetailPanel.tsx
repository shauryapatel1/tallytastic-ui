import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Right-rail / inspector panel used by the Submissions inbox and form detail views.
 * Token-pure card with optional section dividers.
 */
export function DetailPanel({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-card border border-border bg-card shadow-card",
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between gap-2 border-b border-border px-4 py-3">
          <div className="min-w-0">
            {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
        </header>
      )}
      <div className="px-4 py-3">{children}</div>
    </section>
  );
}

/** Single key / value row inside a DetailPanel. */
export function DetailRow({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[7rem_1fr] gap-3 border-b border-border py-2 text-sm last:border-b-0",
        className,
      )}
    >
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="min-w-0 break-words text-foreground">{children}</dd>
    </div>
  );
}