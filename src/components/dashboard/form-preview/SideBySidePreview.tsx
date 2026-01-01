import { FormValues, FormErrors } from "@/types/forms";
import { ClassicFormRenderer } from "@/components/public/ClassicFormRenderer";
import { ConversationalFormRenderer } from "@/components/public/conversational/ConversationalFormRenderer";
import { cn } from "@/lib/utils";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import type { FormTheme } from "@/lib/types";

interface DeviceFrameProps {
  device: 'desktop' | 'tablet' | 'mobile';
  children: React.ReactNode;
  theme?: FormTheme;
}

function DeviceFrame({ device, children, theme }: DeviceFrameProps) {
  const deviceConfig = {
    desktop: { width: 'w-full max-w-md', icon: Monitor, label: 'Desktop' },
    tablet: { width: 'w-full max-w-xs', icon: Tablet, label: 'Tablet' },
    mobile: { width: 'w-full max-w-[200px]', icon: Smartphone, label: 'Mobile' },
  };

  const config = deviceConfig[device];
  const Icon = config.icon;

  return (
    <div className={cn("flex flex-col items-center gap-2", config.width)}>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
      <div 
        className="w-full rounded-lg border-2 border-border shadow-md overflow-hidden"
        style={{
          backgroundColor: theme?.backgroundColor || undefined,
          fontFamily: theme?.fontFamily || undefined,
        }}
      >
        <div className="bg-muted/50 h-6 flex items-center px-2 gap-1.5 border-b">
          <div className="w-2 h-2 rounded-full bg-destructive/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
        <div className="p-3 max-h-[400px] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

interface SideBySidePreviewProps {
  formDefinition: any;
  formMode: 'classic' | 'conversational';
  formValues: FormValues;
  formErrors: FormErrors;
  onValueChange: (fieldId: string, value: any) => void;
  onFieldBlur: (fieldId: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isSubmitting: boolean;
  theme?: FormTheme;
}

export function SideBySidePreview({
  formDefinition,
  formMode,
  formValues,
  formErrors,
  onValueChange,
  onFieldBlur,
  onSubmit,
  isSubmitting,
  theme,
}: SideBySidePreviewProps) {
  const renderForm = (scale: number = 1) => {
    const formStyle = {
      transform: `scale(${scale})`,
      transformOrigin: 'top center',
      ...(theme?.primaryColor && {
        '--theme-primary': theme.primaryColor,
      } as React.CSSProperties),
    };

    const FormComponent = formMode === 'conversational' 
      ? ConversationalFormRenderer 
      : ClassicFormRenderer;

    return (
      <div style={formStyle}>
        <FormComponent
          formDefinition={formDefinition}
          formValues={formValues}
          onFormValueChange={onValueChange}
          onFieldBlur={onFieldBlur}
          formErrors={formErrors}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-wrap justify-center gap-6 p-4">
      <DeviceFrame device="desktop" theme={theme}>
        {renderForm(0.65)}
      </DeviceFrame>
      <DeviceFrame device="tablet" theme={theme}>
        {renderForm(0.55)}
      </DeviceFrame>
      <DeviceFrame device="mobile" theme={theme}>
        {renderForm(0.45)}
      </DeviceFrame>
    </div>
  );
}
