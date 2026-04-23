import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Inbox,
  GitBranch,
  Plug,
  LayoutTemplate,
  BarChart3,
  CreditCard,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

/**
 * Ingrid app navigation IA (per brief):
 *   Overview · Forms · Submissions · Routing · Integrations · Templates · Analytics · Billing · Settings
 *
 * Routes that don't exist yet still appear (per "operational clarity") but
 * are linked to placeholder paths under /app/* — they will be wired up in
 * Phase 3. They are visually identical to live items; the labels are real.
 */
const PRIMARY_NAV = [
  { title: "Overview", url: "/app", icon: LayoutDashboard, end: true },
  { title: "Forms", url: "/app/forms", icon: FileText },
  { title: "Submissions", url: "/app/submissions", icon: Inbox },
  { title: "Routing", url: "/app/routing", icon: GitBranch },
  { title: "Integrations", url: "/app/integrations", icon: Plug },
  { title: "Templates", url: "/app/templates", icon: LayoutTemplate },
  { title: "Analytics", url: "/app/analytics", icon: BarChart3 },
] as const;

const SECONDARY_NAV = [
  { title: "Billing", url: "/app/billing", icon: CreditCard },
  { title: "Settings", url: "/app/settings", icon: Settings },
] as const;

function NavItem({
  item,
  collapsed,
}: {
  item: { title: string; url: string; icon: typeof LayoutDashboard; end?: boolean };
  collapsed: boolean;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={collapsed ? item.title : undefined}>
        <NavLink
          to={item.url}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
            )
          }
        >
          <item.icon className="h-4 w-4 shrink-0" aria-hidden />
          <span>{item.title}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  // Force "Forms" group open when on a form workflow route
  const onFormsWorkflow = location.pathname.startsWith("/app/forms/");
  void onFormsWorkflow; // reserved for future expansion

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <NavLink to="/app" className="flex items-center">
          <Logo showWord={!collapsed} />
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PRIMARY_NAV.map((item) => (
                <NavItem key={item.url} item={item} collapsed={collapsed} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          {SECONDARY_NAV.map((item) => (
            <NavItem key={item.url} item={item} collapsed={collapsed} />
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}