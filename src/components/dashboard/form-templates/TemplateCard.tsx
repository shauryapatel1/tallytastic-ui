
import { TemplateType } from "./types";

interface TemplateCardProps {
  template: TemplateType;
  isSelected: boolean;
  onSelect: () => void;
}

export const TemplateCard = ({ template, isSelected, onSelect }: TemplateCardProps) => {
  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? "border-indigo-600 bg-indigo-50"
          : "border-transparent bg-gray-50 hover:border-gray-200"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        {template.icon}
        <div>
          <h3 className="font-medium">{template.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {template.description}
          </p>
        </div>
      </div>
    </div>
  );
};
