
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar, Copy, Globe, LinkIcon, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormPublishOptionsProps {
  formId: string;
  isPublished?: boolean;
  onPublish?: (isPublished: boolean) => void;
}

export function FormPublishOptions({ formId, isPublished = false, onPublish }: FormPublishOptionsProps) {
  const [publishStatus, setPublishStatus] = useState(isPublished);
  const [customSlug, setCustomSlug] = useState("");
  const [password, setPassword] = useState("");
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [schedulingEnabled, setSchedulingEnabled] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { toast } = useToast();

  const formUrl = `${window.location.origin}/f/${formId}`;
  const embedCode = `<iframe src="${formUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(formUrl);
    toast({
      title: "Link copied",
      description: "Form link has been copied to clipboard",
    });
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Embed code copied",
      description: "Embed code has been copied to clipboard",
    });
  };

  const handlePublishToggle = () => {
    const newStatus = !publishStatus;
    setPublishStatus(newStatus);
    
    if (onPublish) {
      onPublish(newStatus);
    }
    
    toast({
      title: newStatus ? "Form published" : "Form unpublished",
      description: newStatus 
        ? "Your form is now accessible to respondents" 
        : "Your form is now private",
    });
  };

  const handleSaveSettings = () => {
    // In a real implementation, this would save the settings to the database
    toast({
      title: "Settings saved",
      description: "Your form publishing settings have been updated",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
        <div>
          <h3 className="text-lg font-medium text-gray-800">Form visibility</h3>
          <p className="text-sm text-gray-600">
            {publishStatus ? "Your form is currently public and accepting responses" : "Your form is currently private"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">{publishStatus ? "Published" : "Draft"}</span>
          <Switch checked={publishStatus} onCheckedChange={handlePublishToggle} />
        </div>
      </div>

      {publishStatus && (
        <Tabs defaultValue="share">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="embed">Embed</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Form Link</CardTitle>
                <CardDescription>Share this link with your audience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Input value={formUrl} readOnly className="flex-1" />
                  <Button variant="outline" size="icon" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Globe className="h-3 w-3 mr-1" />
                    Open in new tab
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <LinkIcon className="h-3 w-3 mr-1" />
                    Create QR code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="embed" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Embed in your website</CardTitle>
                <CardDescription>Copy this code to embed the form in your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Input value={embedCode} readOnly className="flex-1 font-mono text-xs" />
                  <Button variant="outline" size="icon" onClick={handleCopyEmbed}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-md mt-4 border">
                  <div className="text-xs text-gray-500">Preview</div>
                  <div className="h-32 flex items-center justify-center bg-white border border-dashed mt-2 text-gray-400 text-sm">
                    Form preview would appear here
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Custom URL</CardTitle>
                <CardDescription>Create a custom URL for your form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-gray-500">{window.location.origin}/f/</span>
                  <Input 
                    value={customSlug} 
                    onChange={(e) => setCustomSlug(e.target.value)} 
                    placeholder="custom-form-name" 
                    className="flex-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Form Protection</CardTitle>
                <CardDescription>Add password protection to your form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password-protection" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password protection
                  </Label>
                  <Switch 
                    id="password-protection"
                    checked={passwordProtected} 
                    onCheckedChange={setPasswordProtected} 
                  />
                </div>

                {passwordProtected && (
                  <Input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter password" 
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Form Scheduling</CardTitle>
                <CardDescription>Set open and close dates for your form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="scheduling" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Enable scheduling
                  </Label>
                  <Switch 
                    id="scheduling"
                    checked={schedulingEnabled} 
                    onCheckedChange={setSchedulingEnabled} 
                  />
                </div>

                {schedulingEnabled && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="start-date" className="text-sm">Start date</Label>
                      <Input 
                        id="start-date"
                        type="datetime-local" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date" className="text-sm">End date</Label>
                      <Input 
                        id="end-date"
                        type="datetime-local" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
