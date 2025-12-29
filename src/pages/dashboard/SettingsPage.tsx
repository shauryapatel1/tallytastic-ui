import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { deleteUserAccount } from '@/lib/accountService';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

// It's assumed this page will be rendered within a DashboardLayout
// that provides the overall structure and authentication context.

export default function SettingsPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const expectedConfirmationPhrase = 'DELETE MY ACCOUNT';

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
    setConfirmationText(''); // Reset confirmation text when dialog opens
  };

  const handleConfirmDelete = async () => {
    if (confirmationText !== expectedConfirmationPhrase) {
      toast({
        variant: 'destructive',
        title: 'Confirmation Mismatch',
        description: 'Please type the confirmation phrase exactly as shown.',
      });
      return;
    }

    setIsDeletingAccount(true);
    try {
      await deleteUserAccount();
      toast({
        title: 'Account Deleted',
        description: 'Your account and all associated data have been permanently deleted.',
      });
      await logout();
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Account Deletion Failed',
        description: errorMessage,
      });
    } finally {
      setIsDeletingAccount(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8 max-w-4xl">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Account Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and settings.
        </p>
      </header>

      <div className="space-y-8">
        {/* Placeholder for Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your personal information and profile details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full md:w-auto">
              <Link to="/dashboard/profile">
                Go to Profile Settings <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Placeholder for Subscription */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription & Billing</CardTitle>
            <CardDescription>Manage your subscription plan and view billing history.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="outline" asChild className="w-full md:w-auto">
              <Link to="/pricing">
                Manage Subscription <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-6 w-6 text-destructive" />
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </div>
            <CardDescription>
              These actions are permanent and cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">Delete Your Account</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Permanently delete your account and all associated data, including your forms and responses.
                This action is irreversible.
              </p>
              <Button
                variant="destructive"
                onClick={handleOpenDeleteDialog}
                disabled={isDeletingAccount}
              >
                {isDeletingAccount ? 'Deleting...' : 'Delete My Account'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
              <br /><br />
              To confirm, please type: <strong className="text-destructive">{expectedConfirmationPhrase}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Label htmlFor="confirmationPhraseInput" className="sr-only">
              Confirmation Phrase
            </Label>
            <Input
              id="confirmationPhraseInput"
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={expectedConfirmationPhrase}
              className={confirmationText !== expectedConfirmationPhrase && confirmationText !== '' ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingAccount}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={confirmationText !== expectedConfirmationPhrase || isDeletingAccount}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeletingAccount ? 'Deleting...' : 'Confirm Deletion'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 