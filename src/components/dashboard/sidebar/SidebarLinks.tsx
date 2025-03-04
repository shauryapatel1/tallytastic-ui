
import { useLocation, Link } from "react-router-dom";
import { FileText, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    implemented: true,
  },
  {
    title: "My Forms",
    href: "/dashboard/forms",
    icon: FileText,
    implemented: true,
  }
];

interface SidebarLinksProps {
  isCollapsed: boolean;
}

export function SidebarLinks({ isCollapsed }: SidebarLinksProps) {
  const location = useLocation();

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
