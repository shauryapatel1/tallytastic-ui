import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  XCircle,
  Ban,
  Loader2,
  type LucideIcon,
} from "lucide-react";

/**
 * Global Ingrid status taxonomy. Used for submissions, webhooks, routing rules,
 * and integrations — same vocabulary everywhere (per CTO rule).
 */
export type StatusTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "muted"
  | "pending";

const TONE_STYLES: Record<StatusTone, string> = {
  neutral: "bg-muted text-foreground",
  info: "bg-info-soft text-info",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  muted: "bg-muted text-muted-foreground",
  pending: "bg-info-soft text-info",
};

const DEFAULT_ICONS: Record<StatusTone, LucideIcon | null> = {
  neutral: Circle,
  info: Circle,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
  muted: Ban,
  pending: Clock,
};

export interface StatusChipProps {
  label: string;
  tone?: StatusTone;
  icon?: LucideIcon | null;
  /** Pulsing dot indicator (for "active" / "in-flight" states) */
  pulse?: boolean;
  className?: string;
}

export function StatusChip({
  label,
  tone = "neutral",
  icon,
  pulse = false,
  className,
}: StatusChipProps) {
  const Icon = icon === null ? null : icon ?? DEFAULT_ICONS[tone];
  const showSpinner = tone === "pending" && pulse;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        TONE_STYLES[tone],
        className,
      )}
    >
      {showSpinner ? (
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
      ) : pulse ? (
        <span
          className="h-1.5 w-1.5 rounded-full bg-current animate-status-pulse"
          aria-hidden
        />
      ) : Icon ? (
        <Icon className="h-3 w-3" aria-hidden />
      ) : null}
      <span>{label}</span>
    </span>
  );
}

/**
 * Convenience map for the submission_status enum so call sites stay consistent.
 */
export const SUBMISSION_STATUS_TONE: Record<
  "new" | "in_progress" | "done" | "archived" | "spam",
  { label: string; tone: StatusTone }
> = {
  new: { label: "New", tone: "info" },
  in_progress: { label: "In progress", tone: "warning" },
  done: { label: "Done", tone: "success" },
  archived: { label: "Archived", tone: "muted" },
  spam: { label: "Spam", tone: "danger" },
};

/**
 * Convenience map for webhook delivery status.
 */
export const WEBHOOK_STATUS_TONE: Record<
  "pending" | "success" | "failed" | "retrying" | "dead",
  { label: string; tone: StatusTone; pulse?: boolean }
> = {
  pending: { label: "Pending", tone: "pending", pulse: true },
  success: { label: "Delivered", tone: "success" },
  failed: { label: "Failed", tone: "danger" },
  retrying: { label: "Retrying", tone: "warning", pulse: true },
  dead: { label: "Dead", tone: "muted" },
};