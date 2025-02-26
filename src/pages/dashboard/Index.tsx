
import { DashboardLayout } from "./Layout";
import { Button } from "@/components/ui/button";
import { Plus, Search, SortDesc } from "lucide-react";
import { FormCard } from "@/components/dashboard/FormCard";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getForms } from "@/lib/api";
import { CreateFormDialog } from "@/components/dashboard/CreateFormDialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated_at");
  const { toast } = useToast();
  
  const { data: forms, isLoading, error } = useQuery({
    queryKey: ["forms"],
    queryFn: getForms
  });

  // Show error toast if there's an error
  if (error && !forms) {
    console.error("Error fetching forms:", error);
    toast({
      title: "Error loading forms",
      description: "There was a problem loading your forms. Please try again.",
      variant: "destructive",
    });
  }

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
    return 0;
  });

  const handleCreateForm = () => {
    setIsCreateFormOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your Forms</h1>
            <p className="text-sm text-primary/60">
              Create, manage, and share your forms with the world
            </p>
          </div>
          <Button onClick={handleCreateForm} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Create Form
          </Button>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center h-[40vh] space-y-4 bg-red-50 text-red-800 rounded-lg p-8 border border-red-200">
            <div className="text-4xl">⚠️</div>
            <h3 className="text-xl font-semibold">Error loading forms</h3>
            <p className="text-sm text-center">
              There was a problem loading your forms. Please try again.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="border-red-300 hover:bg-red-100"
            >
              Reload Page
            </Button>
          </div>
        ) : !isLoading && forms && forms.length > 0 ? (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/40" />
              <Input
                placeholder="Search forms..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 ml-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SortDesc className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated_at">Last Updated</SelectItem>
                  <SelectItem value="title">Form Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-lg bg-card animate-pulse"
              />
            ))}
          </div>
        ) : forms?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 bg-secondary/30 rounded-lg p-12">
            <div className="p-6 rounded-full bg-secondary">
              <div className="text-6xl">📋</div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">No forms yet</h3>
              <p className="text-primary/60 max-w-md mb-6">
                Create your first form to get started building beautiful forms for your audience.
              </p>
              <Button size="lg" onClick={handleCreateForm}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Form
              </Button>
            </div>
          </div>
        ) : (
          <>
            {searchTerm && filteredForms?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[40vh] space-y-4 bg-secondary/30 rounded-lg p-8">
                <div className="text-4xl">🔍</div>
                <h3 className="text-xl font-semibold">No matching forms</h3>
                <p className="text-sm text-primary/60 text-center">
                  We couldn't find any forms matching "{searchTerm}"
                </p>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedForms?.map((form) => (
                  <FormCard key={form.id} form={form} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <CreateFormDialog
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
      />
    </DashboardLayout>
  );
}
