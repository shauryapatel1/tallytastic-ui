
import { Button } from "@/components/ui/button";
import { 
  Type, Mail, MessageSquare, Check, List, 
  Hash, Calendar, Phone, Upload, Star,
  Radio, SplitSquareVertical
} from "lucide-react";
import { FieldType } from "./types";

interface FieldTypeButtonsProps {
  onAddField: (type: FieldType) => void;
}

export function FieldTypeButtons({ onAddField }: FieldTypeButtonsProps) {
  const fieldTypes: { type: FieldType; icon: JSX.Element; label: string }[] = [
    { type: 'text', icon: <Type size={16} />, label: 'Text' },
    { type: 'email', icon: <Mail size={16} />, label: 'Email' },
    { type: 'textarea', icon: <MessageSquare size={16} />, label: 'Textarea' },
    { type: 'number', icon: <Hash size={16} />, label: 'Number' },
    { type: 'date', icon: <Calendar size={16} />, label: 'Date' },
    { type: 'phone', icon: <Phone size={16} />, label: 'Phone' },
    { type: 'checkbox', icon: <Check size={16} />, label: 'Checkbox' },
    { type: 'radio', icon: <Radio size={16} />, label: 'Radio' },
    { type: 'select', icon: <List size={16} />, label: 'Dropdown' },
    { type: 'file', icon: <Upload size={16} />, label: 'File Upload' },
    { type: 'rating', icon: <Star size={16} />, label: 'Rating' },
    { type: 'section', icon: <SplitSquareVertical size={16} />, label: 'Section' }
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-medium mb-4">Add Form Elements</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {fieldTypes.map((fieldType) => (
          <Button
            key={fieldType.type}
            variant="outline"
            className="h-auto py-3 flex flex-col items-center justify-center gap-2 bg-white hover:bg-gray-50"
            onClick={() => onAddField(fieldType.type)}
          >
            {fieldType.icon}
            <span className="text-xs">{fieldType.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
