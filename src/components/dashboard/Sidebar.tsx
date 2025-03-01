
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarLinks } from "./sidebar/SidebarLinks";
import { QuickActions } from "./sidebar/QuickActions";
import { BottomLinks } from "./sidebar/BottomLinks";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className={cn(
      "h-full bg-white border-r overflow-y-auto overflow-x-hidden transition-all duration-300",
      isCollapsed ? "w-[72px]" : "w-[240px]"
    )}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <SidebarHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        
        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4">
          <SidebarLinks isCollapsed={isCollapsed} />
        </div>
        
        {/* Quick Actions */}
        <QuickActions isCollapsed={isCollapsed} />
        
        {/* Bottom Links */}
        <BottomLinks isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}
