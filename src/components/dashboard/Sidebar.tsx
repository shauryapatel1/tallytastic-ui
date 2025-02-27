
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import {
  BarChart,
  Box,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  Mail,
  Zap,
  Puzzle,
  BookOpen,
  HelpCircle,
  Menu,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Forms",
    href: "/dashboard/forms",
    icon: FileText,
  },
  {
    title: "Templates",
    href: "/dashboard/templates",
    icon: Puzzle,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Integrations",
    href: "/dashboard/integrations",
    icon: Zap,
  },
  {
    title: "Responses",
    href: "/dashboard/responses",
    icon: Box,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Mail,
    badge: 3,
  },
];

const bottomLinks = [
  {
    title: "Documentation",
    href: "https://docs.example.com",
    icon: BookOpen,
    external: true,
  },
  {
    title: "Support",
    href: "https://help.example.com",
    icon: HelpCircle,
    external: true,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Check if on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const sidebarVariants = {
    expanded: { width: "240px" },
    collapsed: { width: "72px" },
  };

  const mobileMenuVariants = {
    open: { 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: { 
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
      
      {/* Mobile Menu Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.div
          className={cn(
            "h-full bg-white border-r overflow-y-auto overflow-x-hidden transition-all duration-300 hidden md:block",
          )}
          variants={sidebarVariants}
          initial={isCollapsed ? "collapsed" : "expanded"}
          animate={isCollapsed ? "collapsed" : "expanded"}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="text-xl font-semibold">FormCraft</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <Button variant="ghost" size="sm" onClick={toggleSidebar} className="ml-auto">
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Navigation Links */}
            <div className="flex-1 px-3 py-4">
              <nav className="space-y-1">
                {sidebarLinks.map((link) => (
                  <Link key={link.href} to={link.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start mb-1 px-2 relative group",
                        location.pathname === link.href && "bg-indigo-50 text-indigo-700"
                      )}
                    >
                      <link.icon className={cn(
                        "h-5 w-5 mr-2", 
                        location.pathname === link.href ? "text-indigo-600" : "text-gray-500 group-hover:text-indigo-600"
                      )} />
                      
                      {/* Show even when collapsed with tooltip */}
                      {isCollapsed ? (
                        <span className="absolute left-full ml-6 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
                          {link.title}
                        </span>
                      ) : (
                        <span>{link.title}</span>
                      )}
                      
                      {/* Notification Badge */}
                      {link.badge && !isCollapsed && (
                        <span className="absolute right-2 bg-red-500 text-white text-xs px-1 rounded-full min-w-[20px] flex items-center justify-center">
                          {link.badge}
                        </span>
                      )}
                      
                      {/* Smaller badge when collapsed */}
                      {link.badge && isCollapsed && (
                        <span className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full" />
                      )}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Bottom Links */}
            <div className="p-3 border-t">
              <nav className="space-y-1">
                {bottomLinks.map((link) => (
                  <Button
                    key={link.href}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start mb-1 px-2 relative group",
                      location.pathname === link.href && "bg-indigo-50 text-indigo-700"
                    )}
                    asChild
                  >
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        <link.icon className={cn(
                          "h-5 w-5 mr-2", 
                          location.pathname === link.href ? "text-indigo-600" : "text-gray-500 group-hover:text-indigo-600"
                        )} />
                        
                        {isCollapsed ? (
                          <span className="absolute left-full ml-6 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
                            {link.title}
                          </span>
                        ) : (
                          <span>{link.title}</span>
                        )}
                      </a>
                    ) : (
                      <Link to={link.href}>
                        <link.icon className={cn(
                          "h-5 w-5 mr-2", 
                          location.pathname === link.href ? "text-indigo-600" : "text-gray-500 group-hover:text-indigo-600"
                        )} />
                        
                        {isCollapsed ? (
                          <span className="absolute left-full ml-6 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
                            {link.title}
                          </span>
                        ) : (
                          <span>{link.title}</span>
                        )}
                      </Link>
                    )}
                  </Button>
                ))}
              </nav>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Mobile Sidebar */}
      {isMobile && (
        <motion.div
          className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg overflow-y-auto md:hidden"
          variants={mobileMenuVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Sidebar Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <span className="text-xl font-semibold">FormCraft</span>
              <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Mobile Navigation Links */}
            <div className="flex-1 px-3 py-4">
              <nav className="space-y-1">
                {sidebarLinks.map((link) => (
                  <Link key={link.href} to={link.href} onClick={() => setIsOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start mb-1 px-2 relative",
                        location.pathname === link.href && "bg-indigo-50 text-indigo-700"
                      )}
                    >
                      <link.icon className={cn(
                        "h-5 w-5 mr-2", 
                        location.pathname === link.href ? "text-indigo-600" : "text-gray-500"
                      )} />
                      <span>{link.title}</span>
                      
                      {/* Notification Badge */}
                      {link.badge && (
                        <span className="absolute right-2 bg-red-500 text-white text-xs px-1 rounded-full min-w-[20px] flex items-center justify-center">
                          {link.badge}
                        </span>
                      )}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Mobile Bottom Links */}
            <div className="p-3 border-t">
              <nav className="space-y-1">
                {bottomLinks.map((link) => (
                  <Button
                    key={link.href}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start mb-1 px-2",
                      location.pathname === link.href && "bg-indigo-50 text-indigo-700"
                    )}
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        <link.icon className={cn(
                          "h-5 w-5 mr-2", 
                          location.pathname === link.href ? "text-indigo-600" : "text-gray-500"
                        )} />
                        <span>{link.title}</span>
                      </a>
                    ) : (
                      <Link to={link.href}>
                        <link.icon className={cn(
                          "h-5 w-5 mr-2", 
                          location.pathname === link.href ? "text-indigo-600" : "text-gray-500"
                        )} />
                        <span>{link.title}</span>
                      </Link>
                    )}
                  </Button>
                ))}
              </nav>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
