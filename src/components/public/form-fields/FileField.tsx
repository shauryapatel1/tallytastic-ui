
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/lib/types";
import { useState } from "react";

interface FileFieldProps {
  field: FormField;
  onChange: (file: File | null) => void;
  error?: string;
}

export function FileField({ field, onChange, error }: FileFieldProps) {
  const [fileName, setFileName] = useState<string>("");
  
  return (
    <div className="space-y-2">
      <Label 
        htmlFor={field.id} 
        className={`block text-sm font-medium ${error ? 'text-red-500' : ''}`}
      >
        {field.label}
        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {field.description && (
        <div className="text-xs text-gray-500">{field.description}</div>
      )}
      
      <Input 
        id={field.id} 
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          if (file) {
            setFileName(file.name);
          } else {
            setFileName("");
          }
          onChange(file);
        }}
        className={`w-full ${error ? 'border-red-500' : ''}`}
      />
      
      {fileName && (
        <div className="text-xs text-gray-500">Selected file: {fileName}</div>
      )}
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
