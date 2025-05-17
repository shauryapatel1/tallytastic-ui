import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth'; // Optional: may not be needed if AuthProvider handles session
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  // const { user, signIn } = useAuth(); // signIn from context is an alternative to direct supabase call

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (supabaseError) {
        setError(supabaseError.message || 'Invalid login credentials.');
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: supabaseError.message || 'Invalid login credentials.',
        });
      } else if (data.user && data.session) {
        // AuthProvider should pick up the session change via onAuthStateChange
        toast({
          title: "Login Successful!",
          description: "Redirecting to your dashboard...",
        });
        navigate('/dashboard'); // Navigate to dashboard or intended route
      } else {
        // Should not typically be reached if Supabase returns user/session or an error
        setError('An unexpected error occurred. Please try again.');
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: 'An unexpected error occurred. Please try again.',
        });
      }
    } catch (err: any) {
      // Catch any other unexpected errors during the process
      setError(err.message || 'An unexpected error occurred. Please try again.');
      toast({
        variant: "destructive",
        title: "Login Error",
        description: err.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome Back to FormCraft</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Log in to manage your forms and view responses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}> 
              {isSubmitting ? 'Logging In...' : 'Log In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            Forgot your password?{" "}
            <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary">
              <Link to="/auth/forgot-password">Reset Password</Link>
            </Button>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary">
              <Link to="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 