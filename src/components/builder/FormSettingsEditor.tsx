import type { FormDefinition, FormSettings } from '@/types/forms';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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

  // Specific handler for submitButtonText for now
  const handleSubmitButtonTextChange = (value: string | undefined) => {
    onUpdateFormSettings({ submitButtonText: value });
  };

  return (
    <div className={cn("p-4 space-y-6", className)}>
      <h3 className="text-lg font-medium text-foreground">Form Settings</h3>
      
      <div className="space-y-3">
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

        {/* 
          Future settings can be added here. 
          If settings with different types are added, handleSettingChange would need to be more generic or have specific handlers per setting type.
        */}
      </div>
    </div>
  );
} 