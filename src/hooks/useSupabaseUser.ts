
import { useAuth } from '@/lib/auth';

/**
 * A hook to get the current Supabase user.
 * This is a wrapper around the core `useAuth` hook to provide a consistent interface for accessing the user.
 */
export const useSupabaseUser = () => {
  const { user } = useAuth();
  return { user };
};
