import { ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Calm, operational empty state — used by every "no data yet" surface.
 * Always pairs the message with a primary action (per brief).
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-card/50 px-6 py-12 text-center",
        className,
      )}
    >
      {Icon && (
        <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      )}
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      )}
      {(primaryAction || secondaryAction) && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}