import type {
  FormDefinition,
  FormFieldDefinition,
  FormSectionDefinition,
  FormSettings,
  // BaseFieldProps, // No longer needed directly here if FormFieldDefinition has all props
  // FieldSpecificProps, // This type is not defined and not needed with the new structure
} from '@/types/forms';
import { SectionPropertiesEditor } from './SectionPropertiesEditor.tsx';
import { FieldPropertiesEditor } from './FieldPropertiesEditor.tsx';
import { FormSettingsEditor } from './FormSettingsEditor.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils'; // For conditional classNames

export interface PropertyEditorPaneProps {
  formDefinition: FormDefinition | null;
  selectedElement: FormFieldDefinition | FormSectionDefinition | null;
  onUpdateField: (
    sectionId: string,
    fieldId: string,
    // Pass partial updates to the FormFieldDefinition, excluding 'id'
    updates: Partial<Omit<FormFieldDefinition, 'id'>>
  ) => void;
  onUpdateSectionProperties: (
    sectionId: string,
    updatedProperties: Partial<Omit<FormSectionDefinition, 'id' | 'fields'>>
  ) => void;
  onUpdateFormSettings?: (updates: Partial<FormSettings>) => void;
  className?: string; // Allow passing additional class names
}

export function PropertyEditorPane({
  formDefinition,
  selectedElement,
  onUpdateField,
  onUpdateSectionProperties,
  onUpdateFormSettings,
  className,
}: PropertyEditorPaneProps) {
  if (!formDefinition) {
    return (
      <div className={cn("p-6 text-sm text-muted-foreground border-l h-full", className)}>
        Load or create a form to see its properties.
      </div>
    );
  }

  if (selectedElement) {
    const isSection = 'fields' in selectedElement;
    return (
      <ScrollArea className={cn("h-full border-l", className)}>
        <div className="p-4 space-y-6">
          {isSection ? (
            <SectionPropertiesEditor
              key={selectedElement.id}
              section={selectedElement as FormSectionDefinition}
              onUpdate={(updates) => onUpdateSectionProperties(selectedElement.id, updates)}
            />
          ) : (
            () => {
              const field = selectedElement as FormFieldDefinition;
              const parentSection = formDefinition.sections.find(s => s.fields.some(f => f.id === field.id));
              
              if (!parentSection) {
                console.error("Error: Parent section for the selected field not found.", field, formDefinition);
                return <p className="p-4 text-destructive">Error: Field's parent section not found.</p>;
              }

              return (
                <FieldPropertiesEditor
                  key={selectedElement.id}
                  field={field}
                  sectionId={parentSection.id}
                  formDefinition={formDefinition}
                  onUpdateField={onUpdateField}
                />
              );
            }
          )()}
        </div>
      </ScrollArea>
    );
  }

  if (onUpdateFormSettings) {
    return (
      <ScrollArea className={cn("h-full border-l", className)}>
        <FormSettingsEditor 
          formDefinition={formDefinition} 
          onUpdateFormSettings={onUpdateFormSettings} 
        />
      </ScrollArea>
    );
  }
  
  return (
    <div className={cn("p-6 text-sm text-muted-foreground border-l h-full", className)}>
      Select an element from the form structure to edit its properties, or manage form-wide settings.
    </div>
  );
} 