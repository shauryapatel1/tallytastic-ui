import type { FormDefinition, FormFieldDefinition, FormFieldType } from '@/types/forms';
import { isFieldVisible } from '@/lib/conditionalLogicEvaluator'; // Import the evaluator
import { TextFieldPresenter } from './presenters/TextFieldPresenter';
import { NumberFieldPresenter } from './presenters/NumberFieldPresenter';
import { DateFieldPresenter } from './presenters/DateFieldPresenter';
// import { SelectFieldPresenter } from './presenters/SelectFieldPresenter';
// import { DateFieldPresenter } from './presenters/DateFieldPresenter';
import { RatingFieldPresenter } from './presenters/RatingFieldPresenter';
import { FileFieldPresenter } from './presenters/FileFieldPresenter';
import { HeadingPresenter } from './presenters/HeadingPresenter';
import { ParagraphPresenter } from './presenters/ParagraphPresenter';
import { DividerPresenter } from './presenters/DividerPresenter';
import { ChoiceFieldPresenter } from './presenters/ChoiceFieldPresenter'; // For radio, checkbox, select

interface FormRendererProps {
  formDefinition: FormDefinition; // Assuming definition is always present for rendering
  formValues?: Record<string, any>;
  onFormValueChange?: (fieldId: string, newValue: any) => void;
  onFieldBlur?: (fieldId: string) => void;
  formErrors?: Record<string, string[]>; // Added prop for field errors
}

// Helper component to render a single field
const RenderField = ({
  field,
  allFields, // Pass all fields for context in isFieldVisible
  formValues,
  onFormValueChange,
  onFieldBlur,
  fieldErrorMessages, // Added prop for error messages for this specific field
}: {
  field: FormFieldDefinition;
  allFields: FormFieldDefinition[];
  formValues?: Record<string, any>;
  onFormValueChange?: (fieldId: string, newValue: any) => void;
  onFieldBlur?: (fieldId: string) => void;
  fieldErrorMessages?: string[]; // Added prop
}) => {
  // Dynamic visibility check using the evaluator
  if (!isFieldVisible(field, allFields, formValues || {})) {
    return null;
  }

  // Common props to pass to interactive presenters
  const interactivePresenterProps = {
    value: formValues?.[field.id],
    onValueChange: onFormValueChange ? (newValue: any) => onFormValueChange(field.id, newValue) : undefined,
    onBlur: onFieldBlur ? () => onFieldBlur(field.id) : undefined,
    // Pass only the first error message for now, or consider how presenters handle multiple errors
    error: fieldErrorMessages && fieldErrorMessages.length > 0 ? fieldErrorMessages[0] : undefined,
  };

  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'email':
    case 'tel':
    case 'url':
      return <TextFieldPresenter field={field as FormFieldDefinition & { type: Extract<FormFieldType, 'text' | 'textarea' | 'email' | 'tel' | 'url'> }} {...interactivePresenterProps} />;
    case 'number':
      return <NumberFieldPresenter field={field as FormFieldDefinition & { type: 'number' }} {...interactivePresenterProps} />;
    case 'date':
    case 'time':
      return <DateFieldPresenter field={field as FormFieldDefinition & { type: Extract<FormFieldType, 'date' | 'time'> }} {...interactivePresenterProps} />;
    case 'select':
    case 'radio':
    case 'checkbox':
      return <ChoiceFieldPresenter field={field as FormFieldDefinition & { type: Extract<FormFieldType, 'select' | 'radio' | 'checkbox'>; options?: import('@/types/forms').FieldOption[] }} {...interactivePresenterProps} />;
    // case 'date':
    // case 'time':
    //   return <DateFieldPresenter field={field} />;
    case 'rating':
      return <RatingFieldPresenter field={field as FormFieldDefinition & { type: 'rating' }} {...interactivePresenterProps} />;
    case 'file': // File inputs have specific value handling, may need custom logic if made interactive
      return <FileFieldPresenter field={field as FormFieldDefinition & { type: 'file' }} {...interactivePresenterProps} />;
    case 'heading':
      return <HeadingPresenter field={field as FormFieldDefinition & { type: 'heading' }} />;
    case 'paragraph':
      return <ParagraphPresenter field={field as FormFieldDefinition & { type: 'paragraph' }} />;
    case 'divider':
      return <DividerPresenter field={field as FormFieldDefinition & { type: 'divider' }} />;
    default:
      // console.warn(`Unsupported field type in FormRenderer: ${field.type}`);
      return (
        <div className="p-2 my-2 border border-dashed border-destructive rounded-md bg-destructive/10">
          <p className="text-sm text-destructive">
            Preview for field type "<strong>{field.type}</strong>" (Label: {field.label}) is not yet implemented.
          </p>
        </div>
      );
  }
};

export function FormRenderer({ formDefinition, formValues, onFormValueChange, onFieldBlur, formErrors }: FormRendererProps) {
  if (!formDefinition) { 
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No form definition provided.</p>
      </div>
    );
  }

  if (formDefinition.sections.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>This form has no sections or fields yet.</p>
      </div>
    );
  }

  const allFields = formDefinition.sections.flatMap(section => section.fields);

  return (
    <div className="p-4 space-y-8 bg-background rounded-md shadow ring-1 ring-border">
      {formDefinition.sections.map((section) => (
        <section key={section.id} aria-labelledby={`section-title-${section.id}`} className="p-4 border rounded-lg shadow-sm">
          {section.title && (
            <h2 id={`section-title-${section.id}`} className="text-xl font-semibold mb-1 border-b pb-2">
              {section.title}
            </h2>
          )}
          {section.description && (
            <p className="text-sm text-muted-foreground mb-4">
              {section.description}
            </p>
          )}
          {section.fields.length > 0 ? (
            <div className="space-y-4">
              {section.fields.map((field) => (
                <RenderField
                  key={field.id}
                  field={field}
                  allFields={allFields}
                  formValues={formValues}
                  onFormValueChange={onFormValueChange}
                  onFieldBlur={onFieldBlur}
                  fieldErrorMessages={formErrors?.[field.id]}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">This section has no fields yet.</p>
          )}
        </section>
      ))}
    </div>
  );
} 