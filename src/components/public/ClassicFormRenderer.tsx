import React, { useState, useMemo } from 'react';
import type { FormDefinition, FormValues, FormErrors } from '@/types/forms';
import { FormRenderer } from '@/components/builder/preview/FormRenderer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { isFieldVisible } from '@/lib/conditionalLogicEvaluator';

interface ClassicFormRendererProps {
  formDefinition: FormDefinition;
  formValues: FormValues;
  onFormValueChange: (fieldId: string, value: any) => void;
  onFieldBlur: (fieldId: string) => void;
  formErrors: FormErrors;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  onPageChange?: (direction: 'next' | 'back', pageIndex: number) => void;
}

export function ClassicFormRenderer({
  formDefinition,
  formValues,
  onFormValueChange,
  onFieldBlur,
  formErrors,
  onSubmit,
  isSubmitting,
  onPageChange
}: ClassicFormRendererProps) {
  const enablePagination = formDefinition.settings?.enablePagination ?? false;
  const [currentPage, setCurrentPage] = useState(0);

  // Get all fields for conditional logic evaluation
  const allFields = formDefinition.sections.flatMap(section => section.fields);

  // Filter visible sections based on conditional logic
  const visibleSections = useMemo(() => {
    return formDefinition.sections.filter(section => 
      section.fields.some(field => isFieldVisible(field, allFields, formValues))
    );
  }, [formDefinition.sections, allFields, formValues]);

  const totalPages = visibleSections.length;
  const progress = ((currentPage + 1) / totalPages) * 100;

  // Sections to render based on pagination setting
  const sectionsToRender = enablePagination 
    ? [visibleSections[currentPage]] 
    : visibleSections;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      onPageChange?.('next', newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      onPageChange?.('back', newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isLastPage = currentPage === totalPages - 1;
  const isFirstPage = currentPage === 0;

  return (
    <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8">
      {enablePagination && totalPages > 1 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Section {currentPage + 1} of {totalPages}
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <FormRenderer
        formDefinition={{
          ...formDefinition,
          sections: sectionsToRender
        }}
        formValues={formValues}
        onFormValueChange={onFormValueChange}
        onFieldBlur={onFieldBlur}
        formErrors={formErrors}
      />
      
      {enablePagination && totalPages > 1 ? (
        <div className="flex justify-between items-center pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstPage}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {isLastPage ? (
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="text-base py-3 px-6"
            >
              {isSubmitting ? 'Submitting...' : formDefinition.settings?.submitButtonText || 'Submit Response'}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full text-base py-3"
        >
          {isSubmitting ? 'Submitting...' : formDefinition.settings?.submitButtonText || 'Submit Response'}
        </Button>
      )}
    </form>
  );
}
