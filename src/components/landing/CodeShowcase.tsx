import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const snippets = {
  curl: `curl -X POST https://api.ingrid.dev/v1/submit/frm_abc123 \\
  -H "Content-Type: application/json" \\
  -d '{ "email": "lead@acme.com", "message": "Interested in pricing" }'`,
  nextjs: `// app/api/contact/route.ts
export async function POST(req: Request) {
  const data = await req.json();
  await fetch("https://api.ingrid.dev/v1/submit/frm_abc123", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return Response.json({ ok: true });
}`,
  react: `import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      action="https://api.ingrid.dev/v1/submit/frm_abc123"
      method="POST"
      onSubmit={() => setSent(true)}
    >
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Send</button>
    </form>
  );
}`,
  html: `<form
  action="https://api.ingrid.dev/v1/submit/frm_abc123"
  method="POST"
>
  <input name="email" type="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>`,
};

export const CodeShowcase = () => {
  const [tab, setTab] = useState<keyof typeof snippets>("curl");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippets[tab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section id="code" className="py-24 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-foreground">
            Drop it into any stack in 60 seconds
          </h2>
          <p className="text-muted-foreground">
            One endpoint. Works with Next.js, React, Astro, plain HTML — or curl.
          </p>
        </div>

        <div className="max-w-3xl mx-auto rounded-xl border border-border overflow-hidden shadow-sm bg-[hsl(226_50%_9%)]">
          <Tabs value={tab} onValueChange={(v) => setTab(v as keyof typeof snippets)}>
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 bg-[hsl(218_32%_15%)]">
              <TabsList className="bg-transparent gap-1">
                <TabsTrigger value="curl">curl</TabsTrigger>
                <TabsTrigger value="nextjs">Next.js</TabsTrigger>
                <TabsTrigger value="react">React</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 text-white/80 hover:text-white hover:bg-white/10">
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            {(Object.keys(snippets) as (keyof typeof snippets)[]).map((k) => (
              <TabsContent key={k} value={k} className="m-0">
                <pre className="p-6 text-sm overflow-x-auto text-[hsl(213_30%_96%)] font-mono leading-relaxed">
                  <code>{snippets[k]}</code>
                </pre>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/docs/quickstart"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
          >
            Read the quickstart <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
