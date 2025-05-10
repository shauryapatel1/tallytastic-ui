
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";

interface AIFormPreviewStepProps {
  formTitle: string;
  prompt: string;
  formFields: FormField[];
  isGenerating: boolean;
  onPrevious: () => void;
  onSave: () => void;
}

export function AIFormPreviewStep({
  formTitle,
  prompt,
  formFields,
  isGenerating,
  onPrevious,
  onSave
}: AIFormPreviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{formTitle}</h2>
        {prompt && <p className="text-sm text-gray-600">{prompt}</p>}
      </div>
      
      <div className="space-y-4 border p-4 rounded-md bg-gray-50">
        {formFields.map((field) => (
          <div key={field.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <Badge variant="outline" className="text-xs">
                {field.type}
              </Badge>
            </div>
            
            {field.type === "text" || field.type === "email" || field.type === "phone" && (
              <Input placeholder={field.placeholder} disabled />
            )}
            
            {field.type === "number" && (
              <Input type="number" placeholder={field.placeholder} disabled />
            )}
            
            {field.type === "textarea" && (
              <Textarea placeholder={field.placeholder} disabled />
            )}
            
            {field.type === "checkbox" && !field.options && (
              <div className="flex items-center gap-2">
                <input type="checkbox" disabled />
                <span className="text-sm text-gray-600">{field.label}</span>
              </div>
            )}
            
            {field.type === "select" && field.options && (
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option, i) => (
                    <SelectItem key={i} value={option.toLowerCase().replace(/\s+/g, '-')}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {field.type === "radio" && field.options && (
              <div className="space-y-1">
                {field.options.map((option, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="radio" name={field.id} disabled />
                    <span className="text-sm text-gray-600">{option}</span>
                  </div>
                ))}
              </div>
            )}
            
            {field.type === "date" && (
              <Input type="date" disabled />
            )}
            
            {field.type === "file" && (
              <Input type="file" disabled />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Back to Options
        </Button>
        <Button onClick={onSave} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Form
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
