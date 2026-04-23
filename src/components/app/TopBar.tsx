import { Search, ChevronsUpDown, LogOut, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

/**
 * Persistent app top bar.
 * Always renders the SidebarTrigger so the sidebar can be reopened from any state.
 */
export function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast({ title: "Logged out" });
    } catch {
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const initial = user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      {/* Workspace switcher (placeholder — real data in Phase 3) */}
      <Button
        variant="ghost"
        size="sm"
        className="hidden gap-2 px-2 text-sm font-medium md:inline-flex"
        disabled
        aria-label="Workspace switcher (coming soon)"
      >
        Personal workspace
        <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>

      {/* Search stub */}
      <button
        type="button"
        className="ml-auto inline-flex h-9 items-center gap-2 rounded-md border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:w-72"
        onClick={() =>
          toast({ title: "Search", description: "Cmd-K palette coming soon." })
        }
      >
        <Search className="h-4 w-4" aria-hidden />
        <span className="hidden md:inline">Search forms, submissions…</span>
        <kbd className="ml-auto hidden rounded bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline">
          ⌘K
        </kbd>
      </button>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="User menu"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {initial}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
            {user?.email ?? "Signed in"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
            <UserIcon className="mr-2 h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/app/settings")}>
            <UserIcon className="mr-2 h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-danger focus:text-danger">
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}