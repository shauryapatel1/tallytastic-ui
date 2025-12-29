import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("[delete-user-account] No authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Initialize Supabase clients
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // User client to verify the requesting user
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    
    // Service role client for admin operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    
    if (userError || !user) {
      console.log("[delete-user-account] User authentication failed:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const userId = user.id;
    console.log(`[delete-user-account] Processing deletion for user: ${userId}`);
    
    // Parse request body for confirmation
    let confirmEmail: string | undefined;
    try {
      const body = await req.json();
      confirmEmail = body.confirmEmail;
    } catch {
      // Body parsing is optional
    }
    
    // Verify email confirmation if provided
    if (confirmEmail && confirmEmail !== user.email) {
      console.log("[delete-user-account] Email confirmation mismatch");
      return new Response(
        JSON.stringify({ error: "Email confirmation does not match" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Delete user data in order (respecting foreign key constraints)
    
    // 1. Get all form IDs for this user
    const { data: userForms, error: formsQueryError } = await supabaseAdmin
      .from('forms')
      .select('id')
      .eq('user_id', userId);
      
    if (formsQueryError) {
      console.error("[delete-user-account] Error fetching user forms:", formsQueryError);
      throw formsQueryError;
    }
    
    const formIds = userForms?.map(f => f.id) || [];
    console.log(`[delete-user-account] Found ${formIds.length} forms to delete`);
    
    // 2. Delete form responses for user's forms
    if (formIds.length > 0) {
      const { error: responsesError } = await supabaseAdmin
        .from('form_responses')
        .delete()
        .in('form_id', formIds);
        
      if (responsesError) {
        console.error("[delete-user-account] Error deleting form responses:", responsesError);
        throw responsesError;
      }
      console.log("[delete-user-account] Deleted form responses");
      
      // 3. Delete form events for user's forms
      const { error: eventsError } = await supabaseAdmin
        .from('form_events')
        .delete()
        .in('form_id', formIds);
        
      if (eventsError) {
        console.error("[delete-user-account] Error deleting form events:", eventsError);
        throw eventsError;
      }
      console.log("[delete-user-account] Deleted form events");
    }
    
    // 4. Delete user's forms
    const { error: formsError } = await supabaseAdmin
      .from('forms')
      .delete()
      .eq('user_id', userId);
      
    if (formsError) {
      console.error("[delete-user-account] Error deleting forms:", formsError);
      throw formsError;
    }
    console.log("[delete-user-account] Deleted forms");
    
    // 5. Delete user's quota record
    const { error: quotaError } = await supabaseAdmin
      .from('quotas')
      .delete()
      .eq('user_id', userId);
      
    if (quotaError) {
      console.error("[delete-user-account] Error deleting quota:", quotaError);
      // Non-fatal - quota might not exist
    }
    console.log("[delete-user-account] Deleted quota record");
    
    // 6. Delete the user from auth.users using admin client
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteUserError) {
      console.error("[delete-user-account] Error deleting user account:", deleteUserError);
      throw deleteUserError;
    }
    
    console.log(`[delete-user-account] Successfully deleted user: ${userId}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Account and all associated data have been permanently deleted"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("[delete-user-account] Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete account. Please try again or contact support." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
