import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FormFieldType } from '@/types/forms';
import {
  Type,
  CaseSensitive, // Using for Textarea as 'Textarea' icon isn't standard
  Mail,
  Hash,
  Phone,
  Link as LinkIcon, // Alias to avoid conflict with React Router Link
  CalendarDays,
  Clock,
  ChevronDownSquare,
  ListChecks, // For Multiple Choice (Checkbox group)
  CircleDot,  // For Single Choice (Radio group)
  Star,
  FileUp,
  Minus,      // For Divider
  Heading1,
  Pilcrow,    // For Paragraph
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

// Placeholder for the actual item rendering logic which will integrate D&D
const DraggablePaletteItem = ({ item, onAddFieldIntent }: { item: FieldPaletteItemProps, onAddFieldIntent?: (fieldType: FormFieldType) => void }) => {
  // TODO: Implement actual D&D source logic here using @dnd-kit/core or similar.
  // This is a simplified representation for click-to-add or basic display.
  // For D&D, you'd use something like `useDraggable` from @dnd-kit/core here.
  return (
    <Button
      variant="outline"
      className="w-full justify-start text-sm h-auto py-2 px-3 mb-1.5 flex items-center"
      onClick={() => onAddFieldIntent?.(item.fieldType)}
      // TODO: Add D&D attributes (e.g., ref, listeners from useDraggable) here if not handled by a wrapper
      // Consider adding aria-grabbed and role="button" for accessibility if it's purely a drag handle.
      // If it's also clickable, ensure it's a proper button.
      title={`Add ${item.label} field`}
    >
      {item.icon}
      <span className="ml-2">{item.label}</span>
    </Button>
  );
};

export function FieldPalette({ onAddFieldIntent }: FieldPaletteProps) {
  // TODO: Potentially group items by category if PALETTE_ITEMS becomes large.
  // This could be done by structuring PALETTE_ITEMS into groups
  // and rendering subheadings and lists for each group.

  return (
    <div className="h-full flex flex-col border-r bg-background">
      <div className="p-3 border-b">
        <h3 className="text-sm font-semibold text-foreground">Add Field</h3>
        <p className="text-xs text-muted-foreground">Drag or click to add</p>
      </div>
      <ScrollArea className="flex-grow p-1"> {/* Adjust padding/height as needed */}
        <div className="space-y-1 p-2"> {/* Outer padding for scrollbar */}
          {PALETTE_ITEMS.map(item => (
            <DraggablePaletteItem key={item.fieldType} item={item} onAddFieldIntent={onAddFieldIntent} />
          ))}
          {/*
            TODO: Implement drag-and-drop functionality for these items.
            Each DraggablePaletteItem should be a draggable source.
            The data transferred should identify the FormFieldType.
            This will likely involve wrapping FieldPalette or DraggablePaletteItem
            with DndContext and using useDraggable from @dnd-kit/core.
          */}
        </div>
      </ScrollArea>
    </div>
  );
} 