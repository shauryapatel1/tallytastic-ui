
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  onCreateForm: () => void;
}

export const EmptyState = ({ onCreateForm }: EmptyStateProps) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-[60vh] space-y-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-12 border border-indigo-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="p-6 rounded-full bg-white shadow-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        <div className="text-6xl">📋</div>
      </motion.div>
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">No forms yet</h3>
        <p className="text-primary/60 max-w-md mb-6">
          Create your first form to get started building beautiful forms that captivate your audience and collect valuable insights.
        </p>
        <Button 
          size="lg" 
          onClick={onCreateForm}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Form
        </Button>
      </motion.div>
    </motion.div>
  );
};

interface LoadingStateProps {
  count?: number;
}

export const LoadingState = ({ count = 6 }: LoadingStateProps) => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="h-64 rounded-lg bg-card animate-pulse shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        />
      ))}
    </motion.div>
  );
};

export const FullPageLoadingState = () => {
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
};

interface SearchEmptyStateProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export const SearchEmptyState = ({ searchTerm, onClearSearch }: SearchEmptyStateProps) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-[40vh] space-y-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-8 border border-indigo-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-4xl">🔍</div>
      <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">No matching forms</h3>
      <p className="text-sm text-primary/60 text-center">
        We couldn't find any forms matching "{searchTerm}"
      </p>
      <Button 
        variant="outline" 
        onClick={onClearSearch}
        className="border-indigo-200 hover:bg-indigo-50"
      >
        Clear Search
      </Button>
    </motion.div>
  );
};

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-[40vh] space-y-4 bg-red-50 text-red-800 rounded-lg p-8 border border-red-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-4xl">⚠️</div>
      <h3 className="text-xl font-semibold">Error loading forms</h3>
      <p className="text-sm text-center">
        There was a problem loading your forms. Please try again.
      </p>
      <Button 
        variant="outline" 
        onClick={onRetry}
        className="border-red-300 hover:bg-red-100"
      >
        Reload Page
      </Button>
    </motion.div>
  );
};
