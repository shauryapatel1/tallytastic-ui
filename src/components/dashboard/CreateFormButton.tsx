import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
// import { createNewBlankForm } from '@/services/formService'; // If direct creation from here is needed
// import { useToast } from '@/components/ui/use-toast';

export function CreateFormButton() {
  const navigate = useNavigate();
  // const { toast } = useToast();

  const handleCreateNewForm = async () => {
    // Navigate to the new form creation route
    navigate('/app/forms/new');

    // Option 2: Create blank form via API then navigate to it (example)
    // try {
    //   toast({ title: "Creating new form..." });
    //   const newForm = await createNewBlankForm('Untitled Form');
    //   toast({ title: "Form Created!", description: `"${newForm.title}" has been created.` });
    //   navigate(`/builder/${newForm.id}`);
    // } catch (error) {
    //   const errorMessage = error instanceof Error ? error.message : "Could not create form.";
    //   toast({
    //     variant: "destructive",
    //     title: "Creation Failed",
    //     description: errorMessage,
    //   });
    // }
  };

  return (
    <Button onClick={handleCreateNewForm}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Create Form
    </Button>
  );
} 