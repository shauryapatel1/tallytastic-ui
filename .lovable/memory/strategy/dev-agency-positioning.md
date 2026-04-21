---
name: Developer/Agency Positioning
description: Strategic positioning rules — FormCraft is form backend + routing infrastructure, not a Typeform/Tally builder competitor.
type: preference
---
# Developer/Agency Positioning (Phase 0+)

**Core positioning:** "Reliable form backend and routing for modern websites."

## Always
- Lead with infrastructure value: webhooks, retries, signed payloads, spam protection, routing rules, submission inbox.
- Target ICPs in this order: agencies → indie devs / SaaS founders → technical SMB teams.
- Show code (curl / Next.js / React / HTML) on the landing page — code is credibility.
- Frame pricing around operational value (workspaces, submissions, routing, team), not field types.
- Plan names: **Free** / **Pro** ($19) / **Agency** ($79). Internal `enterprise` key still maps to Agency tier.

## Never
- Position as "Typeform alternative", "Tally alternative", or "AI form builder."
- Compete on builder polish, themes, or field-type count.
- Lead landing copy with conversational forms, AI generation, or templates.
- Build vertical SaaS features (HIPAA, ATS, EHR) before workflow infra exists.

## Why
Tally offers unlimited free forms; Typeform owns the brand; Google Forms owns convenience. The only winnable wedge is "what happens after submit": webhook delivery, routing, inbox, integrations. Verticalization comes later, on top of validated workflow usage.

## Roadmap gates
- **Phase 0 (this PR):** landing rewrite, pricing rewrite, DB schema for workspaces / webhook_endpoints / webhook_deliveries / routing_rules / submission_metadata / api_tokens.
- **Phase 1:** webhook delivery edge function, submission inbox UI, framework SDK docs.
- **Phase 2:** Slack + Sheets integrations, AI summaries, routing rule UI.
- **Phase 3:** agency white-label, custom domains, workspace switcher.
