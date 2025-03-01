
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === "signin") {
        await login(email, password);
      } else {
        await signup(email, password, email.split('@')[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "signin"
              ? "Enter your credentials to access your account"
              : "Enter your email below to create your account"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : mode === "signin"
              ? "Sign In"
              : "Sign Up"}
          </Button>
        </form>
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
