
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // If authentication is still loading, show a loading spinner
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // If the user isn't authenticated, redirect to the login page
  if (!user) {
    // Store the current path for redirect after login
    localStorage.setItem("redirectAfterAuth", location.pathname);
    
    return <Navigate to="/auth" replace />;
  }

  // If user is authenticated, render the children
  return <>{children}</>;
};
