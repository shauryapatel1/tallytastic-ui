import type {
  FormDefinition,
  FormFieldDefinition,
  FormSectionDefinition,
  FormFieldType,
  BaseFieldProps,
  FormSettings,
} from '@/types/forms';
import { produce } from 'immer';

export interface FormBuilderState {
  formDefinition: FormDefinition | null;
  selectedFieldId: string | null;
  selectedSectionId: string | null;
  selectedElement: FormFieldDefinition | FormSectionDefinition | null;
}

export const initialFormBuilderState: FormBuilderState = {
  formDefinition: null, 
  selectedFieldId: null,
  selectedSectionId: null,
  selectedElement: null,
};

const createNewField = (type: FormFieldType): Omit<FormFieldDefinition, 'id'> => {
  const baseFieldData: Omit<FormFieldDefinition, 'id'> = {
    type,
    name: `${type.toLowerCase().replace(/_/g, '')}_${Date.now() % 10000}`,
    label: `New ${type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')} Field`,
    description: '',
    placeholder: '',
    isRequired: false,
    isHidden: false,
    defaultValue: undefined,
    styleOptions: { labelIsVisible: true, width: 'full' },
    options: undefined,
    allowMultipleSelection: undefined,
    allowOther: undefined,
    minLength: undefined,
    maxLength: undefined,
    rows: undefined,
    min: undefined,
    max: undefined,
    dateFormat: undefined,
    minDate: undefined,
    maxDate: undefined,
    maxFileSizeMB: undefined,
    allowedFileTypes: undefined,
    maxRating: undefined,
    ratingType: undefined,
    level: undefined,
    content: undefined,
    conditionalLogic: undefined,
    advancedValidationRules: undefined,
  };

  switch (type) {
    case 'select':
    case 'radio':
    case 'checkbox':
      return {
        ...baseFieldData,
        options: [{ id: crypto.randomUUID(), label: 'Option 1', value: 'option1' }],
        allowMultipleSelection: type === 'checkbox',
      };
    case 'rating':
      return {
        ...baseFieldData,
        maxRating: 5,
        ratingType: 'star',
      };
    default:
      return baseFieldData;
  }
};

export type FormBuilderAction =
  | { type: 'LOAD_FORM'; payload: FormDefinition }
  | { type: 'INIT_NEW_FORM'; payload?: Partial<Pick<FormDefinition, 'title' | 'description'>> }
  | { type: 'UPDATE_FORM_META'; payload: Partial<Pick<FormDefinition, 'title' | 'description' | 'customSuccessMessage' | 'redirectUrl'>> }
  | { type: 'UPDATE_FORM_SETTINGS'; payload: Partial<FormSettings> }
  | { 
      type: 'ADD_SECTION'; 
      payload: { 
        section?: Partial<Omit<FormSectionDefinition, 'id' | 'fields'>>; 
        position?: number; 
        initialFieldType?: FormFieldType;
      }
    }
  | { type: 'UPDATE_SECTION_PROPERTIES'; payload: { sectionId: string; updates: Partial<Omit<FormSectionDefinition, 'id' | 'fields'>> } }
  | { type: 'DELETE_SECTION'; payload: { sectionId: string } }
  | { type: 'REORDER_SECTIONS'; payload: { startIndex: number; endIndex: number } }
  | { type: 'ADD_FIELD_TO_SECTION'; payload: { sectionId: string; fieldType: FormFieldType; position?: number } }
  | { type: 'UPDATE_FIELD_PROPERTIES'; payload: { sectionId: string; fieldId: string; updates: Partial<Omit<FormFieldDefinition, 'id' | 'type'>> } }
  | { type: 'DELETE_FIELD'; payload: { sectionId: string; fieldId: string } }
  | { type: 'REORDER_FIELD_IN_SECTION'; payload: { sectionId: string; startIndex: number; endIndex: number } }
  | { type: 'MOVE_FIELD_TO_DIFFERENT_SECTION'; payload: { sourceSectionId: string; fieldId: string; targetSectionId: string; targetIndex: number } }
  | { type: 'SELECT_ELEMENT'; payload: { fieldId: string | null; sectionId: string | null } };

export const formBuilderReducer = produce((draft: FormBuilderState, action: FormBuilderAction): FormBuilderState | void => {
  switch (action.type) {
    case 'LOAD_FORM':
      draft.formDefinition = action.payload;
      draft.selectedFieldId = null;
      draft.selectedSectionId = null;
      draft.selectedElement = null;
      break;

    case 'INIT_NEW_FORM':
      draft.formDefinition = {
        id: crypto.randomUUID(),
        title: action.payload?.title || 'Untitled Form',
        description: action.payload?.description || '',
        sections: [{ id: crypto.randomUUID(), title: 'Section 1', fields: [] }],
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      draft.selectedFieldId = null;
      draft.selectedSectionId = draft.formDefinition.sections[0].id;
      draft.selectedElement = draft.formDefinition.sections[0];
      if (!draft.formDefinition.settings) {
        draft.formDefinition.settings = { submitButtonText: 'Submit' };
      }
      break;
      
    case 'UPDATE_FORM_META':
        if (draft.formDefinition) {
            draft.formDefinition = { ...draft.formDefinition, ...action.payload };
        }
        break;

    case 'UPDATE_FORM_SETTINGS': {
      if (draft.formDefinition) {
        draft.formDefinition.settings = {
          ...(draft.formDefinition.settings || {}),
          ...action.payload,
        };
      }
      break;
    }

    case 'ADD_SECTION': {
        if (!draft.formDefinition) break;
        const newSectionBase = action.payload.section || {};
        const newSection: FormSectionDefinition = {
            id: crypto.randomUUID(),
            title: newSectionBase.title || `New Section ${draft.formDefinition.sections.length + 1}`,
            description: newSectionBase.description || '',
            fields: [],
            ...newSectionBase,
        };

        if (action.payload.initialFieldType) {
            const newFieldDefinition: FormFieldDefinition = {
                ...createNewField(action.payload.initialFieldType),
                id: crypto.randomUUID(),
            };
            newSection.fields.push(newFieldDefinition);
        }

        if (action.payload.position !== undefined) {
            draft.formDefinition.sections.splice(action.payload.position, 0, newSection);
        } else {
            draft.formDefinition.sections.push(newSection);
        }
        if (!action.payload.initialFieldType) {
            draft.selectedSectionId = newSection.id;
            draft.selectedFieldId = null;
            draft.selectedElement = newSection;
        } else if (newSection.fields.length > 0) {
            draft.selectedSectionId = newSection.id;
            draft.selectedFieldId = newSection.fields[0].id;
            draft.selectedElement = newSection.fields[0];
        }
        break;
    }

    case 'UPDATE_SECTION_PROPERTIES': {
        if (!draft.formDefinition) break;
        const sectionIndex = draft.formDefinition.sections.findIndex(s => s.id === action.payload.sectionId);
        if (sectionIndex !== -1) {
            draft.formDefinition.sections[sectionIndex] = {
                ...draft.formDefinition.sections[sectionIndex],
                ...action.payload.updates,
            };
            if (draft.selectedSectionId === action.payload.sectionId && draft.selectedFieldId === null) {
                 draft.selectedElement = draft.formDefinition.sections[sectionIndex];
            }
        }
        break;
    }
    
    case 'DELETE_SECTION': {
        if (!draft.formDefinition) break;
        draft.formDefinition.sections = draft.formDefinition.sections.filter(s => s.id !== action.payload.sectionId);
        if (draft.selectedSectionId === action.payload.sectionId) {
            draft.selectedSectionId = null;
            draft.selectedFieldId = null;
            draft.selectedElement = null;
            if (draft.formDefinition.sections.length > 0) {
                draft.selectedSectionId = draft.formDefinition.sections[0].id;
                draft.selectedElement = draft.formDefinition.sections[0];
            }
        }
        break;
    }
    
    case 'REORDER_SECTIONS': {
        if (!draft.formDefinition) break;
        const [removed] = draft.formDefinition.sections.splice(action.payload.startIndex, 1);
        draft.formDefinition.sections.splice(action.payload.endIndex, 0, removed);
        break;
    }

    case 'ADD_FIELD_TO_SECTION': {
      if (!draft.formDefinition) break;
      const section = draft.formDefinition.sections.find(s => s.id === action.payload.sectionId);
      if (section) {
        const newFieldDefinition: FormFieldDefinition = {
          ...createNewField(action.payload.fieldType),
          id: crypto.randomUUID(),
        };
        if (action.payload.position !== undefined) {
          section.fields.splice(action.payload.position, 0, newFieldDefinition);
        } else {
          section.fields.push(newFieldDefinition);
        }
        draft.selectedFieldId = newFieldDefinition.id;
        draft.selectedSectionId = section.id;
        draft.selectedElement = newFieldDefinition;
      }
      break;
    }

    case 'UPDATE_FIELD_PROPERTIES': {
      if (!draft.formDefinition) break;
      const section = draft.formDefinition.sections.find(s => s.id === action.payload.sectionId);
      if (section) {
        const fieldIndex = section.fields.findIndex(f => f.id === action.payload.fieldId);
        if (fieldIndex !== -1) {
          section.fields[fieldIndex] = {
            ...section.fields[fieldIndex],
            ...action.payload.updates,
          } as FormFieldDefinition;
          if (draft.selectedFieldId === action.payload.fieldId) {
              draft.selectedElement = section.fields[fieldIndex];
          }
        }
      }
      break;
    }
    
    case 'DELETE_FIELD': {
        if (!draft.formDefinition) break;
        const section = draft.formDefinition.sections.find(s => s.id === action.payload.sectionId);
        if (section) {
            section.fields = section.fields.filter(f => f.id !== action.payload.fieldId);
            if (draft.selectedFieldId === action.payload.fieldId) {
                draft.selectedFieldId = null;
                draft.selectedElement = section;
            }
        }
        break;
    }
    
    case 'REORDER_FIELD_IN_SECTION': {
        if (!draft.formDefinition) break;
        const section = draft.formDefinition.sections.find(s => s.id === action.payload.sectionId);
        if (section) {
            const [removed] = section.fields.splice(action.payload.startIndex, 1);
            section.fields.splice(action.payload.endIndex, 0, removed);
        }
        break;
    }
    
    case 'MOVE_FIELD_TO_DIFFERENT_SECTION': {
        if (!draft.formDefinition) break;
        const sourceSection = draft.formDefinition.sections.find(s => s.id === action.payload.sourceSectionId);
        const targetSection = draft.formDefinition.sections.find(s => s.id === action.payload.targetSectionId);

        if (sourceSection && targetSection) {
            const fieldIndex = sourceSection.fields.findIndex(f => f.id === action.payload.fieldId);
            if (fieldIndex !== -1) {
                const [movedField] = sourceSection.fields.splice(fieldIndex, 1);
                targetSection.fields.splice(action.payload.targetIndex, 0, movedField);
                if (draft.selectedFieldId === action.payload.fieldId) {
                    draft.selectedSectionId = targetSection.id;
                }
            }
        }
        break;
    }

    case 'SELECT_ELEMENT': {
      draft.selectedFieldId = action.payload.fieldId;
      draft.selectedSectionId = action.payload.sectionId;
      if (!draft.formDefinition) {
          draft.selectedElement = null;
          break;
      }
      if (action.payload.fieldId && action.payload.sectionId) {
        const section = draft.formDefinition.sections.find(s => s.id === action.payload.sectionId);
        draft.selectedElement = section?.fields.find(f => f.id === action.payload.fieldId) || null;
      } else if (action.payload.sectionId) {
        draft.selectedElement = draft.formDefinition.sections.find(s => s.id === action.payload.sectionId) || null;
      } else {
        draft.selectedElement = null;
      }
      break;
    }

    default:
      break; 
  }
}, initialFormBuilderState); 