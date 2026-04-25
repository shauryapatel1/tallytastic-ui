import { AlertTriangle, Shuffle, Bug, Inbox } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "Submissions get lost in inboxes",
    desc: "Email notifications pile up. Important leads slip past the noise.",
  },
  {
    icon: Bug,
    title: "Spam pollutes your data",
    desc: "No filtering means every honeypot, bot, and scraper ends up in your CRM.",
  },
  {
    icon: Shuffle,
    title: "No routing logic",
    desc: "Enterprise leads, support tickets, and partnership requests all land in the same place.",
  },
  {
    icon: Inbox,
    title: "Too much custom backend",
    desc: "Webhooks, retries, signatures, rate limits, dashboards — none of it ships value.",
  },
];

export const Problem = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs mb-4 text-muted-foreground">
            The problem
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-foreground">
            Forms are easy. What happens after submit isn't.
          </h2>
          <p className="text-muted-foreground">
            Most teams glue together email, scripts, and webhooks until something breaks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {problems.map((p) => (
            <div
              key={p.title}
              className="flex gap-4 rounded-xl border border-border bg-card p-5"
            >
              <div className="h-9 w-9 shrink-0 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
                <p.icon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};