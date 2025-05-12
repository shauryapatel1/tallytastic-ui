
import { supabase } from "@/integrations/supabase/client";
import { FormResponse } from "./types";

/**
 * Get all responses for a specific form
 */
export async function getFormResponses(formId: string): Promise<FormResponse[]> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");
    
    // First check if the user owns this form
    const { data: formData, error: formError } = await supabase
      .from("forms")
      .select("user_id")
      .eq("id", formId)
      .single();
      
    if (formError) throw formError;
    if (!formData || formData.user_id !== userData.user.id) {
      throw new Error("You don't have permission to access these responses");
    }
    
    // Now fetch the responses
    const { data, error } = await supabase
      .from("form_responses" as any)
      .select("*")
      .eq("form_id", formId);
      
    if (error) throw error;
    
    if (!data) return [];
    
    // Transform the data to match our FormResponse interface
    return data.map(item => ({
      id: item.id,
      form_id: item.form_id,
      submitted_at: item.submitted_at,
      data: item.response_data,
      metadata: item.metadata || {}
    })) as FormResponse[];
  } catch (error) {
    console.error(`Error fetching responses for form ${formId}:`, error);
    throw error;
  }
}

/**
 * Get analytics data for a specific form
 */
export async function getFormAnalytics(formId: string) {
  try {
    const responses = await getFormResponses(formId);
    
    // Calculate basic analytics
    const totalResponses = responses.length;
    const responsesByDate = responses.reduce((acc, response) => {
      const date = new Date(response.submitted_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Extract unique browsers
    const browsers = responses.reduce((acc, response) => {
      const browser = response.metadata?.browser || 'Unknown';
      
      // Simple browser detection
      let browserName = 'Other';
      if (browser.includes('Chrome')) browserName = 'Chrome';
      else if (browser.includes('Firefox')) browserName = 'Firefox';
      else if (browser.includes('Safari')) browserName = 'Safari';
      else if (browser.includes('Edge')) browserName = 'Edge';
      
      acc[browserName] = (acc[browserName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate completion rate (if available in metadata)
    const completionRates = responses
      .filter(r => r.metadata?.completionRate !== undefined)
      .map(r => r.metadata.completionRate);
    
    const avgCompletionRate = completionRates.length > 0 
      ? completionRates.reduce((sum, rate) => sum + (rate || 0), 0) / completionRates.length
      : null;
    
    return {
      totalResponses,
      responsesByDate,
      browsers,
      avgCompletionRate,
      lastSubmission: responses.length > 0 ? responses[0].submitted_at : null,
    };
  } catch (error) {
    console.error(`Error getting analytics for form ${formId}:`, error);
    throw error;
  }
}
