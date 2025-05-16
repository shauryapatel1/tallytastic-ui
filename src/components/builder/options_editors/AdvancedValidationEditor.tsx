import { useState, useEffect } from 'react';
import type { ValidationRule, ValidationRuleType, ValidationRuleParams, FormFieldDefinition } from '@/types/forms';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper to generate unique IDs for new rules
const generateRuleId = () => `rule_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const ALL_RULE_TYPES: { value: ValidationRuleType; label: string; fieldTypes?: FormFieldDefinition['type'][] }[] = [
  { value: 'minLength', label: 'Minimum Length', fieldTypes: ['text', 'textarea', 'email', 'tel', 'url'] },
  { value: 'maxLength', label: 'Maximum Length', fieldTypes: ['text', 'textarea', 'email', 'tel', 'url'] },
  { value: 'pattern', label: 'Regex Pattern', fieldTypes: ['text', 'textarea', 'email', 'tel', 'url'] },
  { value: 'isEmail', label: 'Is Valid Email', fieldTypes: ['text', 'email'] },
  { value: 'isURL', label: 'Is Valid URL', fieldTypes: ['text', 'url'] },
  { value: 'minValue', label: 'Minimum Value', fieldTypes: ['number', 'rating', 'date', 'time'] }, // Date/Time might need special handling for 'value' param
  { value: 'maxValue', label: 'Maximum Value', fieldTypes: ['number', 'rating', 'date', 'time'] },
];

export interface AdvancedValidationEditorProps {
  rules: ValidationRule[] | undefined;
  fieldDefinition: FormFieldDefinition; // To provide context (e.g., field type for relevant rule suggestions)
  onRulesChange: (newRules: ValidationRule[] | undefined) => void;
}

export function AdvancedValidationEditor({
  rules: initialRules,
  fieldDefinition,
  onRulesChange,
}: AdvancedValidationEditorProps) {
  const [currentRules, setCurrentRules] = useState<ValidationRule[]>([]);

  useEffect(() => {
    setCurrentRules(initialRules ? JSON.parse(JSON.stringify(initialRules)) : []);
  }, [initialRules]);

  const availableRuleTypes = ALL_RULE_TYPES.filter(rt => 
    !rt.fieldTypes || rt.fieldTypes.includes(fieldDefinition.type)
  );

  const handleAddRule = () => {
    const newRule: ValidationRule = {
      id: generateRuleId(),
      type: availableRuleTypes[0]?.value || 'minLength', // Default to first available or a common one
      params: {},
      customMessage: '',
    };
    const updatedRules = [...currentRules, newRule];
    setCurrentRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const handleDeleteRule = (idToDelete: string) => {
    const updatedRules = currentRules.filter(rule => rule.id !== idToDelete);
    setCurrentRules(updatedRules);
    onRulesChange(updatedRules.length > 0 ? updatedRules : undefined);
  };

  const handleRuleChange = (index: number, updatedRulePart: Partial<ValidationRule>) => {
    const updatedRules = currentRules.map((rule, i) => 
      i === index ? { ...rule, ...updatedRulePart } : rule
    );
    // If type changes, reset params to avoid carrying over incompatible ones
    if (updatedRulePart.type && updatedRules[index].type !== currentRules[index].type) {
        updatedRules[index].params = {}; 
    }
    setCurrentRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const renderRuleParamsInput = (rule: ValidationRule, index: number) => {
    const params = rule.params || {};
    const commonInputProps = {
      className: "mt-1 h-9 text-sm",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value: rawValue } = e.target;
        let processedValue: string | number | undefined = rawValue; // Default to string

        if (name === 'length') {
          const lengthVal = parseInt(rawValue, 10);
          processedValue = !isNaN(lengthVal) && lengthVal >= 0 ? lengthVal : undefined;
        } else if (name === 'regex') {
          processedValue = rawValue || undefined;
        } else if (name === 'value' && (rule.type === 'minValue' || rule.type === 'maxValue')) {
          if (fieldDefinition.type === 'number' || fieldDefinition.type === 'rating') {
            const numVal = parseFloat(rawValue);
            processedValue = !isNaN(numVal) ? numVal : undefined;
          } else { // For date, time, or other future string-comparable types for min/max
            processedValue = rawValue || undefined;
          }
        }
        // For any other future param inputs, they'd default to string processing 
        // or need specific handling added above.

        handleRuleChange(index, { params: { ...params, [name]: processedValue } });
      }
    };

    switch (rule.type) {
      case 'minLength':
      case 'maxLength':
        return (
          <Input 
            {...commonInputProps} 
            type="number" 
            name="length" 
            placeholder="Enter length" 
            value={params.length !== undefined ? String(params.length) : ''} 
            min="0"
          />
        );
      case 'pattern':
        return <Input {...commonInputProps} type="text" name="regex" placeholder="Enter regex pattern" value={params.regex || ''} />;
      case 'minValue':
      case 'maxValue':
        let inputType: 'text' | 'number' | 'date' | 'time' = 'text';
        let inputValue: string = (params.value as string) || '';
        let placeholderText = `Enter ${rule.type === 'minValue' ? 'min' : 'max'} value`;

        if (fieldDefinition.type === 'number' || fieldDefinition.type === 'rating') {
          inputType = 'number';
          inputValue = params.value !== undefined ? String(params.value) : '';
        } else if (fieldDefinition.type === 'date') {
          inputType = 'date';
          inputValue = (params.value as string) || ''; // HTML date input expects YYYY-MM-DD
          placeholderText = 'YYYY-MM-DD';
        } else if (fieldDefinition.type === 'time') {
          inputType = 'time';
          inputValue = (params.value as string) || ''; // HTML time input expects HH:mm
          placeholderText = 'HH:MM';
        } else {
          // Fallback for non-standard field types that might use minValue/maxValue with string comparison
          // This path should be rare given the availableRuleTypes filtering
          inputType = 'text'; 
          inputValue = (params.value as string) || '';
        }
        return <Input {...commonInputProps} type={inputType} name="value" placeholder={placeholderText} value={inputValue} />;
      case 'isEmail':
      case 'isURL':
        return <p className="text-xs text-muted-foreground mt-1 italic">No parameters needed.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {currentRules.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-2">
          No custom validation rules added yet.
        </p>
      )}
      {currentRules.map((rule, index) => (
        <div key={rule.id} className="p-4 border rounded-md bg-background shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Rule #{index + 1}</h4>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)} aria-label="Delete rule">
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`rule-type-${rule.id}`} className="text-xs">Rule Type</Label>
              <Select 
                value={rule.type} 
                onValueChange={(value) => handleRuleChange(index, { type: value as ValidationRuleType })}
              >
                <SelectTrigger id={`rule-type-${rule.id}`} className="h-9 text-sm">
                  <SelectValue placeholder="Select rule type" />
                </SelectTrigger>
                <SelectContent>
                  {availableRuleTypes.map(rt => (
                    <SelectItem key={rt.value} value={rt.value}>{rt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`rule-params-${rule.id}`} className="text-xs">Parameters</Label>
              {renderRuleParamsInput(rule, index)}
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor={`rule-message-${rule.id}`} className="text-xs">Custom Error Message</Label>
            <Input 
              id={`rule-message-${rule.id}`} 
              value={rule.customMessage} 
              onChange={(e) => handleRuleChange(index, { customMessage: e.target.value })}
              placeholder="e.g., Must be at least 8 characters"
              className="h-9 text-sm"
            />
          </div>
        </div>
      ))}
      <Button onClick={handleAddRule} variant="outline" size="sm" className="mt-2">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Validation Rule
      </Button>
    </div>
  );
} 