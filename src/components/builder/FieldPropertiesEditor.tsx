import type {
  FormDefinition,
  FormFieldDefinition as FormFieldDefinitionType, // Keep alias to avoid conflict with component name
  FormFieldType
} from '@/types/forms';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TextOptionsEditor } from "./options_editors/TextOptionsEditor";
import { ChoiceOptionsEditor } from "./options_editors/ChoiceOptionsEditor";
import { NumberOptionsEditor } from "./options_editors/NumberOptionsEditor";
import { DateOptionsEditor } from "./options_editors/DateOptionsEditor";
import { RatingOptionsEditor } from "./options_editors/RatingOptionsEditor";
import { FileOptionsEditor } from "./options_editors/FileOptionsEditor";
import { HeadingOptionsEditor } from "./options_editors/HeadingOptionsEditor";
import { ParagraphOptionsEditor } from "./options_editors/ParagraphOptionsEditor";
import { DividerOptionsEditor } from "./options_editors/DividerOptionsEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdvancedValidationEditor } from "./options_editors/AdvancedValidationEditor";
import { ConditionalLogicEditor } from "./options_editors/ConditionalLogicEditor";
import { FieldStylingEditor } from './options_editors/FieldStylingEditor';

export interface FieldPropertiesEditorProps {
  field: FormFieldDefinitionType; // Use the imported FormFieldDefinitionType directly
  sectionId: string;
  formDefinition: FormDefinition;
  onUpdateField: (
    sectionId: string,
    fieldId: string,
    updates: Partial<Omit<FormFieldDefinitionType, 'id'>>
  ) => void;
}

export function FieldPropertiesEditor({
  field,
  sectionId,
  formDefinition, 
  onUpdateField,
}: FieldPropertiesEditorProps) {

  const handleFieldChange = <K extends keyof Omit<FormFieldDefinitionType, 'id'>>(
    propertyName: K,
    value: Omit<FormFieldDefinitionType, 'id'>[K]
  ) => {
    onUpdateField(sectionId, field.id, { [propertyName]: value });
  };
  
  // name and isRequired are non-optional in FormFieldDefinitionType (via BaseFieldProps)
  // For controlled inputs, ensure they have a value. 
  // `name` will default to empty string if somehow not provided, but should be set by field creation logic.
  // `isRequired` will default to false if not provided, also should be set by field creation.
  const name = field.name; // Non-optional
  const label = field.label; // Non-optional
  const helperText = field.description || ''; // `description` is the new name for helperText
  const placeholder = field.placeholder || '';
  const defaultValue = field.defaultValue; // Keep as 'any' for flexibility
  const isRequired = field.isRequired; // Non-optional
  const isHidden = field.isHidden || false;

  const renderTypeSpecificEditor = () => {
    const fieldTypeStr = field.type as string;

    switch (fieldTypeStr) {
      case 'text': 
      case 'textarea': 
      case 'email':
      case 'tel':
      case 'url':
        return (
          <TextOptionsEditor
            minLength={field.minLength}
            maxLength={field.maxLength}
            rows={field.rows} // Will be undefined for non-textarea types, handled by TextOptionsEditor
            fieldType={field.type as 'text' | 'textarea'} // Asserting specific types TextOptionsEditor expects for fieldType
            onPropertyChange={(propertyName, value) => {
              handleFieldChange(propertyName as 'minLength' | 'maxLength' | 'rows', value);
            }}
          />
        );
      case 'select':
      case 'radio':
      case 'checkbox':
        return (
          <ChoiceOptionsEditor
            options={field.options || []}
            allowMultipleSelection={field.allowMultipleSelection}
            allowOther={field.options?.some(opt => opt.value === '__other__') || field.allowOther}
            fieldType={field.type as 'select' | 'radio' | 'checkbox'}
            onConfigChange={(newConfig) => {
              if (newConfig.options !== undefined) handleFieldChange('options', newConfig.options);
              if (newConfig.allowMultipleSelection !== undefined) handleFieldChange('allowMultipleSelection', newConfig.allowMultipleSelection);
              if (newConfig.allowOther !== undefined) handleFieldChange('allowOther', newConfig.allowOther);
            }}
          />
        );
      case 'number': 
        return (
          <NumberOptionsEditor
            min={field.min}
            max={field.max}
            onPropertyChange={(propertyName, value) => {
              handleFieldChange(propertyName as 'min' | 'max', value);
            }}
          />
        );
      case 'date': 
      case 'time':
        return (
          <DateOptionsEditor
            dateFormat={field.dateFormat}
            minDate={field.minDate}
            maxDate={field.maxDate}
            onPropertyChange={(propertyName, value) => {
              handleFieldChange(propertyName as 'dateFormat' | 'minDate' | 'maxDate', value);
            }}
          />
        );
      case 'rating': 
        return (
          <RatingOptionsEditor
            maxRating={field.maxRating}
            ratingType={field.ratingType}
            onPropertyChange={(propertyName, value) => {
              handleFieldChange(propertyName as 'maxRating' | 'ratingType', value as any);
              // Using `as any` for value here because the value type is a union 
              // (number | 'star' | 'number_scale' | undefined) and handleFieldChange expects a more specific property value type.
              // This is generally safe if RatingOptionsEditor ensures correct value types are passed for each propertyName.
            }}
          />
        );
      case 'file': 
        return (
          <FileOptionsEditor
            maxFileSizeMB={field.maxFileSizeMB}
            allowedFileTypes={field.allowedFileTypes}
            onPropertyChange={(propertyName, value) => {
              handleFieldChange(propertyName as 'maxFileSizeMB' | 'allowedFileTypes', value as any);
              // Using `as any` for value due to the union type of value in FileOptionsEditorProps
              // and the more specific expected type in handleFieldChange.
              // This should be safe if FileOptionsEditor ensures correct value types.
            }}
          />
        );
      case 'heading': 
        return (
          <HeadingOptionsEditor
            level={field.level}
            onPropertyChange={(propertyName, value) => {
              // propertyName will always be 'level' for HeadingOptionsEditor
              handleFieldChange(propertyName, value);
            }}
          />
        );
      case 'paragraph': 
        return (
          <ParagraphOptionsEditor
            content={field.content}
            onPropertyChange={(propertyName, value) => {
              // propertyName will always be 'content' for ParagraphOptionsEditor
              handleFieldChange(propertyName, value);
            }}
          />
        );
      case 'divider':
        return <DividerOptionsEditor />;
      default:
        // This should ideally not be reached if field.type is a valid FormFieldType
        // const exhaustiveCheck: never = field.type; // This line causes a type error in JSX, but confirms exhaustiveness for TS
        console.warn(`Unhandled field type in PropertyEditorPane: ${field.type}`);
        return <p className="text-sm text-destructive-foreground bg-destructive p-2 rounded-md">Unknown/unhandled field type: {field.type}</p>;
    }
  };

  const renderDefaultValueInput = (currentField: FormFieldDefinitionType): JSX.Element | null => {
    const commonProps = {
      id: `field-defaultValue-${currentField.id}`,
      className: "mt-1",
      placeholder: "Set a default value",
    };

    switch (currentField.type) {
      case 'text':
      case 'textarea':
      case 'email':
      case 'tel':
      case 'url':
      case 'paragraph': // Though paragraphs use 'content', defaultValue might be a concept here
        return (
          <Input
            {...commonProps}
            type="text"
            value={(currentField.defaultValue as string) || ''}
            onChange={(e) => handleFieldChange('defaultValue', e.target.value || undefined)}
          />
        );
      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            value={currentField.defaultValue !== undefined ? String(currentField.defaultValue) : ''}
            onChange={(e) => handleFieldChange('defaultValue', e.target.value === '' ? undefined : parseFloat(e.target.value))}
          />
        );
      case 'date':
        return (
          <Input
            {...commonProps}
            type="date"
            value={(currentField.defaultValue as string) || ''} // HTML date input expects YYYY-MM-DD
            onChange={(e) => handleFieldChange('defaultValue', e.target.value || undefined)}
          />
        );
      case 'time':
        return (
          <Input
            {...commonProps}
            type="time"
            value={(currentField.defaultValue as string) || ''} // HTML time input expects HH:mm
            onChange={(e) => handleFieldChange('defaultValue', e.target.value || undefined)}
          />
        );
      case 'select':
      case 'radio': // For radio, defaultValue would be one of the option values
        if (!currentField.options || currentField.options.length === 0) {
          return <p className="text-xs text-muted-foreground mt-1">Define options first to set a default value.</p>;
        }
        return (
          <Select
            value={(currentField.defaultValue as string) || ""}
            onValueChange={(value) => handleFieldChange('defaultValue', value === "" ? undefined : value)}
          >
            <SelectTrigger {...commonProps} id={`field-defaultValue-select-${currentField.id}`}>
              <SelectValue placeholder="Select a default value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No Default</SelectItem>
              {currentField.options.map(option => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'checkbox':
        // Assuming checkbox defaultValue is boolean (true for checked, false for unchecked)
        // This is for a standalone checkbox concept. If it's part of a group or must have a value, this needs adjustment.
        return (
          <div className="flex items-center space-x-2 mt-1">
            <Switch
              id={`field-defaultValue-checkbox-${currentField.id}`}
              checked={currentField.defaultValue as boolean || false}
              onCheckedChange={(checked) => handleFieldChange('defaultValue', checked)}
            />
            <Label htmlFor={`field-defaultValue-checkbox-${currentField.id}`} className="text-sm font-normal">
              Checked by default
            </Label>
          </div>
        );
      case 'rating':
        return (
          <Input
            {...commonProps}
            type="number"
            min="0" // Or 1, depending on rating system (0 could mean 'no rating')
            max={currentField.maxRating || 5} // Default to 5 if maxRating not set
            step="1" // Or 0.5 if half-ratings allowed
            value={currentField.defaultValue !== undefined ? String(currentField.defaultValue) : ''}
            onChange={(e) => {
              const val = e.target.value;
              handleFieldChange('defaultValue', val === '' ? undefined : parseInt(val, 10));
            }}
            placeholder={`e.g., 3 (0-${currentField.maxRating || 5})`}
          />
        );
      case 'file':
      case 'heading':
      case 'divider':
        return <p className="text-xs text-muted-foreground mt-1">Default value is not applicable for this field type.</p>;
      default:
        // Fallback for any unhandled types, though ideally all are covered
        return (
          <Input
            {...commonProps}
            type="text"
            value={currentField.defaultValue !== undefined ? String(currentField.defaultValue) : ''}
            onChange={(e) => handleFieldChange('defaultValue', e.target.value || undefined)}
            placeholder="Enter default value"
          />
        );
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <Label htmlFor={`field-label-${field.id}`} className="text-sm font-medium">Label / Question</Label>
        <Input
          id={`field-label-${field.id}`}
          value={label}
          onChange={(e) => handleFieldChange('label', e.target.value)}
          placeholder="Enter field label"
          className="text-base" // Slightly larger for the main label input
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`field-name-${field.id}`} className="text-sm font-medium">Field Name (Internal ID)</Label>
        <Input
          id={`field-name-${field.id}`}
          value={name} // This is field.name
          onChange={(e) => handleFieldChange('name', e.target.value.replace(/\s+/g, '_').toLowerCase())} // Basic sanitization
          placeholder="e.g., user_email, first_name"
          className="text-xs"
          // Potentially add validation for uniqueness or format if needed here or on blur
        />
        <p className="text-xs text-muted-foreground">
          Internal identifier for this field. Used in data exports and integrations. No spaces or special characters other than underscores.
        </p>
      </div>

      <Accordion type="multiple" defaultValue={['basic']} className="w-full">
        <AccordionItem value="basic">
          <AccordionTrigger className="text-sm font-medium">Basic Properties</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`field-helperText-${field.id}`} className="text-xs">Helper Text / Description</Label>
              <Textarea
                id={`field-helperText-${field.id}`}
                value={helperText}
                onChange={(e) => handleFieldChange('description', e.target.value || undefined)}
                placeholder="Provide additional guidance for this field"
                rows={2}
                className="text-xs"
              />
            </div>

            {field.type !== 'divider' && field.type !== 'heading' && field.type !== 'paragraph' && (
              <div className="space-y-2">
                <Label htmlFor={`field-placeholder-${field.id}`} className="text-xs">Placeholder Text</Label>
                <Input
                  id={`field-placeholder-${field.id}`}
                  value={placeholder}
                  onChange={(e) => handleFieldChange('placeholder', e.target.value || undefined)}
                  placeholder="Enter placeholder text"
                  className="text-xs"
                />
              </div>
            )}

            {field.type !== 'divider' && field.type !== 'heading' && (
              <div className="space-y-2">
                <Label htmlFor={`field-defaultValue-${field.id}`} className="text-xs">Default Value</Label>
                {renderDefaultValueInput(field)}
              </div>
            )}
            
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label htmlFor={`field-isRequired-${field.id}`} className="text-xs font-medium">Required</Label>
                    <p className="text-[11px] text-muted-foreground">
                        User must fill this field.
                    </p>
                </div>
                <Switch
                    id={`field-isRequired-${field.id}`}
                    checked={isRequired}
                    onCheckedChange={(checked) => handleFieldChange('isRequired', checked)}
                    aria-label="Toggle field required status"
                />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label htmlFor={`field-isHidden-${field.id}`} className="text-xs font-medium">Hidden</Label>
                    <p className="text-[11px] text-muted-foreground">
                        Hide this field by default (can be shown by conditional logic).
                    </p>
                </div>
                <Switch
                    id={`field-isHidden-${field.id}`}
                    checked={isHidden}
                    onCheckedChange={(checked) => handleFieldChange('isHidden', checked)}
                    aria-label="Toggle field hidden status"
                />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Type Specific Options - Conditionally Rendered */}
        {renderTypeSpecificEditor() && (
          <AccordionItem value="typeSpecific">
            <AccordionTrigger className="text-sm font-medium">Type Specific Options</AccordionTrigger>
            <AccordionContent className="pt-4">
              {renderTypeSpecificEditor()}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Advanced Validation Rules Editor - CORRECTED AS PER USER DIRECTIVE */}
        {field.type !== 'divider' && field.type !== 'heading' && (
          <AccordionItem value="advancedValidation" disabled={!field}>
            <AccordionTrigger className="text-sm font-medium">Advanced Validation Rules</AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 px-1">
              {field ? (
                <AdvancedValidationEditor
                  rules={field.advancedValidationRules || []}
                  fieldDefinition={field}
                  onRulesChange={(newRules) => {
                    handleFieldChange('advancedValidationRules', newRules && newRules.length > 0 ? newRules : undefined);
                  }}
                />
              ) : (
                <p className="text-sm text-muted-foreground p-2">Select a field to set validation rules.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Conditional Logic Editor */}
        {field.type !== 'divider' && field.type !== 'heading' && (
            <AccordionItem value="conditionalLogic" disabled={!field}>
                <AccordionTrigger className="text-sm font-medium">Conditional Logic</AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 px-1">
                  {field ? (
                    <ConditionalLogicEditor
                        logicBlocks={field.conditionalLogic}
                        currentFieldDefinition={field}
                        formDefinition={formDefinition}
                        onLogicChange={(newLogicBlocks) => handleFieldChange('conditionalLogic', newLogicBlocks && newLogicBlocks.length > 0 ? newLogicBlocks : undefined)}
                    />
                  ) : (
                     <p className="text-sm text-muted-foreground p-2">Select a field to set conditional logic.</p>
                  )}
                </AccordionContent>
            </AccordionItem>
        )}

        {/* Field Styling Options - CORRECTED AS PER USER DIRECTIVE */}
        <AccordionItem value="stylingOptions" disabled={!field}>
          <AccordionTrigger className="text-sm font-medium">Styling Options</AccordionTrigger>
          <AccordionContent className="pt-2 pb-4 px-1">
            {field ? (
              <FieldStylingEditor
                styleOptions={field.styleOptions || { labelIsVisible: true }} // Ensure default for labelIsVisible
                onStyleChange={(newStyles) => { // Changed from onStylesChange to onStyleChange
                  handleFieldChange('styleOptions', newStyles);
                }}
              />
            ) : (
              <p className="text-sm text-muted-foreground p-2">Select a field to set styling options.</p>
            )}
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
} 