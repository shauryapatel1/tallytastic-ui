
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/app/ThemeProvider";

// Eager: landing page (first paint) only
import Index from "./pages/Index";

// Lazy-loaded routes — split into their own chunks
const Dashboard = lazy(() => import("./pages/dashboard/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FormWorkflowLayout = lazy(() => import("./pages/app/forms/FormWorkflowLayout"));
const CreateStep = lazy(() => import("./pages/app/forms/steps/CreateStep"));
const BuildStep = lazy(() => import("./pages/app/forms/steps/BuildStep"));
const PreviewStep = lazy(() => import("./pages/app/forms/steps/PreviewStep"));
const PublishStep = lazy(() => import("./pages/app/forms/steps/PublishStep"));
const ShareStep = lazy(() => import("./pages/app/forms/steps/ShareStep"));
const AnalyzeStep = lazy(() => import("./pages/app/forms/steps/AnalyzeStep"));
const NewFormPage = lazy(() => import("./pages/app/forms/NewFormPage"));
const PublicForm = lazy(() => import("./pages/public/PublicForm"));
const Integrations = lazy(() => import("./pages/dashboard/Integrations"));
const Analytics = lazy(() => import("./pages/dashboard/Analytics"));
const UserProfile = lazy(() => import("./pages/dashboard/UserProfile"));
const SettingsPage = lazy(() => import("./pages/dashboard/SettingsPage"));
const SubmissionsInboxPage = lazy(
  () => import("./pages/app/submissions/SubmissionsInboxPage"),
);

const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

// Redirect component for old dashboard form routes
function RedirectToWorkflow({ step }: { step: string }) {
  const { id } = useParams();
  return <Navigate to={`/app/forms/${id}/${step}`} replace />;
}

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
          <Sonner />
          <AnimatePresence mode="wait">
            <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/f/:id" element={<PublicForm />} />
              
              {/* Protected dashboard routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/forms" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/templates" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/integrations" element={
                <ProtectedRoute>
                  <Integrations />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              
              {/* Redirect old form routes to new workflow */}
              <Route path="/dashboard/forms/:id" element={
                <ProtectedRoute>
                  <RedirectToWorkflow step="build" />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/forms/:id/preview" element={
                <ProtectedRoute>
                  <RedirectToWorkflow step="preview" />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/forms/:id/publish" element={
                <ProtectedRoute>
                  <RedirectToWorkflow step="publish" />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/forms/:id/responses" element={
                <ProtectedRoute>
                  <RedirectToWorkflow step="analyze" />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/forms/:id/settings" element={
                <ProtectedRoute>
                  <RedirectToWorkflow step="build" />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/forms/:id/collaborate" element={
                <ProtectedRoute>
                  <RedirectToWorkflow step="build" />
                </ProtectedRoute>
              } />
              
              {/* Create new form route */}
              <Route path="/app/forms/new" element={
                <ProtectedRoute>
                  <NewFormPage />
                </ProtectedRoute>
              } />
              
              {/* Form workflow routes */}
              <Route path="/app/forms/:formId" element={
                <ProtectedRoute>
                  <FormWorkflowLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="create" replace />} />
                <Route path="create" element={<CreateStep />} />
                <Route path="build" element={<BuildStep />} />
                <Route path="preview" element={<PreviewStep />} />
                <Route path="publish" element={<PublishStep />} />
                <Route path="share" element={<ShareStep />} />
                <Route path="analyze" element={<AnalyzeStep />} />
              </Route>

              {/* Submissions Inbox */}
              <Route path="/app/submissions" element={
                <ProtectedRoute>
                  <SubmissionsInboxPage />
                </ProtectedRoute>
              } />
              <Route path="/app/submissions/:responseId" element={
                <ProtectedRoute>
                  <SubmissionsInboxPage />
                </ProtectedRoute>
              } />
              
              {/* Fallback route for any other dashboard path */}
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* 404 catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
            </AnimatePresence>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
