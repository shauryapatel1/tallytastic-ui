import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export interface ActiveWorkspace {
  id: string;
  name: string;
  slug: string;
  role: "owner" | "admin" | "member";
}

/**
 * Resolves the user's active workspace.
 *
 * Strategy: pick the first workspace they're a member of (sorted by created_at).
 * If none exists, auto-create a personal workspace so every authenticated user
 * has somewhere to land.
 */
export function useActiveWorkspace() {
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState<ActiveWorkspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user) {
        setWorkspace(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data: memberships, error: mErr } = await supabase
          .from("workspace_members")
          .select("workspace_id, role, workspaces!inner(id, name, slug, created_at)")
          .eq("user_id", user.id)
          .order("created_at", { referencedTable: "workspaces", ascending: true })
          .limit(1);
        if (mErr) throw mErr;

        if (memberships && memberships.length > 0) {
          const m = memberships[0] as unknown as {
            role: ActiveWorkspace["role"];
            workspaces: { id: string; name: string; slug: string };
          };
          if (!cancelled) {
            setWorkspace({
              id: m.workspaces.id,
              name: m.workspaces.name,
              slug: m.workspaces.slug,
              role: m.role,
            });
          }
        } else {
          // Auto-create personal workspace
          const slug = `ws-${user.id.slice(0, 8)}`;
          const name = user.email?.split("@")[0]
            ? `${user.email.split("@")[0]}'s workspace`
            : "Personal workspace";
          const { data: created, error: cErr } = await supabase
            .from("workspaces")
            .insert({ name, slug, owner_id: user.id })
            .select("id, name, slug")
            .single();
          if (cErr) throw cErr;
          if (created && !cancelled) {
            setWorkspace({
              id: created.id,
              name: created.name,
              slug: created.slug,
              role: "owner",
            });
          }
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { workspace, loading, error };
}