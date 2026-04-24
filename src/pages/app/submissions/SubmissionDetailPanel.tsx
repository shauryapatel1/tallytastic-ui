import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import {
  Activity,
  ArrowDownToLine,
  CheckCircle2,
  MessageSquarePlus,
  RefreshCw,
  Tag as TagIcon,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  DetailPanel,
  DetailRow,
  EventLog,
  EventLogRow,
  StatusChip,
  SUBMISSION_STATUS_TONE,
  WEBHOOK_STATUS_TONE,
} from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  submissionsService,
  type SubmissionStatus,
} from "@/services/submissionsService";

const STATUS_OPTIONS: SubmissionStatus[] = [
  "new",
  "in_progress",
  "done",
  "archived",
  "spam",
];

const EVENT_LABEL: Record<string, string> = {
  received: "Submission received",
  status_changed: "Status changed",
  note_added: "Note added",
  tag_added: "Tag added",
  assigned: "Assigned",
  webhook_resent: "Webhook resent",
  routing_fired: "Routing rule fired",
};

function eventTone(eventType: string) {
  switch (eventType) {
    case "received":
      return "info" as const;
    case "status_changed":
      return "warning" as const;
    case "webhook_resent":
      return "info" as const;
    case "routing_fired":
      return "success" as const;
    default:
      return "neutral" as const;
  }
}

export function SubmissionDetailPanel({
  responseId,
  onClose,
}: {
  responseId: string;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [note, setNote] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [resending, setResending] = useState<string | null>(null);

  const { data: detail, isLoading } = useQuery({
    queryKey: ["submission", responseId],
    queryFn: () => submissionsService.getSubmission(responseId),
  });

  const { data: events = [] } = useQuery({
    queryKey: ["submission-events", responseId],
    queryFn: () => submissionsService.listEvents(responseId),
  });

  const { data: deliveries = [] } = useQuery({
    queryKey: ["submission-deliveries", responseId],
    queryFn: () => submissionsService.listWebhookDeliveries(responseId),
  });

  // Realtime: refresh events + deliveries for this submission
  useEffect(() => {
    const channel = supabase
      .channel(`submission-${responseId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "submission_events",
          filter: `form_response_id=eq.${responseId}`,
        },
        () =>
          queryClient.invalidateQueries({
            queryKey: ["submission-events", responseId],
          }),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "webhook_deliveries",
          filter: `submission_id=eq.${responseId}`,
        },
        () =>
          queryClient.invalidateQueries({
            queryKey: ["submission-deliveries", responseId],
          }),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "submission_metadata",
          filter: `form_response_id=eq.${responseId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["submission", responseId] });
          queryClient.invalidateQueries({ queryKey: ["submissions"] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [responseId, queryClient]);

  if (isLoading || !detail) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-md bg-muted/50" />
        <div className="h-48 animate-pulse rounded-md bg-muted/50" />
      </div>
    );
  }

  const tone = SUBMISSION_STATUS_TONE[detail.status];

  async function handleStatusChange(next: SubmissionStatus) {
    if (!user || next === detail.status) return;
    try {
      await submissionsService.setStatus(
        detail.id,
        detail.workspaceId,
        next,
        user.id,
      );
      toast({ title: "Status updated", description: SUBMISSION_STATUS_TONE[next].label });
    } catch (e) {
      toast({
        title: "Failed to update status",
        description: e instanceof Error ? e.message : String(e),
        variant: "destructive",
      });
    }
  }

  async function handleAddNote() {
    if (!user || !note.trim()) return;
    try {
      await submissionsService.addNote(
        detail.id,
        detail.workspaceId,
        note.trim(),
        user.id,
      );
      setNote("");
      toast({ title: "Note saved" });
    } catch (e) {
      toast({
        title: "Failed to save note",
        description: e instanceof Error ? e.message : String(e),
        variant: "destructive",
      });
    }
  }

  async function handleAddTag() {
    if (!user || !tagInput.trim()) return;
    try {
      await submissionsService.addTag(
        detail.id,
        detail.workspaceId,
        tagInput.trim(),
        user.id,
        detail.tags,
      );
      setTagInput("");
    } catch (e) {
      toast({
        title: "Failed to add tag",
        description: e instanceof Error ? e.message : String(e),
        variant: "destructive",
      });
    }
  }

  async function handleRemoveTag(tag: string) {
    try {
      await submissionsService.removeTag(detail.id, tag, detail.tags);
    } catch (e) {
      toast({
        title: "Failed to remove tag",
        description: e instanceof Error ? e.message : String(e),
        variant: "destructive",
      });
    }
  }

  async function handleResend(deliveryId: string) {
    setResending(deliveryId);
    try {
      await submissionsService.resendWebhook(deliveryId);
      toast({ title: "Webhook re-enqueued" });
    } catch (e) {
      toast({
        title: "Failed to resend webhook",
        description: e instanceof Error ? e.message : String(e),
        variant: "destructive",
      });
    } finally {
      setResending(null);
    }
  }

  return (
    <div className="space-y-4">
      <DetailPanel
        title={detail.formTitle ?? "Submission"}
        description={`Received ${formatDistanceToNow(new Date(detail.submittedAt), { addSuffix: true })}`}
        actions={
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        }
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <StatusChip label={tone.label} tone={tone.tone} />
          <Select
            value={detail.status}
            onValueChange={(v) => handleStatusChange(v as SubmissionStatus)}
          >
            <SelectTrigger className="h-8 w-40 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {SUBMISSION_STATUS_TONE[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <dl>
          <DetailRow label="Submitted">
            {format(new Date(detail.submittedAt), "MMM d, yyyy · HH:mm")}
          </DetailRow>
          {detail.ipAddress && (
            <DetailRow label="IP">{detail.ipAddress}</DetailRow>
          )}
          {detail.assignedTo && (
            <DetailRow label="Assignee">{detail.assignedTo}</DetailRow>
          )}
        </dl>
      </DetailPanel>

      {/* Tags */}
      <DetailPanel title="Tags">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {detail.tags.length === 0 && (
            <p className="text-xs text-muted-foreground">No tags yet</p>
          )}
          {detail.tags.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleRemoveTag(t)}
            >
              {t} <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add tag…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="h-8"
          />
          <Button size="sm" variant="outline" onClick={handleAddTag}>
            <TagIcon className="mr-1.5 h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </DetailPanel>

      {/* Response data */}
      <DetailPanel title="Response data">
        <dl className="space-y-1">
          {Object.entries(detail.data).length === 0 && (
            <p className="text-xs text-muted-foreground">No data captured</p>
          )}
          {Object.entries(detail.data).map(([key, value]) => (
            <DetailRow key={key} label={key}>
              <span className="break-words">
                {typeof value === "string"
                  ? value
                  : JSON.stringify(value, null, 2)}
              </span>
            </DetailRow>
          ))}
        </dl>
      </DetailPanel>

      {/* Notes */}
      <DetailPanel title="Notes">
        {detail.notes && (
          <p className="mb-3 whitespace-pre-wrap rounded-md bg-muted/40 p-2 text-sm text-foreground">
            {detail.notes}
          </p>
        )}
        <Textarea
          placeholder="Add internal note…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
        <Button
          size="sm"
          className="mt-2"
          onClick={handleAddNote}
          disabled={!note.trim()}
        >
          <MessageSquarePlus className="mr-1.5 h-3.5 w-3.5" />
          Save note
        </Button>
      </DetailPanel>

      {/* Webhook deliveries */}
      {deliveries.length > 0 && (
        <DetailPanel title="Webhook deliveries">
          <ul className="space-y-2">
            {deliveries.map((d) => {
              const t = WEBHOOK_STATUS_TONE[d.status];
              return (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <StatusChip label={t.label} tone={t.tone} pulse={t.pulse} />
                      <span className="text-muted-foreground">
                        attempt {d.attempt}
                      </span>
                    </div>
                    {d.errorMessage && (
                      <p className="mt-1 truncate text-danger">{d.errorMessage}</p>
                    )}
                    {d.responseCode && (
                      <p className="mt-1 text-muted-foreground">
                        HTTP {d.responseCode}
                      </p>
                    )}
                  </div>
                  {(d.status === "failed" || d.status === "dead") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResend(d.id)}
                      disabled={resending === d.id}
                    >
                      <RefreshCw
                        className={`mr-1.5 h-3.5 w-3.5 ${
                          resending === d.id ? "animate-spin" : ""
                        }`}
                      />
                      Resend
                    </Button>
                  )}
                  {d.status === "success" && (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  )}
                </li>
              );
            })}
          </ul>
        </DetailPanel>
      )}

      {/* Timeline */}
      <DetailPanel title="Timeline">
        {events.length === 0 ? (
          <p className="text-xs text-muted-foreground">No events yet</p>
        ) : (
          <EventLog>
            {events.map((e) => (
              <EventLogRow
                key={e.id}
                title={EVENT_LABEL[e.eventType] ?? e.eventType}
                tone={eventTone(e.eventType)}
                icon={e.eventType === "webhook_resent" ? ArrowDownToLine : Activity}
                timestamp={formatDistanceToNow(new Date(e.createdAt), {
                  addSuffix: true,
                })}
              >
                {Object.keys(e.payload).length > 0 && (
                  <code className="block truncate font-mono text-[10px] text-muted-foreground">
                    {JSON.stringify(e.payload)}
                  </code>
                )}
              </EventLogRow>
            ))}
          </EventLog>
        )}
      </DetailPanel>
    </div>
  );
}