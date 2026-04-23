import { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: ReactNode;
  /** Optional change indicator, e.g. "+12%" */
  delta?: { value: string; direction: "up" | "down" | "flat"; label?: string };
  icon?: LucideIcon;
  /** Footer slot for sparklines / inline links. */
  footer?: ReactNode;
  loading?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  footer,
  loading,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card p-4 shadow-card",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        {loading ? (
          <span className="block h-7 w-20 animate-pulse rounded bg-muted" />
        ) : (
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </span>
        )}
        {delta && !loading && <DeltaPill {...delta} />}
      </div>
      {footer && <div className="mt-3 text-xs text-muted-foreground">{footer}</div>}
    </div>
  );
}

function DeltaPill({
  value,
  direction,
  label,
}: {
  value: string;
  direction: "up" | "down" | "flat";
  label?: string;
}) {
  const Icon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;
  const tone =
    direction === "up"
      ? "text-success bg-success-soft"
      : direction === "down"
      ? "text-danger bg-danger-soft"
      : "text-muted-foreground bg-muted";
  return (
    <span
      className={cn("inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-medium", tone)}
      aria-label={label}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {value}
    </span>
  );
}