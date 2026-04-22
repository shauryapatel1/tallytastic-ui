
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How is this different from Tally or Typeform?",
    answer: "Tally and Typeform optimize for the form builder. Ingrid optimizes for what happens after submit — signed webhooks, retries, spam filtering, conditional routing, and a triage inbox. If your forms feed real workflows (CRM, Slack, internal tools), Ingrid is the layer those tools assume already exists."
  },
  {
    question: "Can I keep my existing form HTML?",
    answer: "Yes. Point any HTML form's action to your Ingrid endpoint, or POST JSON from your own UI. There's no SDK lock-in and no required builder. Use ours when it helps; ignore it when it doesn't."
  },
  {
    question: "How do webhook retries work?",
    answer: "Every webhook payload is HMAC-SHA256 signed and delivered with exponential backoff up to 5 attempts. Every attempt is logged with response code, body, and latency. Failed deliveries can be replayed from the dashboard with one click."
  },
  {
    question: "What's included in spam protection?",
    answer: "Honeypot fields, per-IP rate limiting, and pluggable Cloudflare Turnstile / reCAPTCHA support out of the box. Suspected spam goes to a separate folder so it never pollutes your real submissions."
  },
  {
    question: "Do you support multi-client / agency workflows?",
    answer: "Yes. The Agency plan gives you multiple workspaces, per-client branding, team roles, and reusable templates across workspaces. Built specifically for agencies juggling 10+ client sites."
  },
  {
    question: "Is there an API?",
    answer: "Yes. Workspace-scoped API tokens let you submit, list submissions, manage webhooks, and update routing rules programmatically. Tokens are scoped, revocable, and audit-logged."
  },
  {
    question: "Where is data stored?",
    answer: "Submissions live in a Postgres database with row-level security and per-workspace isolation. You own your data, can export it as CSV/JSON anytime, and we provide one-click account deletion."
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
            Questions developers and agencies ask
          </h2>
          <p className="text-primary/60">
            Straight answers about reliability, pricing, and lock-in.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 py-1">
                <AccordionTrigger className="text-left font-medium py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-primary/70 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
