import { supabase } from "@/integrations/supabase/client";
import { Form, FormField, FormSummary, FormStatus } from "@/types/forms";

// Get form by ID
export const getFormById = async (id: string): Promise<Form> => {
  try {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Form not found or data is null");

    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      fields: data.fields as unknown as FormField[],
      status: data.published ? 'published' : 'draft',
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Form;
  } catch (error) {
    console.error(`Error fetching form ${id}:`, error);
    throw error;
  }
};

// Update form fields
export const updateFormFields = async (id: string, fields: FormField[]): Promise<Form> => {
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
      fields: data.fields as unknown as FormField[],
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
