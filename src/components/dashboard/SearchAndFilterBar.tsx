import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormFilterCriteria, FormStatus } from '@/types/forms';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface SearchAndFilterBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  filterCriteria: FormFilterCriteria;
  onFilterChange: (criteria: FormFilterCriteria) => void;
  availableStatuses: Array<{ value: FormStatus | 'all'; label: string }>;
  className?: string;
}

export function SearchAndFilterBar({
  searchTerm,
  onSearchTermChange,
  filterCriteria,
  onFilterChange,
  availableStatuses,
  className,
}: SearchAndFilterBarProps) {
  const handleStatusChange = (status: FormStatus | 'all') => {
    onFilterChange({ ...filterCriteria, status });
  };

  // Add more filter handlers here if needed (e.g., for sort by)

  return (
    <div className={cn("flex flex-col md:flex-row items-center gap-3 md:gap-4 p-4 border-b bg-card", className)}>
      <div className="relative w-full md:flex-grow">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search forms by title..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full rounded-lg bg-background pl-8 md:w-full"
        />
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        <Select
          value={filterCriteria.status || 'all'}
          onValueChange={(value) => handleStatusChange(value as FormStatus | 'all')}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {availableStatuses.map((statusOption) => (
              <SelectItem key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Add more Select components for other filters like sortBy if needed */}
      </div>
    </div>
  );
} 