import { DashboardLayout } from "./Layout";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getForms } from "@/lib/api";
import { CreateFormDialog } from "@/components/dashboard/CreateFormDialog";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatisticsGrid } from "@/components/dashboard/StatisticsGrid";
import { FormsToolbar } from "@/components/dashboard/FormsToolbar";
import { FormsGridView } from "@/components/dashboard/FormsGridView";
import { FormsTableView } from "@/components/dashboard/FormsTableView";
import { 
  EmptyState, 
  ErrorState, 
  LoadingState, 
  SearchEmptyState 
} from "@/components/dashboard/DashboardStates";
import { useAuth } from "@/lib/auth";

export default function Dashboard() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated_at");
  const [viewMode, setViewMode] = useState<"grid" | "insights">("grid");
  const { toast } = useToast();
  const location = useLocation();
  const { user } = useAuth();
  
  const { 
    data: forms, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["forms", user?.id],
    queryFn: getForms,
    enabled: !!user // Only fetch if user is authenticated
  });

  // Refetch forms when user changes
  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error && !forms) {
      console.error("Error fetching forms:", error);
      toast({
        title: "Error loading forms",
        description: "There was a problem loading your forms. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, forms, toast]);

  const filteredForms = forms?.filter(form => 
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedForms = filteredForms?.sort((a, b) => {
    if (sortBy === "updated_at") {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "responses") {
      // This would eventually come from the API with real response counts
      return (Math.floor(Math.random() * 50)) - (Math.floor(Math.random() * 50));
    }
    return 0;
  });

  const handleCreateForm = () => {
    setIsCreateFormOpen(true);
  };

  const getFormStatistics = () => {
    if (!forms) return { total: 0, published: 0, draft: 0, responses: 0 };
    
    const published = forms.filter(form => form.published).length;
    
    return {
      total: forms.length,
      published,
      draft: forms.length - published,
      responses: forms.length * Math.floor(Math.random() * 20) // Simulate response count
    };
  };

  const stats = getFormStatistics();

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const handleFormCreated = () => {
    refetch();
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial="initial" 
        animate="in" 
        exit="out" 
        variants={pageVariants} 
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        <div className="flex flex-col gap-4">
          <DashboardHeader onCreateForm={handleCreateForm} />

          {!isLoading && forms && forms.length > 0 && (
            <StatisticsGrid stats={stats} />
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key="forms-content"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.4 }}
          >
            {error ? (
              <ErrorState onRetry={() => refetch()} />
            ) : !isLoading && forms && forms.length > 0 ? (
              <motion.div className="space-y-6" variants={pageVariants}>
                <FormsToolbar 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  viewMode={viewMode}
                  setViewMode={setViewMode as (mode: "grid" | "insights") => void}
                />

                {/* View modes */}
                {viewMode === "grid" ? (
                  <FormsGridView forms={sortedForms || []} />
                ) : (
                  <FormsTableView forms={sortedForms || []} />
                )}
              </motion.div>
            ) : null}

            {isLoading ? (
              <LoadingState />
            ) : forms?.length === 0 ? (
              <EmptyState onCreateForm={handleCreateForm} />
            ) : null}

            {searchTerm && filteredForms?.length === 0 ? (
              <SearchEmptyState 
                searchTerm={searchTerm} 
                onClearSearch={() => setSearchTerm("")} 
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <CreateFormDialog
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
        onFormCreated={handleFormCreated}
      />
    </DashboardLayout>
  );
}
