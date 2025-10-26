import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { FormDefinition, FormValues, FormErrors, FormFieldDefinition } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isFieldVisible } from '@/lib/conditionalLogicEvaluator';
import { motion, AnimatePresence } from 'framer-motion';
import { FormFieldRenderer } from '@/components/public/form-fields/FormFieldRenderer';

interface ConversationalFormRendererProps {
  formDefinition: FormDefinition;
  formValues: FormValues;
  onFormValueChange: (fieldId: string, value: any) => void;
  onFieldBlur: (fieldId: string) => void;
  formErrors: FormErrors;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ConversationalFormRenderer({
  formDefinition,
  formValues,
  onFormValueChange,
  onFieldBlur,
  formErrors,
  onSubmit,
  isSubmitting
}: ConversationalFormRendererProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get all fields from all sections
  const allFields = formDefinition.sections.flatMap(section => section.fields);
  
  // Filter to only visible, non-display fields
  const getVisibleQuestions = useCallback((): FormFieldDefinition[] => {
    return allFields.filter(field => {
      // Skip display-only fields (heading, paragraph, divider)
      if (['heading', 'paragraph', 'divider'].includes(field.type)) {
        return false;
      }
      // Check conditional visibility
      return isFieldVisible(field, allFields, formValues);
    });
  }, [allFields, formValues]);

  const visibleQuestions = getVisibleQuestions();
  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / visibleQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === visibleQuestions.length - 1;

  // Apply variable piping to text
  const applyPiping = useCallback((text: string): string => {
    if (!text) return text;
    
    return text.replace(/\{([^}]+)\}/g, (match, fieldId) => {
      const value = formValues[fieldId];
      return value !== undefined && value !== null && value !== '' ? String(value) : match;
    });
  }, [formValues]);

  // Focus input on question change
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, [currentQuestionIndex]);

  const handleNext = useCallback(() => {
    if (!currentQuestion) return;

    // Trigger validation on blur
    onFieldBlur(currentQuestion.id);

    // Check if current field has errors
    const hasError = formErrors[currentQuestion.id] && formErrors[currentQuestion.id]!.length > 0;
    
    if (hasError) {
      return; // Don't proceed if there are errors
    }

    if (isLastQuestion) {
      onSubmit();
    } else {
      setCurrentQuestionIndex(prev => Math.min(prev + 1, visibleQuestions.length - 1));
    }
  }, [currentQuestion, formErrors, isLastQuestion, onFieldBlur, onSubmit, visibleQuestions.length]);

  const handlePrevious = useCallback(() => {
    setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Enter to continue
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }

    // Number keys 1-9 for single-choice (radio)
    if (currentQuestion?.type === 'radio' && /^[1-9]$/.test(e.key)) {
      const optionIndex = parseInt(e.key) - 1;
      if (currentQuestion.options && optionIndex < currentQuestion.options.length) {
        const selectedOption = currentQuestion.options[optionIndex];
        onFormValueChange(currentQuestion.id, selectedOption.value);
        
        // Auto-advance after selection
        setTimeout(() => {
          handleNext();
        }, 300);
      }
    }
  }, [currentQuestion, handleNext, onFormValueChange]);

  // Keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (!currentQuestion) {
    return <div className="text-center p-8">No questions to display</div>;
  }

  const currentError = formErrors[currentQuestion.id];
  const pipedLabel = applyPiping(currentQuestion.label);
  const pipedDescription = currentQuestion.description ? applyPiping(currentQuestion.description) : undefined;

  return (
    <div className="flex flex-col h-full min-h-[600px]">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {visibleQuestions.length}
          </span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question area with animation */}
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Question label */}
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                {pipedLabel}
                {currentQuestion.isRequired && <span className="text-destructive ml-1">*</span>}
              </h2>
              {pipedDescription && (
                <p className="text-base text-muted-foreground">{pipedDescription}</p>
              )}
            </div>

            {/* Field input */}
            <div className="max-w-xl">
              <FormFieldRenderer
                field={{
                  ...currentQuestion,
                  label: pipedLabel,
                  description: pipedDescription
                }}
                value={formValues[currentQuestion.id]}
                onChange={(value) => onFormValueChange(currentQuestion.id, value)}
                error={currentError?.[0]}
              />
            </div>

            {/* Error display */}
            {currentError && currentError.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-destructive text-sm"
              >
                {currentError[0]}
              </motion.div>
            )}

            {/* Keyboard hints */}
            {currentQuestion.type === 'radio' && currentQuestion.options && (
              <p className="text-xs text-muted-foreground italic">
                Tip: Press 1-{Math.min(9, currentQuestion.options.length)} to select, or Enter to continue
              </p>
            )}
            {currentQuestion.type === 'select' && (
              <p className="text-xs text-muted-foreground italic">
                Tip: Use arrow keys to navigate options
              </p>
            )}
            {currentQuestion.type === 'date' && (
              <p className="text-xs text-muted-foreground italic">
                Tip: Use arrow keys to navigate calendar
              </p>
            )}
            {currentQuestion.type === 'number' && (
              <p className="text-xs text-muted-foreground italic">
                Tip: Use arrow keys to adjust value
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center pt-8 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="gap-2"
        >
          {isLastQuestion ? (
            <>
              Submit
              <Check className="w-4 h-4" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Tab navigation hint */}
      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground">
          Use <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to continue, 
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs ml-1">Tab</kbd> to navigate
        </p>
      </div>
    </div>
  );
}
