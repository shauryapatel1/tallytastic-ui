import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { DocH1, DocLead, DocH2, DocP, DocList, InlineCode } from "./components";

export default function Introduction() {
  return (
    <article>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Get started
      </div>
      <DocH1>Introduction</DocH1>
      <DocLead>
        Ingrid is the inbound engine for forms — capture submissions, route work, and
        automate follow-up without building backend plumbing from scratch.
      </DocLead>

      <DocH2>What you get</DocH2>
      <DocList>
        <li>One <InlineCode>POST</InlineCode> endpoint per form — works with any frontend.</li>
        <li>HMAC-signed webhooks with retries and full delivery history.</li>
        <li>Spam protection (honeypot + rate limits + Turnstile/reCAPTCHA adapters).</li>
        <li>Conditional routing based on submission field values.</li>
        <li>A triage inbox for status, tags, assignment, and notes.</li>
      </DocList>

      <DocH2>Where to go next</DocH2>
      <DocP>
        New here? Follow the <Link className="text-primary hover:underline" to="/docs/quickstart">Quickstart</Link>
        {" "}to receive your first submission in under five minutes.
      </DocP>

      <div className="mt-10 grid sm:grid-cols-2 gap-3">
        <Link
          to="/docs/quickstart"
          className="group rounded-xl border border-border bg-card p-5 hover:border-border-strong transition-colors"
        >
          <div className="text-sm font-semibold text-foreground mb-1">Quickstart →</div>
          <div className="text-sm text-muted-foreground">Receive your first submission in 5 minutes.</div>
        </Link>
        <Link
          to="/docs/webhooks"
          className="group rounded-xl border border-border bg-card p-5 hover:border-border-strong transition-colors"
        >
          <div className="text-sm font-semibold text-foreground mb-1">Webhooks →</div>
          <div className="text-sm text-muted-foreground">Signed payloads, retries, and replay.</div>
        </Link>
      </div>
    </article>
  );
}