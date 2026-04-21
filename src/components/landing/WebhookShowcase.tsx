import { motion } from "framer-motion";
import { ArrowRight, Inbox, Slack, Database, Mail, Zap, Shield } from "lucide-react";

const destinations = [
  { icon: Slack, label: "Slack" },
  { icon: Database, label: "Sheets" },
  { icon: Mail, label: "Email" },
  { icon: Zap, label: "Zapier" },
];

export const WebhookShowcase = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
            Every submission, routed where it belongs
          </h2>
          <p className="text-primary/60">
            Signed webhooks with automatic retries. Conditional routing. Spam blocked before it hits your inbox.
          </p>
        </div>

        <div className="max-w-5xl mx-auto rounded-2xl border bg-card p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Submission */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border bg-background p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Inbox className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Submission</span>
              </div>
              <div className="space-y-2 text-xs font-mono text-primary/70">
                <div className="bg-muted rounded px-2 py-1">email: lead@acme.com</div>
                <div className="bg-muted rounded px-2 py-1">plan: enterprise</div>
                <div className="bg-muted rounded px-2 py-1">budget: $50k+</div>
              </div>
            </motion.div>

            {/* Engine */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="relative flex flex-col items-center"
            >
              <div className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 text-primary/40">
                <ArrowRight className="h-5 w-5" />
              </div>
              <div className="rounded-xl border-2 border-primary bg-primary text-primary-foreground p-5 w-full text-center">
                <Shield className="h-5 w-5 mx-auto mb-2" />
                <div className="text-sm font-semibold">FormCraft</div>
                <div className="text-xs opacity-80 mt-1">spam · validate · route · retry</div>
              </div>
              <div className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 text-primary/40">
                <ArrowRight className="h-5 w-5" />
              </div>
            </motion.div>

            {/* Destinations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-3"
            >
              {destinations.map((d) => (
                <div
                  key={d.label}
                  className="rounded-xl border bg-background p-3 flex flex-col items-center gap-1"
                >
                  <d.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">{d.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t">
            {[
              { label: "Avg delivery", value: "120ms" },
              { label: "Retry attempts", value: "Up to 5" },
              { label: "Signed payloads", value: "HMAC-SHA256" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-semibold">{s.value}</div>
                <div className="text-xs text-primary/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
