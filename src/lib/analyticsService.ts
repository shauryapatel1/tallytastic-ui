import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsMetrics {
  views: number;
  starts: number;
  completes: number;
  completionRate: number;
  avgTime: number | null; // in seconds
  dailyTrend: Array<{ date: string; views: number; starts: number; completes: number }>;
  dropOffPoints?: Array<{ fieldId: string; fieldLabel: string; dropOffs: number }>;
  fieldStats?: Array<{
    fieldId: string;
    fieldLabel: string;
    fieldType: string;
    responseCount: number;
    fillRate: number;
    topValues?: Array<{ value: string; count: number; percentage: number }>;
  }>;
  weeklyComparison?: {
    thisWeek: number;
    lastWeek: number;
    percentageChange: number;
  };
  peakSubmissionHours?: Array<{ hour: number; count: number }>;
}

/**
 * Compute analytics metrics from form_events and form_responses
 */
export async function getFormAnalyticsMetrics(formId: string): Promise<AnalyticsMetrics> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");
    
    // Verify form ownership and get form definition
    const { data: formData, error: formError } = await supabase
      .from("forms")
      .select("user_id, definition_sections")
      .eq("id", formId)
      .single();
      
    if (formError) throw formError;
    if (!formData || formData.user_id !== userData.user.id) {
      throw new Error("You don't have permission to access this analytics data");
    }
    
    // Build field ID to label map
    const fieldMap = new Map<string, { label: string; type: string }>();
    const sections = Array.isArray(formData.definition_sections) ? formData.definition_sections : [];
    sections.forEach((section: any) => {
      const fields = Array.isArray(section.fields) ? section.fields : [];
      fields.forEach((field: any) => {
        if (field.id) {
          fieldMap.set(field.id, { 
            label: field.label || field.name || field.id,
            type: field.type || 'unknown'
          });
        }
      });
    });
    
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
    
    // Calculate drop-off points with field labels
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
      .map(([fieldId, dropOffs]) => ({
        fieldId,
        fieldLabel: fieldMap.get(fieldId)?.label || fieldId,
        dropOffs
      }))
      .sort((a, b) => b.dropOffs - a.dropOffs);
    
    // Calculate field-level statistics
    const fieldStats: AnalyticsMetrics['fieldStats'] = [];
    const totalResponses = responses?.length || 0;
    
    if (totalResponses > 0) {
      const fieldValueCounts = new Map<string, Map<string, number>>();
      const fieldResponseCounts = new Map<string, number>();
      
      responses?.forEach(response => {
        const data = response.data as Record<string, any>;
        if (data && typeof data === 'object') {
          Object.entries(data).forEach(([fieldId, value]) => {
            // Count responses per field
            if (value !== undefined && value !== null && value !== '') {
              fieldResponseCounts.set(fieldId, (fieldResponseCounts.get(fieldId) || 0) + 1);
              
              // Track value distribution for select/radio/checkbox fields
              const fieldInfo = fieldMap.get(fieldId);
              if (fieldInfo && ['select', 'radio', 'checkbox', 'rating'].includes(fieldInfo.type)) {
                if (!fieldValueCounts.has(fieldId)) {
                  fieldValueCounts.set(fieldId, new Map());
                }
                const valueStr = String(value);
                const counts = fieldValueCounts.get(fieldId)!;
                counts.set(valueStr, (counts.get(valueStr) || 0) + 1);
              }
            }
          });
        }
      });
      
      // Build field stats array
      fieldMap.forEach((info, fieldId) => {
        // Skip non-input fields
        if (['heading', 'paragraph', 'divider'].includes(info.type)) return;
        
        const responseCount = fieldResponseCounts.get(fieldId) || 0;
        const fillRate = Math.round((responseCount / totalResponses) * 100);
        
        const stat: NonNullable<AnalyticsMetrics['fieldStats']>[0] = {
          fieldId,
          fieldLabel: info.label,
          fieldType: info.type,
          responseCount,
          fillRate
        };
        
        // Add top values for choice fields
        const valueCounts = fieldValueCounts.get(fieldId);
        if (valueCounts && valueCounts.size > 0) {
          stat.topValues = Array.from(valueCounts.entries())
            .map(([value, count]) => ({
              value,
              count,
              percentage: Math.round((count / responseCount) * 100)
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        }
        
        fieldStats.push(stat);
      });
    }
    
    // Calculate weekly comparison
    const now = new Date();
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - 7);
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    
    const thisWeekResponses = responses?.filter(r => 
      new Date(r.submitted_at) >= thisWeekStart
    ).length || 0;
    
    const lastWeekResponses = responses?.filter(r => {
      const date = new Date(r.submitted_at);
      return date >= lastWeekStart && date < thisWeekStart;
    }).length || 0;
    
    const percentageChange = lastWeekResponses > 0 
      ? Math.round(((thisWeekResponses - lastWeekResponses) / lastWeekResponses) * 100)
      : thisWeekResponses > 0 ? 100 : 0;
    
    // Calculate peak submission hours
    const hourCounts = new Array(24).fill(0);
    responses?.forEach(response => {
      const hour = new Date(response.submitted_at).getHours();
      hourCounts[hour]++;
    });
    
    const peakSubmissionHours = hourCounts
      .map((count, hour) => ({ hour, count }))
      .filter(h => h.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      views,
      starts,
      completes,
      completionRate,
      avgTime,
      dailyTrend,
      dropOffPoints: dropOffPoints.length > 0 ? dropOffPoints : undefined,
      fieldStats: fieldStats.length > 0 ? fieldStats : undefined,
      weeklyComparison: {
        thisWeek: thisWeekResponses,
        lastWeek: lastWeekResponses,
        percentageChange
      },
      peakSubmissionHours: peakSubmissionHours.length > 0 ? peakSubmissionHours : undefined
    };
  } catch (error) {
    console.error(`Error getting analytics metrics for form ${formId}:`, error);
    throw error;
  }
}
