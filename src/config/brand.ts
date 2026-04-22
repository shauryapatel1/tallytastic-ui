/**
 * Centralized brand constants for Ingrid.
 *
 * Use these constants in UI strings, meta tags, emails, and copy so the
 * brand can be updated in a single place. Internal identifiers
 * (database tables, enums, API contracts, embed postMessage types) are
 * intentionally NOT changed here to preserve backwards compatibility.
 */

export const BRAND = {
  /** Product name shown to users. */
  name: "Ingrid",

  /** Short tagline for hero / OG / meta. */
  tagline: "The inbound engine for forms, routing, and workflow.",

  /** One-liner positioning statement. */
  positioning: "Capture submissions, route work, and automate follow-up.",

  /** SEO meta description (under 160 chars). */
  metaDescription:
    "Ingrid is the inbound engine for forms — capture submissions, route work, and automate follow-up with reliable webhooks, spam protection, and a triage inbox.",

  /** Public API host shown in code samples. */
  apiHost: "api.ingrid.dev",

  /** Embed identifier prefix used for iframe DOM ids in NEW embeds. */
  embedIdPrefix: "ingrid-embed",

  /**
   * postMessage event type for iframe auto-resize.
   * NOTE: legacy `formcraft-resize` is still emitted alongside this for
   * backward compatibility with previously-installed embeds.
   */
  resizeEventType: "ingrid-resize",

  /** Session storage key for analytics session id. */
  sessionStorageKey: "ingrid_session_id",

  /** Copyright owner string. */
  copyrightOwner: "Ingrid",
} as const;

/** Legacy brand identifiers kept for backwards-compatibility. */
export const LEGACY_BRAND = {
  resizeEventType: "formcraft-resize",
  embedIdPrefix: "formcraft-embed",
  sessionStorageKey: "formcraft_session_id",
} as const;
