import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 -z-10 hero-pattern opacity-40" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-b from-secondary/40 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Form backend + routing for modern websites
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl md:text-6xl font-playfair font-semibold tracking-tight text-balance mb-6"
          >
            Reliable form backend for{" "}
            <span className="italic underline decoration-primary/30 underline-offset-4">
              modern websites
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-primary/70 max-w-2xl mx-auto mb-10 text-balance"
          >
            Capture submissions, block spam, trigger workflows, and manage responses —
            without building backend plumbing from scratch.
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
              onClick={() => document.getElementById("code")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Terminal className="mr-2 h-4 w-4" />
              See the code
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-xs text-primary/50 flex flex-wrap justify-center gap-x-6 gap-y-2"
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
          <div className="rounded-xl border bg-card overflow-hidden shadow-xl">
            <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/40">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
              <span className="ml-3 text-xs text-primary/50 font-mono">terminal</span>
            </div>
            <pre className="p-6 text-sm font-mono bg-foreground text-background overflow-x-auto leading-relaxed">
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
