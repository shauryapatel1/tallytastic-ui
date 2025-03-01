
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
              <Route path="/dashboard/integrations" element={<Dashboard />} />
              <Route path="/dashboard/analytics" element={<Dashboard />} />
              <Route path="/dashboard/responses" element={<Dashboard />} />
              <Route path="/dashboard/users" element={<Dashboard />} />
              <Route path="/dashboard/notifications" element={<Dashboard />} />
              <Route path="/dashboard/settings" element={<Dashboard />} />
              <Route path="/dashboard/forms/:id" element={<Dashboard />} />
              <Route path="/dashboard/forms/:id/preview" element={<Dashboard />} />
              <Route path="/dashboard/forms/:id/responses" element={<Dashboard />} />
              <Route path="/dashboard/forms/:id/settings" element={<Dashboard />} />
              
              {/* Public form routes */}
              <Route path="/f/:id" element={<Dashboard />} />
              
              {/* Redirects */}
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
