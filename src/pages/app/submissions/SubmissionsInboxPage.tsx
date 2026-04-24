import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Inbox, RefreshCw, Search } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { PageShell } from "@/components/app/PageShell";
import {
  EmptyState,
  StatusChip,
  SUBMISSION_STATUS_TONE,
  TableShell,
  Td,
  Th,
  Tr,
} from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  submissionsService,
  type SubmissionListItem,
  type SubmissionStatus,
} from "@/services/submissionsService";
import { SubmissionDetailPanel } from "./SubmissionDetailPanel";
import { formatDistanceToNow } from "date-fns";

const STATUS_TABS: Array<{ value: SubmissionStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "archived", label: "Archived" },
  { value: "spam", label: "Spam" },
];

export default function SubmissionsInboxPage() {
  const { workspace, loading: wsLoading } = useActiveWorkspace();
  const navigate = useNavigate();
  const { responseId } = useParams<{ responseId?: string }>();
  const queryClient = useQueryClient();

  const [statusTab, setStatusTab] = useState<SubmissionStatus | "all">("all");
  const [search, setSearch] = useState("");

  const queryKey = useMemo(
    () => ["submissions", workspace?.id, statusTab],
    [workspace?.id, statusTab],
  );

  const { data: submissions = [], isLoading, refetch } = useQuery({
    queryKey,
    enabled: !!workspace?.id,
    queryFn: () =>
      submissionsService.listSubmissions({
        workspaceId: workspace!.id,
        status: statusTab,
      }),
  });

  // Realtime: refresh list when responses or metadata change
  useEffect(() => {
    if (!workspace?.id) return;
    const channel = supabase
      .channel(`inbox-${workspace.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "form_responses" },
        () => queryClient.invalidateQueries({ queryKey: ["submissions"] }),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "submission_metadata" },
        () => queryClient.invalidateQueries({ queryKey: ["submissions"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspace?.id, queryClient]);

  const filtered = useMemo(() => {
    if (!search.trim()) return submissions;
    const q = search.toLowerCase();
    return submissions.filter(
      (s) =>
        s.preview.toLowerCase().includes(q) ||
        (s.formTitle ?? "").toLowerCase().includes(q),
    );
  }, [submissions, search]);

  const selected = responseId
    ? submissions.find((s) => s.id === responseId)
    : undefined;

  const handleRowClick = (row: SubmissionListItem) => {
    navigate(`/app/submissions/${row.id}`);
  };

  return (
    <PageShell
      title="Submissions"
      description="Every response that lands in your workspace — triage, route, and resolve."
      breadcrumbs={[{ label: "Submissions" }]}
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      }
      bleed
    >
      <div className="flex h-full flex-col lg:flex-row">
        {/* List column */}
        <div className="flex min-w-0 flex-1 flex-col border-r border-border">
          <div className="flex flex-wrap items-center gap-3 border-b border-border bg-background px-6 py-3">
            <Tabs
              value={statusTab}
              onValueChange={(v) => setStatusTab(v as SubmissionStatus | "all")}
            >
              <TabsList>
                {STATUS_TABS.map((t) => (
                  <TabsTrigger key={t.value} value={t.value}>
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="relative ml-auto w-full max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search submissions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {wsLoading || isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 animate-pulse rounded-md bg-muted/50"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title={search ? "No matching submissions" : "Inbox is clear"}
                description={
                  search
                    ? "Try another search term or clear filters."
                    : "When a published form receives a response, it lands here."
                }
              />
            ) : (
              <TableShell>
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <Th>Status</Th>
                      <Th>Form</Th>
                      <Th>Preview</Th>
                      <Th align="right">Received</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => {
                      const tone = SUBMISSION_STATUS_TONE[row.status];
                      const isActive = row.id === responseId;
                      return (
                        <Tr
                          key={row.id}
                          onClick={() => handleRowClick(row)}
                          className={`cursor-pointer ${isActive ? "bg-muted/60" : ""}`}
                        >
                          <Td>
                            <StatusChip label={tone.label} tone={tone.tone} />
                          </Td>
                          <Td className="font-medium text-foreground">
                            {row.formTitle ?? "Untitled form"}
                          </Td>
                          <Td className="max-w-[28rem] truncate text-muted-foreground">
                            {row.preview}
                          </Td>
                          <Td align="right" className="text-muted-foreground">
                            {formatDistanceToNow(new Date(row.submittedAt), {
                              addSuffix: true,
                            })}
                          </Td>
                        </Tr>
                      );
                    })}
                  </tbody>
                </table>
              </TableShell>
            )}
          </div>
        </div>

        {/* Detail column */}
        {selected || responseId ? (
          <div className="hidden w-[28rem] shrink-0 overflow-y-auto bg-muted/20 px-4 py-6 lg:block">
            <SubmissionDetailPanel
              responseId={responseId!}
              onClose={() => navigate("/app/submissions")}
            />
          </div>
        ) : (
          <div className="hidden w-[28rem] shrink-0 items-center justify-center bg-muted/20 px-4 py-6 lg:flex">
            <p className="text-sm text-muted-foreground">
              Select a submission to view details
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}