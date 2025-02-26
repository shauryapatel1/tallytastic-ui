
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { TemplateCard } from "./TemplateCard";
import { TemplateType } from "./types";

interface TemplateSelectorProps {
  selectedTemplate: string | null;
  setSelectedTemplate: (id: string) => void;
  templateCategory: "basic" | "feedback" | "data" | "popular";
  setTemplateCategory: (category: "basic" | "feedback" | "data" | "popular") => void;
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
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          {["popular", "basic", "feedback", "data"].map((category) => (
            <Button
              key={category}
              size="sm"
              variant={templateCategory === category ? "default" : "ghost"}
              onClick={() => setTemplateCategory(category as "basic" | "feedback" | "data" | "popular")}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>
      
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
      
      <SubmitButton 
        onSubmit={handleSubmit} 
        disabled={!selectedTemplate || isPending} 
        isPending={isPending}
      />
    </div>
  );
};

import { SparklesIcon } from "lucide-react";

interface SubmitButtonProps {
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
  isPending: boolean;
}

const SubmitButton = ({ onSubmit, disabled, isPending }: SubmitButtonProps) => (
  <div className="flex justify-end">
    <Button onClick={onSubmit} disabled={disabled}>
      {isPending ? (
        <SparklesIcon className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <SparklesIcon className="mr-2 h-4 w-4" />
      )}
      Create Form
    </Button>
  </div>
);
