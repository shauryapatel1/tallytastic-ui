import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "./Layout";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, KeyRound } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function UserProfile() {
  const { toast } = useToast();
  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isSavingName, setIsSavingName] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [currentSupabaseUser, setCurrentSupabaseUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const fetchCurrentSupabaseUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        toast({
          title: "Error fetching user details",
          description: error.message,
          variant: "destructive",
        });
        setCurrentSupabaseUser(null);
      } else {
        setCurrentSupabaseUser(user);
      }
    };

    if (isAuthenticated) {
      fetchCurrentSupabaseUser();
    }
  }, [isAuthenticated, toast]);

  useEffect(() => {
    if (currentSupabaseUser) {
      setFullName(currentSupabaseUser.user_metadata?.full_name || authUser?.name || "");
      setEmail(currentSupabaseUser.email || authUser?.email || "");
      setCreatedAt(currentSupabaseUser.created_at ? formatDate(currentSupabaseUser.created_at) : "Not available");
    } else if (authUser) {
      setFullName(authUser.name || "");
      setEmail(authUser.email || "");
    }
  }, [authUser, currentSupabaseUser]);

  const handleSaveName = async () => {
    if (!currentSupabaseUser) {
      toast({
        title: "Error",
        description: "User details not available. Cannot update profile.",
        variant: "destructive",
      });
      return;
    }
    if (!fullName.trim()) {
        toast({
            title: "Validation Error",
            description: "Full name cannot be empty.",
            variant: "destructive",
        });
        return;
    }

    setIsSavingName(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      if (error) {
        throw error;
      }
      if (data.user) {
        setCurrentSupabaseUser(data.user);
        setFullName(data.user.user_metadata?.full_name || "");
      }
      toast({
        title: "Profile Updated",
        description: "Your full name has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Could not update your name. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingName(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || !authUser) {
    return (
        <DashboardLayout>
            <div className="p-6 text-center">
                <p>Please log in to view your profile.</p>
                <Button onClick={() => navigate("/auth/login")} className="mt-4">
                    Go to Login
                </Button>
            </div>
        </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-8 max-w-2xl mx-auto py-8 px-4 md:px-0"
      >
        <div>
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">View and update your account details.</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your personal details. Email address is read-only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={email}
                readOnly
                disabled
                className="bg-muted/50"
              />
            </div>

            <div className="grid gap-2.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                disabled={isSavingName}
              />
            </div>
            
            <div className="grid gap-2.5">
              <Label>Joined Date</Label>
              <Input
                value={createdAt}
                readOnly
                disabled
                className="bg-muted/50"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveName} disabled={isSavingName || authLoading} className="flex gap-2 items-center">
              {isSavingName ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Name
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your account security settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Need to update your password? Use our secure password reset flow.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/auth/forgot-password")}
                  className="flex gap-2 items-center"
                >
                  <KeyRound className="h-4 w-4" />
                  Change Password
                </Button>
              </div>
          </CardContent>
        </Card>

      </motion.div>
    </DashboardLayout>
  );
}
