import { supabase } from "@/integrations/supabase/client";

export type FormEventType = 
  | 'view' 
  | 'start' 
  | 'complete' 
  | 'page_next' 
  | 'page_back' 
  | 'drop_off'
  | 'field_focus'
  | 'field_blur';

interface FormEventMeta {
  fieldId?: string;
  pageIndex?: number;
  duration?: number;
  [key: string]: any;
}

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('formcraft_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('formcraft_session_id', sessionId);
  }
  return sessionId;
};

// Track if "Do Not Track" is enabled
const isDoNotTrack = (): boolean => {
  return navigator.doNotTrack === '1' || 
         (window as any).doNotTrack === '1';
};

/**
 * Track a form event to the form_events table
 */
export async function trackFormEvent(
  formId: string, 
  eventType: FormEventType, 
  meta?: FormEventMeta
): Promise<void> {
  // Respect Do Not Track
  if (isDoNotTrack()) {
    console.log('[FormEvents] DNT enabled, skipping tracking');
    return;
  }

  try {
    const sessionId = getSessionId();
    
    // Sanitize meta to remove any PII
    const sanitizedMeta = meta ? sanitizeMeta(meta) : {};

    const { error } = await supabase
      .from('form_events')
      .insert({
        form_id: formId,
        event_type: eventType,
        session_id: sessionId,
        meta: sanitizedMeta,
        at: new Date().toISOString()
      });

    if (error) {
      console.error('[FormEvents] Error tracking event:', error);
    } else {
      console.log(`[FormEvents] Tracked: ${eventType} for form ${formId}`);
    }
  } catch (error) {
    console.error('[FormEvents] Unexpected error:', error);
  }
}

/**
 * Sanitize metadata to remove potential PII
 */
function sanitizeMeta(meta: FormEventMeta): FormEventMeta {
  const sanitized: FormEventMeta = {};
  
  // Allowlist of safe properties
  const safeKeys = ['fieldId', 'pageIndex', 'duration', 'fieldType', 'totalPages', 'lastFieldId'];
  
  for (const key of safeKeys) {
    if (meta[key] !== undefined) {
      sanitized[key] = meta[key];
    }
  }
  
  return sanitized;
}

/**
 * Track view event (when form is first loaded)
 */
export function trackFormView(formId: string): void {
  trackFormEvent(formId, 'view');
}

/**
 * Track start event (when user interacts with the form)
 */
export function trackFormStart(formId: string): void {
  trackFormEvent(formId, 'start');
}

/**
 * Track complete event (when form is submitted)
 */
export function trackFormComplete(formId: string, duration?: number): void {
  trackFormEvent(formId, 'complete', { duration });
}

/**
 * Track page navigation
 */
export function trackPageNavigation(
  formId: string, 
  direction: 'next' | 'back',
  pageIndex: number
): void {
  trackFormEvent(formId, direction === 'next' ? 'page_next' : 'page_back', { pageIndex });
}

/**
 * Track drop-off (user abandons form)
 */
export function trackDropOff(formId: string, lastFieldId?: string): void {
  trackFormEvent(formId, 'drop_off', { lastFieldId });
}

/**
 * Hook for tracking form interactions
 * Returns cleanup function to track drop-off on unmount
 */
export function createFormTracker(formId: string) {
  let hasStarted = false;
  let lastFieldId: string | undefined;
  const startTime = Date.now();

  return {
    trackView: () => trackFormView(formId),
    
    trackInteraction: () => {
      if (!hasStarted) {
        hasStarted = true;
        trackFormStart(formId);
      }
    },
    
    trackFieldFocus: (fieldId: string) => {
      lastFieldId = fieldId;
      if (!hasStarted) {
        hasStarted = true;
        trackFormStart(formId);
      }
    },
    
    trackPageChange: (direction: 'next' | 'back', pageIndex: number) => {
      trackPageNavigation(formId, direction, pageIndex);
    },
    
    trackComplete: () => {
      const duration = Math.round((Date.now() - startTime) / 1000);
      trackFormComplete(formId, duration);
    },
    
    trackDropOff: () => {
      if (hasStarted) {
        trackDropOff(formId, lastFieldId);
      }
    },
    
    setLastField: (fieldId: string) => {
      lastFieldId = fieldId;
    }
  };
}
