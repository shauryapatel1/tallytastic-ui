import { supabase } from "@/integrations/supabase/client";

/**
 * Deletes the current user's account and all associated data.
 * Calls the delete-user-account edge function which handles
 * cascading deletion of all user data.
 */
export async function deleteUserAccount(): Promise<void> {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    throw new Error("You must be logged in to delete your account.");
  }

  const response = await supabase.functions.invoke("delete-user-account", {
    body: {
      confirmEmail: session.user.email,
    },
  });

  if (response.error) {
    console.error("[accountService] Delete account error:", response.error);
    throw new Error(response.error.message || "Failed to delete account");
  }

  if (!response.data?.success) {
    throw new Error(response.data?.error || "Failed to delete account");
  }
}
