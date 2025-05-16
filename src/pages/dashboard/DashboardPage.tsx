import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed Plus icon import as CreateFormButton is used

import { PageHeader } from '@/components/dashboard/PageHeader';
import { SearchAndFilterBar } from '@/components/dashboard/SearchAndFilterBar';
import { FormList } from '@/components/dashboard/FormList';
import { CreateFormButton } from '@/components/dashboard/CreateFormButton';
import type { FormSummary, FormFilterCriteria } from '@/types/forms';
import { fetchUserFormSummaries, duplicateFormAPI, deleteFormAPI } from '@/services/formService'; 
import { useToast } from "@/components/ui/use-toast"; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; 

const AVAILABLE_STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [forms, setForms] = useState<FormSummary[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true); // For initial skeleton
  const [isOperating, setIsOperating] = useState(false); // For operations like delete/duplicate
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriteria, setFilterCriteria] = useState<FormFilterCriteria>({ status: 'all' });
  const [error, setError] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<{ id: string; title: string } | null>(null);

  const loadForms = async () => {
    setIsLoadingInitial(true);
    setError(null);
    try {
      const fetchedForms = await fetchUserFormSummaries();
      setForms(fetchedForms);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error Loading Forms",
        description: errorMessage,
      });
    } finally {
      setIsLoadingInitial(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const filteredForms = useMemo(() => {
    return forms.filter(form => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = form.title.toLowerCase().includes(searchTermLower);
      const matchesStatus = filterCriteria.status === 'all' || !filterCriteria.status || form.status === filterCriteria.status;
      return matchesSearch && matchesStatus;
    });
  }, [forms, searchTerm, filterCriteria]);

  const handleEditForm = (formId: string) => {
    navigate(`/builder/${formId}`);
  };

  const handlePreviewForm = (formId: string) => {
    // TODO: Determine if preview route should be /f/:id (public) or a specific /preview/:id (internal)
    window.open(`/f/${formId}`, '_blank'); 
    toast({ title: "Previewing Form", description: `Opening public view for form ${formId} in a new tab.` });
  };

  const handleViewResponses = (formId: string) => {
    // TODO: Navigate to a dedicated responses page e.g. /responses/:formId
    // navigate(`/responses/${formId}`); 
    toast({ title: "View Responses", description: `TODO: Navigate to responses for form ${formId}. Current placeholder: /dashboard/forms/${formId}/responses` });
    navigate(`/dashboard/forms/${formId}/responses`); // Uses existing (soon deprecated) route as placeholder
  };

  const handleDuplicateForm = async (formId: string, formTitle: string) => {
    setIsOperating(true);
    try {
      toast({ title: "Duplicating Form...", description: `Duplicating "${formTitle}"` });
      const newForm = await duplicateFormAPI(formId, formTitle);
      setForms(prevForms => [newForm, ...prevForms]);
      setSearchTerm(''); // Clear search to show the new form
      setFilterCriteria({ status: 'all' }); // Reset filters
      toast({
        variant: "default",
        title: "Form Duplicated!",
        description: `"${newForm.title}" has been created as a draft.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Could not duplicate form.";
      toast({
        variant: "destructive",
        title: "Duplication Failed",
        description: errorMessage,
      });
    } finally {
      setIsOperating(false);
    }
  };

  const handleDeleteFormRequest = (formId: string, formTitle: string) => {
    setFormToDelete({ id: formId, title: formTitle });
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteForm = async () => {
    if (!formToDelete) return;
    setIsOperating(true);
    try {
      toast({ title: "Deleting Form...", description: `Deleting "${formToDelete.title}"` });
      await deleteFormAPI(formToDelete.id);
      setForms(prevForms => prevForms.filter(form => form.id !== formToDelete.id));
      toast({
        variant: "default",
        title: "Form Deleted",
        description: `"${formToDelete.title}" has been successfully deleted.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Could not delete form.";
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: errorMessage,
      });
    } finally {
      setIsOperating(false);
      setIsDeleteDialogOpen(false);
      setFormToDelete(null);
    }
  };
  
  return (
    <>
      <PageHeader 
        title="My Forms"
        description="Manage your existing forms or create new ones to start collecting responses."
        actions={<CreateFormButton />}
        className="bg-background border-b sticky top-0 z-20" // Increased z-index for header
      />
      {/* isOperating can be used for a global overlay loader if desired */}
      {/* {isOperating && <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"><p className="text-white">Processing...</p></div>} */}
      
      <div className="container mx-auto px-4 md:px-6 py-6 space-y-6">
        <SearchAndFilterBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          filterCriteria={filterCriteria}
          onFilterChange={setFilterCriteria}
          availableStatuses={AVAILABLE_STATUSES}
          className="sticky top-[calc(var(--header-height,69px)+1px)] z-10 bg-background py-4" // Adjust var(--header-height) if PageHeader height changes
        />
        <div className="pt-2"> {/* Added padding top to account for sticky SearchAndFilterBar */}
            <FormList
            forms={filteredForms}
            isLoading={isLoadingInitial} 
            error={error}
            onEditForm={handleEditForm}
            onPreviewForm={handlePreviewForm}
            onViewResponses={handleViewResponses}
            onDuplicateForm={handleDuplicateForm}
            onDeleteForm={handleDeleteFormRequest}
            />
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the form
              <strong className="mx-1">"{formToDelete?.title}"</strong>
              and all of its associated responses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFormToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteForm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Delete Form
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 