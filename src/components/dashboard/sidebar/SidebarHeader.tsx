
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export function SidebarHeader({ isCollapsed, setIsCollapsed }: SidebarHeaderProps) {
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            key="logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center"
          >
            <span className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">FormCraft</span>
          </motion.div>
        )}
      </AnimatePresence>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsCollapsed(!isCollapsed)} 
        className={cn("transition-all", isCollapsed ? "mx-auto" : "ml-auto")}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </div>
  );
}
