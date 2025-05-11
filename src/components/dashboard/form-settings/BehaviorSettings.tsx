
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings2 } from "lucide-react";

interface BehaviorSettingsProps {
  redirectUrl: string;
  successMessage: string;
  allowMultiple: boolean;
  enableCaptcha: boolean;
  onRedirectUrlChange: (url: string) => void;
  onSuccessMessageChange: (message: string) => void;
  onAllowMultipleChange: (allow: boolean) => void;
  onEnableCaptchaChange: (enable: boolean) => void;
}

export function BehaviorSettings({
  redirectUrl,
  successMessage,
  allowMultiple,
  enableCaptcha,
  onRedirectUrlChange,
  onSuccessMessageChange,
  onAllowMultipleChange,
  onEnableCaptchaChange
}: BehaviorSettingsProps) {
  return (
    <Card className="border-indigo-100/20 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-b border-indigo-100/20">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-indigo-500" />
          <CardTitle>Form Behavior</CardTitle>
        </div>
        <CardDescription>Configure how your form behaves</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <Label htmlFor="success-message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Success Message
          </Label>
          <Textarea 
            id="success-message" 
            value={successMessage}
            onChange={(e) => onSuccessMessageChange(e.target.value)}
            placeholder="Thank you for your submission!"
            rows={2}
            className="border-indigo-100/30 focus-visible:ring-indigo-500"
          />
        </div>

        <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <Label htmlFor="redirect-url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Redirect URL (optional)
          </Label>
          <Input 
            id="redirect-url" 
            value={redirectUrl}
            onChange={(e) => onRedirectUrlChange(e.target.value)}
            placeholder="https://example.com/thank-you"
            className="border-indigo-100/30 focus-visible:ring-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Redirect users to this URL after form submission
          </p>
        </div>

        <div className="flex items-center justify-between p-4 border border-dashed border-indigo-200 dark:border-indigo-900/50 rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="allow-multiple" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Allow multiple submissions
            </Label>
            <p className="text-sm text-gray-500">
              Let users submit the form multiple times
            </p>
          </div>
          <Switch 
            id="allow-multiple"
            checked={allowMultiple}
            onCheckedChange={onAllowMultipleChange}
            className="data-[state=checked]:bg-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-dashed border-indigo-200 dark:border-indigo-900/50 rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="enable-captcha" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              CAPTCHA protection
            </Label>
            <p className="text-sm text-gray-500">
              Protect your form from spam with CAPTCHA
            </p>
          </div>
          <Switch 
            id="enable-captcha"
            checked={enableCaptcha}
            onCheckedChange={onEnableCaptchaChange}
            className="data-[state=checked]:bg-indigo-500"
          />
        </div>
      </CardContent>
    </Card>
  );
}
