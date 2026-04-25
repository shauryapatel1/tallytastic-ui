import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { DocsSearch } from "./DocsSearch";
import { useScrollSpy } from "./useScrollSpy";

const sections = [
  {
    title: "Get started",
    items: [
      { to: "/docs", label: "Introduction", end: true },
      { to: "/docs/quickstart", label: "Quickstart" },
    ],
  },
  {
    title: "Core concepts",
    items: [
      { to: "/docs/submissions", label: "Submissions" },
      { to: "/docs/webhooks", label: "Webhooks" },
      { to: "/docs/routing", label: "Routing rules" },
    ],
  },
  {
    title: "Reference",
    items: [
      { to: "/docs/api", label: "API reference" },
    ],
  },
];

export const DocsLayout = () => {
  const { theme, setTheme } = useTheme();
  const { pathname, hash } = useLocation();
  const { headings, activeId } = useScrollSpy(pathname);

  // On route change, scroll to hash if present, otherwise to top
  useEffect(() => {
    if (hash) {
      // Defer until the new page mounts so the target exists
      const id = hash.replace(/^#/, "");
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-semibold text-foreground">Ingrid</span>
              <span className="text-muted-foreground">/ Docs</span>
            </Link>
          </div>
          <div className="flex-1 hidden md:flex justify-end">
            <DocsSearch />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link to="/auth">
              <Button size="sm">Start free</Button>
            </Link>
          </div>
        </div>
        {/* Mobile search bar */}
        <div className="md:hidden border-t border-border px-4 py-2">
          <DocsSearch />
        </div>
      </header>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 py-10">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <nav className="space-y-6 text-sm">
            {sections.map((section) => (
              <div key={section.title}>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {section.title}
                </div>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          `block rounded-md px-2 py-1.5 transition-colors ${
                            isActive
                              ? "bg-accent text-accent-foreground font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                      {/* Scroll-spy: nest current page's headings under the active item */}
                      {isActiveItem(pathname, item.to, item.end) && headings.length > 0 ? (
                        <ul className="mt-1 ml-3 border-l border-border space-y-0.5">
                          {headings.map((h) => (
                            <li key={h.id}>
                              <a
                                href={`#${h.id}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  history.replaceState(null, "", `#${h.id}`);
                                  document
                                    .getElementById(h.id)
                                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                                }}
                                className={`block pl-3 pr-2 py-1 -ml-px border-l text-xs transition-colors ${
                                  activeId === h.id
                                    ? "border-primary text-foreground font-medium"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {h.text}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 max-w-3xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DocsLayout;

/** Match logic equivalent to NavLink's `end` semantics. */
function isActiveItem(pathname: string, to: string, end?: boolean) {
  if (end) return pathname === to;
  return pathname === to || pathname.startsWith(`${to}/`);
}