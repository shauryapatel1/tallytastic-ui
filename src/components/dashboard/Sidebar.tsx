
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import {
  BarChart,
  FileText,
  LayoutDashboard,
  Settings,
  Mail,
  ChevronLeft,
  ChevronRight,
  Home,
  Sparkles,
  Zap,
  HelpCircle,
  LogOut
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const sidebarLinks = [
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

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { logout } = useAuth();
  const { toast } = useToast();

  // Check if on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

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
    <div className={cn(
      "h-full bg-white border-r overflow-y-auto overflow-x-hidden transition-all duration-300",
      isCollapsed ? "w-[72px]" : "w-[240px]"
    )}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              <span className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">FormCraft</span>
            </motion.div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className={cn("ml-auto", isCollapsed && "mx-auto")}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4">
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
        </div>
        
        {/* Quick Actions */}
        <div className="px-3 py-2">
          <h4 className={cn(
            "text-xs uppercase text-gray-500 font-semibold mb-2",
            isCollapsed && "text-center"
          )}>
            {!isCollapsed && "Quick Actions"}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "flex flex-col items-center justify-center h-20 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all",
                isCollapsed && "col-span-2"
              )}
              onClick={() => {
                handleNavigation("/dashboard/forms/new");
              }}
              asChild
            >
              <Link to="/dashboard/forms/new">
                <Sparkles className="h-5 w-5 mb-1" />
                {!isCollapsed && <span className="text-xs">New Form</span>}
              </Link>
            </Button>
            
            {!isCollapsed && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex flex-col items-center justify-center h-20 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all"
                onClick={() => {
                  toast({
                    title: "AI Assistant",
                    description: "This feature is coming soon!",
                  });
                }}
              >
                <Zap className="h-5 w-5 mb-1" />
                <span className="text-xs">AI Help</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* Bottom Links */}
        <div className="p-3 mt-auto border-t">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start mb-1 px-2",
              isCollapsed && "justify-center"
            )}
            asChild
          >
            <Link to="/">
              <Home className={cn(
                "h-5 w-5", 
                isCollapsed ? "mr-0" : "mr-2",
                "text-gray-500 group-hover:text-indigo-600"
              )} />
              {!isCollapsed && "Home"}
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start mb-1 px-2",
              isCollapsed && "justify-center"
            )}
            onClick={() => {
              toast({
                title: "Help Center",
                description: "The help documentation is coming soon!",
              });
            }}
          >
            <HelpCircle className={cn(
              "h-5 w-5", 
              isCollapsed ? "mr-0" : "mr-2"
            )} />
            {!isCollapsed && "Help"}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start mb-1 px-2 text-red-500 hover:text-red-600 hover:bg-red-50",
              isCollapsed && "justify-center"
            )}
            onClick={() => logout()}
          >
            <LogOut className={cn(
              "h-5 w-5", 
              isCollapsed ? "mr-0" : "mr-2"
            )} />
            {!isCollapsed && "Logout"}
          </Button>
        </div>
      </div>
    </div>
  );
}
