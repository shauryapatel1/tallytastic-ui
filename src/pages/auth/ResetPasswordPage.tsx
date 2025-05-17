import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const [hasActiveSession, setHasActiveSession] = useState(false);

  useEffect(() => {
    // Check for an active session (implies a valid recovery token was processed by Supabase client)
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setHasActiveSession(true);
      } else {
        // No active session, likely invalid or expired token, or direct navigation
        setError("Invalid or expired password reset link. Please request a new one.");
        toast({
          variant: "destructive",
          title: "Invalid Link",
          description: "The password reset link is invalid or has expired. Please request a new one.",
        });
      }
      setIsSessionChecked(true);
    };
    checkSession();
  }, [toast]);

  const handleSetNewPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!hasActiveSession) {
      setError("Cannot reset password without a valid session. Please use the link from your email.");
      return;
    }

    if (newPassword.length < 6) { // Basic password strength check
      setError("Password must be at least 6 characters long.");
      toast({ variant: "destructive", title: "Password Too Short", description: "Password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      toast({ variant: "destructive", title: "Password Mismatch", description: "The new passwords do not match." });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message || 'Failed to update password. The link may be invalid, expired, or the password may not meet complexity requirements.');
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: updateError.message || 'Failed to update password.',
        });
      } else {
        setSuccessMessage("Your password has been updated successfully! You can now log in.");
        toast({
          title: "Password Updated!",
          description: "You will be redirected to login shortly.",
        });
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSessionChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/20 p-4">
        <p>Verifying reset link...</p> {/* Or a spinner component */}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Set Your New Password</CardTitle>
          {!hasActiveSession && error && (
             <CardDescription className="text-destructive">
                {error} {/* Show session check error prominently if form cannot be used */}
             </CardDescription>
          )}
          {hasActiveSession && (
            <CardDescription className="text-gray-600 dark:text-gray-400">
                Please enter and confirm your new password.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {hasActiveSession ? (
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              {error && !successMessage && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              {successMessage && (
                <p className="text-sm text-green-600 dark:text-green-500">{successMessage}</p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting || successMessage !== null}> 
                {isSubmitting ? 'Updating Password...' : 'Set New Password'}
              </Button>
            </form>
          ) : (
            <div className="text-center">
                {/* Error message is already shown in CardDescription or covered by the general error state for invalid link */}
                 <Button asChild className="mt-4">
                    <Link to="/auth/forgot-password">Request New Reset Link</Link>
                </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm">
            {successMessage ? (
                 <p className="text-gray-600 dark:text-gray-400">
                    Redirecting to login...
                 </p>
            ) : (
                <p className="text-gray-600 dark:text-gray-400">
                    Remembered your password or need to log in?{" "}
                    <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary">
                    <Link to="/auth/login">Log In</Link>
                    </Button>
                </p>
            )}
        </CardFooter>
      </Card>
    </div>
  );
} 