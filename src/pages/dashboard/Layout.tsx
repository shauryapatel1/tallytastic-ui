
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Loader2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      // Store the current path to redirect back after login
      const currentPath = location.pathname;
      if (currentPath !== "/auth") {
        localStorage.setItem("redirectAfterAuth", currentPath);
        
        toast({
          title: "Authentication required",
          description: "Please log in to access the dashboard",
        });
      }
      navigate("/auth");
    }
  }, [user, navigate, isLoading, location.pathname, toast]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <motion.div 
          className="text-center p-8 bg-white rounded-xl shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Loading...</h3>
          <p className="text-sm text-gray-500 mt-2">Please wait while we load your dashboard</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg bg-indigo-600 text-white hover:bg-indigo-700 md:hidden"
          onClick={toggleMobileSidebar}
          aria-label={mobileSidebarOpen ? "Close menu" : "Open menu"}
        >
          {mobileSidebarOpen ? <X /> : <Menu />}
        </Button>
        
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.div
                className="fixed inset-y-0 left-0 z-50 w-64 md:hidden"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25 }}
              >
                <Sidebar />
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
