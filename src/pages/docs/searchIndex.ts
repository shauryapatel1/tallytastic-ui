/**
 * Lightweight in-memory search index for /docs.
 *
 * Each entry corresponds to a section (heading) within a page. Code snippets
 * are attached to the nearest preceding heading so a search like "HMAC" or
 * "curl" surfaces the section that contains the snippet.
 *
 * Kept manual + colocated with the docs so it stays in sync with the source
 * pages. No build step required.
 */
export type DocEntry = {
  /** Page route (without hash). */
  path: string;
  /** Section title shown in results. */
  heading: string;
  /** Page title for context (e.g. "Quickstart"). */
  page: string;
  /** Sidebar group label. */
  group: string;
  /** Anchor id on the page (matches the id passed to <DocH2 id="..."/>). */
  anchor?: string;
  /** Body text + adjacent code snippets used for matching. */
  body: string;
};

export const DOC_ENTRIES: DocEntry[] = [
  // Introduction
  {
    path: "/docs",
    page: "Introduction",
    group: "Get started",
    heading: "Introduction",
    body: "Ingrid is the inbound engine for forms. Capture submissions, route work, automate follow-up. Webhooks spam protection routing inbox triage.",
  },
  {
    path: "/docs",
    page: "Introduction",
    group: "Get started",
    heading: "What you get",
    body: "POST endpoint per form. HMAC-signed webhooks with retries. Spam protection honeypot rate limits Turnstile reCAPTCHA. Conditional routing. Triage inbox status tags assignment notes.",
  },

  // Quickstart
  {
    path: "/docs/quickstart",
    page: "Quickstart",
    group: "Get started",
    heading: "Quickstart",
    body: "Send your first submission in five minutes. No SDK no servers.",
  },
  {
    path: "/docs/quickstart",
    page: "Quickstart",
    group: "Get started",
    anchor: "step-1",
    heading: "1. Create a form",
    body: "New form. frm_abc123 unique form id.",
  },
  {
    path: "/docs/quickstart",
    page: "Quickstart",
    group: "Get started",
    anchor: "step-2",
    heading: "2. Submit from anywhere",
    body: "curl -X POST https://api.ingrid.dev/v1/submit/frm_abc123 Content-Type application/json email lead@acme.com message Interested. HTML form action method POST plain.",
  },
  {
    path: "/docs/quickstart",
    page: "Quickstart",
    group: "Get started",
    anchor: "step-3",
    heading: "3. See it in your inbox",
    body: "Submissions inbox realtime appears within seconds.",
  },
  {
    path: "/docs/quickstart",
    page: "Quickstart",
    group: "Get started",
    anchor: "step-4",
    heading: "4. Connect a destination",
    body: "Add a webhook. HMAC-SHA256 signature exponential backoff retries replay dashboard.",
  },

  // Submissions
  {
    path: "/docs/submissions",
    page: "Submissions",
    group: "Core concepts",
    heading: "Submissions",
    body: "Submissions inbox operational view captured responses.",
  },
  {
    path: "/docs/submissions",
    page: "Submissions",
    group: "Core concepts",
    anchor: "lifecycle",
    heading: "Lifecycle",
    body: "Status: new in_progress done archived spam. Triage filters.",
  },
  {
    path: "/docs/submissions",
    page: "Submissions",
    group: "Core concepts",
    anchor: "triage",
    heading: "Triage",
    body: "Update status add tags assign teammates attach notes replay webhook deliveries realtime.",
  },
  {
    path: "/docs/submissions",
    page: "Submissions",
    group: "Core concepts",
    anchor: "versioning",
    heading: "Versioning",
    body: "Submissions bound to form version published when received. Editing form does not alter historical responses.",
  },

  // Webhooks
  {
    path: "/docs/webhooks",
    page: "Webhooks",
    group: "Core concepts",
    heading: "Webhooks",
    body: "Forward submissions signed JSON payload automatic retries delivery history.",
  },
  {
    path: "/docs/webhooks",
    page: "Webhooks",
    group: "Core concepts",
    anchor: "payload",
    heading: "Payload",
    body: "id sub_8x2k3p form_id submitted_at data email plan metadata ip user_agent JSON.",
  },
  {
    path: "/docs/webhooks",
    page: "Webhooks",
    group: "Core concepts",
    anchor: "signing",
    heading: "Signature verification",
    body: "X-Ingrid-Signature HMAC-SHA256 hash raw body endpoint secret. crypto createHmac timingSafeEqual node verify TypeScript.",
  },
  {
    path: "/docs/webhooks",
    page: "Webhooks",
    group: "Core concepts",
    anchor: "retries",
    heading: "Retries",
    body: "Up to 5 attempts exponential backoff 1m 5m 30m 2h 12h. 2xx success queue retry failures delivery log. 10 second timeout.",
  },

  // Routing
  {
    path: "/docs/routing",
    page: "Routing rules",
    group: "Core concepts",
    heading: "Routing rules",
    body: "Send right submissions right destinations field values.",
  },
  {
    path: "/docs/routing",
    page: "Routing rules",
    group: "Core concepts",
    anchor: "model",
    heading: "When / If / Then",
    body: "When submission received If conditions match Then run actions sentence.",
  },
  {
    path: "/docs/routing",
    page: "Routing rules",
    group: "Core concepts",
    anchor: "example",
    heading: "Example",
    body: "Enterprise leads Slack sales conditions field plan equals enterprise actions webhook endpoint_id wh_slack_sales tag.",
  },
  {
    path: "/docs/routing",
    page: "Routing rules",
    group: "Core concepts",
    anchor: "evaluation",
    heading: "Evaluation",
    body: "Priority order first match wins continue. Inactive skipped. Failed actions execution log retry status.",
  },

  // API reference
  {
    path: "/docs/api",
    page: "API reference",
    group: "Reference",
    heading: "API reference",
    body: "Workspace-scoped tokens authenticate API requests scoped revocable audit-logged.",
  },
  {
    path: "/docs/api",
    page: "API reference",
    group: "Reference",
    anchor: "auth",
    heading: "Authentication",
    body: "Authorization header Bearer ingrid_live_xxx. Public POST submit no auth required.",
  },
  {
    path: "/docs/api",
    page: "API reference",
    group: "Reference",
    anchor: "submit",
    heading: "Submit a response",
    body: "POST /v1/submit/:formId Content-Type application/json email lead message.",
  },
  {
    path: "/docs/api",
    page: "API reference",
    group: "Reference",
    anchor: "list",
    heading: "List submissions",
    body: "GET /v1/submissions form_id status limit Authorization Bearer.",
  },
  {
    path: "/docs/api",
    page: "API reference",
    group: "Reference",
    anchor: "resend",
    heading: "Resend a webhook",
    body: "POST /v1/webhooks/deliveries/:id/resend Authorization Bearer replay.",
  },
];

/**
 * Tiny case-insensitive matcher with simple scoring:
 * heading hit (3) > page hit (2) > body hit (1).
 * Multi-word queries require every term to appear somewhere.
 */
export function searchDocs(query: string, limit = 12): DocEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const scored = DOC_ENTRIES.map((entry) => {
    const heading = entry.heading.toLowerCase();
    const page = entry.page.toLowerCase();
    const body = entry.body.toLowerCase();
    let score = 0;
    for (const t of terms) {
      const inHeading = heading.includes(t);
      const inPage = page.includes(t);
      const inBody = body.includes(t);
      if (!inHeading && !inPage && !inBody) return null;
      if (inHeading) score += 3;
      else if (inPage) score += 2;
      else if (inBody) score += 1;
    }
    return { entry, score };
  }).filter((x): x is { entry: DocEntry; score: number } => x !== null);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.entry);
}