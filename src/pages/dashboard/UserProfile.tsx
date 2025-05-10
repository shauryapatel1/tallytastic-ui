
import { useState } from "react";
import { DashboardLayout } from "./Layout";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { User, Save, Loader2, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth";

// Mock function to get user details
const getUserDetails = async (userId: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id: userId,
    email: "demo@example.com",
    name: "Demo User",
    avatarUrl: null,
    createdAt: "2023-01-15T00:00:00Z",
    preferences: {
      notifications: {
        email: true,
        browser: true,
        marketing: false
      },
      appearance: {
        theme: "light"
      }
    },
    subscription: {
      plan: "Free",
      status: "active",
      renewalDate: null
    }
  };
};

export default function UserProfile() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyBrowser, setNotifyBrowser] = useState(true);
  const [notifyMarketing, setNotifyMarketing] = useState(false);
  const [theme, setTheme] = useState("light");
  
  const { data: userDetails, isLoading } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => user?.id ? getUserDetails(user.id) : Promise.reject("No user ID found"),
    enabled: !!user?.id,
  });

  // Update local state when user data loads
  useState(() => {
    if (userDetails) {
      setName(userDetails.name);
      setEmail(userDetails.email);
      setNotifyEmail(userDetails.preferences.notifications.email);
      setNotifyBrowser(userDetails.preferences.notifications.browser);
      setNotifyMarketing(userDetails.preferences.notifications.marketing);
      setTheme(userDetails.preferences.appearance.theme);
    }
  });

  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
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
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile" className="flex gap-2 items-center">
              <User className="h-4 w-4" />Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userDetails?.avatarUrl || ""} alt={userDetails?.name} />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {getInitials(userDetails?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <Button variant="outline" size="sm">Change avatar</Button>
                    <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid gap-5">
                  <div className="grid gap-2.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div className="grid gap-2.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div className="grid gap-2.5">
                    <Label>Account created</Label>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(userDetails?.createdAt || "")}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} disabled={isSaving} className="flex gap-2">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible account actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all of your forms
                      </p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-email">Email notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for form submissions and important updates
                      </p>
                    </div>
                    <Switch 
                      id="notify-email"
                      checked={notifyEmail}
                      onCheckedChange={setNotifyEmail}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-browser">Browser notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show browser notifications for form activity when you're online
                      </p>
                    </div>
                    <Switch 
                      id="notify-browser"
                      checked={notifyBrowser}
                      onCheckedChange={setNotifyBrowser}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-marketing">Marketing emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about new features, tips, and promotions
                      </p>
                    </div>
                    <Switch 
                      id="notify-marketing"
                      checked={notifyMarketing}
                      onCheckedChange={setNotifyMarketing}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} disabled={isSaving} className="flex gap-2">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save preferences
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription and billing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                  <div>
                    <h3 className="font-medium">Current Plan</h3>
                    <p className="text-2xl font-bold mt-1">{userDetails?.subscription.plan}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {userDetails?.subscription.plan === "Free" ? (
                        "Limited to 3 forms and 100 responses per month"
                      ) : (
                        "Your subscription renews on " + 
                        (userDetails?.subscription.renewalDate ? 
                          formatDate(userDetails.subscription.renewalDate) : 
                          "N/A")
                      )}
                    </p>
                  </div>
                  
                  <Button>
                    {userDetails?.subscription.plan === "Free" ? "Upgrade" : "Manage"}
                  </Button>
                </div>
                
                {userDetails?.subscription.plan === "Free" && (
                  <div className="space-y-4">
                    <Separator />
                    <h3 className="font-medium">Available Plans</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card className="border-primary shadow-sm">
                        <CardHeader>
                          <CardTitle>Pro</CardTitle>
                          <div className="font-medium text-2xl">$29</div>
                          <CardDescription>per month</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-sm">Unlimited forms</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-sm">5,000 responses/month</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-sm">All form fields</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-sm">File uploads</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full">Subscribe</Button>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Enterprise</CardTitle>
                          <div className="font-medium text-2xl">$89</div>
                          <CardDescription>per month</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                            <span className="text-sm">Everything in Pro</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                            <span className="text-sm">Unlimited responses</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                            <span className="text-sm">API access</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                            <span className="text-sm">Priority support</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full">Subscribe</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Change Password</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Update your password to keep your account secure
                    </p>
                    
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">Two-factor Authentication</h3>
                          <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline" disabled className="flex gap-2">
                        <Shield className="h-4 w-4" />
                        Setup 2FA
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium">Active Sessions</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage devices and browsers where you're currently signed in
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border p-4 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium">Current Browser</h4>
                          <p className="text-xs text-muted-foreground">
                            Last active: {new Date().toLocaleString()}
                          </p>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} disabled={isSaving} className="flex gap-2">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
