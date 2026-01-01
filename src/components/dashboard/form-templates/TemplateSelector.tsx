import { Button } from "@/components/ui/button";
import { ChevronLeft, Sparkles, LayoutGrid, Briefcase, MessageSquare, Calendar, Code } from "lucide-react";
import { TemplateCard } from "./TemplateCard";
import { TemplateType, TemplateCategory } from "./types";

type FilterCategory = "all" | TemplateCategory;

const categoryConfig: { id: FilterCategory; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All", icon: <LayoutGrid className="h-4 w-4" /> },
  { id: "business", label: "Business", icon: <Briefcase className="h-4 w-4" /> },
  { id: "feedback", label: "Feedback", icon: <MessageSquare className="h-4 w-4" /> },
  { id: "events", label: "Events", icon: <Calendar className="h-4 w-4" /> },
  { id: "technical", label: "Technical", icon: <Code className="h-4 w-4" /> },
];

interface TemplateSelectorProps {
  selectedTemplate: string | null;
  setSelectedTemplate: (id: string) => void;
  templateCategory: FilterCategory;
  setTemplateCategory: (category: FilterCategory) => void;
  filteredTemplates: TemplateType[];
  handleBack: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export const TemplateSelector = ({
  selectedTemplate,
  setSelectedTemplate,
  templateCategory,
  setTemplateCategory,
  filteredTemplates,
  handleBack,
  handleSubmit,
  isPending,
}: TemplateSelectorProps) => {
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <p className="text-sm text-muted-foreground">
          {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {categoryConfig.map(({ id, label, icon }) => (
          <Button
            key={id}
            size="sm"
            variant={templateCategory === id ? "default" : "outline"}
            onClick={() => setTemplateCategory(id)}
            className="gap-1.5"
          >
            {icon}
            {label}
          </Button>
        ))}
      </div>
      
      {/* Template grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onSelect={() => setSelectedTemplate(template.id)}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No templates in this category yet.</p>
        </div>
      )}
      
      <SubmitButton 
        onSubmit={handleSubmit} 
        disabled={!selectedTemplate || isPending} 
        isPending={isPending}
      />
    </div>
  );
};

interface SubmitButtonProps {
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
  isPending: boolean;
}

const SubmitButton = ({ onSubmit, disabled, isPending }: SubmitButtonProps) => (
  <div className="flex justify-end">
    <Button onClick={onSubmit} disabled={disabled} size="lg">
      {isPending ? (
        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Create Form
    </Button>
  </div>
);
