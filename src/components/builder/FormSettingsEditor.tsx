import { useState, useEffect } from 'react';
import type { FormDefinition, FormSettings } from '@/types/forms';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { validateFormRedirectUrl } from '@/lib/urlValidation';
import { AlertCircle } from 'lucide-react';

interface FormSettingsEditorProps {
  formDefinition: FormDefinition;
  onUpdateFormSettings: (updates: Partial<FormSettings>) => void;
  className?: string;
}

export function FormSettingsEditor({
  formDefinition,
  onUpdateFormSettings,
  className,
}: FormSettingsEditorProps) {
  const currentSettings = formDefinition.settings || {};
  const defaultSubmitButtonText = 'Submit';
  
  const [redirectUrlError, setRedirectUrlError] = useState<string | null>(null);

  // Validate redirect URL on change
  const handleRedirectUrlChange = (value: string) => {
    const validation = validateFormRedirectUrl(value);
    
    if (!validation.isValid) {
      setRedirectUrlError(validation.error || 'Invalid URL');
    } else {
      setRedirectUrlError(null);
    }
    
    // Always update the value so user can see what they're typing
    onUpdateFormSettings({ redirectUrl: value || undefined });
  };

  // Validate on mount if there's an existing value
  useEffect(() => {
    if (currentSettings.redirectUrl) {
      const validation = validateFormRedirectUrl(currentSettings.redirectUrl);
      if (!validation.isValid) {
        setRedirectUrlError(validation.error || 'Invalid URL');
      }
    }
  }, []);

  const handleSubmitButtonTextChange = (value: string | undefined) => {
    onUpdateFormSettings({ submitButtonText: value });
  };

  const handleSuccessMessageChange = (value: string | undefined) => {
    onUpdateFormSettings({ customSuccessMessage: value });
  };

  return (
    <div className={cn("p-4 space-y-6", className)}>
      <h3 className="text-lg font-medium text-foreground">Form Settings</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="submitButtonText" className="text-sm font-medium">
            Submit Button Text
          </Label>
          <p className="text-xs text-muted-foreground mb-1">
            The text displayed on the main submission button of the form.
          </p>
          <Input
            id="submitButtonText"
            type="text"
            placeholder={defaultSubmitButtonText}
            value={currentSettings.submitButtonText ?? ''} 
            onChange={(e) => handleSubmitButtonTextChange(e.target.value || undefined)}
          />
        </div>

        <div>
          <Label htmlFor="customSuccessMessage" className="text-sm font-medium">
            Success Message
          </Label>
          <p className="text-xs text-muted-foreground mb-1">
            Message shown after successful form submission.
          </p>
          <Textarea
            id="customSuccessMessage"
            placeholder="Thank you for your submission!"
            value={currentSettings.customSuccessMessage ?? ''} 
            onChange={(e) => handleSuccessMessageChange(e.target.value || undefined)}
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="redirectUrl" className="text-sm font-medium">
            Redirect URL
          </Label>
          <p className="text-xs text-muted-foreground mb-1">
            Optional URL to redirect users after submission (e.g., https://example.com/thank-you).
          </p>
          <Input
            id="redirectUrl"
            type="text"
            placeholder="https://example.com/thank-you"
            value={currentSettings.redirectUrl ?? ''} 
            onChange={(e) => handleRedirectUrlChange(e.target.value)}
            className={cn(redirectUrlError && "border-destructive focus-visible:ring-destructive")}
          />
          {redirectUrlError && (
            <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              <span>{redirectUrlError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}