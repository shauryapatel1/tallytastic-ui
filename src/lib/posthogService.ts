import posthog from 'posthog-js';

// PostHog Configuration
// =====================
// PostHog API keys are PUBLIC/PUBLISHABLE (safe to expose in frontend code).
// To enable PostHog tracking:
// 1. Create a free PostHog account at https://posthog.com
// 2. Copy your Project API key from Settings > Project > API Keys
// 3. Replace 'phc_placeholder' below with your actual API key
//
// Example: const POSTHOG_KEY = 'phc_abc123xyz...';
const POSTHOG_KEY = 'phc_placeholder';
const POSTHOG_HOST = 'https://us.i.posthog.com';

let isInitialized = false;

/**
 * Check if "Do Not Track" is enabled
 */
function isDoNotTrack(): boolean {
  return navigator.doNotTrack === '1' || 
         (window as any).doNotTrack === '1';
}

/**
 * Initialize PostHog SDK
 */
export function initPostHog(): void {
  // Respect Do Not Track
  if (isDoNotTrack()) {
    console.log('[PostHog] DNT enabled, skipping initialization');
    return;
  }

  // Only initialize if key is configured
  if (POSTHOG_KEY === 'phc_placeholder') {
    console.log('[PostHog] No API key configured, skipping initialization');
    return;
  }

  if (isInitialized) return;

  try {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: false, // Disable autocapture for more control
      disable_session_recording: true, // Disable by default for privacy
      persistence: 'localStorage',
      bootstrap: {
        distinctID: undefined, // Will be auto-generated
      },
      loaded: () => {
        console.log('[PostHog] Initialized successfully');
        isInitialized = true;
      },
    });
  } catch (error) {
    console.error('[PostHog] Failed to initialize:', error);
  }
}

/**
 * Identify user (call after authentication)
 */
export function identifyUser(userId: string, properties?: Record<string, any>): void {
  if (isDoNotTrack() || !isInitialized) return;

  // Only pass non-PII properties
  const safeProperties = properties ? sanitizeProperties(properties) : {};
  
  posthog.identify(userId, safeProperties);
}

/**
 * Reset user identity (call on logout)
 */
export function resetUser(): void {
  if (!isInitialized) return;
  posthog.reset();
}

/**
 * Track custom event
 */
export function trackEvent(eventName: string, properties?: Record<string, any>): void {
  if (isDoNotTrack()) return;
  
  // Initialize if not already done
  if (!isInitialized && POSTHOG_KEY !== 'phc_placeholder') {
    initPostHog();
  }

  if (!isInitialized) {
    console.log(`[PostHog] Not initialized, logging event locally: ${eventName}`, properties);
    return;
  }

  const safeProperties = properties ? sanitizeProperties(properties) : {};
  posthog.capture(eventName, safeProperties);
  console.log(`[PostHog] Tracked: ${eventName}`, safeProperties);
}

/**
 * Sanitize properties to remove PII
 */
function sanitizeProperties(properties: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  // Allowlist of safe property keys
  const safeKeys = [
    'form_id', 'form_title', 'field_count', 'section_count',
    'template_id', 'template_name', 'status',
    'response_count', 'completion_rate', 'avg_time',
    'source', 'referrer_domain', 'utm_source', 'utm_medium', 'utm_campaign',
    'mode', 'page_index', 'total_pages', 'field_type',
    'has_redirect', 'has_custom_message', 'has_pagination'
  ];

  for (const key of safeKeys) {
    if (properties[key] !== undefined) {
      sanitized[key] = properties[key];
    }
  }

  // Sanitize referrer to domain only
  if (properties.referrer) {
    try {
      const url = new URL(properties.referrer);
      sanitized.referrer_domain = url.hostname;
    } catch {
      // Invalid URL, skip
    }
  }

  return sanitized;
}

// ==========================================
// App Analytics Events
// ==========================================

/**
 * Track form creation
 */
export function trackFormCreated(formId: string, properties?: {
  form_title?: string;
  template_id?: string;
  template_name?: string;
  field_count?: number;
  section_count?: number;
}): void {
  trackEvent('form_created', {
    form_id: formId,
    ...properties
  });
}

/**
 * Track form published
 */
export function trackFormPublished(formId: string, properties?: {
  form_title?: string;
  field_count?: number;
  section_count?: number;
  has_redirect?: boolean;
  has_custom_message?: boolean;
  has_pagination?: boolean;
}): void {
  trackEvent('form_published', {
    form_id: formId,
    ...properties
  });
}

/**
 * Track embed view (when form is loaded in iframe)
 */
export function trackEmbedView(formId: string, properties?: {
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}): void {
  trackEvent('embed_view', {
    form_id: formId,
    source: 'embed',
    ...properties
  });
}

/**
 * Track form submission
 */
export function trackSubmission(formId: string, properties?: {
  form_title?: string;
  source?: 'direct' | 'embed';
  completion_time?: number;
  field_count?: number;
}): void {
  trackEvent('form_submission', {
    form_id: formId,
    ...properties
  });
}

/**
 * Track form view (public form page)
 */
export function trackFormPageView(formId: string, properties?: {
  mode?: 'classic' | 'chat';
  source?: 'direct' | 'embed';
  referrer?: string;
}): void {
  trackEvent('form_view', {
    form_id: formId,
    ...properties
  });
}

/**
 * Track form builder events
 */
export function trackBuilderEvent(action: string, properties?: Record<string, any>): void {
  trackEvent(`builder_${action}`, properties);
}
