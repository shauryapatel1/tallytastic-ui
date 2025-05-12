
import { supabase } from "@/integrations/supabase/client";
import { Form, FormField } from "@/lib/types";

// Get form by ID
export const getFormById = async (id: string): Promise<Form> => {
  try {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    
    return {
      ...data,
      fields: data.fields as unknown as FormField[]
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
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      fields: data.fields as unknown as FormField[]
    } as Form;
  } catch (error) {
    console.error(`Error updating form fields ${id}:`, error);
    throw error;
  }
};
