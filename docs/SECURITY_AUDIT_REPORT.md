# Tallytastic Form Builder - Comprehensive Security & Quality Audit

**Audit Date:** December 29, 2025  
**Auditor:** Principal Software Engineer (PhD-level rigor)  
**Scope:** Full codebase end-to-end analysis

---

## Executive Summary

### Top 10 Critical Issues (Must Fix Before Launch)

| Priority | Issue | Impact | Category |
|----------|-------|--------|----------|
| **P0** | No rate limiting on form submissions | DoS, spam flood, quota bypass | Security |
| **P0** | No server-side validation | Data integrity, injection | Security |
| **P0** | Form versioning not implemented | Data corruption, broken submissions | Data Integrity |
| **P1** | Delete account calls non-existent edge function | Feature completely broken | Crash |
| **P1** | Redirect URL unvalidated (XSS/Open Redirect) | Phishing, XSS | Security |
| **P1** | Two incompatible conditional logic evaluators | Inconsistent behavior | Logic Bug |
| **P2** | Submissions not linked to form version | Orphaned data, broken analytics | Data Integrity |
| **P2** | Brand name inconsistency (tallytastic vs FormCraft) | User confusion | UX |
| **P2** | Leaked password protection disabled (Supabase) | Credential stuffing | Security |
| **P3** | Response count query inefficient (N+1 potential) | Performance at scale | Performance |

---

## Architecture Overview

### Stack
- **Frontend:** React 18.3 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Payments:** Stripe (subscriptions via webhooks)
- **Analytics:** PostHog

### Data Flow
```
User Browser
    ↓
React SPA (Lovable-hosted)
    ↓
Supabase Client SDK
    ↓
Supabase (Auth + PostgreSQL + Edge Functions)
    ↓
Stripe (Billing webhooks)
```

### Trust Boundaries
1. Browser → Supabase: Anon key + JWT auth
2. Edge Functions → Supabase: Service role key
3. Stripe → Webhook endpoint: Signature verification

---

## Bug & Risk Register

### P0 - Security/Data Loss (Fix Immediately)

| ID | Component | Symptom & Impact | Root Cause | Location | Fix Recommendation |
|----|-----------|------------------|------------|----------|---------------------|
| P0-1 | Submissions | Attackers can flood form submissions, exhaust quotas, cause DoS | No rate limiting on `form_responses` INSERT | `src/services/formService.ts:647-740`, RLS policy on `form_responses` | Implement rate limiting via edge function or Supabase rate limiting. Add CAPTCHA for public forms. |
| P0-2 | Submissions | Malformed data can be stored, validation bypassed | Only client-side validation, no server-side check against form schema | `src/services/formService.ts:647-740` | Create edge function to validate submissions against stored form schema before INSERT. |
| P0-3 | Form Builder | Editing a published form modifies live version, breaking existing embed/links | No version immutability, no draft/published version separation | `src/services/formService.ts:157-200` | Implement version column increment on publish. Create draft copy on edit of published form. |

**P0-1 Patch Guidance:**
```typescript
// Create edge function: supabase/functions/submit-form/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const RATE_LIMIT_WINDOW = 60; // seconds
const MAX_SUBMISSIONS_PER_WINDOW = 5;

// Use Redis or Supabase table for rate limiting
// Check IP/session against rate limit before allowing INSERT
```

**P0-3 Patch Guidance:**
```sql
-- Add migration for form versioning
ALTER TABLE forms ADD COLUMN published_definition_sections JSONB;
ALTER TABLE forms ADD COLUMN published_version INTEGER DEFAULT 0;
ALTER TABLE form_responses ADD COLUMN form_version INTEGER;

-- When publishing: copy definition_sections to published_definition_sections
-- When submitting: store form_version with response
-- When editing published form: edits go to definition_sections (draft), published_definition_sections unchanged
```

---

### P1 - Crash/Critical Feature Broken

| ID | Component | Symptom & Impact | Root Cause | Location | Fix Recommendation |
|----|-----------|------------------|------------|----------|---------------------|
| P1-1 | User Account | Delete account feature crashes with edge function error | `delete-user-account` edge function doesn't exist | `src/services/formService.ts:826-880`, `supabase/functions/` | Create the missing edge function or remove the feature UI. |
| P1-2 | Public Forms | Redirect URL can be set to `javascript:` or malicious URL | No URL validation/sanitization | `src/pages/public/PublicFormPage.tsx:264-270` | Validate redirect URL is HTTPS and on allowlist or same-origin. |
| P1-3 | Conditional Logic | Two different evaluators with different logic cause inconsistent field visibility | `src/lib/form/logic.ts` and `src/lib/conditionalLogicEvaluator.ts` have different implementations | Both files | Consolidate to single evaluator. The `conditionalLogicEvaluator.ts` is more complete - use that everywhere. |

**P1-1 Fix:**
```typescript
// Create: supabase/functions/delete-user-account/index.ts
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "No auth header" }), { 
      status: 401, headers: corsHeaders 
    });
  }

  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401, headers: corsHeaders 
    });
  }

  // Delete user's data then auth record
  await supabaseAdmin.from('form_responses').delete().eq('form_id', 
    supabaseAdmin.from('forms').select('id').eq('user_id', user.id)
  );
  await supabaseAdmin.from('forms').delete().eq('user_id', user.id);
  await supabaseAdmin.from('quotas').delete().eq('user_id', user.id);
  await supabaseAdmin.auth.admin.deleteUser(user.id);

  return new Response(JSON.stringify({ message: "Account deleted" }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
```

**P1-2 Fix:**
```typescript
// In PublicFormPage.tsx, before redirect:
const validateRedirectUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    // Only allow http/https, reject javascript: etc.
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    // Optionally: restrict to same origin or allowlist
    return true;
  } catch {
    return false;
  }
};

// Usage:
if (formDefinition.redirectUrl && validateRedirectUrl(formDefinition.redirectUrl)) {
  window.location.href = formDefinition.redirectUrl;
}
```

---

### P2 - Wrong Behavior

| ID | Component | Symptom & Impact | Root Cause | Location | Fix Recommendation |
|----|-----------|------------------|------------|----------|---------------------|
| P2-1 | Analytics | Cannot correlate responses to exact form version they were submitted against | `form_responses` doesn't store `form_version` | DB schema, `submitFormResponse` | Add `form_version` to responses table and populate on insert |
| P2-2 | Branding | Inconsistent brand names confuse users | "tallytastic" in landing, "FormCraft" in auth toasts and footer | `src/lib/auth.tsx:152`, `src/pages/public/PublicFormPage.tsx:400` | Search/replace all "FormCraft" → "tallytastic" |
| P2-3 | Auth | Users with compromised passwords can still sign up | Leaked password protection disabled in Supabase | Supabase Dashboard | Enable in Supabase Dashboard → Auth → Settings |
| P2-4 | DB Security | `update_updated_at_column()` function has mutable search path | Function doesn't set `search_path` | Database function | Run: `ALTER FUNCTION public.update_updated_at_column() SET search_path = public;` |
| P2-5 | Validation | `useFormValidation` hook uses `validateFieldEngine` from ValidationEngine.ts but `validateForm` from form/validate.ts - different validation logic | Inconsistent imports between field and form validation | `src/hooks/useFormValidation.ts:3-4` | Use same engine for both field and form validation |

---

### P3 - Refactor/Improvement

| ID | Component | Symptom & Impact | Root Cause | Location | Fix Recommendation |
|----|-----------|------------------|------------|----------|---------------------|
| P3-1 | Dashboard | Response count fetches ALL responses then counts client-side | Inefficient query pattern | `src/services/formService.ts:298-315` | Use SQL COUNT aggregation instead of fetching all rows |
| P3-2 | Forms | Public forms expose full `definition_sections` including possibly sensitive field names | RLS allows anonymous SELECT on published forms | RLS policy on `forms` | Consider what data is truly needed for public rendering |
| P3-3 | Type Safety | Multiple `any` type casts throughout codebase | Rushing past type errors | Various files | Address type issues properly |
| P3-4 | Stripe Webhook | User lookup iterates all users to find by email | Inefficient O(n) lookup | `supabase/functions/stripe-webhook/index.ts:43-53` | Use Supabase Admin API to lookup by email directly |

**P3-1 Fix:**
```typescript
// Replace inefficient count with aggregate query
const { count, error } = await supabase
  .from('form_responses')
  .select('*', { count: 'exact', head: true })
  .eq('form_id', formId);
```

**P3-4 Fix:**
```typescript
// Replace user list iteration with direct lookup
const { data: users } = await supabaseAdmin.auth.admin.listUsers({
  filter: `email.eq.${email}`
});
const user = users.users[0];
```

---

## Product Invariant Violations

### Critical Invariants for Form Builder SaaS

| Invariant | Status | Details |
|-----------|--------|---------|
| Published form versions are immutable | ❌ VIOLATED | Edits directly modify `definition_sections` of published forms |
| Submissions reference exact form version | ❌ VIOLATED | `form_responses` has no `form_version` column |
| Conditional logic is deterministic and versioned | ⚠️ PARTIAL | Logic is stored but two different evaluators exist |
| Server-side validation matches form schema | ❌ VIOLATED | No server-side validation exists |
| Tenant isolation: every read/write scoped to workspace | ✅ PASS | RLS policies enforce `user_id` checks |
| Rate limiting on public submission endpoints | ❌ VIOLATED | No rate limiting implemented |

---

## Security-Specific Findings

### Authentication & Authorization
- ✅ Supabase RLS properly configured for tenant isolation
- ✅ JWT verification on protected routes
- ⚠️ Leaked password protection disabled
- ⚠️ No MFA implementation

### Input Validation
- ❌ No server-side form submission validation
- ⚠️ Client-side validation can be bypassed
- ⚠️ Redirect URL not sanitized (XSS/open redirect risk)

### Data Exposure
- ⚠️ Full form definitions exposed to anonymous users (published forms)
- ✅ Response data properly protected by RLS

### Edge Functions
- ✅ CORS headers properly configured
- ✅ Stripe webhook signature verification
- ⚠️ `verify_jwt = false` on checkout functions (expected for these use cases)

---

## Accessibility (WCAG) Gaps

| Issue | Location | Recommendation |
|-------|----------|----------------|
| No skip navigation link | `src/components/Navbar.tsx` | Add "Skip to main content" link |
| Missing focus indicators on some interactive elements | Various | Ensure `:focus-visible` styles |
| No `prefers-reduced-motion` support | Animation components | Add motion-safe media queries |
| Form error announcements not ARIA live | Form renderers | Add `aria-live="polite"` to error containers |

---

## Performance Recommendations

| Issue | Impact | Fix |
|-------|--------|-----|
| No code splitting for route components | Large initial bundle | Use `React.lazy()` for route components |
| Response count query fetches all rows | Slow at scale | Use COUNT aggregation |
| No pagination on form list | Slow with many forms | Add cursor-based pagination |

---

## Quality Gate Plan

### Recommended CI/CD Checks

```yaml
# .github/workflows/quality.yml
name: Quality Gates
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx tsc --noEmit
      
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test -- --coverage
      - name: Check coverage threshold
        run: |
          # Require 70% coverage minimum
          
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
```

### Recommended ESLint Rules

```javascript
// Add to eslint.config.js
{
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "no-console": ["warn", { allow: ["warn", "error"] }],
  }
}
```

---

## Tests to Add

### Unit Tests (Immediate)

```typescript
// src/lib/form/__tests__/validate.test.ts - ADD:
describe('validateField', () => {
  it('should skip validation for hidden fields', () => {});
  it('should validate required fields correctly', () => {});
  it('should handle malformed input gracefully', () => {});
});

// src/lib/__tests__/conditionalLogicEvaluator.test.ts - CREATE:
describe('isFieldVisible', () => {
  it('should return false for statically hidden fields', () => {});
  it('should evaluate AND logic correctly', () => {});
  it('should evaluate OR logic correctly', () => {});
  it('should handle missing source fields gracefully', () => {});
});
```

### Integration Tests (Priority)

```typescript
// src/services/__tests__/formService.integration.test.ts
describe('Form Submission Flow', () => {
  it('should reject submission with invalid form ID', async () => {});
  it('should reject submission with malformed data', async () => {});
  it('should store metadata with submission', async () => {});
});
```

### E2E Tests (Before Launch)

```typescript
// e2e/form-builder.spec.ts (Playwright)
test('complete form creation flow', async ({ page }) => {
  await page.goto('/app/forms/new');
  // Add fields, configure, preview, publish
});

test('public form submission', async ({ page }) => {
  await page.goto('/f/[published-form-id]');
  // Fill form, submit, verify success
});
```

---

## Recommended Fixes Priority Order

### Week 1 (Before Launch)
1. **P0-1:** Add rate limiting to form submissions
2. **P0-2:** Implement server-side validation edge function
3. **P1-1:** Create delete-user-account edge function
4. **P1-2:** Validate redirect URLs
5. **P2-2:** Fix brand name inconsistency
6. **P2-3:** Enable leaked password protection

### Week 2 (Post-Launch Critical)
7. **P0-3:** Implement form versioning system
8. **P1-3:** Consolidate conditional logic evaluators
9. **P2-1:** Add form_version to responses
10. **P2-4:** Fix database function search path

### Week 3-4 (Hardening)
11. **P3-1:** Optimize response count queries
12. **P3-4:** Optimize Stripe webhook user lookup
13. Add comprehensive test suite
14. Implement observability (error tracking, APM)

---

## Conclusion

The tallytastic codebase has a solid foundation but requires critical security and data integrity fixes before production use. The most urgent issues are:

1. **Rate limiting** - Without it, the service is vulnerable to abuse
2. **Server-side validation** - Required for data integrity
3. **Form versioning** - Critical for a forms SaaS product

The RLS policies are well-designed and tenant isolation is properly enforced. With the recommended fixes, this product can achieve "best in class" quality.
