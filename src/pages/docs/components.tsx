import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DocH1 = ({ children }: { children: React.ReactNode }) => (
  <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-3">{children}</h1>
);

export const DocLead = ({ children }: { children: React.ReactNode }) => (
  <p className="text-lg text-muted-foreground mb-10 leading-relaxed">{children}</p>
);

export const DocH2 = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <h2
    id={id}
    className="group text-2xl font-semibold tracking-tight text-foreground mt-12 mb-4 scroll-mt-24 flex items-center gap-2"
  >
    <span>{children}</span>
    {id ? <AnchorLink id={id} /> : null}
  </h2>
);

export const DocH3 = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <h3
    id={id}
    className="group text-lg font-semibold text-foreground mt-8 mb-3 scroll-mt-24 flex items-center gap-2"
  >
    <span>{children}</span>
    {id ? <AnchorLink id={id} /> : null}
  </h3>
);

/**
 * Small "#" button shown on hover next to a heading.
 * Updates the URL hash and copies a deep link to the clipboard.
 */
const AnchorLink = ({ id }: { id: string }) => {
  const [copied, setCopied] = useState(false);
  const handleClick = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    // Update hash without jumping; smooth-scroll the element into view
    history.replaceState(null, "", `#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Copy link to ${id}`}
      className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted-foreground hover:text-primary transition-opacity"
    >
      {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
    </button>
  );
};

export const DocP = ({ children }: { children: React.ReactNode }) => (
  <p className="text-foreground/80 leading-relaxed mb-4">{children}</p>
);

export const DocList = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc pl-6 space-y-2 text-foreground/80 mb-4">{children}</ul>
);

export const InlineCode = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground border border-border">
    {children}
  </code>
);

export const CodeBlock = ({
  language,
  children,
}: {
  language?: string;
  children: string;
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="my-6 rounded-xl border border-border bg-foreground overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/30 bg-foreground">
        <span className="text-xs font-mono text-background/60">{language ?? "text"}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 text-background/70 hover:text-background hover:bg-background/10"
        >
          {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="p-4 text-sm font-mono text-background overflow-x-auto leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
};

export const Callout = ({
  variant = "info",
  children,
}: {
  variant?: "info" | "success" | "warning";
  children: React.ReactNode;
}) => {
  const styles = {
    info: "bg-info-soft border-info/20 text-foreground",
    success: "bg-success-soft border-success/20 text-foreground",
    warning: "bg-warning-soft border-warning/30 text-foreground",
  }[variant];
  return (
    <div className={`rounded-lg border p-4 my-6 text-sm ${styles}`}>{children}</div>
  );
};