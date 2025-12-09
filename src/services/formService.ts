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
import { trackFormCreated } from "@/lib/posthogService";

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
        "id, title, description, user_id, created_at, updated_at, status, version, custom_success_message, redirect_url, definition_sections, submit_button_text"
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
      settings: {
        // submitButtonText: data.submit_button_text || 'Submit', // Not in schema
      },
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
    // submit_button_text: formDefinition.settings?.submitButtonText, // Not in schema
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
      // submit_button_text: newFormDefinitionData.settings?.submitButtonText, // Not in schema
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
      settings: {
        submitButtonText: 'Submit',
      },
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
      // submit_button_text: newFormDefinition.settings?.submitButtonText, // Not in schema
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

    // Track form creation in PostHog
    trackFormCreated(newFormDefinition.id, {
      form_title: newFormDefinition.title,
      field_count: 1,
      section_count: 1,
    });

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

export const submitFormResponse = async (
  formId: string,
  responseData: FormValues, // FormValues is Record<string, any>
  metadata?: Record<string, any> // Optional metadata for UTM, referrer, hidden fields
): Promise<void> => {
  // Log the submission attempt with only essential, non-sensitive info
  console.log(
    `[formService] Attempting to submit response for formId: ${formId}. Response data keys: ${Object.keys(
      responseData
    ).join(", ")}`
  );

  // Validate formId (basic check)
  if (!formId || typeof formId !== "string") {
    console.error(
      "[formService] Invalid formId provided for submission:",
      formId
    );
    throw new Error("Invalid form ID provided for submission.");
  }

  // Validate responseData (basic check that it's an object and not an array)
  if (!responseData || typeof responseData !== "object" || Array.isArray(responseData)) {
    console.error(
      "[formService] Invalid responseData provided for submission (must be a non-array object):",
      responseData
    );
    throw new Error("Invalid response data provided for submission (must be a non-array object).");
  }

  // Merge response data with metadata
  const fullResponseData = {
    ...responseData,
    ...(metadata && { _metadata: metadata })
  };

  const insertPayload: FormResponseInsertPayload = {
    form_id: formId,
    data: fullResponseData as Json,
    // 'submitted_at' and 'id' are typically handled by database defaults or triggers.
  };

  try {
    // With the Supabase client now fully typed (as per user confirmation),
    // this call to supabase.from('form_responses').insert(...) is type-checked.
    // The 'form_responses' table name should be recognized by TypeScript, and
    // 'insertPayload' must conform to Database["public"]["Tables"]["form_responses"]["Insert"].
    // The previous linter error regarding table recognition should be resolved.
    const { error, data: insertedData } = await supabase // insertedData can be used for logging or confirmation
      .from("form_responses")
      .insert(insertPayload)
      .select(); // Optionally .select() to get the inserted row(s) back.

    if (error) {
      console.error(
        `[formService] Supabase error submitting form response for formId ${formId}:`,
        error
      );
      // Specific error handling (e.g., for constraint violations like duplicate submissions based on a unique key) could be added here.
      throw new Error(
        `Failed to submit form response for form ${formId}: ${error.message} (Code: ${error.code})`
      );
    }

    // For debugging or confirmation, you could log details from insertedData:
    // if (insertedData && insertedData.length > 0) {
    //   console.log(`[formService] Form response successfully submitted. Inserted ID: ${insertedData[0].id}, Full data:`, insertedData[0]);
    // } else if (insertedData) { // If insertedData is an empty array (e.g. if RLS prevented select)
    //   console.log(`[formService] Form response successfully submitted for formId: ${formId}, but no data returned from select (possibly RLS).`);
    // } else { // If insertedData is null (should not happen with .select() unless error, but defensive)
    //   console.log(`[formService] Form response successfully submitted for formId: ${formId}. Null data returned from select().`);
    // }
     console.log(
      `[formService] Form response successfully submitted for formId: ${formId}`
    );

  } catch (error) {
    console.error(
      `[formService] Unexpected error in submitFormResponse for formId ${formId}:`,
      error
    );
    // Re-throw the error, preserving specific Supabase error details if available.
    if (error instanceof Error) {
      // If it's the specific error we threw from the Supabase error block, re-throw it directly.
      if (error.message.startsWith(`Failed to submit form response for form ${formId}:`)) {
          throw error;
      }
      // Otherwise, wrap it if it's a more generic error caught during the try block.
      throw new Error(`An unexpected error occurred while submitting the form response for form ${formId}: ${error.message}`);
    }
    // Fallback for non-Error objects being thrown (less common in modern TypeScript but good for robustness).
    throw new Error(`An unknown and unexpected error occurred while submitting the form response for form ${formId}.`);
  }
};

// Type guard to check if the value is a valid FormResponseDataSupabase object
// This is a basic structural check; more specific validation might be needed
// depending on the expected structure of individual field responses within 'data'.
// Note: FormResponseDataSupabase is an alias for Json, so this primarily checks if it's an object.
function isFormValuesObject(value: Json): value is FormResponseDataSupabase { 
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Function to fetch form responses for a given form ID
export const getFormResponsesByFormId = async (formId: string): Promise<FormResponse[]> => {
  console.log(`[formService] Fetching responses for formId: ${formId}`);
  try {
    // With the Supabase client now fully typed, this call is type-checked.
    // The 'form_responses' table name should be recognized by TypeScript.
    const { data: responseRows, error } = await supabase 
      .from('form_responses')
      .select('id, form_id, submitted_at, data') // Removed created_at as it's not used in FormResponse
      .eq('form_id', formId)
      .order('submitted_at', { ascending: false })
      .returns<FormResponseRow[]>(); // Ensures responseRows is typed as FormResponseRow[]

    if (error) {
      console.error(`[formService] Error fetching responses for form ${formId} from Supabase:`, error);
      throw new Error(`Failed to fetch responses for form ${formId}: ${error.message} (Code: ${error.code})`);
    }

    if (!responseRows) {
      console.warn(`[formService] No responses found for form ${formId}, or Supabase returned null data.`);
      return [];
    }

    const mappedResponses: FormResponse[] = responseRows.map((row: FormResponseRow) => {
      // Initialize processedData as an empty object, conforming to FormValues (Record<string, any>).
      // FormResponseDataSupabase is an alias for Json. The type guard ensures row.data is an object if true.
      let processedData: FormValues = {}; 

      if (row.data && isFormValuesObject(row.data)) {
        // The type guard confirms row.data is a Json object. 
        // A Json object is assignable to FormValues (Record<string, any>).
        processedData = row.data;
      } else if (row.data !== null) {
        // Log a warning if data is present but not in the expected object format (e.g., it's a string, number, or array at the root).
        console.warn(
          `[formService] Malformed data encountered for response ID ${row.id} in form ${formId}. Expected a JSON object, got: ${typeof row.data}. Response data will be empty.`, 
          row.data
        );
      }
      // If row.data is null, processedData remains {}, which is the desired default.

      return {
        id: row.id,
        formId: row.form_id,
        submittedAt: row.submitted_at, // row.submitted_at is string | null, matches FormResponse.submittedAt
        data: processedData, // processedData is FormValues (Record<string, any>)
      };
    });

    console.log(`[formService] Successfully fetched ${mappedResponses.length} responses for form ${formId}.`);
    return mappedResponses;

  } catch (error) {
    console.error(`[formService] Unexpected error in getFormResponsesByFormId for form ${formId}:`, error);
    if (error instanceof Error) {
      // If it's the specific error we threw from the Supabase error block, re-throw it directly.
      if (error.message.startsWith(`Failed to fetch responses for form ${formId}:`)) {
        throw error;
      }
      // Otherwise, wrap it if it's a more generic error caught during the try block.
      throw new Error(`An unexpected error occurred while fetching responses for form ${formId}: ${error.message}`);
    }
    // Fallback for non-Error objects being thrown.
    throw new Error(`An unknown and unexpected error occurred while fetching responses for form ${formId}.`);
  }
};

// --- User Account Management ---

/**
 * Initiates the process of deleting a user's account.
 * This involves signing the user out locally and then invoking a Supabase Edge Function
 * to securely delete their authentication record and all associated data from the backend.
 *
 * @returns {Promise<{ error?: Error | null }>} An object indicating success (error is null) or failure (error is an Error object).
 */
export const deleteUserAccount = async (): Promise<{ error?: Error | null }> => {
  console.log("[formService] Attempting to delete user account.");

  // 1. Sign out locally first
  // We proceed with backend deletion even if local sign-out fails,
  // as data removal is the primary goal.
  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) {
    console.warn("[formService] Error during local sign-out while deleting account:", signOutError);
    // Do not return here; proceed to attempt backend deletion.
  } else {
    console.log("[formService] User signed out locally as part of account deletion.");
  }

  // 2. Invoke Supabase Edge Function to perform secure backend deletion
  try {
    console.log("[formService] Invoking 'delete-user-account' Edge Function.");
    // Type parameters for invoke: <FunctionName extends string, FunctionArgs, FunctionReturnData>
    // We expect the Edge Function to return a JSON object, possibly with an 'error' field if it fails.
    const { data: functionResponseData, error: functionInvokeError } = await supabase.functions.invoke<{ message?: string; error?: string } | null>(
      'delete-user-account', 
      {} // No body needed as the Edge Function derives user ID from its auth context
    );

    if (functionInvokeError) {
      console.error("[formService] Error invoking 'delete-user-account' Edge Function:", functionInvokeError);
      return { error: new Error(functionInvokeError.message || "Failed to invoke account deletion function.") };
    }

    // Check if the function itself returned an error in its response body
    // (e.g. if the Edge Function returns a 200 OK but with an error message in the JSON payload)
    if (functionResponseData && functionResponseData.error) {
      console.error("[formService] 'delete-user-account' Edge Function returned an error in its response:", functionResponseData.error);
      return { error: new Error(functionResponseData.error) };
    }
    
    // Type guard to ensure functionResponseData has a message property if no error.
    const hasMessage = (response: any): response is { message: string } => {
      return response && typeof response.message === 'string';
    };

    if (hasMessage(functionResponseData)) {
        console.log(`[formService] 'delete-user-account' Edge Function successful: ${functionResponseData.message}`);
    } else {
        console.log("[formService] 'delete-user-account' Edge Function completed (no specific message returned).");
    }
    
    return { error: null }; // Success

  } catch (e) {
    console.error("[formService] Unexpected error during 'delete-user-account' Edge Function invocation or processing:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred during account deletion.";
    return { error: new Error(errorMessage) };
  }
};
