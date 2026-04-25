import { Link } from "react-router-dom";
import { DocH1, DocLead, DocH2, DocP, DocList, InlineCode } from "./components";

export default function Submissions() {
  return (
    <article>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Core concepts
      </div>
      <DocH1>Submissions</DocH1>
      <DocLead>
        Every captured response lives in the Submissions inbox — your operational view of
        everything that came in.
      </DocLead>

      <DocH2 id="lifecycle">Lifecycle</DocH2>
      <DocList>
        <li><InlineCode>new</InlineCode> — just received, awaiting triage.</li>
        <li><InlineCode>in_progress</InlineCode> — assigned and being worked on.</li>
        <li><InlineCode>done</InlineCode> — closed, no further action required.</li>
        <li><InlineCode>archived</InlineCode> — out of view, kept for the record.</li>
        <li><InlineCode>spam</InlineCode> — caught by filters or marked manually.</li>
      </DocList>

      <DocH2 id="triage">Triage</DocH2>
      <DocP>
        Open the <Link className="text-primary hover:underline" to="/app/submissions">inbox</Link>{" "}
        to update status, add tags, assign teammates, attach notes, and replay webhook deliveries.
        Realtime updates keep every viewer in sync.
      </DocP>

      <DocH2 id="versioning">Versioning</DocH2>
      <DocP>
        Submissions are bound to the form version that was published when they came in. Editing
        a form afterwards never alters the shape of historical responses.
      </DocP>
    </article>
  );
}