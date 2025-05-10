
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "./Layout";
import { FormPublishOptions } from "@/components/dashboard/form-publishing/FormPublishOptions";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// This would normally fetch from an API
const getFormById = async (id: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id,
    title: "Sample Form",
    description: "This is a sample form",
    published: false,
  };
};

export default function FormPublish() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const { data: form, isLoading, error } = useQuery({
    queryKey: ["form", id],
    queryFn: () => id ? getFormById(id) : Promise.reject("No form ID provided"),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !form) {
    return (
      <DashboardLayout>
        <div className="h-96 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error loading form</h2>
          <p className="text-gray-600 mb-4">There was a problem loading this form</p>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
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
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/dashboard/forms/${id}`}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Editor
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{form.title}</h1>
              <p className="text-sm text-gray-500">Publishing options</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="publish" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="publish">Publish</TabsTrigger>
            <TabsTrigger value="share">Share & Embed</TabsTrigger>
            <TabsTrigger value="collaborate">Collaborate</TabsTrigger>
          </TabsList>

          <TabsContent value="publish" className="space-y-4">
            <FormPublishOptions 
              formId={form.id} 
              isPublished={form.published}
            />
          </TabsContent>
          
          <TabsContent value="share" className="space-y-4">
            <FormPublishOptions 
              formId={form.id} 
              isPublished={form.published}
            />
          </TabsContent>
          
          <TabsContent value="collaborate" className="space-y-4">
            <div className="p-8 text-center bg-white rounded-lg border">
              <h2 className="text-xl font-medium text-gray-700 mb-2">Coming Soon</h2>
              <p className="text-gray-500">
                Team collaboration features will be available in the next update
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
