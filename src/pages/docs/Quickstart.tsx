import { Link } from "react-router-dom";
import { DocH1, DocLead, DocH2, DocP, CodeBlock, Callout, InlineCode } from "./components";

export default function Quickstart() {
  return (
    <article>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Get started
      </div>
      <DocH1>Quickstart</DocH1>
      <DocLead>
        Send your first submission to Ingrid in under five minutes — no SDK, no servers.
      </DocLead>

      <DocH2 id="step-1">1. Create a form</DocH2>
      <DocP>
        Sign in, click <InlineCode>New form</InlineCode>, and Ingrid will give you a
        unique form id like <InlineCode>frm_abc123</InlineCode>. That's all you need.
      </DocP>

      <DocH2 id="step-2">2. Submit from anywhere</DocH2>
      <DocP>Point any HTML form, fetch call, or curl request at your endpoint:</DocP>
      <CodeBlock language="bash">{`curl -X POST https://api.ingrid.dev/v1/submit/frm_abc123 \\
  -H "Content-Type: application/json" \\
  -d '{ "email": "lead@acme.com", "message": "Interested" }'`}</CodeBlock>

      <DocP>Or drop a plain HTML form into your site:</DocP>
      <CodeBlock language="html">{`<form action="https://api.ingrid.dev/v1/submit/frm_abc123" method="POST">
  <input name="email" type="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>`}</CodeBlock>

      <Callout variant="info">
        Submissions are validated against the form's published version. Field names in your
        request must match field ids in your form.
      </Callout>

      <DocH2 id="step-3">3. See it in your inbox</DocH2>
      <DocP>
        Open the <Link className="text-primary hover:underline" to="/app/submissions">Submissions inbox</Link>
        {" "}and your test submission will appear within seconds.
      </DocP>

      <DocH2 id="step-4">4. Connect a destination</DocH2>
      <DocP>
        Add a webhook in <InlineCode>Form → Integrations</InlineCode>. Every submission will be
        delivered with an HMAC-SHA256 signature, retried with exponential backoff, and replayable
        from the dashboard.
      </DocP>

      <Callout variant="success">
        Done. Anything that comes in is captured, filtered, and delivered.
        Read <Link className="text-primary hover:underline" to="/docs/webhooks">Webhooks</Link>
        {" "}or <Link className="text-primary hover:underline" to="/docs/routing">Routing rules</Link> next.
      </Callout>
    </article>
  );
}