import { ReactNode } from "react";
import { type LucideIcon, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { type StatusTone } from "./StatusChip";

const TONE_DOT: Record<StatusTone, string> = {
  neutral: "bg-muted-foreground/40",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  muted: "bg-muted-foreground/40",
  pending: "bg-info animate-status-pulse",
};

/**
 * Single row in an event timeline (submission events, webhook deliveries, audit log).
 * Wrap rows in a parent <ol> for semantic structure.
 */
export function EventLogRow({
  title,
  description,
  timestamp,
  tone = "neutral",
  icon: Icon,
  children,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  timestamp?: string;
  tone?: StatusTone;
  icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <li
      className={cn(
        "relative grid grid-cols-[1rem_1fr_auto] gap-3 border-l border-border pb-4 pl-4 last:border-l-transparent last:pb-0",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute -left-[5px] top-1.5 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full ring-2 ring-background",
          TONE_DOT[tone],
        )}
      >
        {Icon ? <Icon className="h-2 w-2 text-background" /> : <Circle className="hidden" />}
      </span>
      <div className="col-span-1 col-start-2 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
        {children && <div className="mt-1 text-xs text-muted-foreground">{children}</div>}
      </div>
      {timestamp && (
        <time className="col-start-3 shrink-0 text-xs text-muted-foreground">
          {timestamp}
        </time>
      )}
    </li>
  );
}

/** Wrapper to ensure timeline border lines connect cleanly. */
export function EventLog({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <ol className={cn("relative pl-2", className)}>{children}</ol>;
}