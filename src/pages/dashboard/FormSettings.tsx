
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "./Layout";
import { CollaborationPanel } from "@/components/dashboard/collaboration/CollaborationPanel";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
        borderRadius: 8
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
  const [isSaving, setIsSaving] = useState(false);
  
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
              <p className="text-sm text-gray-500">Form settings</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isSaving ? (
              <Button disabled>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
              </Button>
            ) : (
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Form Details</CardTitle>
                <CardDescription>Basic information about your form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="form-title">Form Title</Label>
                  <Input 
                    id="form-title" 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="form-description">Form Description</Label>
                  <Textarea 
                    id="form-description" 
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>Destructive actions for your form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-red-600">Delete Form</h3>
                    <p className="text-sm text-gray-500">
                      This will permanently delete the form and all responses
                    </p>
                  </div>
                  <Button variant="destructive">Delete</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Configure email alerts for form activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-submission">Notify on submission</Label>
                    <p className="text-sm text-gray-500">
                      Receive an email whenever someone submits your form
                    </p>
                  </div>
                  <Switch 
                    id="notify-submission"
                    checked={notifyOnSubmission}
                    onCheckedChange={setNotifyOnSubmission}
                  />
                </div>

                {notifyOnSubmission && (
                  <div className="space-y-2">
                    <Label htmlFor="notification-email">Email address</Label>
                    <Input 
                      id="notification-email" 
                      type="email"
                      value={notificationEmail}
                      onChange={(e) => setNotificationEmail(e.target.value)}
                      placeholder="email@example.com"
                    />
                    <p className="text-xs text-gray-500">
                      You can add multiple email addresses separated by commas
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="behavior" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Form Behavior</CardTitle>
                <CardDescription>Configure how your form behaves</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="success-message">Success Message</Label>
                  <Textarea 
                    id="success-message" 
                    value={successMessage}
                    onChange={(e) => setSuccessMessage(e.target.value)}
                    placeholder="Thank you for your submission!"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="redirect-url">Redirect URL (optional)</Label>
                  <Input 
                    id="redirect-url" 
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    placeholder="https://example.com/thank-you"
                  />
                  <p className="text-xs text-gray-500">
                    Redirect users to this URL after form submission
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow-multiple">Allow multiple submissions</Label>
                    <p className="text-sm text-gray-500">
                      Let users submit the form multiple times
                    </p>
                  </div>
                  <Switch 
                    id="allow-multiple"
                    checked={allowMultiple}
                    onCheckedChange={setAllowMultiple}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-captcha">CAPTCHA protection</Label>
                    <p className="text-sm text-gray-500">
                      Protect your form from spam with CAPTCHA
                    </p>
                  </div>
                  <Switch 
                    id="enable-captcha"
                    checked={enableCaptcha}
                    onCheckedChange={setEnableCaptcha}
                  />
                </div>
              </CardContent>
            </Card>
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
