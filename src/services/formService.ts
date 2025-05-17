import { supabase } from "@/integrations/supabase/client";
import type {
  FormSummary,
  FormStatus,
  FormDefinition,
  FormFieldDefinition,
  FormSectionDefinition,
  FormFieldType,
  FormValues,
  FormResponse,
  FieldOption,
} from "@/types/forms";
import type {
  Database,
  FormDefinitionSectionsSupabase,
  FormResponseDataSupabase,
  Json,
} from "@/types/supabase"; // Added Supabase types

// Define concrete types for Supabase table rows
type FormRow = Database["public"]["Tables"]["forms"]["Row"];
type FormResponseRow = Database["public"]["Tables"]["form_responses"]["Row"];
type FormInsertPayload = Database["public"]["Tables"]["forms"]["Insert"];
type FormUpdatePayload = Database["public"]["Tables"]["forms"]["Update"];
type FormResponseInsertPayload = Database["public"]["Tables"]["form_responses"]["Insert"];

// Helper type guard for definition_sections - returns boolean
function isValidFormSectionDefinitionArrayStructure(value: Json | null | undefined): boolean {
  if (!value || !Array.isArray(value)) {
    return false;
  }
  return value.every(section => {
    if (typeof section !== 'object' || section === null || Array.isArray(section)) {
      return false;
    }
    const fieldsProperty = (section as { fields?: unknown }).fields;
    if (!Array.isArray(fieldsProperty)) {
        return false;
    }
    return true;
  });
}

// Get form by ID - Now returns FormDefinition
export const getFormById = async (id: string): Promise<FormDefinition> => {
  try {
    const { data, error } = await supabase
      .from("forms")
      .select(
        "id, title, description, user_id, created_at, updated_at, status, version, custom_success_message, redirect_url, definition_sections"
      )
      .eq("id", id)
      .single<FormRow>();

    if (error) {
      console.error(`Error fetching form ${id} from Supabase:`, error);
      throw new Error(`Failed to fetch form: ${error.message}`);
    }
    if (!data) {
      throw new Error("Form not found or data is null");
    }

    let mappedSections: FormSectionDefinition[] = [];
    const rawSections = data.definition_sections;

    if (isValidFormSectionDefinitionArrayStructure(rawSections)) {
      // Runtime check passed, now we can assert the type.
      const sectionsToMap = rawSections as unknown as FormSectionDefinition[];
      mappedSections = sectionsToMap.map((sectionFromDb): FormSectionDefinition => {
        const sectionFields = sectionFromDb.fields || [];
        
        const mappedFields: FormFieldDefinition[] = sectionFields.map((dbField: any): FormFieldDefinition => {
          const fieldType = (dbField.type as FormFieldType) || 'text';

          return {
            id: dbField.id || crypto.randomUUID(),
            type: fieldType,
            name: dbField.name || `field_${crypto.randomUUID().substring(0, 6)}`,
            label: dbField.label || `Untitled ${fieldType} Field`,
            description: dbField.description || '',
            placeholder: dbField.placeholder || '',
            isRequired: typeof dbField.isRequired === 'boolean' ? dbField.isRequired : false,
            isHidden: typeof dbField.isHidden === 'boolean' ? dbField.isHidden : false,
            defaultValue: dbField.defaultValue,
            minLength: typeof dbField.minLength === 'number' ? dbField.minLength : undefined,
            maxLength: typeof dbField.maxLength === 'number' ? dbField.maxLength : undefined,
            rows: typeof dbField.rows === 'number' ? dbField.rows : undefined,
            min: typeof dbField.min === 'number' ? dbField.min : undefined,
            max: typeof dbField.max === 'number' ? dbField.max : undefined,
            dateFormat: typeof dbField.dateFormat === 'string' ? dbField.dateFormat : undefined,
            minDate: typeof dbField.minDate === 'string' ? dbField.minDate : undefined,
            maxDate: typeof dbField.maxDate === 'string' ? dbField.maxDate : undefined,
            maxFileSizeMB: typeof dbField.maxFileSizeMB === 'number' ? dbField.maxFileSizeMB : undefined,
            allowedFileTypes: Array.isArray(dbField.allowedFileTypes) && dbField.allowedFileTypes.every((ft: any) => typeof ft === 'string')
              ? dbField.allowedFileTypes
              : [],
            maxRating: typeof dbField.maxRating === 'number' ? dbField.maxRating : 5,
            ratingType: dbField.ratingType === 'star' || dbField.ratingType === 'number_scale' ? dbField.ratingType : 'star',
            options: Array.isArray(dbField.options)
              ? dbField.options.map((opt: any): FieldOption => ({
                  id: opt.id || crypto.randomUUID(),
                  label: opt.label || 'Option',
                  value: opt.value || opt.label || `option_${crypto.randomUUID().substring(0,4)}`,
                }))
              : [],
            allowMultipleSelection: typeof dbField.allowMultipleSelection === 'boolean' ? dbField.allowMultipleSelection : false,
            allowOther: typeof dbField.allowOther === 'boolean' ? dbField.allowOther : false,
            level: typeof dbField.level === 'number' && [1,2,3,4,5,6].includes(dbField.level)
              ? dbField.level as FormFieldDefinition['level'] 
              : undefined, 
            content: typeof dbField.content === 'string' ? dbField.content : undefined,
            conditionalLogic: Array.isArray(dbField.conditionalLogic) ? dbField.conditionalLogic : [],
            advancedValidationRules: Array.isArray(dbField.advancedValidationRules) ? dbField.advancedValidationRules : [],
            styleOptions: typeof dbField.styleOptions === 'object' && dbField.styleOptions !== null ? dbField.styleOptions : {},
          };
        });

        return {
          id: sectionFromDb.id || crypto.randomUUID(),
          title: sectionFromDb.title || 'Untitled Section',
          description: sectionFromDb.description || '',
          fields: mappedFields,
        };
      });
    } else if (rawSections != null) { 
      console.warn(`Form ${id} has malformed or unexpected 'definition_sections' data. Defaulting to empty sections. Data:`, rawSections);
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      sections: mappedSections,
      customSuccessMessage: data.custom_success_message || undefined,
      redirectUrl: data.redirect_url || undefined,
      version: data.version || 1,
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      status: (data.status as FormStatus) || 'draft',
    };

  } catch (error) {
    console.error(`Error in getFormById for form ${id}:`, error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error(`An unexpected error occurred while fetching form ${id}.`);
  }
};

// New function to update form based on FormDefinition
export const updateFormDefinitionInService = async (
  formId: string,
  formDefinition: FormDefinition
): Promise<void> => {
  console.log(`[formService] updateFormDefinitionInService called for formId: ${formId}`, formDefinition);

  const updatePayload: FormUpdatePayload = {
    title: formDefinition.title,
    description: formDefinition.description,
    definition_sections: formDefinition.sections as unknown as Json,
    status: formDefinition.status,
    version: formDefinition.version,
    custom_success_message: formDefinition.customSuccessMessage,
    redirect_url: formDefinition.redirectUrl,
    updated_at: new Date().toISOString(),
    // user_id, created_at are typically not updated here.
    // id is used in .eq() and not in payload.
  };

  // Supabase client handles partial updates correctly if optional fields are undefined.
  // No need to manually delete undefined keys if the 'Update' type has optional properties.

  try {
    const { error } = await supabase
      .from('forms')
      .update(updatePayload)
      .eq('id', formId);

    if (error) {
      console.error('Error updating form definition in Supabase:', error);
      throw new Error(`Supabase error updating form (ID: ${formId}): ${error.message} (Code: ${error.code})`);
    }

    console.log(`Form ${formId} updated successfully in Supabase.`);

  } catch (error) {
    console.error(`Unexpected error in updateFormDefinitionInService for form ID ${formId}:`, error);
    if (error instanceof Error && error.message.startsWith('Supabase error')) {
        throw error;
    }
    throw new Error(`Failed to update form definition (ID: ${formId}): ${error instanceof Error ? error.message : 'Unknown error'}`);
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
// let mockFormsStore: FormSummary[] = [
//   { id: 'form1', title: 'Customer Feedback Survey', createdAt: new Date(2023, 10, 15).toISOString(), lastModified: new Date(2023, 11, 1).toISOString(), status: 'published', responseCount: 120 },
//   { id: 'form2', title: 'New Product Idea Submission', createdAt: new Date(2023, 11, 5).toISOString(), lastModified: new Date(2023, 11, 20).toISOString(), status: 'draft', responseCount: 0 },
//   { id: 'form3', title: 'Website Usability Test', createdAt: new Date(2024, 0, 10).toISOString(), lastModified: new Date(2024, 0, 25).toISOString(), status: 'published', responseCount: 85 },
//   { id: 'form4', title: 'Employee Satisfaction Poll (Annual)', createdAt: new Date(2024, 1, 1).toISOString(), lastModified: new Date(2024, 1, 10).toISOString(), status: 'archived', responseCount: 350 },
//   { id: 'form5', title: 'Event Registration - Tech Conference 2024', createdAt: new Date(2024, 1, 20).toISOString(), lastModified: new Date(2024, 2, 1).toISOString(), status: 'published', responseCount: 275 },
//   { id: 'form6', title: 'Marketing Campaign Feedback Q1', createdAt: new Date(2024, 2, 5).toISOString(), lastModified: new Date(2024, 2, 12).toISOString(), status: 'draft', responseCount: 0 },
// ];

// export const fetchUserFormSummaries = async (): Promise<FormSummary[]> => {
//   console.log('[formService] fetchUserFormSummaries called');
//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 500));
//   // Simulate potential error
//   // if (Math.random() > 0.8) {
//   //   console.error('[formService] Mock API error: Could not fetch forms.');
//   //   throw new Error('Mock API Error: Failed to fetch form summaries.');
//   // }
//   console.log('[formService] Returning mock forms:', mockFormsStore);
//   return [...mockFormsStore]; // Return a copy to prevent direct modification
// };

export const WorkspaceUserFormSummaries = async (): Promise<FormSummary[]> => {
  console.log('[formService] WorkspaceUserFormSummaries called');
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('[formService] Authentication error:', authError);
      throw new Error('User not authenticated or session expired.');
    }
    if (!user) {
      console.warn('[formService] No authenticated user found.');
      return []; // Or throw new Error('User not authenticated'); depending on desired strictness
    }

    const { data: formRows, error: queryError } = await supabase
      .from('forms')
      .select('id, title, created_at, updated_at, status')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .returns<Partial<FormRow>[]>(); // Expecting an array of partial FormRow objects

    if (queryError) {
      console.error('[formService] Error fetching form summaries:', queryError);
      throw new Error(`Failed to fetch form summaries: ${queryError.message}`);
    }

    if (!formRows) {
      console.log('[formService] No form summaries found for user:', user.id);
      return [];
    }

    const formSummaries: FormSummary[] = formRows.map(row => {
      // Basic validation for essential fields from Partial<FormRow>
      if (!row.id || !row.title || !row.created_at || !row.updated_at || !row.status) {
        console.warn('[formService] Encountered partial form data, skipping item:', row);
        return null; // Will be filtered out later
      }
      return {
        id: row.id,
        title: row.title,
        createdAt: row.created_at,
        lastModified: row.updated_at, // Mapping updated_at to lastModified
        status: row.status as FormStatus, // Assuming status in DB matches FormStatus
        // TODO: Implement performant response count fetching (e.g., denormalized counter in DB or a separate view/RPC)
        responseCount: 0, 
      };
    }).filter(summary => summary !== null) as FormSummary[]; // Filter out nulls and assert type

    console.log(`[formService] Successfully fetched ${formSummaries.length} form summaries for user ${user.id}.`);
    return formSummaries;

  } catch (error) {
    console.error('[formService] Unexpected error in WorkspaceUserFormSummaries:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching form summaries.');
  }
};

// export const duplicateFormAPI = async (formId: string, currentTitle: string): Promise<FormSummary> => {
//   console.log(`[formService] duplicateFormAPI called for formId: ${formId}, title: ${currentTitle}`);
//   await new Promise(resolve => setTimeout(resolve, 300));
//   const originalForm = mockFormsStore.find(f => f.id === formId);
//   if (!originalForm) {
//     console.error(`[formService] Mock API error: Form with id ${formId} not found for duplication.`);
//     throw new Error('Mock API Error: Original form not found.');
//   }
//   const newForm: FormSummary = {
//     ...originalForm,
//     id: `form${Date.now()}`,
//     title: `${currentTitle} (Copy)`,
//     status: 'draft',
//     responseCount: 0,
//     createdAt: new Date().toISOString(),
//     lastModified: new Date().toISOString(),
//   };
//   mockFormsStore.unshift(newForm);
//   console.log('[formService] Duplicated form, new form:', newForm);
//   return newForm;
// };

export const duplicateFormAPI = async (formIdToDuplicate: string, newTitle?: string): Promise<FormSummary> => {
  console.log(`[formService] duplicateFormAPI called for formId: ${formIdToDuplicate}, newTitle: ${newTitle}`);
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('[formService] Authentication error during duplication:', authError);
      throw new Error('User not authenticated or session expired. Cannot duplicate form.');
    }

    // 1. Fetch the full FormDefinition of the form to duplicate
    const originalFormDefinition = await getFormById(formIdToDuplicate);

    // Ensure the user owns the form they are trying to duplicate
    if (originalFormDefinition.userId !== user.id) {
      console.error(`[formService] User ${user.id} attempted to duplicate form ${formIdToDuplicate} owned by ${originalFormDefinition.userId}.`);
      throw new Error('Permission denied. You can only duplicate your own forms.');
    }

    // 2. Modify the fetched definition for the new form
    const newFormId = crypto.randomUUID();
    const currentTime = new Date().toISOString();

    const duplicatedSections: FormSectionDefinition[] = originalFormDefinition.sections.map(section => ({
      ...section,
      id: crypto.randomUUID(), // Regenerate section ID
      fields: section.fields.map(field => ({
        ...field,
        id: crypto.randomUUID(), // Regenerate field ID
        // Ensure conditionalLogic sourceFieldIds are updated if we implement that feature more deeply
        // For now, just regenerating IDs is the primary concern for duplication.
        // If conditional logic refers to old IDs, it would break. This is a deeper topic.
        // TODO: Handle re-mapping of field IDs in conditionalLogic and advancedValidationRules if they reference other field IDs.
      })),
    }));

    const newFormDefinitionData: Omit<FormDefinition, 'createdAt' | 'updatedAt'> & { userId: string; sections: FormSectionDefinition[] } = {
      ...originalFormDefinition,
      id: newFormId,
      title: newTitle || `${originalFormDefinition.title} (Copy)`,
      status: 'draft', // New duplicated forms are drafts
      version: 1, // Reset version or increment originalFormDefinition.version + 1 ? For MVP, reset to 1.
      userId: user.id, // Set current user as owner
      sections: duplicatedSections,
      // Clear fields that should be unique to a new form instance or re-evaluated
      customSuccessMessage: originalFormDefinition.customSuccessMessage, // Retain or clear? For now, retain.
      redirectUrl: originalFormDefinition.redirectUrl, // Retain or clear? For now, retain.
      // createdAt and updatedAt will be set by DB or insert payload
    };

    // 3. Insert the new form definition
    const insertPayload: FormInsertPayload = {
      id: newFormDefinitionData.id,
      user_id: newFormDefinitionData.userId,
      title: newFormDefinitionData.title,
      description: newFormDefinitionData.description,
      status: newFormDefinitionData.status,
      version: newFormDefinitionData.version,
      definition_sections: newFormDefinitionData.sections as unknown as Json, // Cast sections to Json
      custom_success_message: newFormDefinitionData.customSuccessMessage,
      redirect_url: newFormDefinitionData.redirectUrl,
      created_at: currentTime, // Set explicitly for the new record
      updated_at: currentTime, // Set explicitly for the new record
    };

    const { data: newFormRow, error: insertError } = await supabase
      .from('forms')
      .insert(insertPayload)
      .select('id, title, created_at, updated_at, status')
      .single<Partial<FormRow>>();

    if (insertError || !newFormRow) {
      console.error('[formService] Error inserting duplicated form:', insertError);
      throw new Error(`Failed to duplicate form: ${insertError?.message || 'No data returned after insert'}`);
    }

    // 4. Map the newly created Supabase record back to a FormSummary
    if (!newFormRow.id || !newFormRow.title || !newFormRow.created_at || !newFormRow.updated_at || !newFormRow.status) {
      console.error('[formService] Inserted duplicated form data is incomplete:', newFormRow);
      throw new Error('Failed to create a complete form summary for the duplicated form.');
    }

    const formSummary: FormSummary = {
      id: newFormRow.id,
      title: newFormRow.title,
      createdAt: newFormRow.created_at,
      lastModified: newFormRow.updated_at,
      status: newFormRow.status as FormStatus,
      responseCount: 0, // New forms have 0 responses
    };

    console.log(`[formService] Form ${formIdToDuplicate} duplicated successfully as new form ${formSummary.id}.`);
    return formSummary;

  } catch (error) {
    console.error(`[formService] Unexpected error in duplicateFormAPI for formId ${formIdToDuplicate}:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while duplicating the form.');
  }
};

export const deleteFormAPI = async (formId: string): Promise<void> => {
  console.log(`[formService] deleteFormAPI called for formId: ${formId}`);
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('[formService] Authentication error:', authError);
      throw new Error('User not authenticated or session expired for delete operation.');
    }
    if (!user) {
      console.warn('[formService] No authenticated user found for delete operation.');
      // Depending on desired behavior, could throw error or return early
      throw new Error('User not authenticated, cannot delete form.'); 
    }

    const { error: deleteError } = await supabase
      .from('forms')
      .delete()
      .eq('id', formId)
      .eq('user_id', user.id); // Ensure user can only delete their own forms

    if (deleteError) {
      console.error(`[formService] Error deleting form ${formId}:`, deleteError);
      // It might be useful to check if the error was due to the form not being found
      // vs. a more general DB error. Supabase errors often include a code.
      // For MVP, a general error is acceptable.
      throw new Error(`Failed to delete form: ${deleteError.message}`);
    }

    console.log(`[formService] Form ${formId} deleted successfully (or did not exist for this user).`);
    // Note: Supabase delete doesn't error if the row to delete doesn't exist, 
    // as long as the query itself is valid. The .eq('user_id', user.id) ensures security.
  } catch (error) {
    console.error(`[formService] Unexpected error in deleteFormAPI for formId ${formId}:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while deleting the form.');
  }
};

// Placeholder for creating a new blank form - to be used by CreateFormButton
// export const createNewBlankForm = async (title: string = "Untitled Form"): Promise<FormSummary> => {
//   console.log(`[formService] createNewBlankForm called with title: ${title}`);
//   await new Promise(resolve => setTimeout(resolve, 300));
//   const newForm: FormSummary = {
//     id: `form${Date.now()}`,
//     title: title,
//     status: 'draft',
//     responseCount: 0,
//     createdAt: new Date().toISOString(),
//     lastModified: new Date().toISOString(),
//   };
//   // mockFormsStore.unshift(newForm);
//   console.log('[formService] Created new blank form:', newForm);
//   return newForm;
// };

export const createNewBlankForm = async (defaultTitle: string = "Untitled Form"): Promise<FormDefinition> => {
  console.log(`[formService] createNewBlankForm called with title: ${defaultTitle}`);
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('[formService] Authentication error during new form creation:', authError);
      throw new Error('User not authenticated or session expired. Cannot create form.');
    }

    const currentTime = new Date().toISOString();
    const newFormId = crypto.randomUUID();
    const defaultSectionId = crypto.randomUUID();
    const defaultFieldId = crypto.randomUUID();

    // Construct the full FormDefinition for the new blank form
    const newFormDefinition: FormDefinition = {
      id: newFormId,
      title: defaultTitle,
      description: '',
      sections: [
        {
          id: defaultSectionId,
          title: 'Section 1',
          description: '',
          fields: [
            {
              id: defaultFieldId,
              type: 'text',
              name: `text_field_${defaultFieldId.substring(0, 6)}`,
              label: 'Short Text',
              description: '',
              placeholder: '',
              isRequired: false,
              isHidden: false,
              // Initialize all other optional FormFieldDefinition properties to undefined or sensible defaults
              defaultValue: undefined,
              minLength: undefined,
              maxLength: undefined,
              rows: undefined,
              min: undefined,
              max: undefined,
              dateFormat: undefined,
              minDate: undefined,
              maxDate: undefined,
              maxFileSizeMB: undefined,
              allowedFileTypes: [],
              maxRating: 5,
              ratingType: 'star',
              options: [],
              allowMultipleSelection: false,
              allowOther: false,
              level: undefined,
              content: undefined,
              conditionalLogic: [],
              advancedValidationRules: [],
              styleOptions: {},
            },
          ],
        },
      ],
      customSuccessMessage: undefined,
      redirectUrl: undefined,
      version: 1,
      userId: user.id,
      createdAt: currentTime,
      updatedAt: currentTime,
      status: 'draft',
    };

    // Prepare the payload for Supabase insertion
    const insertPayload: FormInsertPayload = {
      id: newFormDefinition.id,
      user_id: newFormDefinition.userId,
      created_at: newFormDefinition.createdAt,
      updated_at: newFormDefinition.updatedAt,
      title: newFormDefinition.title,
      description: newFormDefinition.description,
      status: newFormDefinition.status,
      version: newFormDefinition.version,
      definition_sections: newFormDefinition.sections as unknown as Json, // Cast sections to Json
      custom_success_message: newFormDefinition.customSuccessMessage,
      redirect_url: newFormDefinition.redirectUrl,
    };

    const { error: insertError } = await supabase
      .from('forms')
      .insert(insertPayload)
      // We don't strictly need to .select() here if we return the client-constructed newFormDefinition,
      // but doing so and checking for error confirms the insert worked as expected.
      // .select('id') // Select minimal data to confirm insert
      // .single(); // Expect one row back

    if (insertError) {
      console.error('[formService] Error inserting new blank form:', insertError);
      throw new Error(`Failed to create new form: ${insertError.message}`);
    }

    console.log(`[formService] New blank form ${newFormDefinition.id} created successfully for user ${user.id}.`);
    // Return the locally constructed FormDefinition object, as it's already complete and accurate.
    return newFormDefinition;

  } catch (error) {
    console.error(`[formService] Unexpected error in createNewBlankForm:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while creating the new form.');
  }
};

// Function to submit form responses
export const submitFormResponse = async (
  formId: string,
  responseData: FormValues // This is our internal type for form submission data
): Promise<void> => {
  console.log(`[formService] Attempting to submit response for formId: ${formId}`, responseData);

  const insertPayload: FormResponseInsertPayload = {
    form_id: formId,
    data: responseData as Json, // Ensure this is 'as Json' and not 'as unknown as X'
    // created_at and submitted_at will be set by default by Supabase or here if needed
    // id will be auto-generated by Supabase
  };

  try {
    // The following line should no longer have a linter error if Supabase client is correctly typed with full Database schema
    const { data, error } = await supabase
      .from('form_responses') // Ensure this is your actual table name
      .insert(insertPayload)
      .select(); // Optionally select to confirm insert or get generated values

    if (error) {
      console.error('Error submitting form response to Supabase:', error);
      // More specific error based on Supabase error codes could be useful
      // e.g., if (error.code === '23503') { /* foreign key violation */ }
      throw new Error(`Supabase error submitting response for form (ID: ${formId}): ${error.message} (Code: ${error.code})`);
    }

    console.log(`Form response for form ${formId} submitted successfully. Response data:`, data);
    // Potentially return some part of 'data' if needed, e.g., the new response ID

  } catch (error) {
    console.error(`Unexpected error in submitFormResponse for form ID ${formId}:`, error);
    if (error instanceof Error && error.message.startsWith('Supabase error')) {
        throw error; // Re-throw Supabase-specific errors directly
    }
    // Ensure a generic error is thrown if it's not already an Error instance
    throw new Error(`Failed to submit form response (ID: ${formId}): ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Type guard for FormValues (must be a non-null object, not an array)
function isFormValuesObject(value: Json): value is FormResponseDataSupabase { 
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Function to fetch form responses for a given form ID
export const getFormResponsesByFormId = async (formId: string): Promise<FormResponse[]> => {
  console.log(`[formService] Fetching responses for formId: ${formId}`);
  try {
    // The following line should no longer have a linter error if Supabase client is correctly typed
    const { data: responseRows, error } = await supabase 
      .from('form_responses')
      .select('id, form_id, created_at, submitted_at, data')
      .eq('form_id', formId)
      .order('submitted_at', { ascending: false })
      .returns<FormResponseRow[]>();

    if (error) {
      console.error(`Error fetching responses for form ${formId} from Supabase:`, error);
      throw new Error(`Failed to fetch responses: ${error.message}`);
    }

    if (!responseRows) {
      console.warn(`No responses found for form ${formId}, or data is null.`);
      return [];
    }

    const mappedResponses: FormResponse[] = responseRows.map((row: FormResponseRow) => {
      let processedData: FormResponseDataSupabase = {}; // Default to empty object
      if (isFormValuesObject(row.data)) {
        // Type predicate 'isFormValuesObject' narrows row.data.
        // If FormResponseDataSupabase is e.g. Record<string, any> (aliased as FormValues),
        // this direct assignment is type-safe.
        processedData = row.data; 
      } else {
        // Log a warning if data is not in the expected object format
        console.warn(`[formService] Malformed data encountered for response ID ${row.id} in form ${formId}. Expected object, got:`, typeof row.data);
      }
      return {
        id: row.id,
        formId: row.form_id,
        submittedAt: row.submitted_at, // Assuming submitted_at exists and is correctly typed
        data: processedData,
      };
    });

    console.log(`[formService] Successfully fetched ${mappedResponses.length} responses for form ${formId}.`);
    return mappedResponses;

  } catch (error) {
    console.error(`Error in getFormResponsesByFormId for form ${formId}:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`An unexpected error occurred while fetching responses for form ${formId}.`);
  }
};
