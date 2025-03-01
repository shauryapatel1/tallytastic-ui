
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  onCreateForm: () => void;
}

export const DashboardHeader = ({ onCreateForm }: DashboardHeaderProps) => {
  return (
    <motion.div 
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-6 rounded-xl border border-indigo-100"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          Your Forms
        </h1>
        <p className="text-sm text-primary/60 mt-1">
          Create, manage, and share your forms with the world
        </p>
      </div>
      <Button 
        onClick={onCreateForm} 
        size="lg" 
        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg group"
      >
        <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
        Create Form
      </Button>
    </motion.div>
  );
};
