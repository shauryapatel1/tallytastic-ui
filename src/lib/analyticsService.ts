import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsMetrics {
  views: number;
  starts: number;
  completes: number;
  completionRate: number;
  avgTime: number | null; // in seconds
  dailyTrend: Array<{ date: string; views: number; starts: number; completes: number }>;
  dropOffPoints?: Array<{ fieldId: string; dropOffs: number }>;
}

/**
 * Compute analytics metrics from form_events and form_responses
 */
export async function getFormAnalyticsMetrics(formId: string): Promise<AnalyticsMetrics> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");
    
    // Verify form ownership
    const { data: formData, error: formError } = await supabase
      .from("forms")
      .select("user_id")
      .eq("id", formId)
      .single();
      
    if (formError) throw formError;
    if (!formData || formData.user_id !== userData.user.id) {
      throw new Error("You don't have permission to access this analytics data");
    }
    
    // Fetch all events for this form
    const { data: events, error: eventsError } = await supabase
      .from("form_events")
      .select("*")
      .eq("form_id", formId)
      .order("at", { ascending: true });
      
    if (eventsError) throw eventsError;
    
    // Fetch all responses for this form
    const { data: responses, error: responsesError } = await supabase
      .from("form_responses")
      .select("*")
      .eq("form_id", formId);
      
    if (responsesError) throw responsesError;
    
    // Calculate metrics
    const viewEvents = events?.filter(e => e.event_type === 'view') || [];
    const startEvents = events?.filter(e => e.event_type === 'start') || [];
    const completeEvents = events?.filter(e => e.event_type === 'complete') || [];
    
    const views = viewEvents.length;
    const starts = startEvents.length;
    const completes = responses?.length || 0;
    const completionRate = starts > 0 ? Math.round((completes / starts) * 100) : 0;
    
    // Calculate average completion time
    let avgTime: number | null = null;
    const sessionTimes: number[] = [];
    
    // Group events by session_id
    const sessionMap = new Map<string, any[]>();
    events?.forEach(event => {
      if (event.session_id) {
        if (!sessionMap.has(event.session_id)) {
          sessionMap.set(event.session_id, []);
        }
        sessionMap.get(event.session_id)!.push(event);
      }
    });
    
    // Calculate time for each completed session
    sessionMap.forEach((sessionEvents) => {
      const startEvent = sessionEvents.find(e => e.event_type === 'start');
      const completeEvent = sessionEvents.find(e => e.event_type === 'complete');
      
      if (startEvent && completeEvent) {
        const startTime = new Date(startEvent.at).getTime();
        const completeTime = new Date(completeEvent.at).getTime();
        const duration = (completeTime - startTime) / 1000; // in seconds
        
        // Only include reasonable durations (less than 1 hour)
        if (duration > 0 && duration < 3600) {
          sessionTimes.push(duration);
        }
      }
    });
    
    if (sessionTimes.length > 0) {
      avgTime = Math.round(sessionTimes.reduce((a, b) => a + b, 0) / sessionTimes.length);
    }
    
    // Calculate daily trend (last 30 days)
    const dailyTrend: Array<{ date: string; views: number; starts: number; completes: number }> = [];
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });
    
    last30Days.forEach(date => {
      const dayViews = viewEvents.filter(e => e.at.startsWith(date)).length;
      const dayStarts = startEvents.filter(e => e.at.startsWith(date)).length;
      const dayCompletes = responses?.filter(r => r.submitted_at.startsWith(date)).length || 0;
      
      dailyTrend.push({
        date,
        views: dayViews,
        starts: dayStarts,
        completes: dayCompletes
      });
    });
    
    // Calculate drop-off points
    const dropOffEvents = events?.filter(e => e.event_type === 'drop_off') || [];
    const dropOffMap = new Map<string, number>();
    
    dropOffEvents.forEach(event => {
      if (event.meta && typeof event.meta === 'object' && 'fieldId' in event.meta) {
        const fieldId = event.meta.fieldId as string;
        if (fieldId) {
          dropOffMap.set(fieldId, (dropOffMap.get(fieldId) || 0) + 1);
        }
      }
    });
    
    const dropOffPoints = Array.from(dropOffMap.entries())
      .map(([fieldId, dropOffs]) => ({ fieldId, dropOffs }))
      .sort((a, b) => b.dropOffs - a.dropOffs);
    
    return {
      views,
      starts,
      completes,
      completionRate,
      avgTime,
      dailyTrend,
      dropOffPoints: dropOffPoints.length > 0 ? dropOffPoints : undefined
    };
  } catch (error) {
    console.error(`Error getting analytics metrics for form ${formId}:`, error);
    throw error;
  }
}
