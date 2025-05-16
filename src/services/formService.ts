import { supabase } from "@/integrations/supabase/client";
import { FormSummary, FormStatus, FormDefinition, FormFieldDefinition, FormSectionDefinition, FormFieldType } from "@/types/forms";

// Get form by ID - Now returns FormDefinition
export const getFormById = async (id: string): Promise<FormDefinition> => {
  try {
    const { data, error } = await supabase
      .from("forms")
      .select("*") // Select all fields
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Form not found or data is null");

    // data.fields from Supabase is expected to be an array of objects.
    // Each object should be transformed into FormFieldDefinition.

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      sections: data.fields && Array.isArray(data.fields) && data.fields.length > 0
        ? [{
            id: `section-${crypto.randomUUID()}`, // Ensure section ID is always unique
            title: 'Main Section', // Provide a default title
            description: '',
            fields: data.fields.map((dbField: any) => { // Explicitly map each dbField
              // dbField is assumed to be of a type similar to FormField from @/lib/types
              // We need to transform it to FormFieldDefinition from @/types/forms
              const transformedField: FormFieldDefinition = {
                id: dbField.id || crypto.randomUUID(), // Ensure ID exists
                type: dbField.type as FormFieldType,    // Assume type exists and is compatible
                name: dbField.name || `field_${crypto.randomUUID().substring(0, 6)}`, // PROVIDE A DEFAULT FOR 'name'
                label: dbField.label || `Untitled ${dbField.type || 'field'} Field`, // Default label, ensure dbField.type is checked

                // BaseFieldProps (ensure all required ones are covered)
                description: dbField.description || '',
                placeholder: dbField.placeholder || '',
                // Check for is_required (snake_case from DB) or isRequired (camelCase)
                isRequired: typeof dbField.is_required === 'boolean' ? dbField.is_required : (typeof dbField.isRequired === 'boolean' ? dbField.isRequired : false),
                isHidden: typeof dbField.is_hidden === 'boolean' ? dbField.is_hidden : (typeof dbField.isHidden === 'boolean' ? dbField.isHidden : false),
                defaultValue: dbField.defaultValue, // Pass through, type 'any'

                // Spread other properties from dbField that might match optional properties
                // on FormFieldDefinition. This part needs to be careful.
                // Assuming Supabase stores specific props in a 'properties' JSON or flat.
                // Let's be explicit for known properties based on FormFieldDefinition.
                
                // Text & Textarea specific
                minLength: dbField.minLength,
                maxLength: dbField.maxLength,
                rows: dbField.rows, // for textarea

                // Number specific
                min: dbField.min,
                max: dbField.max,
                
                // Date specific
                dateFormat: dbField.dateFormat,
                minDate: dbField.minDate,
                maxDate: dbField.maxDate,

                // Rating specific
                maxRating: dbField.maxRating,
                ratingType: dbField.ratingType as FormFieldDefinition['ratingType'],

                // Choice (Select, Radio, CheckboxGroup) specific
                options: Array.isArray(dbField.options) ? dbField.options.map((opt: any) => ({ // Ensure options match FieldOption[]
                  id: opt.id || crypto.randomUUID(),
                  label: opt.label || 'Option',
                  value: opt.value || opt.label || `option_${crypto.randomUUID().substring(0,4)}`,
                  disabled: typeof opt.disabled === 'boolean' ? opt.disabled : false,
                })) : [],
                allowMultipleSelection: typeof dbField.allowMultipleSelection === 'boolean' ? dbField.allowMultipleSelection : undefined, // for select
                allowOther: typeof dbField.allowOther === 'boolean' ? dbField.allowOther : undefined,

                // Content specific (Paragraph, Heading)
                content: dbField.content, // For paragraph
                level: dbField.level as FormFieldDefinition['level'], // For heading
                
                // General styling and advanced logic
                styleOptions: dbField.styleOptions as FormFieldDefinition['styleOptions'], 
                advancedValidationRules: dbField.advancedValidationRules as FormFieldDefinition['advancedValidationRules'],
                conditionalLogic: dbField.conditionalLogic as FormFieldDefinition['conditionalLogic'],
                
                // Any other custom properties stored in a 'properties' sub-object, for example
                ...(dbField.properties && typeof dbField.properties === 'object' ? dbField.properties : {}),
              };
              return transformedField;
            }),
          }]
        : [{ // Default section if no fields from DB or data.fields is not an array or empty
            id: `section-${crypto.randomUUID()}`,
            title: 'Main Section',
            description: '',
            fields: [],
          }],
      status: data.published ? 'published' : 'draft',
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      version: 1, // Default version to 1
      customSuccessMessage: undefined, // Default to undefined
      redirectUrl: undefined, // Default to undefined
    } as FormDefinition;
  } catch (error) {
    console.error(`Error fetching form ${id}:`, error);
    throw error;
  }
};

// New function to update form based on FormDefinition
export const updateFormDefinitionInService = async (formId: string, formDef: FormDefinition): Promise<FormDefinition> => {
  try {
    const fieldsToSave: FormFieldDefinition[] = formDef.sections.reduce((acc, section) => {
      return acc.concat(section.fields);
    }, [] as FormFieldDefinition[]);

    const updatePayload = {
      title: formDef.title,
      description: formDef.description,
      fields: fieldsToSave as any, // Cast to any for Supabase Json type
      published: formDef.status === 'published',
      updated_at: new Date().toISOString(),
      version: formDef.version,
      custom_success_message: formDef.customSuccessMessage,
      redirect_url: formDef.redirectUrl,
    };

    const { data, error } = await supabase
      .from("forms")
      .update(updatePayload)
      .eq("id", formId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Form not found after update or data is null");

    // For now, we return the input formDef assuming the update was successful.
    // A more robust version would transform the `data` (Supabase response) back to FormDefinition.
    // This might involve re-fetching or carefully mapping fields if Supabase returns the flat `fields` array.
    return {
        ...formDef, // Return the sent definition, but update the timestamp
        updatedAt: updatePayload.updated_at 
    };

  } catch (error) {
    console.error(`Error updating form definition ${formId}:`, error);
    throw error;
  }
};

// Old updateFormFields - can be deprecated or removed
/*
export const updateFormFields = async (id: string, fields: FormFieldDefinition[]): Promise<Form> => {
  try {
    const { data, error } = await supabase
      .from("forms")
      .update({
        fields: fields as unknown as any,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    if (!data) throw new Error("Form not found after update or data is null");

    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      fields: data.fields as unknown as FormFieldDefinition[],
      status: data.published ? 'published' : 'draft',
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Form;
  } catch (error) {
    console.error(`Error updating form fields ${id}:`, error);
    throw error;
  }
};
*/

// --- Placeholder functions for Dashboard ---

// Mock data store (in-memory, replace with actual API calls)
let mockFormsStore: FormSummary[] = [
  { id: 'form1', title: 'Customer Feedback Survey', createdAt: new Date(2023, 10, 15).toISOString(), lastModified: new Date(2023, 11, 1).toISOString(), status: 'published', responseCount: 120 },
  { id: 'form2', title: 'New Product Idea Submission', createdAt: new Date(2023, 11, 5).toISOString(), lastModified: new Date(2023, 11, 20).toISOString(), status: 'draft', responseCount: 0 },
  { id: 'form3', title: 'Website Usability Test', createdAt: new Date(2024, 0, 10).toISOString(), lastModified: new Date(2024, 0, 25).toISOString(), status: 'published', responseCount: 85 },
  { id: 'form4', title: 'Employee Satisfaction Poll (Annual)', createdAt: new Date(2024, 1, 1).toISOString(), lastModified: new Date(2024, 1, 10).toISOString(), status: 'archived', responseCount: 350 },
  { id: 'form5', title: 'Event Registration - Tech Conference 2024', createdAt: new Date(2024, 1, 20).toISOString(), lastModified: new Date(2024, 2, 1).toISOString(), status: 'published', responseCount: 275 },
  { id: 'form6', title: 'Marketing Campaign Feedback Q1', createdAt: new Date(2024, 2, 5).toISOString(), lastModified: new Date(2024, 2, 12).toISOString(), status: 'draft', responseCount: 0 },
];

export const fetchUserFormSummaries = async (): Promise<FormSummary[]> => {
  console.log('[formService] fetchUserFormSummaries called');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // Simulate potential error
  // if (Math.random() > 0.8) {
  //   console.error('[formService] Mock API error: Could not fetch forms.');
  //   throw new Error('Mock API Error: Failed to fetch form summaries.');
  // }
  console.log('[formService] Returning mock forms:', mockFormsStore);
  return [...mockFormsStore]; // Return a copy to prevent direct modification
};

export const duplicateFormAPI = async (formId: string, currentTitle: string): Promise<FormSummary> => {
  console.log(`[formService] duplicateFormAPI called for formId: ${formId}, title: ${currentTitle}`);
  await new Promise(resolve => setTimeout(resolve, 300));
  const originalForm = mockFormsStore.find(f => f.id === formId);
  if (!originalForm) {
    console.error(`[formService] Mock API error: Form with id ${formId} not found for duplication.`);
    throw new Error('Mock API Error: Original form not found.');
  }
  const newForm: FormSummary = {
    ...originalForm,
    id: `form${Date.now()}`,
    title: `${currentTitle} (Copy)`,
    status: 'draft',
    responseCount: 0,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  };
  mockFormsStore.unshift(newForm);
  console.log('[formService] Duplicated form, new form:', newForm);
  return newForm;
};

export const deleteFormAPI = async (formId: string): Promise<void> => {
  console.log(`[formService] deleteFormAPI called for formId: ${formId}`);
  await new Promise(resolve => setTimeout(resolve, 300));
  const initialLength = mockFormsStore.length;
  mockFormsStore = mockFormsStore.filter(form => form.id !== formId);
  if (mockFormsStore.length === initialLength) {
    console.warn(`[formService] Mock API: Form with id ${formId} not found for deletion, or already deleted.`);
    // Depending on strictness, could throw an error here or allow idempotent deletes
    // throw new Error('Mock API Error: Form not found for deletion.');
  }
  console.log(`[formService] Form with id ${formId} deleted (if existed).`);
  return Promise.resolve();
};

// Placeholder for creating a new blank form - to be used by CreateFormButton
export const createNewBlankForm = async (title: string = "Untitled Form"): Promise<FormSummary> => {
  console.log(`[formService] createNewBlankForm called with title: ${title}`);
  await new Promise(resolve => setTimeout(resolve, 300));
  const newForm: FormSummary = {
    id: `form${Date.now()}`,
    title: title,
    status: 'draft',
    responseCount: 0,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  };
  mockFormsStore.unshift(newForm);
  console.log('[formService] Created new blank form:', newForm);
  return newForm;
};
