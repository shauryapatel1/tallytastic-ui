
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BellRing } from "lucide-react";

interface NotificationSettingsProps {
  notifyOnSubmission: boolean;
  notificationEmail: string;
  onNotifyOnSubmissionChange: (value: boolean) => void;
  onNotificationEmailChange: (email: string) => void;
}

export function NotificationSettings({
  notifyOnSubmission,
  notificationEmail,
  onNotifyOnSubmissionChange,
  onNotificationEmailChange
}: NotificationSettingsProps) {
  return (
    <Card className="border-indigo-100/20 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-b border-indigo-100/20">
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5 text-indigo-500" />
          <CardTitle>Email Notifications</CardTitle>
        </div>
        <CardDescription>Configure email alerts for form activity</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="notify-submission" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Notify on submission
            </Label>
            <p className="text-sm text-gray-500">
              Receive an email whenever someone submits your form
            </p>
          </div>
          <Switch 
            id="notify-submission"
            checked={notifyOnSubmission}
            onCheckedChange={onNotifyOnSubmissionChange}
            className="data-[state=checked]:bg-indigo-500"
          />
        </div>

        {notifyOnSubmission && (
          <div className="space-y-2 p-4 border border-dashed border-indigo-200 dark:border-indigo-900/50 rounded-lg bg-white dark:bg-slate-900/20">
            <Label htmlFor="notification-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </Label>
            <Input 
              id="notification-email" 
              type="email"
              value={notificationEmail}
              onChange={(e) => onNotificationEmailChange(e.target.value)}
              placeholder="email@example.com"
              className="border-indigo-100/30 focus-visible:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can add multiple email addresses separated by commas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
