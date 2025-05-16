import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FormFieldType } from '@/types/forms';
import {
  useDraggable,
} from '@dnd-kit/core';
import {
  Type,
  CaseSensitive,
  Mail,
  Hash,
  Phone,
  Link as LinkIcon,
  CalendarDays,
  Clock,
  ChevronDownSquare,
  ListChecks,
  CircleDot,
  Star,
  FileUp,
  Minus,
  Heading1,
  Pilcrow,
} from 'lucide-react';

export interface FieldPaletteItemProps {
  fieldType: FormFieldType;
  label: string;
  icon: React.ReactNode;
}

export interface FieldPaletteProps {
  /**
   * Callback function to be invoked when a user initiates adding a field
   * (e.g., by clicking if click-to-add is implemented).
   * The actual placement logic (handling a drop) will likely reside in the parent.
   */
  onAddFieldIntent?: (fieldType: FormFieldType) => void;
  // Potentially add props for configuring which field types are shown or their grouping
}

// Define field types and their presentation details based on src/types/forms.ts
const PALETTE_ITEMS: FieldPaletteItemProps[] = [
  { fieldType: 'text', label: 'Text Input', icon: <Type className="mr-2 h-4 w-4" /> },
  { fieldType: 'textarea', label: 'Textarea', icon: <CaseSensitive className="mr-2 h-4 w-4" /> },
  { fieldType: 'email', label: 'Email', icon: <Mail className="mr-2 h-4 w-4" /> },
  { fieldType: 'number', label: 'Number', icon: <Hash className="mr-2 h-4 w-4" /> },
  { fieldType: 'tel', label: 'Phone', icon: <Phone className="mr-2 h-4 w-4" /> },
  { fieldType: 'url', label: 'URL', icon: <LinkIcon className="mr-2 h-4 w-4" /> },
  { fieldType: 'date', label: 'Date', icon: <CalendarDays className="mr-2 h-4 w-4" /> },
  { fieldType: 'time', label: 'Time', icon: <Clock className="mr-2 h-4 w-4" /> },
  { fieldType: 'select', label: 'Dropdown', icon: <ChevronDownSquare className="mr-2 h-4 w-4" /> },
  { fieldType: 'checkbox', label: 'Checkbox Group', icon: <ListChecks className="mr-2 h-4 w-4" /> }, // Represents multiple choices
  { fieldType: 'radio', label: 'Radio Group', icon: <CircleDot className="mr-2 h-4 w-4" /> }, // Represents single choice
  { fieldType: 'rating', label: 'Rating', icon: <Star className="mr-2 h-4 w-4" /> },
  { fieldType: 'file', label: 'File Upload', icon: <FileUp className="mr-2 h-4 w-4" /> },
  { fieldType: 'heading', label: 'Heading', icon: <Heading1 className="mr-2 h-4 w-4" /> },
  { fieldType: 'paragraph', label: 'Paragraph', icon: <Pilcrow className="mr-2 h-4 w-4" /> },
  { fieldType: 'divider', label: 'Divider', icon: <Minus className="mr-2 h-4 w-4" /> },
  // TODO: Consider adding 'section' or 'page break' if those are added to FormFieldType
];

// Component to render the item in the palette (draggable)
const DraggablePaletteItem = ({ item }: { item: FieldPaletteItemProps }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-item-${item.fieldType}`, // Ensure unique ID across all draggables if necessary
    data: {
      type: 'newField', // This identifies the drag source type for FormBuilder's onDragEnd
      fieldType: item.fieldType,
      label: item.label,
      // icon: item.icon, // Keeping icon data, FormBuilder can decide to use it or not
      // For DragOverlay in FormBuilder, it's easier if we pass primitive data or simple structures.
      // Let's pass icon metadata if FormBuilder wants to reconstruct it, or just rely on label.
      // For now, label is sufficient for FormBuilder's DragOverlay.
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : undefined, // Higher zIndex during drag
    opacity: isDragging ? 0.5 : undefined,
  } : undefined;

  return (
    <Button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      variant="outline"
      className="w-full justify-start text-sm h-auto py-2 px-3 mb-1.5 flex items-center cursor-grab"
      title={`Drag to add ${item.label} field`}
    >
      {item.icon}
      <span className="ml-2">{item.label}</span>
    </Button>
  );
};

export function FieldPalette({ onAddFieldIntent }: FieldPaletteProps) {
  // Removed local DndContext, DragOverlay, and their state/handlers (activeItem, handleDragStart, handleDragEnd)
  // The DndContext in FormBuilder.tsx will manage drag operations.

  return (
    <div className="h-full flex flex-col border-r bg-background">
      <div className="p-3 border-b">
        <h3 className="text-sm font-semibold text-foreground">Add Field</h3>
        <p className="text-xs text-muted-foreground">Drag to add</p>
      </div>
      <ScrollArea className="flex-grow p-1">
        <div className="space-y-1 p-2">
          {PALETTE_ITEMS.map(item => (
            <DraggablePaletteItem key={item.fieldType} item={item} />
          ))}
        </div>
      </ScrollArea>
      {/* Removed DragOverlay from here */}
    </div>
  );
} 