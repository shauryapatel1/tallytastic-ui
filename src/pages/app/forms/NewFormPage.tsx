import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormsApi } from '@/lib/api/forms';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function NewFormPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const createForm = async () => {
      if (isCreating) return;
      setIsCreating(true);
      
      try {
        const newForm = await FormsApi.createForm({
          title: 'Untitled Form',
          description: '',
          sections: [],
          status: 'draft',
        });
        
        // Navigate to the create step of the new form
        navigate(`/app/forms/${newForm.id}/create`, { replace: true });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Could not create form.';
        toast({
          variant: 'destructive',
          title: 'Creation Failed',
          description: errorMessage,
        });
        // Navigate back to dashboard on error
        navigate('/dashboard', { replace: true });
      }
    };

    createForm();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Creating your form...</p>
      </div>
    </div>
  );
}
