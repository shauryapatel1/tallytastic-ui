import { DocH1, DocLead, DocH2, DocP, DocList, CodeBlock, InlineCode } from "./components";

export default function Routing() {
  return (
    <article>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Core concepts
      </div>
      <DocH1>Routing rules</DocH1>
      <DocLead>
        Send the right submissions to the right destinations based on field values.
      </DocLead>

      <DocH2 id="model">When / If / Then</DocH2>
      <DocP>
        Every routing rule reads as a sentence: <InlineCode>When</InlineCode> a submission is
        received, <InlineCode>If</InlineCode> the conditions match, <InlineCode>Then</InlineCode>
        run the configured actions.
      </DocP>

      <DocH2 id="example">Example</DocH2>
      <CodeBlock language="json">{`{
  "name": "Enterprise leads → #sales",
  "conditions": [
    { "field": "plan", "op": "equals", "value": "enterprise" }
  ],
  "actions": [
    { "type": "webhook", "endpoint_id": "wh_slack_sales" },
    { "type": "tag", "value": "enterprise" }
  ]
}`}</CodeBlock>

      <DocH2 id="evaluation">Evaluation</DocH2>
      <DocList>
        <li>Rules run in priority order. First match wins unless <InlineCode>continue</InlineCode> is set.</li>
        <li>Inactive rules are skipped without affecting downstream actions.</li>
        <li>Failed actions appear in the rule's execution log with retry status.</li>
      </DocList>
    </article>
  );
}