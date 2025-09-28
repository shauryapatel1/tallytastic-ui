import { useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseAutosaveProps {
  data: any;
  saveFunction: (data: any) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

interface AutosaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
}

export function useAutosave({ 
  data, 
  saveFunction, 
  delay = 500, 
  enabled = true 
}: UseAutosaveProps) {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastDataRef = useRef(data);
  const statusRef = useRef<AutosaveStatus>({ status: 'idle' });

  const triggerSave = useCallback(async () => {
    if (!enabled) return;

    statusRef.current = { status: 'saving' };
    
    try {
      await saveFunction(data);
      statusRef.current = { 
        status: 'saved', 
        lastSaved: new Date() 
      };
    } catch (error) {
      statusRef.current = { status: 'error' };
      toast({
        title: "Autosave failed",
        description: "Your changes could not be saved automatically.",
        variant: "destructive"
      });
    }
  }, [data, saveFunction, enabled, toast]);

  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      triggerSave();
    }, delay);
  }, [triggerSave, delay]);

  useEffect(() => {
    if (!enabled) return;

    const dataChanged = JSON.stringify(data) !== JSON.stringify(lastDataRef.current);
    
    if (dataChanged && data) {
      lastDataRef.current = data;
      debouncedSave();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debouncedSave, enabled]);

  return statusRef.current;
}