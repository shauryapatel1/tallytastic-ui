import { DocH1, DocLead, DocH2, DocP, CodeBlock, InlineCode } from "./components";

export default function ApiReference() {
  return (
    <article>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Reference
      </div>
      <DocH1>API reference</DocH1>
      <DocLead>
        Workspace-scoped tokens authenticate every API request. Tokens are scoped, revocable,
        and audit-logged.
      </DocLead>

      <DocH2 id="auth">Authentication</DocH2>
      <DocP>
        Pass your token via the <InlineCode>Authorization</InlineCode> header. Public submission
        endpoints (<InlineCode>POST /v1/submit/:formId</InlineCode>) do not require authentication.
      </DocP>
      <CodeBlock language="bash">{`curl https://api.ingrid.dev/v1/submissions \\
  -H "Authorization: Bearer ingrid_live_xxx"`}</CodeBlock>

      <DocH2 id="submit">Submit a response</DocH2>
      <CodeBlock language="http">{`POST /v1/submit/:formId
Content-Type: application/json

{ "email": "lead@acme.com", "message": "Interested" }`}</CodeBlock>

      <DocH2 id="list">List submissions</DocH2>
      <CodeBlock language="http">{`GET /v1/submissions?form_id=frm_abc123&status=new&limit=50
Authorization: Bearer ingrid_live_xxx`}</CodeBlock>

      <DocH2 id="resend">Resend a webhook</DocH2>
      <CodeBlock language="http">{`POST /v1/webhooks/deliveries/:id/resend
Authorization: Bearer ingrid_live_xxx`}</CodeBlock>
    </article>
  );
}