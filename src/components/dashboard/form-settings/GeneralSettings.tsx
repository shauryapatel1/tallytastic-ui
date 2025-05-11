
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface GeneralSettingsProps {
  formTitle: string;
  formDescription: string;
  onFormTitleChange: (title: string) => void;
  onFormDescriptionChange: (description: string) => void;
}

export function GeneralSettings({
  formTitle,
  formDescription,
  onFormTitleChange,
  onFormDescriptionChange
}: GeneralSettingsProps) {
  return (
    <>
      <Card className="border-indigo-100/20 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-b border-indigo-100/20">
          <CardTitle>Form Details</CardTitle>
          <CardDescription>Basic information about your form</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="form-title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Form Title
            </Label>
            <Input 
              id="form-title" 
              value={formTitle}
              onChange={(e) => onFormTitleChange(e.target.value)}
              className="border-indigo-100/30 focus-visible:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="form-description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Form Description
            </Label>
            <Textarea 
              id="form-description" 
              value={formDescription}
              onChange={(e) => onFormDescriptionChange(e.target.value)}
              rows={3}
              className="border-indigo-100/30 focus-visible:ring-indigo-500"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-100/20 shadow-md overflow-hidden">
        <CardHeader className="bg-red-50/50 dark:bg-red-950/30 border-b border-red-100/20">
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Destructive actions for your form</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
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
    </>
  );
}
