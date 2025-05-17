import React from 'react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { FormFieldDefinition, FormFieldType, FieldOption, FormFieldStyleOptions } from "@/types/forms";
import { cn } from "@/lib/utils";

// Helper to determine width class
const getWidthClass = (width?: FormFieldStyleOptions['width']) => {
  switch (width) {
    case '1/2': return 'w-1/2';
    case '1/3': return 'w-1/3';
    case '2/3': return 'w-2/3';
    case 'auto': return 'w-auto';
    case 'full':
    default: return 'w-full';
  }
};

export interface ChoiceFieldPresenterProps {
  field: FormFieldDefinition & {
    type: Extract<FormFieldType, 'select' | 'radio' | 'checkbox'>;
    options?: FieldOption[]; // Should ideally always be present for these types
    allowMultipleSelection?: boolean; // Primarily for 'select', implied for 'checkbox' groups
    allowOther?: boolean; // V1: Not fully implemented in preview, only options are rendered
    // defaultValue is part of FormFieldDefinition (any type)
    error?: string; // Added error prop
  };
  value?: string | string[] | undefined;
  onValueChange?: (newValue: string | string[] | undefined) => void;
}

export function ChoiceFieldPresenter({ field, value: propValue, onValueChange, error }: ChoiceFieldPresenterProps) {
  const {
    id,
    label,
    description,
    placeholder,
    isRequired,
    defaultValue,
    options = [], // Default to empty array if undefined
    styleOptions = { labelIsVisible: true }, // Provide default for styleOptions
    type,
    allowMultipleSelection,
    // allowOther is destructured but not used in V1 rendering logic per spec
  } = field;

  const isInteractive = !!onValueChange;

  const widthClass = getWidthClass(styleOptions?.width);
  const inputStyling: React.CSSProperties = {
    color: styleOptions?.inputTextColor,
    backgroundColor: styleOptions?.inputBackgroundColor,
    borderColor: error ? 'hsl(var(--destructive))' : styleOptions?.inputBorderColor,
    borderWidth: styleOptions?.inputBorderColor || error ? '1px' : undefined,
    borderStyle: styleOptions?.inputBorderColor || error ? 'solid' : undefined,
  };
  const labelStyling: React.CSSProperties = { color: styleOptions?.labelTextColor };

  const renderSelect = () => {
    // For multi-select 'select' fields, render as disabled checkboxes
    if (allowMultipleSelection) {
      const currentSelectedValues = isInteractive ? 
        (Array.isArray(propValue) ? propValue : (propValue ? [propValue] : [])) : 
        (Array.isArray(defaultValue) ? defaultValue : (defaultValue ? [String(defaultValue)] : []));

      return (
        <div className="mt-1 space-y-2">
          {options.map(option => {
            const isChecked = currentSelectedValues.includes(option.value);
            return (
              <div key={option.id || option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${id}-ms-${option.id || option.value}`} // Unique ID for multi-select checkbox
                  checked={isChecked}
                  disabled // Always disabled in preview for multi-select dropdown
                  className={error ? "border-destructive" : ""}
                />
                <Label htmlFor={`${id}-ms-${option.id || option.value}`} style={labelStyling} className="font-normal">
                  {option.label}
                </Label>
              </div>
            );
          })}
          {options.length === 0 && <p className="text-sm text-muted-foreground">No options defined.</p>}
        </div>
      );
    }

    // Original logic for single-select dropdown
    const singleSelectDefaultValue = typeof defaultValue === 'string' ? defaultValue : undefined;
    const currentSingleSelectValue = isInteractive ? (typeof propValue === 'string' ? propValue : undefined) : singleSelectDefaultValue;

    let triggerPlaceholder = placeholder || "Select...";
    // The following block for triggerPlaceholder modification is no longer needed here
    // as multi-select is handled above and single-select doesn't need this complex logic.
    // if (allowMultipleSelection && Array.isArray(propValue) && propValue.length > 0 && isInteractive) { ... }
    // else if (allowMultipleSelection && Array.isArray(defaultValue) && defaultValue.length > 0 && !isInteractive) { ... }

    return (
      <>
        <Select
          value={currentSingleSelectValue}
          disabled={!isInteractive}
          onValueChange={(newValue) => {
            if (isInteractive && onValueChange) {
              // For single-select, onValueChange is straightforward
              onValueChange(newValue);
            }
          }}
        >
          <SelectTrigger 
            id={id} 
            style={inputStyling} 
            className={cn("mt-1", error ? "border-destructive focus-visible:ring-destructive" : "")}
          >
            <SelectValue placeholder={triggerPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map(option => (
                <SelectItem
                  key={option.id || option.value}
                  value={option.value}
                  disabled={!isInteractive}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* The block below for displaying selected values for multi-select is no longer needed,
            as the checkboxes above now handle the visual representation.
        {allowMultipleSelection && (
          isInteractive ? (
            Array.isArray(propValue) && propValue.length > 0 && (
              <div className="mt-1 text-sm text-muted-foreground">
                Selected: {propValue
                  .map(dv => {
                    const opt = options.find(o => o.value === dv);
                    return opt ? opt.label : dv;
                  })
                  .join(', ')}
              </div>
            )
          ) : (
            Array.isArray(defaultValue) && defaultValue.length > 0 && (
          <div className="mt-1 text-sm text-muted-foreground">
            Selected: {defaultValue
              .map(dv => {
                const opt = options.find(o => o.value === dv);
                return opt ? opt.label : dv;
              })
              .join(', ')}
          </div>
            )
          )
        )}
        */}
      </>
    );
  };

  const renderRadioGroup = () => {
    const radioDefaultValue = typeof defaultValue === 'string' ? defaultValue : undefined;
    const currentRadioValue = isInteractive ? (typeof propValue === 'string' ? propValue : undefined) : radioDefaultValue;

    return (
    <RadioGroup
        value={currentRadioValue}
        disabled={!isInteractive}
        onValueChange={(newValue) => {
          if (isInteractive && onValueChange) {
            onValueChange(newValue);
          }
        }}
      className={cn("mt-1 space-y-2", error ? "ring-1 ring-destructive rounded-md p-2" : "")}
    >
      {options.map(option => (
        <div key={option.id || option.value} className="flex items-center space-x-2">
          <RadioGroupItem 
            value={option.value} 
            id={`${id}-${option.id || option.value}`} 
              disabled={!isInteractive}
            style={{borderColor: error? 'hsl(var(--destructive))' : styleOptions?.inputBorderColor}}
          />
          <Label htmlFor={`${id}-${option.id || option.value}`} style={labelStyling} className="font-normal">
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
  };

  const renderCheckboxGroup = () => {
    const currentCheckboxValues = isInteractive ? (Array.isArray(propValue) ? propValue : (typeof propValue === 'string' ? [propValue] : [])) : (Array.isArray(defaultValue) ? defaultValue : (typeof defaultValue === 'string' ? [defaultValue] : []));

    return (
    <div className={cn("mt-1 space-y-2", error ? "ring-1 ring-destructive rounded-md p-2" : "")}>
      {options.map(option => {
          const isChecked = currentCheckboxValues.includes(option.value);

        return (
          <div key={option.id || option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${id}-${option.id || option.value}`}
              checked={isChecked}
                disabled={!isInteractive}
                onCheckedChange={(checkedState) => {
                  if (isInteractive && onValueChange) {
                    const currentValues = Array.isArray(propValue) ? [...propValue] : (propValue ? [propValue] : []);
                    let newValues: string[];
                    if (checkedState) {
                      newValues = [...currentValues, option.value];
                    } else {
                      newValues = currentValues.filter(v => v !== option.value);
                    }
                    // If allowMultipleSelection is true (which is typical for checkboxes), pass array.
                    // If it's meant to be a single checkbox acting like a boolean, this needs adjustment.
                    // For now, assuming checkbox group implies multiple selection capability.
                    onValueChange(newValues);
                  }
                }}
              style={{borderColor: error? 'hsl(var(--destructive))' : styleOptions?.inputBorderColor}}
            />
            <Label htmlFor={`${id}-${option.id || option.value}`} style={labelStyling} className="font-normal">
              {option.label}
            </Label>
          </div>
        );
      })}
    </div>
  );
  };

  let fieldElement: JSX.Element | null = null;
  switch (type) {
    case 'select':
      fieldElement = renderSelect();
      break;
    case 'radio':
      fieldElement = renderRadioGroup();
      break;
    case 'checkbox':
      fieldElement = renderCheckboxGroup();
      break;
  }

  return (
    <div
      className={cn("mb-4 flex flex-col", widthClass)}
      style={{
        backgroundColor: styleOptions?.containerBackgroundColor,
        padding: styleOptions?.containerPadding ? `${styleOptions.containerPadding}px` : undefined,
        // Assuming containerBorderColor implies a border is desired.
        borderWidth: styleOptions?.containerBorderColor ? '1px' : '0px',
        borderStyle: styleOptions?.containerBorderColor ? 'solid' : 'none',
        borderColor: styleOptions?.containerBorderColor,
      }}
    >
      {styleOptions?.labelIsVisible !== false && (
        <Label htmlFor={id} style={labelStyling} className="text-sm font-medium mb-0.5">
          {label} {isRequired && <span className="text-destructive font-normal">*</span>}
        </Label>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mb-1">
          {description}
        </p>
      )}
      {fieldElement}
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
} 