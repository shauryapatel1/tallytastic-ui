import type {
  FormDefinition,
  FormFieldDefinition,
  FormSectionDefinition,
  // BaseFieldProps, // No longer needed directly here if FormFieldDefinition has all props
  // FieldSpecificProps, // This type is not defined and not needed with the new structure
} from '@/types/forms';
import { SectionPropertiesEditor } from './SectionPropertiesEditor.tsx';
import { FieldPropertiesEditor } from './FieldPropertiesEditor.tsx';
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
  className?: string; // Allow passing additional class names
}

export function PropertyEditorPane({
  formDefinition,
  selectedElement,
  onUpdateField,
  onUpdateSectionProperties,
  className,
}: PropertyEditorPaneProps) {
  if (!selectedElement || !formDefinition) {
    return (
      <div className={cn("p-6 text-sm text-muted-foreground border-l h-full", className)}>
        Select an element from the form structure to edit its properties.
      </div>
    );
  }

  // Determine if it's a section or a field
  const isSection = 'fields' in selectedElement;

  return (
    <ScrollArea className={cn("h-full border-l", className)}>
      <div className="p-4 space-y-6">
        {isSection ? (
          <SectionPropertiesEditor
            key={selectedElement.id} // Ensure re-render on selection change
            section={selectedElement as FormSectionDefinition}
            onUpdate={(updates) => onUpdateSectionProperties(selectedElement.id, updates)}
          />
        ) : (
          () => {
            const field = selectedElement as FormFieldDefinition;
            // Find the parent section ID. This assumes fields are always within sections.
            // A more robust solution might involve passing sectionId or enhancing data structure if fields can be parent-less.
            const parentSection = formDefinition.sections.find(s => s.fields.some(f => f.id === field.id));
            
            if (!parentSection) {
              // This case should ideally not be reached if the data integrity is maintained.
              console.error("Error: Parent section for the selected field not found.", field, formDefinition);
              return <p className="p-4 text-destructive">Error: Field's parent section not found. Please check data consistency.</p>;
            }

            return (
              <FieldPropertiesEditor
                key={selectedElement.id} // Ensure re-render on selection change
                field={field}
                sectionId={parentSection.id}
                formDefinition={formDefinition}
                onUpdateField={onUpdateField} // Pass the consolidated update handler
                // TODO: Pass AI suggestion states & handlers here in the future
              />
            );
          }
        )()}
      </div>
    </ScrollArea>
  );
} 