import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

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
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-semibold text-foreground">Ingrid</span>
              <span className="text-muted-foreground">/ Docs</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
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