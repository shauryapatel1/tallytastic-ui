
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { createForm } from "@/lib/api";
import { CircleDashed } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";

export function CreateFormDialog({
  open,
  onOpenChange,
  onFormCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormCreated?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleCreateForm = async () => {
    if (!title.trim()) {
      toast({
        title: "Form title required",
        description: "Please enter a title for your form",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to create forms",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const newForm = await createForm({
        title,
        description,
        user
      });

      await queryClient.invalidateQueries({ queryKey: ["forms", user.id] });

      toast({
        title: "Form created",
        description: "Your new form has been created successfully",
      });

      if (onFormCreated) onFormCreated();
      handleClose();
      
      // Navigate to the form workflow create step
      navigate(`/app/forms/${newForm.id}/create`);
    } catch (error) {
      console.error("Error creating form:", error);
      toast({
        title: "Error",
        description: "Failed to create form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
          <DialogDescription>
            Give your form a name and description to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Form Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Form Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleCreateForm} disabled={isLoading || !title.trim()}>
              {isLoading ? (
                <>
                  <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
