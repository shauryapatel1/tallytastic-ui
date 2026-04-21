import { Building2, Code2, Briefcase, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const useCases = [
  {
    icon: Briefcase,
    title: "Agencies",
    headline: "Manage every client form from one workspace",
    points: [
      "Client-branded confirmation pages",
      "Per-project workspaces & team roles",
      "Reusable form templates across clients",
    ],
  },
  {
    icon: Code2,
    title: "Indie developers",
    headline: "Skip the form backend on every side project",
    points: [
      "One endpoint per form, zero servers",
      "Next.js / Astro / React recipes",
      "Generous free tier, predictable pricing",
    ],
  },
  {
    icon: Building2,
    title: "SaaS teams",
    headline: "Lead capture, intake, and support — wired up",
    points: [
      "Signed webhooks into your stack",
      "Routing rules by field value",
      "Inbox triage with status & assignment",
    ],
  },
];

export const UseCases = () => {
  const navigate = useNavigate();
  return (
    <section id="use-cases" className="py-24 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
            Built for teams who ship
          </h2>
          <p className="text-primary/60">
            Whether you run an agency, a side project, or a SaaS — the form is the easy part.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="rounded-xl border bg-card p-6 flex flex-col"
            >
              <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center mb-4">
                <uc.icon className="h-5 w-5" />
              </div>
              <div className="text-xs uppercase tracking-wider text-primary/60 mb-1">
                {uc.title}
              </div>
              <h3 className="font-semibold text-lg mb-4">{uc.headline}</h3>
              <ul className="space-y-2 text-sm text-primary/70 flex-1">
                {uc.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/auth")}
                className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
