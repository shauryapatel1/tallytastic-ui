import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye, Monitor, Smartphone, Tablet, MessageSquare, List, LayoutGrid, Columns } from "lucide-react";
import { ClassicFormRenderer } from "@/components/public/ClassicFormRenderer";
import { ConversationalFormRenderer } from "@/components/public/conversational/ConversationalFormRenderer";
import { SideBySidePreview } from "@/components/dashboard/form-preview/SideBySidePreview";
import { CompactThemeCustomizer } from "@/components/dashboard/form-preview/CompactThemeCustomizer";
import { useFormValidation } from "@/hooks/useFormValidation";
import { cn } from "@/lib/utils";
import type { FormValues } from "@/types/forms";
import type { FormTheme } from "@/lib/types";

interface ContextType {
  formData: any;
  navigationState: any;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';
type FormMode = 'classic' | 'conversational';
type ViewMode = 'single' | 'sidebyside';

const defaultTheme: FormTheme = {
  primaryColor: "#6366f1",
  backgroundColor: "#ffffff",
  fontFamily: "Inter, sans-serif",
  borderRadius: "6px",
};

export default function PreviewStep() {
  const { formData } = useOutletContext<ContextType>();
  const [previewValues, setPreviewValues] = useState<FormValues>({});
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [formMode, setFormMode] = useState<FormMode>(
    formData?.settings?.mode === 'conversational' ? 'conversational' : 'classic'
  );
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [theme, setTheme] = useState<FormTheme>(formData?.theme || defaultTheme);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fieldCount = formData?.sections?.reduce((total: number, section: any) => 
    total + (section.fields?.length || 0), 0) || 0;

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
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Preview submission successful! (This is a preview - no data was saved)');
    }, 1000);
  };

  const handleOpenPublicPreview = () => {
    window.open(`/public/form/${formData.id}`, '_blank');
  };

  const handleThemeChange = (newTheme: FormTheme) => {
    setTheme(newTheme);
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

      {/* Mode, Device, View, and Theme Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex flex-wrap items-center gap-4">
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

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">View:</span>
            <div className="flex gap-1 p-1 bg-background rounded-md border">
              <Button
                variant={viewMode === 'single' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('single')}
                className="gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                Single
              </Button>
              <Button
                variant={viewMode === 'sidebyside' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('sidebyside')}
                className="gap-2"
              >
                <Columns className="w-4 h-4" />
                Compare
              </Button>
            </div>
          </div>

          {/* Device Toggle - Only show in single view mode */}
          {viewMode === 'single' && (
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
          )}
        </div>

        {/* Theme Customizer */}
        <CompactThemeCustomizer theme={theme} onThemeChange={handleThemeChange} />
      </div>

      {/* Preview Container */}
      <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/30">
        {viewMode === 'sidebyside' ? (
          <SideBySidePreview
            formDefinition={formData}
            formMode={formMode}
            formValues={previewValues}
            formErrors={previewErrors}
            onValueChange={handleValueChange}
            onFieldBlur={validateField}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            theme={theme}
          />
        ) : (
          <div className="flex justify-center">
            <div className={cn(
              "w-full transition-all duration-300",
              deviceWidths[deviceMode]
            )}>
              <div 
                className="rounded-lg shadow-lg p-6 sm:p-8 max-h-[600px] overflow-y-auto"
                style={{
                  backgroundColor: theme.backgroundColor,
                  fontFamily: theme.fontFamily,
                  borderRadius: theme.borderRadius,
                }}
              >
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
        )}
      </div>

      <div className="text-sm text-muted-foreground bg-primary/5 p-4 rounded-lg border border-primary/10">
        <p className="font-semibold text-foreground mb-2">Testing tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Try filling out the form as a user would</li>
          <li>Test required field validation by leaving fields empty</li>
          <li>Check that conditional logic shows/hides fields correctly</li>
          <li>Toggle between Classic and Conversational modes</li>
          <li>Use "Compare" view to see all device sizes side by side</li>
          <li>Customize theme colors and fonts before publishing</li>
          {formMode === 'conversational' && (
            <li>Use keyboard shortcuts: Enter to continue, 1-9 for radio choices</li>
          )}
        </ul>
      </div>
    </div>
  );
}
