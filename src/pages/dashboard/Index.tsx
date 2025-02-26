
import { DashboardLayout } from "./Layout";
import { Button } from "@/components/ui/button";
import { Plus, Search, SortDesc, Filter, BarChart, Grid, ChevronRight, Clock } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated_at");
  const [viewMode, setViewMode] = useState<"grid" | "insights">("grid");
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                Your Forms
              </h1>
              <p className="text-sm text-primary/60 mt-1">
                Create, manage, and share your forms with the world
              </p>
            </div>
            <Button 
              onClick={handleCreateForm} 
              size="lg" 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Form
            </Button>
          </div>

          {!isLoading && forms && forms.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Total Forms</p>
                    <p className="text-2xl font-bold mt-1">{stats.total}</p>
                  </div>
                  <div className="bg-indigo-100 p-2 rounded-md">
                    <Grid className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Published</p>
                    <p className="text-2xl font-bold mt-1">{stats.published}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-md">
                    <ChevronRight className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Drafts</p>
                    <p className="text-2xl font-bold mt-1">{stats.draft}</p>
                  </div>
                  <div className="bg-amber-100 p-2 rounded-md">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Total Responses</p>
                    <p className="text-2xl font-bold mt-1">{stats.responses}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-md">
                    <BarChart className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          )}
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
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-white p-4 rounded-lg border shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/40" />
                <Input
                  placeholder="Search forms..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-4 ml-auto">
                <Tabs defaultValue="grid" className="w-[200px]" onValueChange={(v) => setViewMode(v as "grid" | "insights")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="grid">
                      <Grid className="mr-2 h-4 w-4" />
                      Grid
                    </TabsTrigger>
                    <TabsTrigger value="insights">
                      <BarChart className="mr-2 h-4 w-4" />
                      Insights
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SortDesc className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated_at">Last Updated</SelectItem>
                    <SelectItem value="title">Form Title</SelectItem>
                    <SelectItem value="responses">Response Count</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* View modes */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedForms?.map((form) => (
                  <FormCard key={form.id} form={form} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responses</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedForms?.map((form) => (
                      <tr key={form.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{form.title}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{form.description || "No description"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${form.published ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                            {form.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Math.floor(Math.random() * 50)} {/* Mock response count */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDistanceToNow(new Date(form.updated_at), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm" asChild className="h-8">
                              <Link to={`/dashboard/forms/${form.id}`}>
                                Edit
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild className="h-8">
                              <Link to={`/dashboard/forms/${form.id}/preview`}>
                                Preview
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-lg bg-card animate-pulse shadow"
              />
            ))}
          </div>
        ) : forms?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-12 border border-indigo-100">
            <div className="p-6 rounded-full bg-white shadow-md">
              <div className="text-6xl">📋</div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">No forms yet</h3>
              <p className="text-primary/60 max-w-md mb-6">
                Create your first form to get started building beautiful forms that captivate your audience and collect valuable insights.
              </p>
              <Button 
                size="lg" 
                onClick={handleCreateForm}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Form
              </Button>
            </div>
          </div>
        ) : (
          <>
            {searchTerm && filteredForms?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[40vh] space-y-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-8 border border-indigo-100">
                <div className="text-4xl">🔍</div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">No matching forms</h3>
                <p className="text-sm text-primary/60 text-center">
                  We couldn't find any forms matching "{searchTerm}"
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm("")}
                  className="border-indigo-200 hover:bg-indigo-50"
                >
                  Clear Search
                </Button>
              </div>
            ) : null}
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

// Import formatDistanceToNow and Link at the top
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
