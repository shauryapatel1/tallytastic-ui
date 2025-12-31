import { templateDefinitions } from "@/lib/templateDefinitions";
import { FormFieldDefinition } from "@/lib/form/types";
import { 
  Type, Mail, Phone, Hash, Calendar, Star, FileUp, 
  List, CircleDot, CheckSquare, AlignLeft 
} from "lucide-react";

interface TemplatePreviewProps {
  templateId: string;
}

const fieldTypeIcons: Record<string, React.ReactNode> = {
  text: <Type className="h-3 w-3" />,
  textarea: <AlignLeft className="h-3 w-3" />,
  email: <Mail className="h-3 w-3" />,
  tel: <Phone className="h-3 w-3" />,
  number: <Hash className="h-3 w-3" />,
  date: <Calendar className="h-3 w-3" />,
  rating: <Star className="h-3 w-3" />,
  file: <FileUp className="h-3 w-3" />,
  select: <List className="h-3 w-3" />,
  radio: <CircleDot className="h-3 w-3" />,
  checkbox: <CheckSquare className="h-3 w-3" />,
};

export const TemplatePreview = ({ templateId }: TemplatePreviewProps) => {
  const templateGenerator = templateDefinitions[templateId];
  
  if (!templateGenerator) {
    return (
      <div className="p-3 text-center text-muted-foreground text-xs">
        Preview not available
      </div>
    );
  }

  const template = templateGenerator();
  const allFields = template.sections.flatMap(section => section.fields);
  
  // Show first 6 fields max
  const displayFields = allFields.slice(0, 6);
  const remainingCount = allFields.length - displayFields.length;

  return (
    <div className="p-3 space-y-2">
      <div className="text-xs font-medium text-muted-foreground mb-2">
        {allFields.length} field{allFields.length !== 1 ? 's' : ''}
      </div>
      
      <div className="space-y-1.5">
        {displayFields.map((field: FormFieldDefinition) => (
          <div 
            key={field.id}
            className="flex items-center gap-2 px-2 py-1.5 bg-muted/50 rounded text-xs"
          >
            <span className="text-muted-foreground flex-shrink-0">
              {fieldTypeIcons[field.type] || <Type className="h-3 w-3" />}
            </span>
            <span className="truncate flex-1">{field.label}</span>
            {field.isRequired && (
              <span className="text-destructive flex-shrink-0">*</span>
            )}
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div className="text-xs text-muted-foreground text-center py-1">
            +{remainingCount} more field{remainingCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};
