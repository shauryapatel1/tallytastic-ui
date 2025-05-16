import { useState, useEffect } from 'react';
import type { 
  ConditionalLogicBlock, 
  ConditionalLogicRule, 
  FormFieldDefinition, 
  FormDefinition, 
  FormFieldType, 
  // ConditionalLogicOperator // We'll define this locally or import if it becomes a shared type
} from '@/types/forms';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input"; // For value input placeholder
import { Trash2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define Operator types locally for now, can be moved to types/forms if widely used
type ConditionalLogicOperator =
  | 'isEmpty' | 'isNotEmpty' | 'equals' | 'notEquals' | 'contains' | 'notContains'
  | 'startsWith' | 'endsWith' | 'isGreaterThan' | 'isLessThan' 
  | 'isGreaterThanOrEquals' | 'isLessThanOrEquals' | 'isOneOf' | 'isNoneOf'
  | 'isBefore' | 'isAfter' | 'isOnOrBefore' | 'isOnOrAfter'; // Added date/time operators

// Helper to generate unique IDs
const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// --- Helper Functions/Constants (Placeholders) ---
const getOperatorsForFieldType = (fieldType: FormFieldType | undefined): Array<{ value: ConditionalLogicOperator; label: string }> => {
  if (!fieldType) return [];

  const baseOperators: Array<{ value: ConditionalLogicOperator; label: string }> = [
    { value: 'isEmpty', label: 'Is Empty' },
    { value: 'isNotEmpty', label: 'Is Not Empty' },
    // 'equals' and 'notEquals' are widely applicable but handled per type for clarity/specific labels if needed.
  ];

  let specificOperators: Array<{ value: ConditionalLogicOperator; label: string }> = [];

  switch (fieldType) {
    case 'text':
    case 'textarea':
    case 'email':
    case 'tel':
    case 'url':
    case 'paragraph':
      specificOperators = [
        { value: 'equals', label: 'Equals' },
        { value: 'notEquals', label: 'Does Not Equal' },
        { value: 'contains', label: 'Contains' },
        { value: 'notContains', label: 'Does Not Contain' },
        { value: 'startsWith', label: 'Starts With' },
        { value: 'endsWith', label: 'Ends With' },
      ];
      break;
    case 'number':
    case 'rating':
      specificOperators = [
        { value: 'equals', label: 'Equals' },
        { value: 'notEquals', label: 'Does Not Equal' },
        { value: 'isGreaterThan', label: 'Is Greater Than' },
        { value: 'isLessThan', label: 'Is Less Than' },
        { value: 'isGreaterThanOrEquals', label: 'Is Greater Than or Equals' },
        { value: 'isLessThanOrEquals', label: 'Is Less Than or Equals' },
      ];
      break;
    case 'date':
    case 'time': // Assuming same operators for date and time for now, adjust if needed
      specificOperators = [
        { value: 'equals', label: 'Is On' }, // "Equals" can be "Is On" for dates
        { value: 'notEquals', label: 'Is Not On' }, // "Not Equals" can be "Is Not On"
        { value: 'isBefore', label: 'Is Before' },
        { value: 'isAfter', label: 'Is After' },
        { value: 'isOnOrBefore', label: 'Is On or Before' },
        { value: 'isOnOrAfter', label: 'Is On or After' },
      ];
      break;
    case 'select':
    case 'radio':
    case 'checkbox': // For single checkbox state, 'equals' (to true/false) might be tricky with shared ops.
                     // For checkbox groups, 'contains' would be better.
                     // V1: simple equals/not equals for selected value
      specificOperators = [
        { value: 'equals', label: 'Is Equal To' }, // Renamed for clarity for choice types
        { value: 'notEquals', label: 'Is Not Equal To' },
        // TODO: For multi-select source fields or checkbox groups:
        // { value: 'isOneOf', label: 'Is One Of (Multiple Values)' }, 
        // { value: 'isNoneOf', label: 'Is None Of (Multiple Values)' },
        // TODO: For standalone checkbox:
        // { value: 'isChecked', label: 'Is Checked' }, (would need boolean value)
        // { value: 'isUnchecked', label: 'Is Unchecked' } (would need boolean value)
      ];
      break;
    // 'file', 'divider', 'heading' might not have many applicable operators or value comparisons
    default:
      specificOperators = [
        { value: 'equals', label: 'Equals' },
        { value: 'notEquals', label: 'Does Not Equal' },
      ];
      break;
  }
  // Combine and remove duplicates if any (though structure above should prevent it)
  const allOperators = [...baseOperators, ...specificOperators];
  return allOperators.filter((op, index, self) => index === self.findIndex(o => o.value === op.value));
};

const renderValueInputForCondition = (
  sourceField: FormFieldDefinition | undefined, 
  operator: ConditionalLogicOperator | undefined,
  currentValue: any,
  onChange: (value: any) => void
): JSX.Element | null => {
  if (!sourceField || !operator || operator === 'isEmpty' || operator === 'isNotEmpty') {
    return <p className="text-xs text-muted-foreground mt-1 italic h-9 flex items-center">No value needed for this operator.</p>;
  }

  const commonInputProps = {
    value: currentValue ?? '', // Ensure value is not null/undefined for controlled inputs
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    className: "mt-1 h-9 text-sm",
    placeholder: "Enter value",
  };
  
  const commonSelectProps = {
    value: currentValue ?? '',
    onValueChange: (value: string) => onChange(value === "" ? undefined : value), // Allow unsetting to undefined
    // className: "mt-1 h-9 text-sm", // SelectTrigger will handle its own styling via className prop
  };

  switch (sourceField.type) {
    case 'text':
    case 'textarea':
    case 'email':
    case 'tel':
    case 'url':
    case 'paragraph':
      return <Input {...commonInputProps} type="text" />;
    
    case 'number':
    case 'rating':
      return (
        <Input 
          {...commonInputProps} 
          type="number" 
          value={currentValue ?? ''} // Allow empty string for clearing
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === '' ? undefined : parseFloat(val));
          }} 
        />
      );

    case 'date':
      return <Input {...commonInputProps} type="date" placeholder="YYYY-MM-DD" />;
    
    case 'time':
      return <Input {...commonInputProps} type="time" placeholder="HH:MM" />;

    case 'select':
    case 'radio':
    // For 'checkbox' if it's a group and has options. For standalone boolean checkbox, this needs a different approach.
    // V1: Assuming 'checkbox' refers to a field that has predefined options, similar to radio/select for value comparison.
      if (!sourceField.options || sourceField.options.length === 0) {
        return <p className="text-xs text-muted-foreground mt-1 italic h-9 flex items-center">Source field has no options.</p>;
      }
      return (
        <Select {...commonSelectProps}>
          <SelectTrigger className="mt-1 h-9 text-sm">
            <SelectValue placeholder="Select value..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">(No Value / Clear)</SelectItem> {/* Allow clearing the selection */}
            {sourceField.options.map(opt => (
              <SelectItem key={opt.id} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    
    case 'checkbox':
      // New logic based on CTO decision for 'equals' or 'notEquals' operator
      if (operator === 'equals' || operator === 'notEquals') {
        return (
          <Select
            value={currentValue === true ? "true" : currentValue === false ? "false" : ""}
            onValueChange={(val) => {
              if (val === "true") onChange(true);
              else if (val === "false") onChange(false);
              else onChange(undefined); // Or handle as per requirements for empty selection
            }}
          >
            <SelectTrigger className="mt-1 h-9 text-sm">
              <SelectValue placeholder="Select state..." />
            </SelectTrigger>
            <SelectContent>
              {/* Optional: Allow clearing the selection if needed 
              <SelectItem value="">(No Value / Clear)</SelectItem> 
              */}
              <SelectItem value="true">Checked</SelectItem>
              <SelectItem value="false">Unchecked</SelectItem>
            </SelectContent>
          </Select>
        );
      }
      // Fallback for other operators or if checkbox has options (current behavior)
      // This part handles cases where a checkbox might have assigned values like a radio group.
      if (sourceField.options && sourceField.options.length > 0) {
        return (
          <Select {...commonSelectProps}>
            <SelectTrigger className="mt-1 h-9 text-sm">
              <SelectValue placeholder="Select value..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">(No Value / Clear)</SelectItem>
              {sourceField.options.map(opt => (
                <SelectItem key={opt.id} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      // Default for checkbox if no specific handling and no options (e.g. for future custom operators)
      // or if operator is not 'equals'/'notEquals'
      // For now, if not 'equals'/'notEquals' and no options, it might be better to show nothing or a message.
      // However, the original code had a fallback to text input here.
      // Let's provide a message if no specific UI is defined for the operator.
      return <p className="text-xs text-muted-foreground mt-1 italic h-9 flex items-center">Value input not applicable for this operator on a checkbox without options.</p>;

    default:
      // Fallback for unhandled field types that require a value
      return <Input {...commonInputProps} type="text" />;
  }
};

// --- Component Props & Main Component ---
export interface ConditionalLogicEditorProps {
  logicBlocks: ConditionalLogicBlock[] | undefined;
  currentFieldDefinition: FormFieldDefinition;
  formDefinition: FormDefinition;
  onLogicChange: (newLogicBlocks: ConditionalLogicBlock[] | undefined) => void;
}

export function ConditionalLogicEditor({
  logicBlocks: initialLogicBlocks,
  currentFieldDefinition,
  formDefinition,
  onLogicChange,
}: ConditionalLogicEditorProps) {
  const [currentLogicBlocks, setCurrentLogicBlocks] = useState<ConditionalLogicBlock[]>([]);

  useEffect(() => {
    setCurrentLogicBlocks(initialLogicBlocks ? JSON.parse(JSON.stringify(initialLogicBlocks)) : []);
  }, [initialLogicBlocks]);

  const allOtherFields = formDefinition.sections.flatMap(s => s.fields).filter(f => f.id !== currentFieldDefinition.id);

  // --- Block Level Handlers ---
  const handleAddLogicBlock = () => {
    const newBlock: ConditionalLogicBlock = {
      id: generateId('block'),
      action: 'show',
      logicType: 'all',
      conditions: [],
    };
    const updatedBlocks = [...currentLogicBlocks, newBlock];
    setCurrentLogicBlocks(updatedBlocks);
    onLogicChange(updatedBlocks);
  };

  const handleUpdateBlock = (blockIndex: number, updatedBlockPart: Partial<ConditionalLogicBlock>) => {
    const updatedBlocks = currentLogicBlocks.map((block, i) => 
      i === blockIndex ? { ...block, ...updatedBlockPart } : block
    );
    setCurrentLogicBlocks(updatedBlocks);
    onLogicChange(updatedBlocks);
  };

  const handleDeleteBlock = (blockId: string) => {
    const updatedBlocks = currentLogicBlocks.filter(block => block.id !== blockId);
    setCurrentLogicBlocks(updatedBlocks);
    onLogicChange(updatedBlocks.length > 0 ? updatedBlocks : undefined);
  };

  // --- Condition Level Handlers (within a block) ---
  const handleAddCondition = (blockIndex: number) => {
    const newCondition: ConditionalLogicRule = {
      id: generateId('condition'),
      sourceFieldId: '',
      operator: 'equals', // Default operator
      value: undefined,
    };
    const targetBlock = { ...currentLogicBlocks[blockIndex] };
    targetBlock.conditions = [...targetBlock.conditions, newCondition];
    handleUpdateBlock(blockIndex, { conditions: targetBlock.conditions });
  };

  const handleUpdateCondition = (blockIndex: number, conditionIndex: number, updatedRulePart: Partial<ConditionalLogicRule>) => {
    const targetBlock = { ...currentLogicBlocks[blockIndex] };
    const updatedConditions = targetBlock.conditions.map((cond, i) => 
      i === conditionIndex ? { ...cond, ...updatedRulePart } : cond
    );
    // If sourceFieldId changes, reset operator and value
    if (updatedRulePart.sourceFieldId && updatedConditions[conditionIndex].sourceFieldId !== targetBlock.conditions[conditionIndex].sourceFieldId) {
      updatedConditions[conditionIndex].operator = 'equals'; // Reset operator
      updatedConditions[conditionIndex].value = undefined;    // Reset value
    }
    handleUpdateBlock(blockIndex, { conditions: updatedConditions });
  };

  const handleDeleteCondition = (blockIndex: number, conditionId: string) => {
    const targetBlock = { ...currentLogicBlocks[blockIndex] };
    targetBlock.conditions = targetBlock.conditions.filter(cond => cond.id !== conditionId);
    handleUpdateBlock(blockIndex, { conditions: targetBlock.conditions });
  };

  // --- Render Functions ---
  const renderConditionRuleItem = (rule: ConditionalLogicRule, blockIndex: number, conditionIndex: number) => {
    const selectedSourceField = allOtherFields.find(f => f.id === rule.sourceFieldId);
    const availableOperators = getOperatorsForFieldType(selectedSourceField?.type);

    return (
      <div key={rule.id} className="p-3 border rounded-md bg-card-foreground/5 space-y-2">
        <div className="flex justify-between items-start">
          <p className="text-xs font-medium text-muted-foreground">Condition</p>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteCondition(blockIndex, rule.id)} aria-label="Delete condition" className="h-7 w-7">
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
          <div className="space-y-1">
            <Label htmlFor={`condition-source-${rule.id}`} className="text-xs">Source Field</Label>
            <Select 
              value={rule.sourceFieldId}
              onValueChange={(value) => handleUpdateCondition(blockIndex, conditionIndex, { sourceFieldId: value })}
            >
              <SelectTrigger id={`condition-source-${rule.id}`} className="h-9 text-sm">
                <SelectValue placeholder="Select field..." />
              </SelectTrigger>
              <SelectContent>
                {allOtherFields.map(f => <SelectItem key={f.id} value={f.id}>{f.label || f.name} ({f.type})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor={`condition-operator-${rule.id}`} className="text-xs">Operator</Label>
            <Select 
              value={rule.operator}
              onValueChange={(value) => handleUpdateCondition(blockIndex, conditionIndex, { operator: value as ConditionalLogicOperator })}
              disabled={!rule.sourceFieldId}
            >
              <SelectTrigger id={`condition-operator-${rule.id}`} className="h-9 text-sm">
                <SelectValue placeholder="Select operator..." />
              </SelectTrigger>
              <SelectContent>
                {availableOperators.map(op => <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor={`condition-value-${rule.id}`} className="text-xs">Value</Label>
            {renderValueInputForCondition(selectedSourceField, rule.operator as ConditionalLogicOperator, rule.value, 
              (value) => handleUpdateCondition(blockIndex, conditionIndex, { value }))}
          </div>
        </div>
      </div>
    );
  };

  const renderLogicBlockItem = (block: ConditionalLogicBlock, blockIndex: number) => (
    <div key={block.id} className="p-4 border rounded-lg bg-background shadow-md space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-base font-semibold">Logic Block #{blockIndex + 1}</h4>
        <Button variant="ghost" size="icon" onClick={() => handleDeleteBlock(block.id)} aria-label="Delete logic block">
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">If</p>
            <RadioGroup 
                defaultValue={block.logicType} 
                onValueChange={(value) => handleUpdateBlock(blockIndex, { logicType: value as 'all' | 'any' })}
                className="flex space-x-2"
            >
                <div className="flex items-center space-x-1"><RadioGroupItem value="all" id={`logic-all-${block.id}`} /><Label htmlFor={`logic-all-${block.id}`} className="text-sm font-normal">All</Label></div>
                <div className="flex items-center space-x-1"><RadioGroupItem value="any" id={`logic-any-${block.id}`} /><Label htmlFor={`logic-any-${block.id}`} className="text-sm font-normal">Any</Label></div>
            </RadioGroup>
            <p className="text-sm font-medium">of the following conditions are met:</p>
        </div>
      </div>

      <div className="space-y-2 pl-4 border-l-2">
        {block.conditions.length === 0 && <p className="text-xs text-muted-foreground italic py-1">No conditions added to this block yet.</p>}
        {block.conditions.map((cond, condIndex) => renderConditionRuleItem(cond, blockIndex, condIndex))}
        <Button variant="outline" size="sm" onClick={() => handleAddCondition(blockIndex)} className="mt-2">
          <PlusCircle className="h-3.5 w-3.5 mr-1.5" /> Add Condition
        </Button>
      </div>
      
      <div className="flex items-center space-x-2 pt-2 border-t mt-3">
        <p className="text-sm font-medium">Then</p>
        <Select 
            value={block.action} 
            onValueChange={(value) => handleUpdateBlock(blockIndex, { action: value as 'show' | 'hide' })}
        >
            <SelectTrigger className="h-9 text-sm w-[180px]">
                <SelectValue placeholder="Select action..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="show">Show this field</SelectItem>
                <SelectItem value="hide">Hide this field</SelectItem>
            </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {currentLogicBlocks.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-2">
          No display logic configured. This field will always be visible by default.
        </p>
      )}
      {currentLogicBlocks.map((block, index) => renderLogicBlockItem(block, index))}
      <Button onClick={handleAddLogicBlock} variant="default" size="sm" className="mt-3 w-full">
        <PlusCircle className="h-4 w-4 mr-2" /> Add Display Logic Block
      </Button>
      <p className="text-xs text-muted-foreground mt-2">
        {/* TODO: Add note about logic evaluation order / precedence if needed */}
        Note: If multiple logic blocks are active, 'hide' actions generally take precedence. This field is visible by default unless hidden by logic.
      </p>
    </div>
  );
} 