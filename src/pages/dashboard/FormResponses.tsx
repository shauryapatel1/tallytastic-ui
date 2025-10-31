
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "./Layout";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, Download, Loader2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ResponsesTable } from "@/components/dashboard/responses/ResponsesTable";
import { getForm } from "@/lib/api";
import { getFormResponses } from "@/lib/responseApi";
import { getFormAnalyticsMetrics } from "@/lib/analyticsService";
import { Form, FormResponse } from "@/lib/types";
import { ErrorDisplay } from "@/components/ui/error-display";

export default function FormResponses() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"responses" | "analytics">("responses");
  
  // Fetch the form details
  const { 
    data: form,
    isLoading: isFormLoading,
    error: formError
  } = useQuery({
    queryKey: ["form", id],
    queryFn: () => id ? getForm(id) : Promise.reject("No form ID provided"),
    enabled: !!id,
  });
  
  // Fetch form responses
  const {
    data: responses,
    isLoading: isResponsesLoading,
    error: responsesError,
    refetch: refetchResponses
  } = useQuery({
    queryKey: ["formResponses", id],
    queryFn: () => id ? getFormResponses(id) : Promise.reject("No form ID provided"),
    enabled: !!id,
  });
  
  // Fetch analytics metrics
  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    error: analyticsError
  } = useQuery({
    queryKey: ["formAnalyticsMetrics", id],
    queryFn: () => id ? getFormAnalyticsMetrics(id) : Promise.reject("No form ID provided"),
    enabled: !!id && activeTab === "analytics",
  });
  
  // Export responses as CSV
  const exportResponses = () => {
    if (!responses || responses.length === 0) {
      toast({
        title: "No responses to export",
        description: "This form doesn't have any responses yet.",
        variant: "destructive",
      });
      return;
    }
    
    // Get all possible headers from all responses
    const allHeaders = new Set<string>();
    responses.forEach(response => {
      Object.keys(response.data).forEach(key => allHeaders.add(key));
    });
    
    const headers = Array.from(allHeaders);
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers row
    csvContent += ["Submission Date", ...headers].join(",") + "\r\n";
    
    // Add data rows
    responses.forEach(response => {
      const date = new Date(response.submitted_at).toLocaleString();
      const row = [
        `"${date}"`, // Add quotes to handle commas in dates
        ...headers.map(header => {
          const value = response.data[header] || "";
          // Handle commas in values by wrapping in quotes
          return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value;
        })
      ];
      csvContent += row.join(",") + "\r\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${form?.title || "form"}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Responses exported",
      description: `${responses.length} responses exported to CSV.`,
    });
  };
  
  const isLoading = isFormLoading || isResponsesLoading || (activeTab === "analytics" && isAnalyticsLoading);
  const error = formError || responsesError || (activeTab === "analytics" ? analyticsError : undefined);
  
  if (isLoading && !responses && !form) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DashboardLayout>
        <ErrorDisplay 
          title="Unable to load responses"
          description="We couldn't load the responses for this form."
          retryAction={() => refetchResponses()}
          backAction={true}
        />
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/dashboard/forms/${id}`}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{form?.title || "Form Responses"}</h1>
              <p className="text-sm text-muted-foreground">
                {responses?.length || 0} total responses
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline"
            disabled={!responses || responses.length === 0} 
            onClick={exportResponses}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
        
        <Tabs 
          defaultValue="responses" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value as "responses" | "analytics")}
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
            <TabsTrigger value="responses">Responses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="responses" className="space-y-4">
            {responses && responses.length > 0 ? (
              <ResponsesTable responses={responses} form={{
                ...form,
                user_id: form?.userId || '',
                created_at: form?.createdAt || '',
                updated_at: form?.updatedAt || ''
              } as Form} />
            ) : (
              <div className="text-center p-12 border rounded-lg bg-background">
                <h3 className="text-lg font-medium mb-2">No responses yet</h3>
                <p className="text-muted-foreground mb-4">
                  This form hasn't received any submissions yet.
                </p>
                <Button variant="outline" asChild>
                  <Link to={`/dashboard/forms/${id}/publish`}>
                    Publish Form
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            {analytics ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold mt-1">{analytics.views}</p>
                  </div>
                  <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <p className="text-sm text-muted-foreground">Form Starts</p>
                    <p className="text-2xl font-bold mt-1">{analytics.starts}</p>
                  </div>
                  <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <p className="text-sm text-muted-foreground">Completions</p>
                    <p className="text-2xl font-bold mt-1">{analytics.completes}</p>
                  </div>
                  <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold mt-1">{analytics.completionRate}%</p>
                  </div>
                  <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <p className="text-sm text-muted-foreground">Avg. Time</p>
                    <p className="text-2xl font-bold mt-1">
                      {analytics.avgTime ? `${Math.round(analytics.avgTime / 60)}m` : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Daily Trend */}
                {analytics.dailyTrend && analytics.dailyTrend.length > 0 && (
                  <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <h3 className="text-lg font-medium mb-4">30-Day Trend</h3>
                    <div className="space-y-2">
                      {analytics.dailyTrend.slice(-7).map((day) => (
                        <div key={day.date} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{format(new Date(day.date), 'MMM d')}</span>
                          <div className="flex gap-4">
                            <span className="text-blue-600">{day.views} views</span>
                            <span className="text-amber-600">{day.starts} starts</span>
                            <span className="text-green-600">{day.completes} completes</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drop-off Analysis */}
                {analytics.dropOffPoints && analytics.dropOffPoints.length > 0 && (
                  <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <h3 className="text-lg font-medium mb-4">Drop-off Points</h3>
                    <div className="space-y-3">
                      {analytics.dropOffPoints.slice(0, 5).map((point) => (
                        <div key={point.fieldId} className="flex justify-between items-center">
                          <span className="text-muted-foreground">Field: {point.fieldId}</span>
                          <span className="font-medium">{point.dropOffs} drop-offs</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-12 border rounded-lg bg-background">
                <h3 className="text-lg font-medium mb-2">No analytics available</h3>
                <p className="text-muted-foreground mb-4">
                  Analytics will be available once your form receives submissions.
                </p>
                <Button variant="outline" asChild>
                  <Link to={`/dashboard/forms/${id}/publish`}>
                    Publish Form
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
