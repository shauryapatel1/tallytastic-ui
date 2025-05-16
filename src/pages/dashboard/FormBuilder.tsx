import { useReducer, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "./Layout";
import { FieldPalette } from "@/components/builder/FieldPalette";
import { FormStructureTree } from "@/components/builder/FormStructureTree";
import { PropertyEditorPane } from "@/components/builder/PropertyEditorPane";
import type {
  // Form, // No longer directly used for main definition state, superseded by FormDefinition
  FormDefinition,
  FormFieldType,
  FormFieldDefinition,
  FormSectionDefinition,
  FormStatus
} from "@/types/forms";
import { initialFormBuilderState, formBuilderReducer } from "@/lib/formBuilderReducer";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  Active,
} from '@dnd-kit/core';
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, Save, GripVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { getFormById } from "@/services/formService";

// Simple component to render the dragged item in the overlay
const DraggedItemPreview = ({ label }: { label?: string }) => {
  return (
    <Button 
      variant="outline" 
      className="w-auto justify-start text-sm h-auto py-2 px-3 flex items-center shadow-lg bg-background cursor-grabbing"
    >
      <GripVertical className="h-4 w-4 mr-2 text-muted-foreground" />
      {label || "New Field"}
    </Button>
  );
};

export default function FormBuilder() {
  const { id: formId } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [state, dispatch] = useReducer(formBuilderReducer, initialFormBuilderState);

  const queryFn: () => Promise<FormDefinition> = async () => {
    if (!formId) throw new Error("No form ID provided");
    return getFormById(formId);
  };

  const { data: fetchedFormDef, isLoading, error: queryError } = useQuery<FormDefinition, Error, FormDefinition, string[]>({
    queryKey: ["formDefinition", formId!],
    queryFn,
    enabled: !!formId,
  });

  useEffect(() => {
    if (fetchedFormDef) {
      dispatch({ type: 'LOAD_FORM', payload: fetchedFormDef });
    }
  }, [fetchedFormDef]);

  const updateMutation = useMutation<FormDefinition, Error, FormDefinition>({
    mutationFn: async (currentFormDefinition: FormDefinition) => {
      if (!formId) throw new Error("No form ID provided for update");
      const { updateFormDefinitionInService } = await import("@/services/formService");
      return updateFormDefinitionInService(formId, currentFormDefinition);
    },
    onSuccess: (data) => {
      toast({
        title: "Form saved",
        description: "Your form has been saved successfully",
      });
    },
    onError: (error) => {
      console.error("Error saving form:", error);
      toast({
        title: "Save failed",
        description: error.message || "There was a problem saving your form",
        variant: "destructive",
      });
    }
  });

  const handleSaveForm = () => {
    if (state.formDefinition) {
      updateMutation.mutate(state.formDefinition);
    } else {
      toast({ title: "Cannot save", description: "Form data is not available.", variant: "destructive" });
    }
  };

  const [activeDragItem, setActiveDragItem] = useState<Active | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragItem(event.active);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragItem(null);
    const { active, over } = event;

    if (!active || !over) return;

    // Explicitly convert active.id and over.id to strings for reliable string operations
    const activeIdString = String(active.id);
    const overIdString = String(over.id); // over is guaranteed to exist by the check above

    const activeType = active.data.current?.type as string;
    const overType = over.data.current?.type as string;
    
    // Debugging log
    console.log('DragEnd Event:', {
      activeId: activeIdString,
      activeType,
      activeData: active.data.current,
      overId: overIdString,
      overType,
      overData: over.data.current,
    });

    // Case 1: Adding a new field from the palette
    if (activeType === 'newField' && overType === 'sectionDropArea') {
      const fieldType = active.data.current?.fieldType as FormFieldType;
      const targetSectionId = over.data.current?.sectionId as string;
      if (fieldType && targetSectionId) {
        // TODO: Determine position for new field drop (e.g., always at the end, or based on drop coords)
        dispatch({
          type: 'ADD_FIELD_TO_SECTION',
          payload: { sectionId: targetSectionId, fieldType /* position: calculatedPosition */ },
        });
      }
      return;
    }
    
    // Case 2: Adding a new field to an empty form structure area
    if (activeType === 'newField' && overType === 'emptyFormArea') {
      const fieldType = active.data.current?.fieldType as FormFieldType;
      // Ensure formDefinition exists, even if sections are empty
      if (fieldType && state.formDefinition !== null) { 
        dispatch({ 
          type: 'ADD_SECTION', 
          payload: { 
            section: { title: 'Section 1' }, 
            initialFieldType: fieldType
          }
        });
      } else if (fieldType && state.formDefinition === null) {
        console.warn("FormBuilder: Attempted to add field to empty area, but formDefinition is null.");
      }
      return;
    } else if (activeType === 'newField' && overType === 'dropIndicator') {
      // New field dropped onto a DropIndicator between existing fields or at start/end of a section
      const { sectionId, targetIndex } = over.data.current as {
        sectionId: string;
        targetIndex: number;
      };
      const fieldType = active.data.current.fieldType as FormFieldType;

      // The reducer will handle creating the new field instance
      dispatch({
        type: 'ADD_FIELD_TO_SECTION',
        payload: {
          sectionId,
          fieldType,
          position: targetIndex,
        },
      });
      return;
    }

    // Case 3: Reordering an existing field
    if (activeType === 'field') {
      const draggedFieldId = active.data.current?.fieldId as string;
      const sourceSectionId = active.data.current?.sourceSectionId as string;

      if (!draggedFieldId || !sourceSectionId) return;

      // Scenario 3a: Dropping field onto a DropIndicator for precise positioning
      if (overType === 'dropIndicator') {
        const targetSectionId = over.data.current?.sectionId as string;
        const targetIndex = over.data.current?.targetIndex as number;

        if (!targetSectionId || typeof targetIndex !== 'number') return;

        const sourceSection = state.formDefinition?.sections.find(s => s.id === sourceSectionId);
        if (!sourceSection) return;
        const sourceFieldIndex = sourceSection.fields.findIndex(f => f.id === draggedFieldId);
        if (sourceFieldIndex === -1) return;

        if (sourceSectionId === targetSectionId) {
          // REORDER_FIELD_IN_SECTION
          // Ensure not dropping in the exact same start position or the position immediately after it (which is same logical spot after removal)
          if (sourceFieldIndex !== targetIndex && sourceFieldIndex + 1 !== targetIndex) {
            let effectiveTargetIndex = targetIndex;
            // If dragging an item downwards in the same list, and the targetIndex is after the original position,
            // the targetIndex needs to be adjusted because the splice(startIndex,1) will shorten the array.
            if (sourceFieldIndex < targetIndex) {
              effectiveTargetIndex = targetIndex - 1;
            }
            
            // Prevent no-op if effectiveTargetIndex is same as sourceFieldIndex
            if (sourceFieldIndex === effectiveTargetIndex) return;

            dispatch({
              type: 'REORDER_FIELD_IN_SECTION',
              payload: { sectionId: sourceSectionId, startIndex: sourceFieldIndex, endIndex: effectiveTargetIndex },
            });
          } else if (sourceFieldIndex === targetIndex) {
            // Special case: if dragging to the indicator immediately before itself (targetIndex is same as sourceIndex),
            // it means it's being dropped at its current position effectively if no adjustment was made.
            // Or if targetIndex is sourceFieldIndex + 1, after adjustment it becomes sourceFieldIndex.
            // This is to prevent re-dispatching for what results in no change of order.
            console.log("Field reorder resulted in no change of position.");
          }

        } else {
          // MOVE_FIELD_TO_DIFFERENT_SECTION
          dispatch({
            type: 'MOVE_FIELD_TO_DIFFERENT_SECTION',
            payload: {
              sourceSectionId,
              fieldId: draggedFieldId,
              targetSectionId,
              targetIndex, // Target index is directly from the drop indicator
            },
          });
        }
        return;
      }
      
      // Scenario 3b: Fallback or alternative - Dropping field onto a general sectionDropArea (e.g., for empty sections or append)
      // This might be less used now with DropIndicators, but can be a fallback.
      // For now, let's prioritize DropIndicators. If this is needed, we can uncomment and refine.
      /*
      if (overType === 'sectionDropArea') {
        const targetSectionId = over.data.current?.sectionId as string;
        if (!targetSectionId) return;

        const sourceSection = state.formDefinition?.sections.find(s => s.id === sourceSectionId);
        const targetSection = state.formDefinition?.sections.find(s => s.id === targetSectionId);
        if (!sourceSection || !targetSection) return;
        const sourceFieldIndex = sourceSection.fields.findIndex(f => f.id === draggedFieldId);
        if (sourceFieldIndex === -1) return;

        // Default to appending if no better index found
        const targetFieldIndex = targetSection.fields.length; 

        if (sourceSectionId === targetSectionId) {
          if (sourceFieldIndex !== targetFieldIndex) { 
            const adjustedTargetIndex = sourceFieldIndex < targetFieldIndex ? targetFieldIndex -1 : targetFieldIndex;
            if(sourceFieldIndex === adjustedTargetIndex) return; // No actual move
            dispatch({
              type: 'REORDER_FIELD_IN_SECTION',
              payload: { sectionId: sourceSectionId, startIndex: sourceFieldIndex, endIndex: adjustedTargetIndex },
            });
          }
        } else {
          dispatch({
            type: 'MOVE_FIELD_TO_DIFFERENT_SECTION',
            payload: { sourceSectionId, fieldId: draggedFieldId, targetSectionId, targetIndex: targetFieldIndex },
          });
        }
        return;
      }
      */
      return; // If activeType is 'field' but not dropped on a 'dropIndicator' or handled 'sectionDropArea'
    }

    // Case 4: Reordering a section
    if (activeType === 'section') {
      const draggedSectionId = active.data.current?.sectionId as string;
      if (!draggedSectionId) return;

      // Scenario 4a: Dropping section onto the main list area (less precise)
      // Scenario 4b: Dropping section onto another section (more precise for index)
      if (overType === 'sectionsListArea' || overType === 'section') {
        const sections = state.formDefinition?.sections;
        if (!sections) return;

        const sourceIndex = sections.findIndex(s => s.id === draggedSectionId);
        if (sourceIndex === -1) return;

        let targetIndex = sections.length -1; 

        if (overType === 'section') {
          const targetSectionId = over.data.current?.sectionId as string;
          if (targetSectionId && targetSectionId !== draggedSectionId) {
            const foundTargetIndex = sections.findIndex(s => s.id === targetSectionId);
            if (foundTargetIndex !== -1) {
              if (sourceIndex < foundTargetIndex) {
                targetIndex = foundTargetIndex;
              } else {
                targetIndex = foundTargetIndex;
              }
            }
          }
        } else if (overType === 'sectionsListArea') {
            // Using overIdString which is now explicitly a string
            const overSectionIdIfAny = overIdString.startsWith('section-draggable-') ? overIdString.replace('section-draggable-', '') : null;
            if (overSectionIdIfAny && overSectionIdIfAny !== draggedSectionId) {
                const foundOverIndex = sections.findIndex(s => s.id === overSectionIdIfAny);
                if (foundOverIndex !== -1) targetIndex = foundOverIndex;
            }
        }
        
        if (sourceIndex !== targetIndex) {
           const adjustedTargetIndex = sourceIndex < targetIndex && targetIndex > 0 ? targetIndex : targetIndex;
          dispatch({
            type: 'REORDER_SECTIONS',
            payload: { startIndex: sourceIndex, endIndex: adjustedTargetIndex },
          });
        }
        return;
      }
      return;
    }

    // Log unhandled cases
    console.warn('Unhandled drag and drop case:', { activeType, overType });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (queryError || !state.formDefinition?.id) {
    return (
      <DashboardLayout>
        <div className="h-96 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">
            {queryError ? queryError.message : "Error loading form data"}
          </h2>
          <p className="text-muted-foreground mb-4">Please try again or go back to the dashboard.</p>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  const { formDefinition, selectedFieldId, selectedSectionId, selectedElement } = state;
  const formTitle = formDefinition.title || 'Untitled Form';
  const formDescription = formDefinition.description || '';

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col h-full max-h-[calc(100vh-var(--header-height)-2rem)]"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{formTitle}</h1>
                {formDescription && <p className="text-sm text-muted-foreground">{formDescription}</p>}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={handleSaveForm} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : 
                  <><Save className="h-4 w-4 mr-2" /> Save Form</>
                }
              </Button>
            </div>
          </div>

          <div className="flex flex-grow gap-4 overflow-hidden">
            <div className="w-[280px] flex-shrink-0">
              <FieldPalette />
            </div>

            <div className="flex-grow min-w-0">
              <FormStructureTree 
                formDefinition={formDefinition} 
                selectedFieldId={selectedFieldId}
                selectedSectionId={selectedSectionId}
                onSelectField={(fieldId, sectionId) => dispatch({ type: 'SELECT_ELEMENT', payload: { fieldId, sectionId } })}
                onSelectSection={(sectionId) => dispatch({ type: 'SELECT_ELEMENT', payload: { sectionId, fieldId: null } })}
                onDeleteField={(fieldId, sectionId) => dispatch({ type: 'DELETE_FIELD', payload: { fieldId, sectionId } })}
                onDeleteSection={(sectionId) => dispatch({ type: 'DELETE_SECTION', payload: { sectionId } })}
              />
            </div>

            <div className="w-[350px] flex-shrink-0">
              <PropertyEditorPane 
                formDefinition={formDefinition}
                selectedElement={selectedElement}
                onUpdateField={(sectionId, fieldId, updates) => dispatch({ type: 'UPDATE_FIELD_PROPERTIES', payload: { sectionId, fieldId, updates }})}
                onUpdateSectionProperties={(sectionId, updates) => dispatch({ type: 'UPDATE_SECTION_PROPERTIES', payload: { sectionId, updates }})}
              />
            </div>
          </div>
        </motion.div>
      </DashboardLayout>
      <DragOverlay dropAnimation={null}>
        {activeDragItem && activeDragItem.data.current?.type === 'newField' ? (
          <DraggedItemPreview label={activeDragItem.data.current.label as string} />
        ) : activeDragItem ? (
          <DraggedItemPreview label={activeDragItem.data.current?.label as string || "Dragging Item"} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
