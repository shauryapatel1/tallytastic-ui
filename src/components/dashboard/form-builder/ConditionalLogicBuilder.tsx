import { useState, useEffect } from "react";
import { FormFieldDefinition } from "@/types/forms";
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
  field: FormFieldDefinition;
  allFields: FormFieldDefinition[];
  onChange: (conditionalLogic: FormFieldDefinition['conditionalLogic']) => void;
}

export function ConditionalLogicBuilder({ 
  field, 
  allFields, 
  onChange 
}: ConditionalLogicBuilderProps) {
  const hasConditionalLogic = Boolean(field.conditionalLogic && field.conditionalLogic.length > 0);

  const handleToggleConditionalLogic = (enabled: boolean) => {
    const updatedConditionalLogic = enabled
      ? [{ id: crypto.randomUUID(), action: 'show' as const, logicType: 'all' as const, conditions: [] }]
      : undefined;
    
    onChange(updatedConditionalLogic);
  };

  // Filter out fields that can't be used as condition sources
  const availableFields = allFields.filter(f => 
    f.id !== field.id
  );

  return (
    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Conditional Logic</h4>
        <div className="flex items-center space-x-2">
          <Label htmlFor="enable-condition">Enable</Label>
          <Checkbox 
            id="enable-condition" 
            checked={hasConditionalLogic} 
            onCheckedChange={handleToggleConditionalLogic}
          />
        </div>
      </div>

      {hasConditionalLogic && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Conditional logic is enabled for this field. Use the advanced settings to configure conditions.
          </p>
        </div>
      )}
    </div>
  );
}