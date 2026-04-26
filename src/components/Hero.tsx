import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-background">
      {/* Calm routing-line motif — subtle SVG instead of decorative gradients */}
      <svg
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 w-full h-[520px] text-border"
        preserveAspectRatio="none"
        viewBox="0 0 1440 520"
        fill="none"
      >
        <defs>
          <linearGradient id="ingrid-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.7" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Converging routing lines — three sources into one node */}
        <path d="M0 120 Q 480 120 720 260" stroke="url(#ingrid-fade)" strokeWidth="1" />
        <path d="M0 260 Q 480 260 720 260" stroke="url(#ingrid-fade)" strokeWidth="1" />
        <path d="M0 400 Q 480 400 720 260" stroke="url(#ingrid-fade)" strokeWidth="1" />
        <path d="M720 260 Q 960 260 1440 120" stroke="url(#ingrid-fade)" strokeWidth="1" />
        <path d="M720 260 Q 960 260 1440 260" stroke="url(#ingrid-fade)" strokeWidth="1" />
        <path d="M720 260 Q 960 260 1440 400" stroke="url(#ingrid-fade)" strokeWidth="1" />
        <circle cx="720" cy="260" r="3" fill="hsl(var(--primary))" />
      </svg>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs mb-6 text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Form backend + routing for modern websites
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl md:text-6xl font-semibold tracking-tight text-balance mb-6 text-foreground"
          >
            Capture submissions, route work, and{" "}
            <span className="text-primary">automate follow-up</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance"
          >
            Ingrid is the inbound engine for forms — reliable webhooks, spam protection,
            conditional routing, and a triage inbox for everything that comes in.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
          >
            <Button size="lg" onClick={() => navigate("/auth")} className="group">
              Start free
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/docs")}
            >
              <Terminal className="mr-2 h-4 w-4" />
              View docs
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-xs text-muted-foreground flex flex-wrap justify-center gap-x-6 gap-y-2"
          >
            <span>✓ 100 free submissions / month</span>
            <span>✓ No credit card required</span>
            <span>✓ 60-second setup</span>
          </motion.div>
        </div>

        {/* Hero terminal mock */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto mt-16"
        >
          <div className="rounded-xl border border-border overflow-hidden shadow-lg bg-[hsl(226_50%_9%)]">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-[hsl(218_32%_15%)]">
              <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
              <span className="ml-3 text-xs text-white/60 font-mono">terminal</span>
            </div>
            <pre className="p-6 text-sm font-mono text-[hsl(213_30%_96%)] overflow-x-auto leading-relaxed">
{`$ curl -X POST https://api.ingrid.dev/v1/submit/frm_abc123 \\
    -H "Content-Type: application/json" \\
    -d '{ "email": "lead@acme.com", "plan": "enterprise" }'

✓ Submission stored          (id: sub_8x2k...)
✓ Spam check passed          (score: 0.02)
✓ Routing rule matched       ("enterprise → #sales")
✓ Webhook delivered to Slack (120ms, 200 OK)`}
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
