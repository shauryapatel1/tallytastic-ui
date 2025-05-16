import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit3, Eye, BarChart3, Copy, Trash2 } from 'lucide-react';
import type { FormSummary } from '@/types/forms';
import { formatDistanceToNow, parseISO } from 'date-fns'; // For relative date formatting
import { cn } from '@/lib/utils';

interface FormListItemProps {
  form: FormSummary;
  onEdit: (formId: string) => void;
  onPreview: (formId: string) => void;
  onViewResponses: (formId: string) => void;
  onDuplicate: (formId: string, formTitle: string) => void;
  onDelete: (formId: string, formTitle: string) => void;
  className?: string;
}

const getStatusBadgeVariant = (status: FormSummary['status']): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (status) {
    case 'published':
      return 'default'; // Consider a green-ish or success-like variant if defined in theme
    case 'draft':
      return 'secondary';
    case 'archived':
      return 'outline';
    default:
      return 'secondary';
  }
};

export function FormListItem({
  form,
  onEdit,
  onPreview,
  onViewResponses,
  onDuplicate,
  onDelete,
  className,
}: FormListItemProps) {
  // Use lastModified for last modified date, as per FormSummary definition
  const lastModifiedDate = parseISO(form.lastModified);
  const createdDate = parseISO(form.createdAt);

  return (
    <Card className={cn("flex flex-col h-full shadow-sm hover:shadow-lg transition-shadow duration-200 ease-in-out", className)}>
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-tight clamp-2-lines" title={form.title}>
            {form.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0 -mr-2 -mt-2 h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Form actions for {form.title}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onPreview(form.id)}>
                <Eye className="mr-2 h-4 w-4" />
                Preview Form
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(form.id, form.title)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(form.id, form.title)}
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Form
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-xs text-muted-foreground clamp-1-line pt-0.5" title={`Last modified: ${lastModifiedDate.toLocaleString()}`}>
          Modified: {formatDistanceToNow(lastModifiedDate, { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm px-5 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">Status:</span>
          <Badge variant={getStatusBadgeVariant(form.status)} className="capitalize text-xs px-1.5 py-0.5 h-auto">
            {form.status}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">Responses:</span>
          <span className="font-medium text-xs">{form.responseCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">Created:</span>
          <span className="font-medium text-xs" title={createdDate.toLocaleString()}>
            {formatDistanceToNow(createdDate, { addSuffix: true })}
          </span>
        </div>
      </CardContent>
      <CardFooter className="border-t p-3 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 group text-xs h-8" onClick={() => onEdit(form.id)}>
          <Edit3 className="mr-1.5 h-3.5 w-3.5 transition-transform group-hover:scale-110" />
          Edit
        </Button>
        <Button
          variant="default"
          size="sm"
          className="flex-1 group text-xs h-8"
          onClick={() => onViewResponses(form.id)}
          disabled={form.responseCount === 0 && form.status !== 'published'} // Example: disable if no responses and not published
        >
          <BarChart3 className="mr-1.5 h-3.5 w-3.5 transition-transform group-hover:scale-110" />
          Responses {form.responseCount > 0 ? `(${form.responseCount})` : ''}
        </Button>
      </CardFooter>
    </Card>
  );
} 