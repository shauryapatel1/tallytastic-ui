import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusChip, type StatusTone } from "./StatusChip";

export interface IntegrationCardProps {
  name: string;
  description?: string;
  /** Logo / icon node — typically an SVG or <img />. */
  logo?: ReactNode;
  status: { label: string; tone: StatusTone };
  /** Last sync / last delivery / etc. */
  lastUsed?: string;
  linkedFormsCount?: number;
  /** Mark as "Planned" — shows a clear non-CTA badge instead of a connect button. */
  planned?: boolean;
  onConnect?: () => void;
  onManage?: () => void;
  className?: string;
}

/**
 * Operational integration card. NEVER implies live support for "planned"
 * providers (per CTO rule).
 */
export function IntegrationCard({
  name,
  description,
  logo,
  status,
  lastUsed,
  linkedFormsCount,
  planned = false,
  onConnect,
  onManage,
  className,
}: IntegrationCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-card border border-border bg-card p-4 shadow-card",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {logo && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
              {logo}
            </span>
          )}
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">{name}</h3>
            {description && (
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {planned ? (
          <StatusChip label="Planned" tone="muted" />
        ) : (
          <StatusChip label={status.label} tone={status.tone} pulse={status.tone === "pending"} />
        )}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        {lastUsed && (
          <div>
            <dt className="uppercase tracking-wide">Last used</dt>
            <dd className="text-foreground">{lastUsed}</dd>
          </div>
        )}
        {typeof linkedFormsCount === "number" && (
          <div>
            <dt className="uppercase tracking-wide">Linked forms</dt>
            <dd className="text-foreground">{linkedFormsCount}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex items-center justify-end gap-2">
        {planned ? (
          <Button variant="ghost" size="sm" disabled>
            Coming soon
          </Button>
        ) : onManage ? (
          <Button variant="outline" size="sm" onClick={onManage}>
            Manage
          </Button>
        ) : onConnect ? (
          <Button variant="default" size="sm" onClick={onConnect}>
            Connect
          </Button>
        ) : null}
      </div>
    </article>
  );
}