import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Operational table chrome — header / body wrapper used by Forms list, Routing,
 * Submissions, etc. The table itself is rendered as children so call sites
 * keep full control of columns.
 *
 * Use semantic HTML <table> directly inside, OR pass a non-table grid.
 */
export function TableShell({
  children,
  toolbar,
  footer,
  className,
}: {
  children: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border border-border bg-card shadow-card",
        className,
      )}
    >
      {toolbar && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
          {toolbar}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
      {footer && (
        <div className="border-t border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}

/** Token-styled <th> for use inside TableShell tables. */
export function Th({
  children,
  className,
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}) {
  return (
    <th
      className={cn(
        "px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground",
        align === "right" && "text-right",
        align === "center" && "text-center",
        align === "left" && "text-left",
        className,
      )}
    >
      {children}
    </th>
  );
}

/** Token-styled <td>. */
export function Td({
  children,
  className,
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}) {
  return (
    <td
      className={cn(
        "px-3 py-2.5 text-sm text-foreground",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </td>
  );
}

/** Token-styled <tr> with hover affordance. */
export function Tr({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-t border-border first:border-t-0 transition-colors hover:bg-muted/40",
        className,
      )}
      {...rest}
    >
      {children}
    </tr>
  );
}