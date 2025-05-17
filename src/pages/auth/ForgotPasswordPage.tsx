import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePasswordResetRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null); // Clear previous message
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        // This error is more likely a configuration or network issue, 
        // as Supabase typically doesn't confirm/deny email existence for security.
        setMessage(error.message || "Failed to initiate password reset. Please try again.");
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to initiate password reset. Please try again.",
        });
      } else {
        setMessage("If an account with this email exists, a password reset link has been sent. Please check your inbox (and spam folder).");
        toast({
          title: "Password Reset Requested",
          description: "If an account with this email exists, you will receive a reset link shortly.",
        });
      }
    } catch (err: any) {
      setMessage("An unexpected error occurred. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Forgot Your Password?</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordResetRequest} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            {message && (
              <p className={`text-sm ${message.startsWith("If an account") ? "text-foreground" : "text-destructive"}`}>{message}</p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}> 
              {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Remembered your password?{" "}
            <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary">
              <Link to="/auth/login">Log In</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 