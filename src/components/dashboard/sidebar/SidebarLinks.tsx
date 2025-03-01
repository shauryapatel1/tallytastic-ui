
import { useLocation, Link } from "react-router-dom";
import { BarChart, FileText, LayoutDashboard, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Forms",
    href: "/dashboard/forms",
    icon: FileText,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Responses",
    href: "/dashboard/responses",
    icon: Mail,
  },
];

interface SidebarLinksProps {
  isCollapsed: boolean;
}

export function SidebarLinks({ isCollapsed }: SidebarLinksProps) {
  const location = useLocation();
  const { toast } = useToast();

  const handleNavigation = (href: string) => {
    // For routes that are not implemented yet
    if (["/dashboard/analytics", "/dashboard/responses"].includes(href)) {
      toast({
        title: "Coming Soon",
        description: "This feature is still in development.",
        variant: "default",
      });
      return false;
    }
    return true;
  };

  return (
    <nav className="space-y-1">
      {sidebarLinks.map((link) => {
        const isActive = location.pathname === link.href || 
          (link.href !== "/dashboard" && location.pathname.startsWith(link.href));
        
        return (
          <Button
            key={link.href}
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start mb-1 px-2 relative group",
              isActive && "bg-indigo-50 text-indigo-700",
              isCollapsed && "justify-center"
            )}
            onClick={(e) => {
              if (!handleNavigation(link.href)) {
                e.preventDefault();
              }
            }}
            asChild
          >
            <Link to={link.href}>
              <link.icon className={cn(
                "h-5 w-5", 
                isCollapsed ? "mr-0" : "mr-2",
                isActive ? "text-indigo-600" : "text-gray-500 group-hover:text-indigo-600"
              )} />
              
              {/* Show tooltip when collapsed */}
              {isCollapsed ? (
                <span className="absolute left-full ml-2 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
                  {link.title}
                </span>
              ) : (
                <span>{link.title}</span>
              )}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
