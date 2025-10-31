
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Download, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormResponse as AppFormResponse } from "@/lib/types";
import { ResponseFilters, DateRangeFilter } from "./ResponseFilters";
import { format } from "date-fns";

// Local interface to match the component's expectations
export interface FormResponse {
  id: string;
  submittedAt: string;
  respondent?: string;
  values: Record<string, any>;
}

interface ResponsesTableProps {
  responses: AppFormResponse[];
  form: Form;
}

export function ResponsesTable({ responses, form }: ResponsesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResponses, setSelectedResponses] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRangeFilter>({ from: undefined, to: undefined });
  const { toast } = useToast();

  // Transform the app FormResponse to the component's expected format
  const transformedResponses: FormResponse[] = responses.map(response => ({
    id: response.id,
    submittedAt: response.submitted_at,
    respondent: response.data.name || response.data.email || response.data.fullName || "Anonymous",
    values: response.data
  }));

  const handleExport = (format: "csv") => {
    const responsesToExport = selectedResponses.length > 0
      ? filteredResponses.filter(r => selectedResponses.includes(r.id))
      : filteredResponses;

    if (responsesToExport.length === 0) {
      toast({
        title: "No responses to export",
        description: "Please select responses or adjust your filters.",
        variant: "destructive",
      });
      return;
    }

    // Get all unique field keys
    const allKeys = new Set<string>();
    responsesToExport.forEach(response => {
      Object.keys(response.values).forEach(key => {
        if (!key.startsWith('_')) allKeys.add(key); // Skip metadata keys
      });
    });
    
    const headers = ['Submitted At', 'Respondent', ...Array.from(allKeys)];
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.map(h => `"${h}"`).join(",") + "\r\n";
    
    // Add data rows
    responsesToExport.forEach(response => {
      const row = [
        `"${formatDate(response.submittedAt)}"`,
        `"${response.respondent || 'Anonymous'}"`,
        ...Array.from(allKeys).map(key => {
          const value = response.values[key];
          if (value === null || value === undefined) return '""';
          
          // Handle arrays (multi-select)
          if (Array.isArray(value)) {
            return `"${value.join(', ').replace(/"/g, '""')}"`;
          }
          
          // Handle objects
          if (typeof value === 'object') {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          
          // Handle strings and numbers
          return `"${String(value).replace(/"/g, '""')}"`;
        })
      ];
      csvContent += row.join(",") + "\r\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const currentDate = new Date();
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    link.setAttribute("download", `${form.title || "form"}_responses_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export complete",
      description: `${responsesToExport.length} response(s) exported successfully.`,
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedResponses(transformedResponses.map(r => r.id));
    } else {
      setSelectedResponses([]);
    }
  };

  const handleSelectResponse = (responseId: string) => {
    setSelectedResponses(prev => {
      if (prev.includes(responseId)) {
        return prev.filter(id => id !== responseId);
      } else {
        return [...prev, responseId];
      }
    });
  };

  const filteredResponses = transformedResponses.filter(response => {
    // Search filter
    if (searchQuery) {
      const matchesSearch = Object.values(response.values).some(
        value => value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (!matchesSearch) return false;
    }
    
    // Date range filter
    if (dateRange.from || dateRange.to) {
      const submittedDate = new Date(response.submittedAt);
      
      if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        if (submittedDate < fromDate) return false;
      }
      
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        if (submittedDate > toDate) return false;
      }
    }
    
    return true;
  });

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Extract field information from the form
  const fields = form.sections?.flatMap(section => section.fields).map(field => ({
    id: field.id,
    label: field.label
  })) || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" />
            <Input
              placeholder="Search responses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <ResponseFilters
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onClearFilters={() => setDateRange({ from: undefined, to: undefined })}
            hasActiveFilters={!!dateRange.from || !!dateRange.to}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Download className="h-4 w-4 mr-1" />
                Export <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Input 
                  type="checkbox"
                  className="h-4 w-4"
                  checked={selectedResponses.length === transformedResponses.length && transformedResponses.length > 0}
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-40">Date</TableHead>
              {fields.slice(0, 3).map((field) => (
                <TableHead key={field.id}>{field.label}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResponses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5 + fields.slice(0, 3).length} className="text-center py-10">
                  {transformedResponses.length === 0 ? (
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No responses yet</p>
                      <p className="text-sm">Responses will appear here when people submit your form</p>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No matching responses</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredResponses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell>
                    <Input 
                      type="checkbox"
                      className="h-4 w-4"
                      checked={selectedResponses.includes(response.id)}
                      onChange={() => handleSelectResponse(response.id)}
                    />
                  </TableCell>
                  <TableCell>{formatDate(response.submittedAt)}</TableCell>
                  {fields.slice(0, 3).map((field) => (
                    <TableCell key={field.id}>{response.values[field.id] || "-"}</TableCell>
                  ))}
                  <TableCell>
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredResponses.length > 0 && (
        <div className="flex justify-between items-center py-2">
          <div className="text-sm text-gray-500">
            Showing {filteredResponses.length} of {transformedResponses.length} responses
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
