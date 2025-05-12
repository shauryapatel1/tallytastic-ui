
import { Button } from "@/components/ui/button";

interface FormSubmissionSuccessProps {
  successMessage: string;
  redirectUrl?: string;
}

export function FormSubmissionSuccess({ successMessage, redirectUrl }: FormSubmissionSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">Submission Received</h2>
      <p className="text-gray-700 mb-4">{successMessage}</p>
      {redirectUrl && (
        <p className="text-sm text-gray-500">You will be redirected shortly...</p>
      )}
      {redirectUrl && (
        <Button 
          className="mt-4" 
          onClick={() => window.location.href = redirectUrl}
        >
          Continue
        </Button>
      )}
    </div>
  );
}
