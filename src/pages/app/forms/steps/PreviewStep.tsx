import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye, Monitor, Smartphone, Tablet, MessageSquare, List } from "lucide-react";
import { ClassicFormRenderer } from "@/components/public/ClassicFormRenderer";
import { ConversationalFormRenderer } from "@/components/public/conversational/ConversationalFormRenderer";
import { useFormValidation } from "@/hooks/useFormValidation";
import { cn } from "@/lib/utils";
import type { FormValues } from "@/types/forms";

interface ContextType {
  formData: any;
  navigationState: any;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';
type FormMode = 'classic' | 'conversational';

export default function PreviewStep() {
  const { formData } = useOutletContext<ContextType>();
  const [previewValues, setPreviewValues] = useState<FormValues>({});
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [formMode, setFormMode] = useState<FormMode>(
    formData?.settings?.mode === 'conversational' ? 'conversational' : 'classic'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fieldCount = formData?.sections?.reduce((total: number, section: any) => 
    total + (section.fields?.length || 0), 0) || 0;

  // Use unified validation hook
  const { 
    errors: previewErrors, 
    validateField,
    validateForm 
  } = useFormValidation({
    formDefinition: formData,
    formValues: previewValues
  });

  const handleValueChange = (fieldId: string, value: any) => {
    setPreviewValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;
    
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Preview submission successful! (This is a preview - no data was saved)');
    }, 1000);
  };

  const handleOpenPublicPreview = () => {
    window.open(`/public/form/${formData.id}`, '_blank');
  };

  const deviceWidths = {
    desktop: 'max-w-4xl',
    tablet: 'max-w-2xl',
    mobile: 'max-w-sm'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Preview Your Form
          </h2>
          <p className="text-muted-foreground">
            Test your form before publishing. See how users will experience it.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {fieldCount} field{fieldCount !== 1 ? 's' : ''}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenPublicPreview}
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </Button>
        </div>
      </div>

      {/* Mode and Device Toggles */}
      <div className="flex items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
        {/* Form Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Mode:</span>
          <div className="flex gap-1 p-1 bg-background rounded-md border">
            <Button
              variant={formMode === 'classic' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFormMode('classic')}
              className="gap-2"
            >
              <List className="w-4 h-4" />
              Classic
            </Button>
            <Button
              variant={formMode === 'conversational' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFormMode('conversational')}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Conversational
            </Button>
          </div>
        </div>

        {/* Device Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Device:</span>
          <div className="flex gap-1 p-1 bg-background rounded-md border">
            <Button
              variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceMode('desktop')}
              className="gap-2"
            >
              <Monitor className="w-4 h-4" />
              Desktop
            </Button>
            <Button
              variant={deviceMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceMode('tablet')}
              className="gap-2"
            >
              <Tablet className="w-4 h-4" />
              Tablet
            </Button>
            <Button
              variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceMode('mobile')}
              className="gap-2"
            >
              <Smartphone className="w-4 h-4" />
              Mobile
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/30">
        <div className="flex justify-center">
          <div className={cn(
            "w-full transition-all duration-300",
            deviceWidths[deviceMode]
          )}>
            <div className="bg-background rounded-lg shadow-lg p-6 sm:p-8 max-h-[600px] overflow-y-auto">
              {formMode === 'conversational' ? (
                <ConversationalFormRenderer
                  formDefinition={formData}
                  formValues={previewValues}
                  onFormValueChange={handleValueChange}
                  onFieldBlur={validateField}
                  formErrors={previewErrors}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              ) : (
                <ClassicFormRenderer
                  formDefinition={formData}
                  formValues={previewValues}
                  onFormValueChange={handleValueChange}
                  onFieldBlur={validateField}
                  formErrors={previewErrors}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground bg-primary/5 p-4 rounded-lg border border-primary/10">
        <p className="font-semibold text-foreground mb-2">Testing tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Try filling out the form as a user would</li>
          <li>Test required field validation by leaving fields empty</li>
          <li>Check that conditional logic shows/hides fields correctly</li>
          <li>Toggle between Classic and Conversational modes</li>
          <li>Test on different device sizes to verify responsive design</li>
          {formMode === 'conversational' && (
            <li>Use keyboard shortcuts: Enter to continue, 1-9 for radio choices</li>
          )}
        </ul>
      </div>
    </div>
  );
}