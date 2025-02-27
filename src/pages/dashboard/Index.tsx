
import { DashboardLayout } from "./Layout";
import { Button } from "@/components/ui/button";
import { 
  Plus, Search, SortDesc, Filter, BarChart, Grid, ChevronRight, Clock, 
  Zap, Sparkles, Rocket, Puzzle, Settings, Box
} from "lucide-react";
import { FormCard } from "@/components/dashboard/FormCard";
import { useState, useEffect } from "react";
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
import { IntegrationsPanel } from "@/components/dashboard/integrations/IntegrationsPanel";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated_at");
  const [viewMode, setViewMode] = useState<"grid" | "insights">("grid");
  const [activeTab, setActiveTab] = useState<"forms" | "templates" | "integrations" | "analytics">("forms");
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

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial="initial" 
        animate="in" 
        exit="out" 
        variants={pageVariants} 
        transition={pageTransition}
        className="space-y-8"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                {activeTab === "forms" && "Your Forms"}
                {activeTab === "templates" && "Templates"}
                {activeTab === "integrations" && "Integrations"}
                {activeTab === "analytics" && "Analytics"}
              </h1>
              <p className="text-sm text-primary/60 mt-1">
                {activeTab === "forms" && "Create, manage, and share your forms with the world"}
                {activeTab === "templates" && "Start with pre-built templates to save time"}
                {activeTab === "integrations" && "Connect your forms to external services"}
                {activeTab === "analytics" && "Get insights on your form performance"}
              </p>
            </div>
            {activeTab === "forms" && (
              <Button 
                onClick={handleCreateForm} 
                size="lg" 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Form
              </Button>
            )}
          </div>

          <div className="px-2 sm:px-6 py-3 bg-white rounded-lg shadow-sm">
            <Tabs 
              defaultValue="forms" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as "forms" | "templates" | "integrations" | "analytics")}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-4 mb-4">
                <TabsTrigger value="forms" className="data-[state=active]:bg-indigo-50">
                  <Box className="mr-2 h-4 w-4" />
                  Forms
                </TabsTrigger>
                <TabsTrigger value="templates" className="data-[state=active]:bg-indigo-50">
                  <Puzzle className="mr-2 h-4 w-4" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="integrations" className="data-[state=active]:bg-indigo-50">
                  <Zap className="mr-2 h-4 w-4" />
                  Integrations
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-50">
                  <BarChart className="mr-2 h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {activeTab === "forms" && !isLoading && forms && forms.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
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
            </motion.div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "forms" && (
            <motion.div
              key="forms-content"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
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
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ staggerChildren: 0.1 }}
                    >
                      {sortedForms?.map((form, index) => (
                        <motion.div
                          key={form.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <FormCard form={form} />
                        </motion.div>
                      ))}
                    </motion.div>
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
            </motion.div>
          )}

          {activeTab === "integrations" && (
            <motion.div
              key="integrations-content"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <IntegrationsPanel />
            </motion.div>
          )}

          {activeTab === "templates" && (
            <motion.div
              key="templates-content"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Featured Templates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {templates.filter(t => t.category === "popular").map((template, index) => (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-5 rounded-lg hover:shadow-md transition-all cursor-pointer"
                        onClick={handleCreateForm}
                      >
                        <div className="p-2 bg-white rounded-md shadow-sm w-fit mb-3">
                          {template.icon}
                        </div>
                        <h3 className="font-bold">{template.name}</h3>
                        <p className="text-sm text-primary/60 mt-1">
                          {template.description}
                        </p>
                        <Button variant="ghost" size="sm" className="mt-4">
                          <Sparkles className="mr-2 h-3 w-3" />
                          Use template
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h2 className="text-xl font-bold mb-4">All Templates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {templates.map((template, index) => (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white border p-5 rounded-lg hover:shadow-md transition-all cursor-pointer hover:bg-indigo-50/30"
                        onClick={handleCreateForm}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-white rounded-md shadow-sm">
                            {template.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-sm text-primary/60 mt-1">
                              {template.description}
                            </p>
                            <Button variant="ghost" size="sm" className="mt-2 pl-0 text-indigo-600">
                              Use template
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics-content"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-bold mb-4">Form Performance</h2>
                <div className="h-80 bg-indigo-50/50 rounded-lg border border-indigo-100 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Rocket className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics dashboard coming soon</h3>
                    <p className="text-primary/60 max-w-md">
                      We're working on a comprehensive analytics dashboard to help you understand your form performance better.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Top Performing Forms</h2>
                  <div className="space-y-4">
                    {forms?.slice(0, 5).map((form, index) => (
                      <div key={form.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-indigo-50/30 transition-colors">
                        <div className="flex items-center">
                          <div className="bg-indigo-100 text-indigo-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{form.title}</p>
                            <p className="text-xs text-primary/60">
                              {formatDistanceToNow(new Date(form.updated_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{Math.floor(Math.random() * 150)}</p>
                          <p className="text-xs text-primary/60">submissions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Submission Trends</h2>
                  <div className="h-64 bg-indigo-50/50 rounded-lg border border-indigo-100 flex items-center justify-center">
                    <div className="text-center p-6">
                      <BarChart className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                      <p className="text-primary/60">
                        Data visualization coming soon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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
import { templates } from "@/components/dashboard/form-templates/templateData";
