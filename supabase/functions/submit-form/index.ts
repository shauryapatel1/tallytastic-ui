import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 submissions per minute per IP
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Clean up expired rate limit entries
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Check rate limit for an IP
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  cleanupRateLimitStore();
  
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  
  if (!entry || entry.resetAt < now) {
    // New window
    const resetAt = now + RATE_LIMIT_WINDOW_MS;
    rateLimitStore.set(ip, { count: 1, resetAt });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetAt };
  }
  
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  
  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - entry.count, resetAt: entry.resetAt };
}

// Validate field value against field definition
function validateFieldValue(field: any, value: any): { valid: boolean; error?: string } {
  const fieldLabel = field.label || field.id;
  
  // Check required
  if (field.isRequired) {
    if (value === undefined || value === null || value === '') {
      return { valid: false, error: `${fieldLabel} is required` };
    }
    if (field.type === 'checkbox' && value !== true) {
      return { valid: false, error: `${fieldLabel} must be checked` };
    }
  }
  
  // If not required and empty, skip other validations
  if (value === undefined || value === null || value === '') {
    return { valid: true };
  }
  
  // Type-specific validations
  switch (field.type) {
    case 'email':
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailRegex.test(String(value))) {
        return { valid: false, error: `${fieldLabel} must be a valid email address` };
      }
      break;
      
    case 'number':
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return { valid: false, error: `${fieldLabel} must be a valid number` };
      }
      if (field.min !== undefined && numValue < field.min) {
        return { valid: false, error: `${fieldLabel} must be at least ${field.min}` };
      }
      if (field.max !== undefined && numValue > field.max) {
        return { valid: false, error: `${fieldLabel} must be at most ${field.max}` };
      }
      break;
      
    case 'text':
    case 'textarea':
      const strValue = String(value);
      if (field.minLength !== undefined && strValue.length < field.minLength) {
        return { valid: false, error: `${fieldLabel} must be at least ${field.minLength} characters` };
      }
      if (field.maxLength !== undefined && strValue.length > field.maxLength) {
        return { valid: false, error: `${fieldLabel} must be at most ${field.maxLength} characters` };
      }
      break;
      
    case 'select':
    case 'radio':
      if (field.options && Array.isArray(field.options)) {
        const validValues = field.options.map((opt: any) => opt.value);
        const allowOther = field.allowOther === true;
        if (!validValues.includes(value) && !allowOther) {
          return { valid: false, error: `${fieldLabel} has an invalid selection` };
        }
      }
      break;
      
    case 'rating':
      const ratingValue = Number(value);
      const maxRating = field.maxRating || 5;
      if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > maxRating) {
        return { valid: false, error: `${fieldLabel} must be between 1 and ${maxRating}` };
      }
      break;
      
    case 'date':
      const dateValue = new Date(value);
      if (isNaN(dateValue.getTime())) {
        return { valid: false, error: `${fieldLabel} must be a valid date` };
      }
      if (field.minDate) {
        const minDate = new Date(field.minDate);
        if (dateValue < minDate) {
          return { valid: false, error: `${fieldLabel} must be on or after ${field.minDate}` };
        }
      }
      if (field.maxDate) {
        const maxDate = new Date(field.maxDate);
        if (dateValue > maxDate) {
          return { valid: false, error: `${fieldLabel} must be on or before ${field.maxDate}` };
        }
      }
      break;
      
    case 'tel':
      // Basic phone validation - allows digits, spaces, dashes, parentheses, plus
      const phoneRegex = /^[\\d\\s\\-\\(\\)\\+]+$/;
      if (!phoneRegex.test(String(value))) {
        return { valid: false, error: `${fieldLabel} must be a valid phone number` };
      }
      break;
  }
  
  // Advanced validation rules
  if (field.advancedValidationRules && Array.isArray(field.advancedValidationRules)) {
    for (const rule of field.advancedValidationRules) {
      if (rule.isActive === false) continue;
      
      const strValue = String(value);
      const numValue = Number(value);
      
      switch (rule.type) {
        case 'minLength':
          if (rule.params?.length && strValue.length < rule.params.length) {
            return { valid: false, error: rule.customMessage || `${fieldLabel} is too short` };
          }
          break;
        case 'maxLength':
          if (rule.params?.length && strValue.length > rule.params.length) {
            return { valid: false, error: rule.customMessage || `${fieldLabel} is too long` };
          }
          break;
        case 'exactLength':
          if (rule.params?.length && strValue.length !== rule.params.length) {
            return { valid: false, error: rule.customMessage || `${fieldLabel} must be exactly ${rule.params.length} characters` };
          }
          break;
        case 'pattern':
          if (rule.params?.pattern) {
            const regex = new RegExp(rule.params.pattern);
            if (!regex.test(strValue)) {
              return { valid: false, error: rule.customMessage || `${fieldLabel} format is invalid` };
            }
          }
          break;
        case 'minValue':
          if (rule.params?.value !== undefined && !isNaN(numValue) && numValue < Number(rule.params.value)) {
            return { valid: false, error: rule.customMessage || `${fieldLabel} must be at least ${rule.params.value}` };
          }
          break;
        case 'maxValue':
          if (rule.params?.value !== undefined && !isNaN(numValue) && numValue > Number(rule.params.value)) {
            return { valid: false, error: rule.customMessage || `${fieldLabel} must be at most ${rule.params.value}` };
          }
          break;
        case 'numberInteger':
          if (!Number.isInteger(numValue)) {
            return { valid: false, error: rule.customMessage || `${fieldLabel} must be a whole number` };
          }
          break;
        case 'stringContains':
          if (rule.params?.substring && !strValue.includes(rule.params.substring)) {
            return { valid: false, error: rule.customMessage || `${fieldLabel} must contain \"${rule.params.substring}\"` };
          }
          break;
        case 'stringNotContains':
          if (rule.params?.substring && strValue.includes(rule.params.substring)) {
            return { valid: false, error: rule.customMessage || `${fieldLabel} must not contain \"${rule.params.substring}\"` };
          }
          break;
      }
    }
  }
  
  return { valid: true };
}

// Check quota for form owner
async function checkFormOwnerQuota(supabase: any, formId: string): Promise<{ canSubmit: boolean; message?: string }> {
  // Get form owner
  const { data: form, error: formError } = await supabase
    .from('forms')
    .select('user_id')
    .eq('id', formId)
    .single();
    
  if (formError || !form) {
    return { canSubmit: false, message: 'Form not found' };
  }
  
  // Get owner's quota
  const { data: quota, error: quotaError } = await supabase
    .from('quotas')
    .select('*')
    .eq('user_id', form.user_id)
    .single();
    
  if (quotaError || !quota) {
    // No quota record means free tier - allow with default limits
    return { canSubmit: true };
  }
  
  // Count responses this month for this user
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const { count, error: countError } = await supabase
    .from('form_responses')
    .select('id', { count: 'exact', head: true })
    .in('form_id', supabase.from('forms').select('id').eq('user_id', form.user_id))
    .gte('submitted_at', startOfMonth.toISOString());
    
  if (countError) {
    console.error('Error checking quota:', countError);
    // Allow submission if quota check fails
    return { canSubmit: true };
  }
  
  if ((count || 0) >= quota.response_limit) {
    return { canSubmit: false, message: 'This form has reached its monthly response limit' };
  }
  
  return { canSubmit: true };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || 
                     "unknown";
    
    console.log(`[submit-form] Request from IP: ${clientIP}`);
    
    // Check rate limit
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      console.log(`[submit-form] Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          error: "Too many requests", 
          message: "Please wait before submitting again",
          retryAfter: Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000))
          } 
        }
      );
    }
    
    // Parse request body
    const { formId, responseData, metadata } = await req.json();
    
    if (!formId || typeof formId !== 'string') {
      return new Response(
        JSON.stringify({ error: "Invalid form ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!responseData || typeof responseData !== 'object') {
      return new Response(
        JSON.stringify({ error: "Invalid response data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Initialize Supabase client with service role for server-side operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Fetch the form and its published version
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('*, published_version_id')
      .eq('id', formId)
      .eq('status', 'published')
      .single();
      
    if (formError || !form) {
      console.log(`[submit-form] Form not found or not published: ${formId}`);
      return new Response(
        JSON.stringify({ error: "Form not found or not published" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get the published version for validation (immutable snapshot)
    let formVersionId = form.published_version_id;
    let sections: any[] = [];
    
    if (formVersionId) {
      // Use the immutable published version for validation
      const { data: version, error: versionError } = await supabase
        .from('form_versions')
        .select('*')
        .eq('id', formVersionId)
        .single();
        
      if (versionError || !version) {
        console.error(`[submit-form] Published version not found: ${formVersionId}`);
        // Fall back to current form definition
        sections = Array.isArray(form.definition_sections) ? form.definition_sections : [];
      } else {
        sections = Array.isArray(version.definition_sections) ? version.definition_sections : [];
      }
    } else {
      // Legacy forms without versioning - use current definition
      sections = Array.isArray(form.definition_sections) ? form.definition_sections : [];
    }
    
    // Check quota
    const quotaCheck = await checkFormOwnerQuota(supabase, formId);
    if (!quotaCheck.canSubmit) {
      console.log(`[submit-form] Quota exceeded for form: ${formId}`);
      return new Response(
        JSON.stringify({ error: "Quota exceeded", message: quotaCheck.message }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Parse form definition and validate response data
    const allFields: any[] = sections.flatMap((section: any) => section.fields || []);
    
    const validationErrors: { fieldId: string; error: string }[] = [];
    
    for (const field of allFields) {
      // Skip non-input fields
      if (['heading', 'paragraph', 'divider'].includes(field.type)) continue;
      
      const value = responseData[field.id];
      const validation = validateFieldValue(field, value);
      
      if (!validation.valid && validation.error) {
        validationErrors.push({ fieldId: field.id, error: validation.error });
      }
    }
    
    if (validationErrors.length > 0) {
      console.log(`[submit-form] Validation failed for form ${formId}:`, validationErrors);
      return new Response(
        JSON.stringify({ error: "Validation failed", validationErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Sanitize response data - only keep known field IDs
    const knownFieldIds = new Set(allFields.map((f: any) => f.id));
    const sanitizedData: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(responseData)) {
      if (knownFieldIds.has(key)) {
        // Basic XSS prevention - escape HTML in string values
        if (typeof value === 'string') {
          sanitizedData[key] = value
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
        } else {
          sanitizedData[key] = value;
        }
      }
    }
    
    // Insert the response with version reference
    const { data: response, error: insertError } = await supabase
      .from('form_responses')
      .insert({
        form_id: formId,
        form_version_id: formVersionId || null, // Link to the version used
        data: sanitizedData,
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (insertError) {
      console.error(`[submit-form] Error inserting response for form ${formId}:`, insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`[submit-form] Successfully saved response ${response.id} for form ${formId}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        responseId: response.id,
        message: "Response submitted successfully"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("[submit-form] Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
