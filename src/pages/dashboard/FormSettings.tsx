
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "./Layout";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormSettingsHeader } from "@/components/dashboard/form-settings/FormSettingsHeader";
import { GeneralSettings } from "@/components/dashboard/form-settings/GeneralSettings";
import { NotificationSettings } from "@/components/dashboard/form-settings/NotificationSettings";
import { BehaviorSettings } from "@/components/dashboard/form-settings/BehaviorSettings";
import { CollaborationPanel } from "@/components/dashboard/collaboration/CollaborationPanel";
import { ThemeCustomizer } from "@/components/dashboard/theme-customization/ThemeCustomizer";
import { ResponseIntelligence } from "@/components/dashboard/analytics/ResponseIntelligence";
import { WorkflowBuilder } from "@/components/dashboard/automation/WorkflowBuilder";
import { PredictiveAnalytics } from "@/components/dashboard/analytics/PredictiveAnalytics";
import { FormTheme } from "@/lib/types";

// Mock collaborators for demo
const mockCollaborators = [
  {
    id: "current-user",
    name: "You",
    email: "you@example.com",
    role: "owner" as const,
    avatarUrl: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "editor" as const,
    avatarUrl: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "3",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    role: "viewer" as const,
    avatarUrl: "https://i.pravatar.cc/150?img=3"
  }
];

// This would normally fetch from an API
const getFormById = async (id: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id,
    title: "Sample Form",
    description: "This is a sample form",
    settings: {
      notifications: {
        onSubmission: true,
        emailAddresses: ["you@example.com"]
      },
      behavior: {
        redirectUrl: "",
        successMessage: "Thank you for your submission!",
        allowMultipleSubmissions: false,
        captchaEnabled: true
      },
      theme: {
        primaryColor: "#6366f1",
        backgroundColor: "#ffffff",
        fontFamily: "Inter, sans-serif",
        borderRadius: "8px"
      }
    }
  };
};

export default function FormSettings() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [notifyOnSubmission, setNotifyOnSubmission] = useState(true);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [enableCaptcha, setEnableCaptcha] = useState(true);
  const [formTheme, setFormTheme] = useState<FormTheme | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  const { data: form, isLoading, error } = useQuery({
    queryKey: ["form", id],
    queryFn: () => id ? getFormById(id) : Promise.reject("No form ID provided"),
    enabled: !!id,
  });

  // Set form data when it's loaded
  useEffect(() => {
    if (form) {
      // Initialize form data
      setFormTitle(form.title);
      setFormDescription(form.description || "");
      setNotifyOnSubmission(form.settings?.notifications?.onSubmission || false);
      setNotificationEmail(form.settings?.notifications?.emailAddresses?.[0] || "");
      setRedirectUrl(form.settings?.behavior?.redirectUrl || "");
      setSuccessMessage(form.settings?.behavior?.successMessage || "");
      setAllowMultiple(form.settings?.behavior?.allowMultipleSubmissions || false);
      setEnableCaptcha(form.settings?.behavior?.captchaEnabled || false);
      setFormTheme(form.settings?.theme || null);
    }
  }, [form]);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your form settings have been updated",
      });
    }, 800);
  };

  const handleAddCollaborator = (email: string, role: "owner" | "editor" | "viewer") => {
    // This would normally send an invitation to the email address
    console.log(`Added ${email} as ${role}`);
  };

  const handleUpdateCollaborator = (id: string, role: "owner" | "editor" | "viewer") => {
    // This would normally update the collaborator's role
    console.log(`Updated ${id} to ${role}`);
  };

  const handleRemoveCollaborator = (id: string) => {
    // This would normally remove the collaborator
    console.log(`Removed ${id}`);
  };

  const handleThemeChange = (theme: FormTheme) => {
    setFormTheme(theme);
    console.log("Theme updated:", theme);
  };
  
  const handleSaveWorkflow = (workflow: any) => {
    console.log("Saving workflow:", workflow);
    toast({
      title: "Workflow saved",
      description: "Your workflow automation has been saved",
    });
  };

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

  const formData = {
    title: formTitle,
    description: formDescription,
    notifyOnSubmission,
    notificationEmail,
    redirectUrl,
    successMessage,
    allowMultiple,
    enableCaptcha,
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        <FormSettingsHeader 
          title={form.title}
          isSaving={isSaving}
          onSave={handleSaveSettings}
          formId={id || ''}
        />

        <Tabs 
          defaultValue={activeTab} 
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-7 mb-6 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl p-1">
            <TabsTrigger value="general" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg">General</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg">Notifications</TabsTrigger>
            <TabsTrigger value="behavior" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg">Behavior</TabsTrigger>
            <TabsTrigger value="theme" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg">Theme</TabsTrigger>
            <TabsTrigger value="intelligence" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg">Intelligence</TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg">Automation</TabsTrigger>
            <TabsTrigger value="collaboration" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg">Collaboration</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <GeneralSettings 
              formTitle={formTitle}
              formDescription={formDescription}
              onFormTitleChange={setFormTitle}
              onFormDescriptionChange={setFormDescription}
            />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings
              notifyOnSubmission={notifyOnSubmission}
              notificationEmail={notificationEmail}
              onNotifyOnSubmissionChange={setNotifyOnSubmission}
              onNotificationEmailChange={setNotificationEmail}
            />
          </TabsContent>
          
          <TabsContent value="behavior" className="space-y-4">
            <BehaviorSettings
              redirectUrl={redirectUrl}
              successMessage={successMessage}
              allowMultiple={allowMultiple}
              enableCaptcha={enableCaptcha}
              onRedirectUrlChange={setRedirectUrl}
              onSuccessMessageChange={setSuccessMessage}
              onAllowMultipleChange={setAllowMultiple}
              onEnableCaptchaChange={setEnableCaptcha}
            />
          </TabsContent>
          
          <TabsContent value="theme" className="space-y-4">
            {formTheme && (
              <ThemeCustomizer 
                initialTheme={formTheme}
                onThemeChange={handleThemeChange}
              />
            )}
          </TabsContent>
          
          <TabsContent value="intelligence" className="space-y-4">
            <ResponseIntelligence formId={form.id} />
            <PredictiveAnalytics formId={form.id} />
          </TabsContent>
          
          <TabsContent value="automation" className="space-y-4">
            <WorkflowBuilder formId={form.id} onSave={handleSaveWorkflow} />
          </TabsContent>
          
          <TabsContent value="collaboration" className="space-y-4">
            <CollaborationPanel 
              formId={form.id}
              collaborators={mockCollaborators}
              currentUserId="current-user"
              onAddCollaborator={handleAddCollaborator}
              onUpdateCollaborator={handleUpdateCollaborator}
              onRemoveCollaborator={handleRemoveCollaborator}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
