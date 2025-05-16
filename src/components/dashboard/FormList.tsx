import React from 'react';
import { AlertCircle, FilePlus2, Loader2, Plus } from 'lucide-react';
import type { FormSummary } from '@/types/forms';
import { FormListItem } from './FormListItem';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FormListProps {
  forms: FormSummary[];
  isLoading: boolean;
  error: string | null;
  onEditForm: (formId: string) => void;
  onPreviewForm: (formId: string) => void;
  onViewResponses: (formId: string) => void;
  onDuplicateForm: (formId: string, formTitle: string) => void;
  onDeleteForm: (formId: string, formTitle: string) => void;
  className?: string;
}

const LoadingSkeleton = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <Card key={i} className="flex flex-col h-full">
        <CardHeader className="pb-3 pt-5 px-5">
          <Skeleton className="h-5 w-3/4 mb-1.5" />
          <Skeleton className="h-3 w-1/2" />
        </CardHeader>
        <CardContent className="flex-grow space-y-2 text-sm px-5 pb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </CardContent>
        <CardFooter className="border-t p-3 flex gap-2">
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
        </CardFooter>
      </Card>
    ))}
  </div>
);

export function FormList({
  forms,
  isLoading,
  error,
  onEditForm,
  onPreviewForm,
  onViewResponses,
  onDuplicateForm,
  onDeleteForm,
  className,
}: FormListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className={cn("max-w-2xl mx-auto", className)}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Fetching Forms</AlertTitle>
        <AlertDescription>
          {error || "An unexpected error occurred while trying to load your forms. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  if (forms.length === 0) {
    return (
      <div className={cn("text-center py-12 border-2 border-dashed border-border rounded-lg bg-card", className)}>
        <FilePlus2 className="mx-auto h-16 w-16 text-muted-foreground/70 mb-4" strokeWidth={1.25}/>
        <h3 className="text-xl font-semibold text-foreground">No Forms Found</h3>
        <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
          It looks like you haven't created any forms yet, or your current filter returned no results.
        </p>
        <Button asChild variant="default">
          <Link to="/builder/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Form
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6", className)}>
      {forms.map((form) => (
        <FormListItem
          key={form.id}
          form={form}
          onEdit={onEditForm}
          onPreview={onPreviewForm}
          onViewResponses={onViewResponses}
          onDuplicate={onDuplicateForm}
          onDelete={onDeleteForm}
        />
      ))}
    </div>
  );
} 