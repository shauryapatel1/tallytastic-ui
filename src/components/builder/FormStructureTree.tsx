import React, { useState, useEffect } from 'react';
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
import { useDroppable, useDraggable, DragEndEvent as DndDragEndEvent } from '@dnd-kit/core';

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
  sectionId, // Now needed for draggable data
  isSelected,
  onSelect,
  onDelete,
}) => {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: `field-${field.id}`, // Unique ID for the draggable item
    data: {
      type: 'field',
      fieldId: field.id,
      sourceSectionId: sectionId,
      label: field.label, // Pass label for DragOverlay if needed
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 100 : 'auto', // Ensure dragged item is on top
    opacity: isDragging ? 0.75 : 1,
  } : undefined;

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
    <div
      ref={setNodeRef} // D&D ref
      style={style}    // D&D style
      className={cn(
        "flex items-center justify-between p-2 pl-4 rounded-md hover:bg-muted/50", // Adjusted padding for drag handle
        isSelected && "bg-primary/10 ring-1 ring-primary", // Removed text-primary-foreground as it might not be desired always
        isDragging && "shadow-lg bg-background" // Style for when dragging
      )}
      // onClick={onSelect} // onClick might interfere with dragging, handle selection carefully
      // It's often better to have a specific clickable area if the whole item is draggable
      // For now, let's see how it behaves. If selection is an issue, we'll refine.
    >
      <div className="flex items-center gap-1 truncate flex-grow" onClick={onSelect} style={{ cursor: 'pointer' }}> {/* Make this part clickable */}
        <Button variant="ghost" size="icon" className="h-7 w-7 cursor-grab" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4" />
        </Button>
        {getFieldIcon(field.type)}
        <span className="text-sm truncate" title={field.label || field.name}>{field.label || field.name || 'Untitled Field'}</span>
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
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

// --- DropIndicator Component ---
interface DropIndicatorProps {
  id: string;
  sectionId: string;    // For data payload
  targetIndex: number;  // For data payload
  // isVisible?: boolean; // Future: control visibility based on active draggable
}

const DropIndicator: React.FC<DropIndicatorProps> = ({ id, sectionId, targetIndex }) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id,
    data: {
      type: 'dropIndicator',
      sectionId,
      targetIndex,
    },
  });

  // Visual cue for when a draggable is over this drop target
  const isActiveDropTarget =
    isOver &&
    (active?.data.current?.type === 'field' ||
      active?.data.current?.type === 'newField'); // Added 'newField'

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-1 my-0.5 w-full bg-transparent transition-all duration-150 ease-in-out",
        isActiveDropTarget ? "bg-primary h-2.5 rounded" : "h-1",
        // Subtle visibility even when not active, for debugging or if desired
        // !isActiveDropTarget && "bg-slate-100 dark:bg-slate-800 opacity-50"
      )}
      style={{ minHeight: isActiveDropTarget ? '0.625rem' : '0.25rem' }} // Ensure space for visual change
    />
  );
};

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
  // Draggable hook for the section itself
  const {
    attributes: sectionDragAttributes,
    listeners: sectionDragListeners,
    setNodeRef: setSectionDraggableNodeRef,
    transform: sectionTransform,
    isDragging: isSectionDragging,
  } = useDraggable({
    id: `section-draggable-${section.id}`, // Unique ID for section dragging
    data: {
      type: 'section',
      sectionId: section.id,
      label: section.title,
    },
  });

  const sectionDragStyle = sectionTransform ? {
    transform: `translate3d(${sectionTransform.x}px, ${sectionTransform.y}px, 0)`,
    zIndex: isSectionDragging ? 200 : 'auto', // Higher z-index for section dragging
    opacity: isSectionDragging ? 0.75 : 1,
  } : undefined;

  // Droppable hook for the general area within the section (for new fields from palette)
  const { setNodeRef: setFieldsDroppableNodeRef, isOver: isSectionAreaOver, active: activeOverSectionArea } = useDroppable({
    id: `section-drop-area-${section.id}`, 
    data: {
      type: 'sectionDropArea', 
      sectionId: section.id,
    },
  });
  
  const isNewFieldOverSectionArea = isSectionAreaOver && activeOverSectionArea?.data.current?.type === 'newField';

  const isSectionDirectlySelected = isSelected && selectedFieldId === null;

  return (
    <div 
      ref={setSectionDraggableNodeRef} // Ref for making the whole section draggable
      style={sectionDragStyle}        // Style for drag transform
      className={cn("rounded-md border mb-2 bg-card", // bg-card for sections
                      isSectionDirectlySelected && "bg-primary/10 ring-1 ring-primary",
                      // isFieldsDropAreaOver && !isSectionDragging && "outline-2 outline-dashed outline-primary", // Visual cue for field drop, not when section itself is dragged
                      isSectionDragging && "shadow-xl"
                    )}>
      <div
        className={cn(
          "flex items-center justify-between p-2 rounded-t-md hover:bg-muted/50",
          isSectionDirectlySelected && "bg-primary/20",
        )}
        // onClick={onSelect} // Section selection will be handled by clicking the title area for now
      >
        <div className="flex items-center gap-1 flex-grow" onClick={onSelect} style={{ cursor: 'pointer' }}> {/* Clickable title area for selection */}
          <Button variant="ghost" size="icon" className="h-7 w-7 cursor-grab" {...sectionDragAttributes} {...sectionDragListeners}>
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <span className="text-sm font-medium truncate" title={section.title}>{section.title || 'Untitled Section'}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>
      {isExpanded && (
        <div 
          ref={setFieldsDroppableNodeRef} // Ref for the general section drop area (mainly for new fields)
          className={cn(
            "p-2 border-t min-h-[60px] relative", // Added relative for potential absolute positioning of indicators if needed
            isNewFieldOverSectionArea && "bg-primary/5 outline-1 outline-dashed outline-primary-focus", 
            fields.length === 0 && !isNewFieldOverSectionArea && "flex items-center justify-center" 
          )}
        >
          {/* Render DropIndicators around and between fields */}
          <DropIndicator 
            id={`drop-indicator-${section.id}-index-0`}
            sectionId={section.id} 
            targetIndex={0} 
          />
          {fields.map((field, index) => (
            <React.Fragment key={field.id}> {/* Use field.id for React key on Fragment if field is direct child, or on FieldItemRenderer */}
              <FieldItemRenderer
                key={field.id} // Ensure FieldItemRenderer also has its key
                field={field}
                sectionId={section.id}
                isSelected={selectedFieldId === field.id}
                onSelect={() => onSelectField(field.id, section.id)}
                onDelete={() => onDeleteField(field.id, section.id)}
              />
              <DropIndicator 
                id={`drop-indicator-${section.id}-index-${index + 1}`}
                sectionId={section.id} 
                targetIndex={index + 1} 
              />
            </React.Fragment>
          ))}
          
          {/* Placeholder text if section is empty AND not being hovered by a new field */}
          {fields.length === 0 && !isNewFieldOverSectionArea && (
            <div className="text-center text-xs text-muted-foreground py-4 px-2">
              Drag fields or drop existing ones here.
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
  useEffect(() => {
    // Expand all sections by default, or based on a prop
    const initialExpansion: Record<string, boolean> = {};
    if (formDefinition && formDefinition.sections) {
        formDefinition.sections.forEach(sec => initialExpansion[sec.id] = true);
    }
    setExpandedSections(initialExpansion);
  }, [formDefinition]);

  const toggleSectionExpand = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };
  
  // TODO: D&D - handleDragEnd function to process different drag types (new field, reorder field, move field, reorder section)
  // const handleDragEnd = (event: DragEndEvent) => { ... logic using event.active and event.over ... dispatch actions ... };

  if (!formDefinition || !formDefinition.sections || formDefinition.sections.length === 0) {
    // TODO: This empty state itself needs to be a droppable target for new sections/fields.
    // For now, focusing on dropping into existing sections.
    const { setNodeRef: setEmptyStateDropRef, isOver: isEmptyStateOver } = useDroppable({ 
      id: 'empty-form-structure-drop-area', // For adding first section or field to an empty form
      data: { type: 'emptyFormArea' }
    });
    return (
      <div 
        ref={setEmptyStateDropRef} 
        className={cn(
          "h-full flex flex-col items-center justify-center p-4 border-r bg-background",
          isEmptyStateOver && "outline-2 outline-dashed outline-primary bg-primary/5" // Visual cue
        )}
      >
        <p className="text-sm text-muted-foreground">No sections in this form yet.</p>
        <p className="text-xs text-muted-foreground mt-1">Drag a field from the palette to start building your form, or add a section.</p>
      </div>
    );
  }

  // Droppable for the list of sections (for reordering sections)
  const { setNodeRef: setSectionsListDroppableNodeRef, isOver: isSectionsListOver } = useDroppable({
    id: 'form-structure-sections-list-droppable',
    data: {
      type: 'sectionsListArea',
    },
  });

  return (
    <div className="h-full flex flex-col border-r bg-background">
      <div className="p-3 border-b">
        <h3 className="text-sm font-semibold text-foreground">Form Structure</h3>
      </div>
      <ScrollArea className="flex-grow">
        <div 
          ref={setSectionsListDroppableNodeRef} // Make the scrollable area droppable for sections
          className={cn(
            "p-3 space-y-1",
            isSectionsListOver && "bg-muted/30 outline-1 outline-dashed outline-accent" // Visual cue for section reorder
          )}
        >
          {formDefinition.sections.map((section, index) => (
            <SectionItemRenderer
              key={section.id}
              section={section}
              // Pass index for reordering sections
              isSelected={selectedSectionId === section.id || (selectedFieldId !== null && section.fields.some(f => f.id === selectedFieldId))}
              isExpanded={expandedSections[section.id] || false}
              onSelect={() => onSelectSection(section.id)}
              onDelete={() => onDeleteSection(section.id)}
              onToggleExpand={() => toggleSectionExpand(section.id)}
              fields={section.fields}
              selectedFieldId={selectedFieldId}
              onSelectField={onSelectField}
              onDeleteField={onDeleteField}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 