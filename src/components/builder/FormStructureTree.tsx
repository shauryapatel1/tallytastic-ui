import React from 'react';
import type { FormDefinition, FormFieldType, FormFieldDefinition, FormSectionDefinition } from '@/types/forms';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Type,
  Mail,
  CalendarDays,
  ListChecks,
  // ... import other icons as needed for field types
} from 'lucide-react';
import { cn } from '@/lib/utils';

// TODO: D&D - Import necessary D&D components from chosen library (e.g., @dnd-kit/core)

// --- Prop Interfaces ---
export interface FormStructureTreeProps {
  formDefinition: FormDefinition;
  selectedFieldId: string | null;
  selectedSectionId: string | null;

  onSelectField: (fieldId: string, sectionId: string) => void;
  onSelectSection: (sectionId: string) => void;

  onDeleteField: (fieldId: string, sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  
  // For quick common updates like label from tree - future enhancement
  // onUpdateField: (sectionId: string, fieldId: string, updates: Partial<FormFieldDefinition>) => void;
  // onUpdateSection: (sectionId: string, updates: Partial<Omit<FormSectionDefinition, 'fields'>>) => void;

  // Callbacks for drag-and-drop actions - to be implemented with D&D library
  // onDropNewField: (fieldType: FormFieldType, targetSectionId: string, targetIndexInFieldsArray: number) => void;
  // onReorderFieldsInSection: (sectionId: string, draggedFieldIndex: number, targetDropIndex: number) => void;
  // onMoveFieldToDifferentSection: (sourceSectionId: string, fieldId: string, targetSectionId: string, targetDropIndexInFieldsArray: number) => void;
  // onReorderSections: (draggedSectionIndex: number, targetDropIndex: number) => void;
}

interface FieldItemRendererProps {
  field: FormFieldDefinition;
  sectionId: string;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  // TODO: D&D - Add D&D props (e.g., attributes, listeners, ref from useDraggable)
}

const FieldItemRenderer: React.FC<FieldItemRendererProps> = ({
  field,
  // sectionId, // available if needed for D&D data
  isSelected,
  onSelect,
  onDelete,
}) => {
  // TODO: D&D - Use D&D hooks here (e.g., useDraggable)
  // const {attributes, listeners, setNodeRef, transform} = useDraggable(...);
  // const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  // Basic icon mapping - can be expanded
  const getFieldIcon = (type: FormFieldType) => {
    switch (type) {
      case 'text': return <Type className="h-4 w-4 text-muted-foreground" />;
      case 'email': return <Mail className="h-4 w-4 text-muted-foreground" />;
      case 'date': return <CalendarDays className="h-4 w-4 text-muted-foreground" />;
      case 'checkbox': return <ListChecks className="h-4 w-4 text-muted-foreground" />;
      // Add other cases for all FormFieldTypes
      default: return <Type className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    // TODO: D&D - Apply setNodeRef, style, attributes, listeners to this div
    <div
      className={cn(
        "flex items-center justify-between p-2 pl-8 rounded-md hover:bg-muted/50 cursor-pointer",
        isSelected && "bg-primary/10 ring-1 ring-primary text-primary-foreground"
      )}
      onClick={onSelect}
      // ref={setNodeRef} // D&D ref
      // style={style}    // D&D style
    >
      <div className="flex items-center gap-2 truncate">
        {/* TODO: D&D - Drag handle (optional, can drag whole item) */}
        {/* <Button variant="ghost" size="icon" className="h-7 w-7 cursor-grab" {...attributes} {...listeners}> <GripVertical className="h-4 w-4" /> </Button> */}
        {getFieldIcon(field.type)}
        <span className="text-sm truncate" title={field.label}>{field.label || 'Untitled Field'}</span>
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
      </Button>
    </div>
  );
};

interface SectionItemRendererProps {
  section: FormSectionDefinition;
  isSelected: boolean; // True if section itself or a field within it is selected
  isExpanded: boolean; // For collapsible sections
  onSelect: () => void;
  onDelete: () => void;
  onToggleExpand: () => void;
  // Props for rendering fields
  fields: FormFieldDefinition[];
  selectedFieldId: string | null;
  onSelectField: (fieldId: string, sectionId: string) => void;
  onDeleteField: (fieldId: string, sectionId: string) => void;
  // TODO: D&D - Add D&D props (e.g., attributes, listeners, ref from useDraggable for section drag)
  // TODO: D&D - Add D&D props for droppable area (e.g., setNodeRef from useDroppable for field drops)
}

const SectionItemRenderer: React.FC<SectionItemRendererProps> = ({
  section,
  isSelected,
  isExpanded,
  onSelect,
  onDelete,
  onToggleExpand,
  fields,
  selectedFieldId,
  onSelectField,
  onDeleteField,
}) => {
  // TODO: D&D - Hook for draggable section: useDraggable({ id: section.id, data: { type: 'section' } })
  // TODO: D&D - Hook for droppable area within section for fields: useDroppable({ id: section.id, data: { type: 'section-drop-area' } })

  const isSectionDirectlySelected = isSelected && selectedFieldId === null;

  return (
    // TODO: D&D - Apply draggable props to this outer div if sections are draggable
    <div className={cn("rounded-md border mb-2", isSectionDirectlySelected && "bg-primary/10 ring-1 ring-primary text-primary-foreground")}>
      {/* TODO: D&D - Section Drop Zone (for new fields from palette) could be this header or area around it */}
      <div
        className={cn(
          "flex items-center justify-between p-2 rounded-t-md hover:bg-muted/50 cursor-pointer",
          isSectionDirectlySelected && "bg-primary/20",
        )}
        onClick={onSelect}
      >
        <div className="flex items-center gap-2">
          {/* TODO: D&D - Section drag handle */}
          {/* <Button variant="ghost" size="icon" className="h-7 w-7 cursor-grab"> <GripVertical className="h-4 w-4" /> </Button> */}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <span className="text-sm font-medium truncate" title={section.title}>{section.title || 'Untitled Section'}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>
      {isExpanded && (
        // TODO: D&D - This div would be a primary droppable area for fields
        // ref={setDroppableNodeRef} // D&D ref for section as a drop zone for fields
        <div className="p-2 border-t">
          {fields.length > 0 ? (
            fields.map((field) => (
              <FieldItemRenderer
                key={field.id}
                field={field}
                sectionId={section.id}
                isSelected={selectedFieldId === field.id}
                onSelect={() => onSelectField(field.id, section.id)}
                onDelete={() => onDeleteField(field.id, section.id)}
              />
            ))
          ) : (
            // TODO: D&D - This empty state should also be a droppable target
            <div className="text-center text-xs text-muted-foreground py-4 px-2 border border-dashed rounded-md">
              Drag fields here or from the palette.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export function FormStructureTree({
  formDefinition,
  selectedFieldId,
  selectedSectionId,
  onSelectField,
  onSelectSection,
  onDeleteField,
  onDeleteSection,
}: FormStructureTreeProps) {
  
  // TODO: D&D - Wrap with DndContext if not handled by parent
  // <DndContext onDragEnd={handleDragEnd} ...>

  // Local state for expanded sections - can be moved to parent if needed for persistence
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});
  React.useEffect(() => {
    // Expand all sections by default, or based on a prop
    const initialExpansion: Record<string, boolean> = {};
    formDefinition.sections.forEach(sec => initialExpansion[sec.id] = true);
    setExpandedSections(initialExpansion);
  }, [formDefinition.sections]);

  const toggleSectionExpand = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };
  
  // TODO: D&D - handleDragEnd function to process different drag types (new field, reorder field, move field, reorder section)
  // const handleDragEnd = (event: DragEndEvent) => { ... logic using event.active and event.over ... dispatch actions ... };

  if (!formDefinition || formDefinition.sections.length === 0) {
    return (
      // TODO: D&D - This area should also be a droppable target for new sections / fields from palette
      <div className="h-full flex flex-col items-center justify-center p-4 border-r bg-background">
        <p className="text-sm text-muted-foreground">No sections in this form yet.</p>
        <p className="text-xs text-muted-foreground mt-1">Drag a field from the palette to start.</p>
        {/* Or a button to add first section? */}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border-r bg-background">
      <div className="p-3 border-b">
        <h3 className="text-sm font-semibold text-foreground">Form Structure</h3>
        {/* Add any toolbar items for structure tree here if needed */}
      </div>
      <ScrollArea className="flex-grow p-2">
        {/* TODO: D&D - If reordering sections, this area needs sensors and droppable logic for sections */}
        {formDefinition.sections.map((section, index) => (
          <SectionItemRenderer
            key={section.id}
            section={section}
            isSelected={selectedSectionId === section.id}
            isExpanded={!!expandedSections[section.id]}
            onSelect={() => onSelectSection(section.id)}
            onDelete={() => onDeleteSection(section.id)}
            onToggleExpand={() => toggleSectionExpand(section.id)}
            fields={section.fields}
            selectedFieldId={selectedFieldId}
            onSelectField={onSelectField}
            onDeleteField={onDeleteField}
            // TODO: D&D - Pass D&D related props and handlers
          />
        ))}
      </ScrollArea>
    </div>
  );
} 