
import { FormField } from "./types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FormPreviewProps {
  fields: FormField[];
}

export function FormPreview({ fields }: FormPreviewProps) {
  if (fields.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-gray-100">
        <h2 className="text-lg font-medium text-gray-500">No fields added yet</h2>
        <p className="text-sm text-gray-400 mt-2">
          Add form fields in the Builder tab to see a preview
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-6">Form Preview</h2>
      
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor={field.id} className="block text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              
              {field.description && (
                <div className="text-xs text-gray-500">{field.description}</div>
              )}
            </div>
            
            {field.type === 'text' && (
              <Input 
                id={field.id} 
                placeholder={field.placeholder}
                defaultValue={field.defaultValue as string}
                className="w-full"
              />
            )}
            
            {field.type === 'email' && (
              <Input 
                id={field.id} 
                type="email"
                placeholder={field.placeholder}
                defaultValue={field.defaultValue as string}
                className="w-full"
              />
            )}
            
            {field.type === 'number' && (
              <Input 
                id={field.id} 
                type="number"
                placeholder={field.placeholder}
                defaultValue={field.defaultValue as string}
                className="w-full"
                min={field.validation?.min}
                max={field.validation?.max}
              />
            )}
            
            {field.type === 'phone' && (
              <Input 
                id={field.id} 
                type="tel"
                placeholder={field.placeholder || "Phone number"}
                defaultValue={field.defaultValue as string}
                className="w-full"
              />
            )}
            
            {field.type === 'date' && (
              <Input 
                id={field.id} 
                type="date"
                placeholder={field.placeholder}
                defaultValue={field.defaultValue as string}
                className="w-full"
              />
            )}
            
            {field.type === 'textarea' && (
              <Textarea 
                id={field.id} 
                placeholder={field.placeholder}
                defaultValue={field.defaultValue as string}
                className="w-full min-h-[100px]"
              />
            )}
            
            {field.type === 'checkbox' && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={field.id}
                  defaultChecked={field.defaultValue as boolean}
                />
                <label htmlFor={field.id} className="text-sm">
                  {field.placeholder || "Yes, I agree"}
                </label>
              </div>
            )}
            
            {field.type === 'select' && field.options && (
              <Select defaultValue={field.defaultValue as string}>
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder || "Select an option"} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option, i) => (
                    <SelectItem key={i} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {field.type === 'radio' && field.options && (
              <RadioGroup defaultValue={field.defaultValue as string}>
                {field.options.map((option, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${field.id}-${i}`} />
                    <Label htmlFor={`${field.id}-${i}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {field.type === 'file' && (
              <Input 
                id={field.id} 
                type="file"
                className="w-full"
              />
            )}
            
            {field.type === 'rating' && (
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button 
                    key={star} 
                    type="button" 
                    variant="outline"
                    size="sm"
                    className={
                      Number(field.defaultValue) >= star
                        ? "bg-yellow-400 border-yellow-400 hover:bg-yellow-500"
                        : "bg-gray-100 hover:bg-gray-200"
                    }
                  >
                    {star}
                  </Button>
                ))}
              </div>
            )}
            
            {field.type === 'section' && (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <h3 className="font-medium">{field.label}</h3>
                {field.description && (
                  <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                )}
              </div>
            )}
          </div>
        ))}
        
        <div className="pt-4">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
}
