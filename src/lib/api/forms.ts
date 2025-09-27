import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { 
  FormDefinition, 
  FormSectionDefinition, 
  FormStatus,
  parseFormDefinition,
  validateFormDefinition 
} from "@/lib/form/types";

// Supabase table types
type FormRow = Database['public']['Tables']['forms']['Row'];
type FormInsert = Database['public']['Tables']['forms']['Insert'];
type FormUpdate = Database['public']['Tables']['forms']['Update'];
type FormEventRow = Database['public']['Tables']['form_events']['Row'];
type FormEventInsert = Database['public']['Tables']['form_events']['Insert'];

// Analytics interfaces
export interface FormAnalyticsSummary {
  views: number;
  starts: number;
  completes: number;
  completionRate: number;
  avgTime: number | null;
  dropOffPoints: Array<{
    fieldId: string;
    dropOffs: number;
  }>;
}

export interface FormListItem {
  id: string;
  title: string;
  description: string | null;
  status: FormStatus;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
  responseCount?: number;
}

// Data mappers
export class FormMapper {
  /**
   * Convert Supabase form row to FormDefinition
   */
  static fromSupabaseRow(row: FormRow): FormDefinition {
    const sectionsData = Array.isArray(row.definition_sections) 
      ? row.definition_sections as FormSectionDefinition[]
      : [];

    return {
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      sections: sectionsData,
      status: row.status as FormStatus,
      settings: {
        submitButtonText: 'Submit',
        customSuccessMessage: row.custom_success_message || undefined,
        redirectUrl: row.redirect_url || undefined,
        allowMultipleSubmissions: true,
        collectEmail: false,
        requireLogin: false
      },
      version: row.version,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  /**
   * Convert FormDefinition to Supabase insert data
   */
  static toSupabaseInsert(form: Partial<FormDefinition>, userId: string): FormInsert {
    return {
      title: form.title || 'Untitled Form',
      description: form.description || null,
      definition_sections: form.sections || [],
      status: form.status || 'draft',
      custom_success_message: form.settings?.customSuccessMessage || null,
      redirect_url: form.settings?.redirectUrl || null,
      version: form.version || 1,
      user_id: userId,
      slug: null // Will be generated later if needed
    };
  }

  /**
   * Convert FormDefinition to Supabase update data
   */
  static toSupabaseUpdate(form: Partial<FormDefinition>): FormUpdate {
    const updateData: FormUpdate = {};
    
    if (form.title !== undefined) updateData.title = form.title;
    if (form.description !== undefined) updateData.description = form.description;
    if (form.sections !== undefined) updateData.definition_sections = form.sections;
    if (form.status !== undefined) updateData.status = form.status;
    if (form.settings?.customSuccessMessage !== undefined) {
      updateData.custom_success_message = form.settings.customSuccessMessage;
    }
    if (form.settings?.redirectUrl !== undefined) {
      updateData.redirect_url = form.settings.redirectUrl;
    }
    if (form.version !== undefined) updateData.version = form.version;

    return updateData;
  }
}

// Form API client
export class FormsApi {
  /**
   * List all forms for the current user
   */
  static async listForms(): Promise<FormListItem[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('forms')
      .select(`
        id,
        title,
        description,
        status,
        slug,
        created_at,
        updated_at,
        form_responses(count)
      `)
      .eq('user_id', userData.user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return data.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status as FormStatus,
      slug: row.slug,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      responseCount: Array.isArray(row.form_responses) ? row.form_responses.length : 0
    }));
  }

  /**
   * Get a single form by ID
   */
  static async getForm(id: string): Promise<FormDefinition> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', id)
      .eq('user_id', userData.user.id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Form not found');

    return FormMapper.fromSupabaseRow(data);
  }

  /**
   * Get a published form by ID (public access)
   */
  static async getPublishedForm(id: string): Promise<FormDefinition> {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Form not found or not published');

    return FormMapper.fromSupabaseRow(data);
  }

  /**
   * Create a new form
   */
  static async createForm(formData: Partial<FormDefinition>): Promise<FormDefinition> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    // Validate form definition if sections provided
    if (formData.sections) {
      try {
        parseFormDefinition({
          ...formData,
          id: 'temp',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        throw new Error(`Invalid form definition: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    const insertData = FormMapper.toSupabaseInsert(formData, userData.user.id);

    const { data, error } = await supabase
      .from('forms')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create form');

    return FormMapper.fromSupabaseRow(data);
  }

  /**
   * Update an existing form
   */
  static async updateForm(id: string, formData: Partial<FormDefinition>): Promise<FormDefinition> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    // Validate form definition if sections provided
    if (formData.sections) {
      try {
        parseFormDefinition({
          ...formData,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        throw new Error(`Invalid form definition: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    const updateData = FormMapper.toSupabaseUpdate(formData);

    const { data, error } = await supabase
      .from('forms')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userData.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Form not found or update failed');

    return FormMapper.fromSupabaseRow(data);
  }

  /**
   * Delete a form
   */
  static async deleteForm(id: string): Promise<void> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from('forms')
      .delete()
      .eq('id', id)
      .eq('user_id', userData.user.id);

    if (error) throw error;
  }

  /**
   * Publish a form
   */
  static async publishForm(id: string): Promise<FormDefinition> {
    return this.updateForm(id, { status: 'published' });
  }

  /**
   * Unpublish a form
   */
  static async unpublishForm(id: string): Promise<FormDefinition> {
    return this.updateForm(id, { status: 'draft' });
  }

  /**
   * Get analytics summary for a form
   */
  static async getAnalyticsSummary(formId: string): Promise<FormAnalyticsSummary> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    // Verify user owns the form
    const { data: formData, error: formError } = await supabase
      .from('forms')
      .select('user_id')
      .eq('id', formId)
      .single();

    if (formError) throw formError;
    if (!formData || formData.user_id !== userData.user.id) {
      throw new Error("You don't have permission to view these analytics");
    }

    // Get form events
    const { data: events, error: eventsError } = await supabase
      .from('form_events')
      .select('*')
      .eq('form_id', formId)
      .order('at', { ascending: true });

    if (eventsError) throw eventsError;

    // Calculate analytics
    const views = events?.filter(e => e.event_type === 'view').length || 0;
    const starts = events?.filter(e => e.event_type === 'start').length || 0;
    const completes = events?.filter(e => e.event_type === 'complete').length || 0;
    const dropOffs = events?.filter(e => e.event_type === 'drop_off') || [];

    // Calculate completion rate
    const completionRate = starts > 0 ? (completes / starts) * 100 : 0;

    // Calculate average completion time
    let avgTime: number | null = null;
    const completeSessions = new Map<string, { start?: string; complete?: string }>();
    
    events?.forEach(event => {
      if (!event.session_id) return;
      
      if (event.event_type === 'start') {
        const existing = completeSessions.get(event.session_id) || {};
        completeSessions.set(event.session_id, { ...existing, start: event.at });
      } else if (event.event_type === 'complete') {
        const existing = completeSessions.get(event.session_id) || {};
        completeSessions.set(event.session_id, { ...existing, complete: event.at });
      }
    });

    const completionTimes: number[] = [];
    completeSessions.forEach(({ start, complete }) => {
      if (start && complete) {
        const timeInMs = new Date(complete).getTime() - new Date(start).getTime();
        completionTimes.push(timeInMs / 1000); // Convert to seconds
      }
    });

    if (completionTimes.length > 0) {
      avgTime = completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length;
    }

    // Calculate drop-off points
    const dropOffPoints = dropOffs.reduce((acc, event) => {
      const fieldId = event.meta && typeof event.meta === 'object' && 'fieldId' in event.meta 
        ? String(event.meta.fieldId) 
        : 'unknown';
      
      const existing = acc.find(point => point.fieldId === fieldId);
      if (existing) {
        existing.dropOffs++;
      } else {
        acc.push({ fieldId, dropOffs: 1 });
      }
      return acc;
    }, [] as Array<{ fieldId: string; dropOffs: number }>);

    return {
      views,
      starts,
      completes,
      completionRate: Math.round(completionRate * 100) / 100,
      avgTime: avgTime ? Math.round(avgTime * 100) / 100 : null,
      dropOffPoints
    };
  }

  /**
   * Track a form event
   */
  static async trackEvent(
    formId: string, 
    eventType: 'view' | 'start' | 'complete' | 'page_next' | 'page_back' | 'drop_off',
    sessionId: string,
    meta?: Record<string, any>
  ): Promise<void> {
    const eventData: FormEventInsert = {
      form_id: formId,
      event_type: eventType,
      session_id: sessionId,
      meta: meta || {}
    };

    const { error } = await supabase
      .from('form_events')
      .insert(eventData);

    if (error) {
      console.error('Failed to track form event:', error);
      // Don't throw error for tracking failures to avoid disrupting user flow
    }
  }
}

// Export the API client as the default export
export default FormsApi;