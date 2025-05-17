import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth'; // ONE MORE TRY with this specific path
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  // const { user } = useAuth(); // Example if needing to check existing user state

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast({
        variant: "destructive",
        title: "Signup Error",
        description: "Passwords do not match.",
      });
      return;
    }

    // Additional client-side validation (e.g., password strength) can be added here

    setIsSubmitting(true);

    try {
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName || undefined, // Pass undefined if fullName is empty
          },
        },
      });

      if (supabaseError) {
        setError(supabaseError.message);
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: supabaseError.message,
        });
      } else if (data.user && !data.session) {
        // User created, email confirmation needed
        toast({
          title: "Signup Successful!",
          description: "Please check your email to confirm your account.",
          duration: 5000,
        });
        // Optionally navigate to a "check email" page or login
        // navigate('/auth/check-email'); 
      } else if (data.user && data.session) {
        // User created and session exists (e.g., email confirmation disabled or auto-confirmed)
        // AuthProvider should handle setting the user context via onAuthStateChange
        toast({
          title: "Signup Successful!",
          description: "You are now logged in and being redirected.",
        });
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        // Fallback for unexpected response structure, though Supabase usually provides user/session or error
         setError("An unexpected issue occurred during signup. Please try again.");
         toast({
            variant: "destructive",
            title: "Signup Failed",
            description: "An unexpected issue occurred. Please try again.",
          });
      }
    } catch (err: any) {
      // Catch any other unexpected errors during the process
      setError(err.message || "An unexpected error occurred during signup processing.");
      toast({
        variant: "destructive",
        title: "Signup Error",
        description: err.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Create your FormCraft Account</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Join FormCraft and start building intelligent forms in minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name (Optional)</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
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
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm Password</Label>
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
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}> 
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary">
              <Link to="/auth/login">Log In</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 