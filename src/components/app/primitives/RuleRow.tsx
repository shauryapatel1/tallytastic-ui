import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { StatusChip, type StatusTone } from "./StatusChip";

/**
 * Routing rule row — uses the "When / If / Then" pattern from the brief.
 * Avoid heavy node-canvas builders (deferred per plan).
 */
export function RuleRow({
  name,
  when,
  ifCond,
  then,
  status,
  meta,
  actions,
  className,
}: {
  name: string;
  when: ReactNode;
  ifCond?: ReactNode;
  then: ReactNode;
  status?: { label: string; tone: StatusTone };
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-card border border-border bg-card p-4 shadow-card",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{name}</h3>
          {meta && <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>}
        </div>
        <div className="flex items-center gap-2">
          {status && <StatusChip label={status.label} tone={status.tone} />}
          {actions}
        </div>
      </header>

      <div className="mt-3 grid gap-2 text-sm md:grid-cols-3">
        <RulePart label="When" value={when} />
        <RulePart label="If" value={ifCond ?? <span className="text-muted-foreground">Always</span>} />
        <RulePart label="Then" value={then} />
      </div>
    </article>
  );
}

function RulePart({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-md bg-muted/40 p-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 text-sm text-foreground">{value}</div>
    </div>
  );
}