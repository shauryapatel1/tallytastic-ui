import { Webhook, Shield, Inbox, GitBranch, Code2, Lock } from "lucide-react";

const features = [
  {
    icon: Webhook,
    title: "Signed webhooks with retries",
    desc: "HMAC-signed payloads, exponential backoff, full delivery history, and one-click replay.",
  },
  {
    icon: Shield,
    title: "Spam protection that works",
    desc: "Honeypot fields, IP rate limits, and Turnstile/reCAPTCHA adapters baked in.",
  },
  {
    icon: GitBranch,
    title: "Conditional routing rules",
    desc: "Send enterprise leads to Slack, support tickets to your CRM, everything else to email.",
  },
  {
    icon: Inbox,
    title: "Submission inbox",
    desc: "Triage responses with status, tags, assignment, and notes — without leaving the dashboard.",
  },
  {
    icon: Code2,
    title: "Framework-ready",
    desc: "Drop-in recipes for Next.js, React, Astro, and plain HTML. No SDK required.",
  },
  {
    icon: Lock,
    title: "Workspace-scoped API tokens",
    desc: "Per-project secrets, scoped permissions, and audit-ready access logs.",
  },
];

export const DeveloperFeatures = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
            Backend plumbing, solved
          </h2>
          <p className="text-primary/60">
            Everything you'd otherwise build yourself — webhooks, retries, spam, routing, inbox — in one focused product.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-primary/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
