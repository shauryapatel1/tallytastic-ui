
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      const redirectPath = localStorage.getItem("redirectAfterAuth") || "/dashboard";
      localStorage.removeItem("redirectAfterAuth");
      navigate(redirectPath);
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      setError("Email is required");
      return;
    }
    
    if (!password) {
      setError("Password is required");
      return;
    }
    
    if (mode === "signup" && !name) {
      setError("Name is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === "signin") {
        await login(email, password);
        toast({
          title: "Sign in successful",
          description: "Welcome back to FormCraft!",
        });
      } else {
        await signup(email, password, name);
        toast({
          title: "Account created",
          description: "Your account has been created successfully!",
        });
      }
      
      // After successful auth, redirect
      const redirectPath = localStorage.getItem("redirectAfterAuth") || "/dashboard";
      localStorage.removeItem("redirectAfterAuth");
      navigate(redirectPath);
    } catch (error: any) {
      console.error("Authentication error:", error);
      setError(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen grid place-items-center bg-gradient-to-b from-white to-indigo-50/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">
            {mode === "signin" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "signin"
              ? "Enter your credentials to access your account"
              : "Enter your details below to create your account"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="rounded-lg"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
              className="rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="rounded-lg"
            />
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg" 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : mode === "signin"
              ? "Sign In"
              : "Create Account"}
          </Button>
        </form>
        
        <div className="text-center pt-2">
          <Button
            variant="link"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
            }}
            className="text-indigo-600 hover:text-indigo-800"
          >
            {mode === "signin"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Auth;
