import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { searchDocs, DOC_ENTRIES } from "./searchIndex";

/**
 * Trigger button + dialog for searching the docs.
 * Cmd/Ctrl+K opens the dialog from anywhere within /docs.
 */
export const DocsSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Cmd/Ctrl+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) {
      // Show first heading of each page as a default "browse" list
      const seen = new Set<string>();
      return DOC_ENTRIES.filter((e) => {
        if (seen.has(e.path)) return false;
        seen.add(e.path);
        return true;
      });
    }
    return searchDocs(query);
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof results>();
    for (const r of results) {
      if (!map.has(r.group)) map.set(r.group, []);
      map.get(r.group)!.push(r);
    }
    return Array.from(map.entries());
  }, [results]);

  const handleSelect = (path: string, anchor?: string) => {
    setOpen(false);
    setQuery("");
    const url = anchor ? `${path}#${anchor}` : path;
    navigate(url);
  };

  const isMac =
    typeof navigator !== "undefined" &&
    /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-full items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors md:w-[280px]"
        aria-label="Search docs"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search docs…</span>
        <kbd className="pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          {isMac ? "⌘" : "Ctrl"} K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search headings, code, concepts…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          {grouped.map(([group, entries]) => (
            <CommandGroup key={group} heading={group}>
              {entries.map((entry) => (
                <CommandItem
                  key={`${entry.path}#${entry.anchor ?? "_"}`}
                  // Use a value that keeps cmdk's own filter from hiding results
                  // (we already filtered ourselves).
                  value={`${entry.heading} ${entry.page} ${entry.body}`}
                  onSelect={() => handleSelect(entry.path, entry.anchor)}
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">{entry.heading}</span>
                    <span className="text-xs text-muted-foreground">
                      {entry.page}
                      {entry.anchor ? ` · #${entry.anchor}` : ""}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};