
import { AlertTriangle, ArrowRight, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ErrorDisplayProps {
  title?: string;
  description?: string;
  retryAction?: () => void;
  homeAction?: boolean;
  backAction?: boolean;
  customActions?: React.ReactNode;
}

export function ErrorDisplay({
  title = "Something went wrong",
  description = "There was a problem with your request",
  retryAction,
  homeAction = true,
  backAction = false,
  customActions
}: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      <div className="flex flex-wrap gap-4 justify-center">
        {retryAction && (
          <Button onClick={retryAction} className="flex items-center">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
        
        {customActions}
        
        {backAction && (
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        )}
        
        {homeAction && (
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
