import { DocH1, DocLead, DocH2, DocP, DocList, CodeBlock, InlineCode, Callout } from "./components";

export default function Webhooks() {
  return (
    <article>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Core concepts
      </div>
      <DocH1>Webhooks</DocH1>
      <DocLead>
        Every submission can be forwarded to your stack as a signed JSON payload, with
        automatic retries and full delivery history.
      </DocLead>

      <DocH2 id="payload">Payload</DocH2>
      <CodeBlock language="json">{`{
  "id": "sub_8x2k3p",
  "form_id": "frm_abc123",
  "submitted_at": "2026-04-25T10:21:00Z",
  "data": { "email": "lead@acme.com", "plan": "enterprise" },
  "metadata": { "ip": "203.0.113.4", "user_agent": "Mozilla/5.0..." }
}`}</CodeBlock>

      <DocH2 id="signing">Signature verification</DocH2>
      <DocP>
        Each request includes <InlineCode>X-Ingrid-Signature</InlineCode> — an HMAC-SHA256
        hash of the raw body using your endpoint secret. Verify it before trusting a payload:
      </DocP>
      <CodeBlock language="ts">{`import crypto from "node:crypto";

function verify(rawBody: string, signature: string, secret: string) {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}`}</CodeBlock>

      <DocH2 id="retries">Retries</DocH2>
      <DocList>
        <li>Up to 5 attempts with exponential backoff (1m, 5m, 30m, 2h, 12h).</li>
        <li>Considered successful on any 2xx response.</li>
        <li>Anything else is queued for retry; final failures land in the delivery log.</li>
      </DocList>

      <Callout variant="warning">
        Webhook endpoints must respond within 10 seconds. Long-running processing should be
        offloaded to a queue on your side.
      </Callout>
    </article>
  );
}