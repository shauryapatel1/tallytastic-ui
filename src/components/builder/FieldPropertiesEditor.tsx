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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Field: {label || field.type}</h3>
      <Accordion type="multiple" defaultValue={["common-props", "type-specific-props"]} className="w-full">
        <AccordionItem value="common-props">
          <AccordionTrigger>General Properties</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor={`field-label-${field.id}`}>Label / Question Text</Label>
              <Input
                id={`field-label-${field.id}`}
                value={label} // Now directly from field (non-optional)
                onChange={(e) => handleFieldChange('label', e.target.value)}
                placeholder="E.g., Your Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`field-name-${field.id}`}>Submission Key (Name)</Label>
              <Input
                id={`field-name-${field.id}`}
                value={name} // Now directly from field (non-optional)
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="e.g., user_name (unique, no spaces)"
              />
              {/* TODO: Add validation for the 'name' property (e.g., no spaces, uniqueness, required) */}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`field-description-${field.id}`}>Helper Text / Description</Label>
              <Textarea
                id={`field-description-${field.id}`}
                value={helperText} // field.description
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Optional helper text shown below the input."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`field-placeholder-${field.id}`}>Placeholder Text</Label>
              <Input
                id={`field-placeholder-${field.id}`}
                value={placeholder}
                onChange={(e) => handleFieldChange('placeholder', e.target.value)}
                placeholder="Optional placeholder text for the input."
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor={`field-defaultValue-${field.id}`}>Default Value</Label>
              {renderDefaultValueInput(field)}
              {/* TODO: defaultValue input type should vary based on field.type (e.g. number, boolean, etc. Currently always string) - This is now addressed by renderDefaultValueInput */}
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id={`field-isRequired-${field.id}`}
                checked={isRequired} // Now directly from field (non-optional)
                onCheckedChange={(checked) => handleFieldChange('isRequired', checked)}
              />
              <Label htmlFor={`field-isRequired-${field.id}`}>Required Field</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id={`field-isHidden-${field.id}`}
                checked={isHidden} 
                onCheckedChange={(checked) => handleFieldChange('isHidden', checked)}
              />
              <Label htmlFor={`field-isHidden-${field.id}`}>Hidden Field</Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="type-specific-props">
          <AccordionTrigger>Type Specific Properties ({field.type})</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            {renderTypeSpecificEditor()}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="validation-rules">
          <AccordionTrigger>Validation Rules</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">// TODO: UI for more complex validation rules.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="advanced-validation-rules">
          <AccordionTrigger>Custom Validation Rules</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <AdvancedValidationEditor
              rules={field.advancedValidationRules}
              fieldDefinition={field}
              onRulesChange={(newRules) => {
                handleFieldChange('advancedValidationRules', newRules);
              }}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="display-logic">
          <AccordionTrigger>Display Logic</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <ConditionalLogicEditor
              logicBlocks={field.conditionalLogic}
              currentFieldDefinition={field}
              formDefinition={formDefinition}
              onLogicChange={(newLogicBlocks) => {
                handleFieldChange('conditionalLogic', newLogicBlocks);
              }}
            />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="styling-options">
          <AccordionTrigger>Styling Options</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">// TODO: UI for styling options (Phase 1.G).</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ai-suggestions">
          <AccordionTrigger>AI Assistance</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">// TODO: Placeholder for AI suggestions.</p>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
} 