
import { createClient } from "@supabase/supabase-js";

// Default to Lovable-provided Supabase URL and key
const supabaseUrl = "https://aclluclfiiibahomeetq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjbGx1Y2xmaWlpYmFob21lZXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MzMxODIsImV4cCI6MjA1NjAwOTE4Mn0.unP_5tGi1neKH5jQ2IsZifPFbXrLOR50hDNXyRm4vmc";

if (!supabaseUrl) throw new Error("Missing VITE_SUPABASE_URL");
if (!supabaseAnonKey) throw new Error("Missing VITE_SUPABASE_ANON_KEY");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
