
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PublicFormView } from "@/components/public/PublicFormView";
import { FormField } from "@/components/dashboard/form-builder/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// This would normally fetch from an API
const getPublicFormById = async (id: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Sample form fields
  const fields: FormField[] = [
    {
      id: "name",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
    },
    {
      id: "email",
      type: "email",
      label: "Email Address",
      placeholder: "you@example.com",
      required: true,
    },
    {
      id: "message",
      type: "textarea",
      label: "Message",
      placeholder: "What would you like to tell us?",
      required: false,
    },
    {
      id: "consent",
      type: "checkbox",
      label: "Consent",
      placeholder: "I agree to the terms and conditions",
      required: true,
    }
  ];
  
  return {
    id,
    title: "Sample Public Form",
    description: "This is a public form that anyone can fill out and submit.",
    fields,
    successMessage: "Thank you for your submission! We'll get back to you soon.",
    theme: {
      primaryColor: "#6366f1",
      backgroundColor: "#ffffff",
      fontFamily: "Inter, sans-serif",
      borderRadius: 8,
      logo: "https://via.placeholder.com/150x50?text=Logo"
    }
  };
};

const submitFormResponse = async (formId: string, formData: Record<string, any>) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { success: true };
};

export default function PublicForm() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForm = async () => {
      if (!id) return;
      
      try {
        const formData = await getPublicFormById(id);
        setForm(formData);
      } catch (err) {
        console.error("Error loading form:", err);
        setError("This form could not be found or is no longer available.");
        toast({
          title: "Error",
          description: "Could not load form. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [id, toast]);

  const handleSubmit = async (formData: Record<string, any>): Promise<void> => {
    if (!id) return;
    
    try {
      await submitFormResponse(id, formData);
      // Return void instead of boolean to match the expected function type
    } catch (err) {
      console.error("Error submitting form:", err);
      throw new Error("Failed to submit form");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Form Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "This form could not be found or is no longer available."}</p>
        </div>
      </div>
    );
  }

  // Apply the form theme as a style to the entire container
  const themeStyle = {
    '--primary-color': form.theme.primaryColor,
    '--background-color': form.theme.backgroundColor,
    '--font-family': form.theme.fontFamily,
    '--border-radius': `${form.theme.borderRadius}px`,
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen py-12 px-4"
      style={{
        ...themeStyle,
        backgroundColor: form.theme.backgroundColor,
        fontFamily: form.theme.fontFamily,
      }}
    >
      <PublicFormView 
        title={form.title}
        description={form.description}
        fields={form.fields}
        successMessage={form.successMessage}
        theme={form.theme}
        onSubmit={handleSubmit}
      />
      
      <div className="text-center mt-8">
        <p className="text-xs text-gray-500">
          Powered by YouForm
        </p>
      </div>
    </div>
  );
}
