
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Dashboard from "./pages/dashboard/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import FormBuilder from "./pages/dashboard/FormBuilder";
import FormPublish from "./pages/dashboard/FormPublish";
import FormResponses from "./pages/dashboard/FormResponses";
import FormSettings from "./pages/dashboard/FormSettings";
import FormWorkflowLayout from "./pages/app/forms/FormWorkflowLayout";
import CreateStep from "./pages/app/forms/steps/CreateStep";
import BuildStep from "./pages/app/forms/steps/BuildStep";
import PreviewStep from "./pages/app/forms/steps/PreviewStep";
import PublishStep from "./pages/app/forms/steps/PublishStep";
import ShareStep from "./pages/app/forms/steps/ShareStep";
import AnalyzeStep from "./pages/app/forms/steps/AnalyzeStep";
import PublicForm from "./pages/public/PublicForm";
import Integrations from "./pages/dashboard/Integrations";
import Analytics from "./pages/dashboard/Analytics";
import UserProfile from "./pages/dashboard/UserProfile";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AnimatePresence mode="wait">
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
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Form management routes */}
              <Route path="/dashboard/forms/:id" element={
                <ProtectedRoute>
                  <FormBuilder />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/forms/:id/publish" element={
                <ProtectedRoute>
                  <FormPublish />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/forms/:id/responses" element={
                <ProtectedRoute>
                  <FormResponses />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/forms/:id/settings" element={
                <ProtectedRoute>
                  <FormSettings />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/forms/:id/collaborate" element={
                <ProtectedRoute>
                  <FormSettings />
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
              
              {/* Fallback route for any other dashboard path */}
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* 404 catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
