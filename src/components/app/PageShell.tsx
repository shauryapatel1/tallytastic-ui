import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/**
 * Shared page shell for every authenticated dashboard route.
 *
 * Slots:
 *   - breadcrumbs (optional)
 *   - title + description
 *   - actions (right side of header)
 *   - rightRail (optional — collapses below body on small screens)
 *   - children (main body)
 */
export interface PageShellProps {
  breadcrumbs?: Crumb[];
  title: string;
  description?: string;
  actions?: ReactNode;
  rightRail?: ReactNode;
  /** Make body full-bleed (no padding) — used by inbox-style three-column views. */
  bleed?: boolean;
  children: ReactNode;
  className?: string;
}

export function PageShell({
  breadcrumbs,
  title,
  description,
  actions,
  rightRail,
  bleed = false,
  children,
  className,
}: PageShellProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <div className="border-b border-border bg-background px-6 py-5">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} className="mb-2" />
        )}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
            {description && (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      </div>

      {/* Body + optional right rail */}
      <div className="flex flex-1 overflow-hidden">
        <main
          className={cn(
            "min-w-0 flex-1 overflow-y-auto",
            !bleed && "px-6 py-6",
          )}
        >
          {children}
        </main>
        {rightRail && (
          <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-border bg-muted/30 px-4 py-6 lg:block">
            {rightRail}
          </aside>
        )}
      </div>
    </div>
  );
}