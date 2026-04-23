import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";

/**
 * Authenticated app shell. Wraps every dashboard/app route.
 * Hard auth gate — unauthenticated users redirect to /auth with a return path.
 */
export function AppLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex min-h-screen flex-col">
          <TopBar />
          <div className="flex-1 overflow-hidden">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}