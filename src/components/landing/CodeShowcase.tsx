import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const snippets = {
  curl: `curl -X POST https://api.formcraft.dev/v1/submit/frm_abc123 \\
  -H "Content-Type: application/json" \\
  -d '{ "email": "lead@acme.com", "message": "Interested in pricing" }'`,
  nextjs: `// app/api/contact/route.ts
export async function POST(req: Request) {
  const data = await req.json();
  await fetch("https://api.formcraft.dev/v1/submit/frm_abc123", {
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
      action="https://api.formcraft.dev/v1/submit/frm_abc123"
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
  action="https://api.formcraft.dev/v1/submit/frm_abc123"
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
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
            Drop it into any stack in 60 seconds
          </h2>
          <p className="text-primary/60">
            One endpoint. Works with Next.js, React, Astro, plain HTML — or curl.
          </p>
        </div>

        <div className="max-w-3xl mx-auto rounded-xl border bg-card overflow-hidden shadow-sm">
          <Tabs value={tab} onValueChange={(v) => setTab(v as keyof typeof snippets)}>
            <div className="flex items-center justify-between border-b px-3 py-2 bg-muted/40">
              <TabsList className="bg-transparent gap-1">
                <TabsTrigger value="curl">curl</TabsTrigger>
                <TabsTrigger value="nextjs">Next.js</TabsTrigger>
                <TabsTrigger value="react">React</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8">
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            {(Object.keys(snippets) as (keyof typeof snippets)[]).map((k) => (
              <TabsContent key={k} value={k} className="m-0">
                <pre className="p-6 text-sm overflow-x-auto bg-foreground text-background font-mono leading-relaxed">
                  <code>{snippets[k]}</code>
                </pre>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};
