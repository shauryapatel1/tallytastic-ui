
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Download, Filter, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormResponse as AppFormResponse } from "@/lib/types";

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
  const { toast } = useToast();

  // Transform the app FormResponse to the component's expected format
  const transformedResponses: FormResponse[] = responses.map(response => ({
    id: response.id,
    submittedAt: response.submitted_at,
    respondent: response.data.name || response.data.email || response.data.fullName || "Anonymous",
    values: response.data
  }));

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    toast({
      title: "Export initiated",
      description: `Your responses are being exported as ${format.toUpperCase()}`,
    });
    // In a real implementation, this would trigger the export functionality
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
    if (!searchQuery) return true;
    
    // Search in all values
    return Object.values(response.values).some(
      value => value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
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
  const fields = form.fields.map(field => ({
    id: field.id,
    label: field.label
  }));

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
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
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
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                Export as PDF
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
