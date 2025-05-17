import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { FormDefinition, FormResponse } from '@/types/forms';
import { getFormById, getFormResponsesByFormId } from '@/services/formService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ExternalLink, Eye } from 'lucide-react';

export function FormResponsesPage() {
  const { formId } = useParams<{ formId: string }>();
  const [formDefinition, setFormDefinition] = useState<FormDefinition | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);

  useEffect(() => {
    if (!formId) {
      setError("Form ID is missing from URL.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setFormDefinition(null);
      setResponses([]);

      try {
        const formDefData = await getFormById(formId);

        if (!formDefData) {
          setError('Form definition not found. Cannot display responses.');
          toast.error('Form definition not found.');
          setIsLoading(false);
          return;
        }
        
        setFormDefinition(formDefData);

        const responsesData = await getFormResponsesByFormId(formId);
        setResponses(responsesData || []);

      } catch (err) {
        console.error("Error fetching form responses or definition:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        if (err instanceof Error && err.message.toLowerCase().includes("form not found")) {
            setError('Form definition not found.');
            toast.error('Form definition not found.');
        } else if (formDefinition) {
            setError(`Failed to load responses: ${errorMessage}`);
            toast.error(`Failed to load responses: ${errorMessage}`);
        } else {
            setError(`Failed to load form data: ${errorMessage}`);
            toast.error(`Failed to load form data: ${errorMessage}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  const getFieldLabel = useCallback((fieldId: string): string => {
    if (!formDefinition) return fieldId;
    for (const section of formDefinition.sections) {
      const field = section.fields.find(f => f.id === fieldId);
      if (field) return field.label || fieldId;
    }
    return fieldId;
  }, [formDefinition]);

  if (isLoading) {
    return <div className="p-6"><p>Loading responses...</p></div>;
  }

  if (error) {
    return <div className="p-6 text-destructive"><p>Error: {error}</p></div>;
  }

  if (!formDefinition) {
    return <div className="p-6 text-muted-foreground"><p>Form definition could not be loaded. Responses cannot be displayed.</p></div>;
  }
  
  const hasResponses = responses.length > 0;

  // Determine columns for the table - for MVP, let's pick first 3-4 data fields from the first response
  // Or better, use formDefinition fields if available and not too many.
  // For simplicity now: Submitted At and a preview of data.
  
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Responses for: {formDefinition.title}</h1>
        <p className="text-sm text-muted-foreground">
          {formDefinition.description || `Review submissions for your form.`}
        </p>
        <div className="mt-3">
            <Button variant="outline" size="sm" asChild>
                <Link to={`/f/${formDefinition.id}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" /> View Live Form
                </Link>
            </Button>
        </div>
      </header>

      {hasResponses ? (
        <>
          <div className="border rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Submitted At</TableHead>
                  <TableHead>Response Summary</TableHead>
                  <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell className="font-medium">
                      {new Date(response.submittedAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="truncate max-w-md">
                      {/* Simple preview of first few data points */}
                      {Object.entries(response.data)
                        .slice(0, 3) 
                        .map(([key, value], index, arr) => (
                          <span key={key} className="mr-2">
                            <Badge variant="secondary">{getFieldLabel(key)}:</Badge> {String(value).substring(0,30)}{String(value).length > 30 ? '...': ''}
                            {index < arr.length - 1 && ', '}
                          </span>
                        ))}
                      {Object.keys(response.data).length === 0 && <span className="text-muted-foreground italic">No data submitted.</span>}
                      {Object.keys(response.data).length > 3 && <span className="text-muted-foreground">...</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => setSelectedResponse(response)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </DialogTrigger>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className='text-sm text-muted-foreground mt-2'>Total responses: {responses.length}</p>
        </>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-foreground">No responses yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Once users start submitting this form, their responses will appear here.
          </p>
        </div>
      )}

      {/* Modal for Viewing Individual Response */}
      {selectedResponse && (
        <Dialog open={!!selectedResponse} onOpenChange={(isOpen) => !isOpen && setSelectedResponse(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Response Details</DialogTitle>
              <DialogDescription>
                Submitted on: {new Date(selectedResponse.submittedAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              {Object.entries(selectedResponse.data).map(([fieldId, value]) => (
                <div key={fieldId} className="grid grid-cols-[max-content_1fr] items-start gap-x-3 gap-y-1">
                  <dt className="font-semibold text-sm text-muted-foreground whitespace-nowrap">{getFieldLabel(fieldId)}:</dt>
                  <dd className="text-sm break-words">{String(value)}</dd>
                </div>
              ))}
              {Object.keys(selectedResponse.data).length === 0 && <p className="text-sm text-muted-foreground italic">This response contains no data.</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedResponse(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 