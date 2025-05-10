
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "./Layout";
import { ResponsesTable, FormResponse } from "@/components/dashboard/responses/ResponsesTable";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";

// Mock data for responses
const mockResponses: FormResponse[] = [
  {
    id: "1",
    submittedAt: "2023-04-15T09:24:45Z",
    respondent: "john.doe@example.com",
    values: {
      name: "John Doe",
      email: "john.doe@example.com",
      message: "This is a test submission",
      consent: true
    }
  },
  {
    id: "2",
    submittedAt: "2023-04-16T14:38:12Z",
    respondent: "jane.smith@example.com",
    values: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      message: "Another test submission",
      consent: true
    }
  }
];

// Mock fields for the form
const mockFields = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "message", label: "Message" },
  { id: "consent", label: "Consent" }
];

// This would normally fetch from an API
const getFormById = async (id: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id,
    title: "Sample Form",
    description: "This is a sample form",
    fields: mockFields,
  };
};

const getFormResponses = async (formId: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockResponses;
};

export default function FormResponses() {
  const { id } = useParams<{ id: string }>();
  
  const { data: form, isLoading: isLoadingForm } = useQuery({
    queryKey: ["form", id],
    queryFn: () => id ? getFormById(id) : Promise.reject("No form ID provided"),
    enabled: !!id,
  });

  const { data: responses, isLoading: isLoadingResponses } = useQuery({
    queryKey: ["form-responses", id],
    queryFn: () => id ? getFormResponses(id) : Promise.reject("No form ID provided"),
    enabled: !!id,
  });

  const isLoading = isLoadingForm || isLoadingResponses;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!form) {
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
              <p className="text-sm text-gray-500">Form responses</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to={`/dashboard/forms/${id}`}>Edit Form</Link>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <ResponsesTable 
            formId={form.id}
            responses={responses || []}
            fields={form.fields}
          />
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
