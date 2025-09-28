import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {template.icon}
            <div>
              <CardTitle className="text-base">{template.name}</CardTitle>
            </div>
          </div>
          {isSelected && (
            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
          )}
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