
import { useState, useEffect } from "react";
import { FormField } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";

interface ConditionalLogicBuilderProps {
  field: FormField;
  allFields: FormField[];
  onChange: (conditional: FormField['conditional']) => void;
}

type Operator = 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';

export function ConditionalLogicBuilder({ 
  field, 
  allFields, 
  onChange 
}: ConditionalLogicBuilderProps) {
  const [enabled, setEnabled] = useState(!!field.conditional);
  const [selectedFieldId, setSelectedFieldId] = useState<string>(field.conditional?.fieldId || '');
  const [selectedOperator, setSelectedOperator] = useState<Operator>(
    field.conditional?.operator as Operator || 'equals'
  );
  const [conditionValue, setConditionValue] = useState<string | number | boolean>(
    field.conditional?.value !== undefined ? field.conditional.value : ''
  );

  // Filter out the current field and section fields since they can't be used as condition sources
  const availableFields = allFields.filter(f => 
    f.id !== field.id && f.type !== 'section'
  );

  // Get the selected field object
  const selectedField = availableFields.find(f => f.id === selectedFieldId);

  useEffect(() => {
    if (enabled) {
      onChange({
        fieldId: selectedFieldId,
        operator: selectedOperator,
        value: conditionValue
      });
    } else {
      onChange(undefined);
    }
  }, [enabled, selectedFieldId, selectedOperator, conditionValue, onChange]);

  // Handle the value input based on field type
  const renderValueInput = () => {
    if (!selectedField) return null;

    switch (selectedField.type) {
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="condition-value-checkbox"
              checked={!!conditionValue}
              onCheckedChange={checked => setConditionValue(!!checked)}
            />
            <Label htmlFor="condition-value-checkbox">
              {conditionValue ? 'Checked' : 'Unchecked'}
            </Label>
          </div>
        );
        
      case 'select':
      case 'radio':
        if (selectedField.options?.length) {
          return (
            <Select 
              value={conditionValue as string} 
              onValueChange={setConditionValue}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a value" />
              </SelectTrigger>
              <SelectContent>
                {selectedField.options.map((option, i) => (
                  <SelectItem key={i} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        return null;
        
      case 'number':
      case 'rating':
        return (
          <Input
            type="number"
            value={conditionValue as string}
            onChange={(e) => setConditionValue(Number(e.target.value))}
            className="w-full"
          />
        );
        
      default:
        return (
          <Input
            value={conditionValue as string}
            onChange={(e) => setConditionValue(e.target.value)}
            placeholder="Enter value"
            className="w-full"
          />
        );
    }
  };

  // Get available operators based on field type
  const getAvailableOperators = () => {
    if (!selectedField) return ['equals', 'notEquals'];
    
    switch (selectedField.type) {
      case 'number':
      case 'rating':
        return ['equals', 'notEquals', 'greaterThan', 'lessThan'];
      case 'checkbox':
        return ['equals'];
      case 'text':
      case 'email':
      case 'textarea':
        return ['equals', 'notEquals', 'contains'];
      default:
        return ['equals', 'notEquals'];
    }
  };

  // Convert operator to display text
  const operatorToText = (op: Operator): string => {
    switch(op) {
      case 'equals': return 'Equals';
      case 'notEquals': return 'Not equals';
      case 'contains': return 'Contains';
      case 'greaterThan': return 'Greater than';
      case 'lessThan': return 'Less than';
      default: return op;
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Conditional Logic</h4>
        <div className="flex items-center space-x-2">
          <Label htmlFor="enable-condition">Enable</Label>
          <Checkbox 
            id="enable-condition" 
            checked={enabled} 
            onCheckedChange={setEnabled}
          />
        </div>
      </div>

      {enabled && (
        <div className="space-y-3">
          <div>
            <Label className="mb-1 block">Show this field if</Label>
            <Select 
              value={selectedFieldId} 
              onValueChange={setSelectedFieldId}
              disabled={availableFields.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                {availableFields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedFieldId && (
            <>
              <div>
                <Label className="mb-1 block">Operator</Label>
                <Select 
                  value={selectedOperator} 
                  onValueChange={(value) => setSelectedOperator(value as Operator)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableOperators().map((op) => (
                      <SelectItem key={op} value={op}>
                        {operatorToText(op as Operator)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1 block">Value</Label>
                {renderValueInput()}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
