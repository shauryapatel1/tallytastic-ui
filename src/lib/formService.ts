import { supabase } from "@/integrations/supabase/client";
import { FormDefinition } from "@/types/forms";

export const formService = {
  async getFormById(formId: string): Promise<FormDefinition> {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Form not found');

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      sections: typeof data.definition_sections === 'string' 
        ? JSON.parse(data.definition_sections) 
        : data.definition_sections || [],
      customSuccessMessage: data.custom_success_message,
      redirectUrl: data.redirect_url,
      version: data.version || 1,
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      status: data.status as any
    };
  },

  async updateForm(formId: string, updates: Partial<FormDefinition>): Promise<void> {
    const { error } = await supabase
      .from('forms')
      .update({
        title: updates.title,
        description: updates.description,
        status: updates.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', formId);

    if (error) throw error;
  }
};

export const responseService = {
  async getFormResponses(formId: string) {
    const { data, error } = await supabase
      .from('form_responses')
      .select('*')
      .eq('form_id', formId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    
    return data?.map(row => ({
      id: row.id,
      formId: row.form_id,
      submittedAt: row.submitted_at,
      data: row.data
    })) || [];
  }
};