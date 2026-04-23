
import { AppLayout } from "@/components/app/AppLayout";

/**
 * Backwards-compatible wrapper — all `/dashboard/*` routes call DashboardLayout.
 * Internally we now route through the new Ingrid AppLayout (Phase 2 shell).
 *
 * Auth gating, sidebar, top bar, and theme are handled inside AppLayout.
 */
export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <AppLayout>{children}</AppLayout>;
};
