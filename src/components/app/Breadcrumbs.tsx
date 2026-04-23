import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Compact, token-pure breadcrumb. Last crumb is rendered as plain text.
 */
export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm text-muted-foreground", className)}>
      <ol className="flex items-center gap-1">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="rounded px-1 py-0.5 transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={cn("px-1 py-0.5", isLast && "text-foreground font-medium")}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}