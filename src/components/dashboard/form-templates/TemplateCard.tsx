
import { TemplateType } from "./types";
import { motion } from "framer-motion";

interface TemplateCardProps {
  template: TemplateType;
  isSelected: boolean;
  onSelect: () => void;
}

export const TemplateCard = ({ template, isSelected, onSelect }: TemplateCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? "border-indigo-600 bg-indigo-50 shadow-md"
          : "border-transparent bg-gray-50 hover:border-gray-200 hover:shadow-sm"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-md ${isSelected ? 'bg-indigo-100' : 'bg-white shadow-sm'}`}>
          {template.icon}
        </div>
        <div>
          <h3 className={`font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-900'}`}>
            {template.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {template.description}
          </p>
          {isSelected && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-indigo-600 font-medium"
            >
              Selected
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
