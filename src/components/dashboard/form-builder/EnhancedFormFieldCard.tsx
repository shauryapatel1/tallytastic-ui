import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FormFieldDefinition } from '@/types/forms';
import { motion } from 'framer-motion';
import { 
  Type, CaseSensitive, Mail, Hash, Phone, Link as LinkIcon,
  CalendarDays, Clock, ChevronDownSquare, ListChecks, CircleDot,
  Star, FileUp, Heading1, Pilcrow, Minus, Edit2, Copy, Trash2,
  GripVertical
} from 'lucide-react';

interface EnhancedFormFieldCardProps {
  field: FormFieldDefinition;
  isEditing: boolean;
  isDragging: boolean;
  isDraggedOver: boolean;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateField: (id: string, updates: Partial<FormFieldDefinition>) => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onDragLeave: () => void;
}

const FIELD_ICONS = {
  text: Type,
  textarea: CaseSensitive,
  email: Mail,
  number: Hash,
  tel: Phone,
  url: LinkIcon,
  date: CalendarDays,
  time: Clock,
  select: ChevronDownSquare,
  checkbox: ListChecks,
  radio: CircleDot,
  rating: Star,
  file: FileUp,
  heading: Heading1,
  paragraph: Pilcrow,
  divider: Minus
};

export function EnhancedFormFieldCard({
  field,
  isEditing,
  isDragging,
  isDraggedOver,
  onEdit,
  onDuplicate,
  onRemove,
  onUpdateField,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDragLeave
}: EnhancedFormFieldCardProps) {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(field.label);
  const [isEditingPlaceholder, setIsEditingPlaceholder] = useState(false);
  const [placeholderValue, setPlaceholderValue] = useState(field.placeholder || '');

  const FieldIcon = FIELD_ICONS[field.type as keyof typeof FIELD_ICONS] || Type;

  const handleLabelSave = () => {
    onUpdateField(field.id, { label: labelValue });
    setIsEditingLabel(false);
  };

  const handlePlaceholderSave = () => {
    onUpdateField(field.id, { placeholder: placeholderValue });
    setIsEditingPlaceholder(false);
  };

  const getFieldSummary = () => {
    switch (field.type) {
      case 'select':
        return `Dropdown with ${field.options?.length || 0} options`;
      case 'radio':
        return `Radio group with ${field.options?.length || 0} options`;
      case 'checkbox':
        return field.options ? `Checkbox group with ${field.options.length} options` : 'Single checkbox';
      case 'rating':
        return `Rating field (1-${field.max || 5})`;
      case 'file':
        return field.allowMultipleSelection ? 'Multiple file upload' : 'Single file upload';
      default:
        return field.type.charAt(0).toUpperCase() + field.type.slice(1) + ' field';
    }
  };

  return (
    <motion.div
      layout
      animate={{
        scale: isDragging ? 0.95 : 1,
        opacity: isDragging ? 0.8 : 1,
        boxShadow: isDraggedOver 
          ? '0 8px 25px rgba(59, 130, 246, 0.15)' 
          : isEditing 
          ? '0 4px 12px rgba(0, 0, 0, 0.1)'
          : '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`
          relative overflow-hidden transition-all duration-200
          ${isDraggedOver ? 'ring-2 ring-primary/50 bg-primary/5' : ''}
          ${isEditing ? 'ring-2 ring-primary/30' : ''}
          hover:shadow-md
        `}
        draggable
        onDragStart={() => onDragStart(field.id)}
        onDragOver={(e) => onDragOver(e, field.id)}
        onDragEnd={onDragEnd}
        onDragLeave={onDragLeave}
      >
        {/* Drag Handle */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-grab">
          <GripVertical className="h-4 w-4 text-muted-foreground/50" />
        </div>

        <div className="pl-8 pr-4 py-4">
          {/* Field Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2 flex-1">
              <FieldIcon className="h-4 w-4 text-muted-foreground" />
              
              {/* Inline Label Editing */}
              {isEditingLabel ? (
                <div className="flex items-center space-x-2 flex-1">
                  <Input
                    value={labelValue}
                    onChange={(e) => setLabelValue(e.target.value)}
                    onBlur={handleLabelSave}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleLabelSave();
                      if (e.key === 'Escape') {
                        setLabelValue(field.label);
                        setIsEditingLabel(false);
                      }
                    }}
                    className="h-7 text-sm font-medium"
                    autoFocus
                  />
                </div>
              ) : (
                <div 
                  className="flex items-center space-x-2 cursor-pointer flex-1"
                  onClick={() => setIsEditingLabel(true)}
                >
                  <span className="font-medium hover:text-primary transition-colors">
                    {field.label}
                  </span>
                  <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
              
              {field.isRequired && <Badge variant="destructive" className="text-xs">Required</Badge>}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(field.id)}
                className="h-7 w-7 p-0"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(field.id)}
                className="h-7 w-7 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(field.id)}
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Field Summary */}
          <div className="text-xs text-muted-foreground mb-2">
            {getFieldSummary()}
          </div>

          {/* Placeholder Editing (if applicable) */}
          {field.type !== 'checkbox' && field.type !== 'file' && field.type !== 'rating' && 
           field.type !== 'heading' && field.type !== 'paragraph' && field.type !== 'divider' && (
            <div className="mt-2">
              {isEditingPlaceholder ? (
                <Input
                  value={placeholderValue}
                  onChange={(e) => setPlaceholderValue(e.target.value)}
                  onBlur={handlePlaceholderSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handlePlaceholderSave();
                    if (e.key === 'Escape') {
                      setPlaceholderValue(field.placeholder || '');
                      setIsEditingPlaceholder(false);
                    }
                  }}
                  className="h-7 text-xs"
                  placeholder="Field placeholder..."
                  autoFocus
                />
              ) : (
                <div 
                  className="text-xs text-muted-foreground/70 cursor-pointer hover:text-muted-foreground transition-colors p-1 rounded border border-transparent hover:border-border"
                  onClick={() => setIsEditingPlaceholder(true)}
                >
                  {field.placeholder || 'Click to add placeholder...'}
                </div>
              )}
            </div>
          )}

          {/* Conditional Logic Badge */}
          {field.conditionalLogic && field.conditionalLogic.length > 0 && (
            <Badge variant="secondary" className="text-xs mt-2">
              Conditional
            </Badge>
          )}
        </div>
      </Card>
    </motion.div>
  );
}