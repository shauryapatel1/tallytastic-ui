import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Eye } from "lucide-react";
import { TemplatePreview } from "./TemplatePreview";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

interface EnhancedTemplateCardProps {
  template: Template;
  isSelected: boolean;
  onClick: () => void;
}

export const EnhancedTemplateCard = ({ template, isSelected, onClick }: EnhancedTemplateCardProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md group ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-muted-foreground group-hover:text-primary transition-colors">
              {template.icon}
            </div>
            <div>
              <CardTitle className="text-base">{template.name}</CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Popover open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <PopoverTrigger asChild onClick={handlePreviewClick}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-64 p-0" 
                side="right" 
                align="start"
                onClick={handlePreviewClick}
              >
                <div className="border-b px-3 py-2">
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-xs text-muted-foreground">Preview</p>
                </div>
                <TemplatePreview templateId={template.id} />
              </PopoverContent>
            </Popover>
            {isSelected && (
              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm">
          {template.description}
        </CardDescription>
        <div className="mt-3">
          <Badge variant="secondary" className="text-xs">
            {template.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
