
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
import PublicForm from "./pages/public/PublicForm";
import Integrations from "./pages/dashboard/Integrations";
import Analytics from "./pages/dashboard/Analytics";
import UserProfile from "./pages/dashboard/UserProfile";

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
              
              {/* Dashboard routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/forms" element={<Dashboard />} />
              <Route path="/dashboard/templates" element={<Dashboard />} />
              <Route path="/dashboard/integrations" element={<Integrations />} />
              <Route path="/dashboard/analytics" element={<Analytics />} />
              <Route path="/dashboard/responses" element={<Dashboard />} />
              <Route path="/dashboard/profile" element={<UserProfile />} />
              <Route path="/dashboard/settings" element={<Dashboard />} />
              
              {/* Form management routes */}
              <Route path="/dashboard/forms/:id" element={<FormBuilder />} />
              <Route path="/dashboard/forms/:id/publish" element={<FormPublish />} />
              <Route path="/dashboard/forms/:id/responses" element={<FormResponses />} />
              <Route path="/dashboard/forms/:id/settings" element={<FormSettings />} />
              <Route path="/dashboard/forms/:id/collaborate" element={<FormSettings />} />
              
              {/* Public form routes */}
              <Route path="/f/:id" element={<PublicForm />} />
              
              {/* Fallback route for any other dashboard path */}
              <Route path="/dashboard/*" element={<Dashboard />} />
              
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
