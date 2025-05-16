import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react"; // Using lucide-react consistently
import { format, parseISO, isValid } from "date-fns"; // For displaying selected dates and parsing
import { useState } from "react"; // For managing popover open state

export interface DateOptionsEditorProps {
  dateFormat: string | undefined;
  minDate: string | undefined;    // ISO date string
  maxDate: string | undefined;    // ISO date string
  onPropertyChange: (
    propertyName: 'dateFormat' | 'minDate' | 'maxDate',
    value: string | undefined
  ) => void;
}

const COMMON_DATE_FORMATS = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (e.g., 05/15/2025)" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (e.g., 15/05/2025)" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (e.g., 2025-05-15)" },
  { value: "Month D, YYYY", label: "Month D, YYYY (e.g., May 15, 2025)" }, // Uses date-fns format tokens for parsing later if needed
  { value: "PPP", label: "Default Full (e.g., May 15th, 2025)" }, // date-fns PPP format
];

export function DateOptionsEditor({
  dateFormat,
  minDate,
  maxDate,
  onPropertyChange,
}: DateOptionsEditorProps) {
  // Popover open states
  const [isMinDatePopoverOpen, setIsMinDatePopoverOpen] = useState(false);
  const [isMaxDatePopoverOpen, setIsMaxDatePopoverOpen] = useState(false);

  const getValidDate = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    const parsed = parseISO(dateString);
    return isValid(parsed) ? parsed : undefined;
  };

  const selectedMinDateObj = getValidDate(minDate);
  const selectedMaxDateObj = getValidDate(maxDate);

  const handleDateSelect = (
    date: Date | undefined,
    propertyName: 'minDate' | 'maxDate',
    setPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    onPropertyChange(propertyName, date ? date.toISOString() : undefined);
    setPopoverOpen(false); // Close popover on date select or clear
  };

  // TODO: Implement cross-validation: if maxDate < minDate, show warning or prevent invalid state.
  // The Calendar's disabled prop provides some basic UI for this.

  return (
    <div className="space-y-4">
      {/* Date Format Selector */}
      <div className="space-y-1.5">
        <Label htmlFor="date-format" className="text-xs font-medium">Date Display Format</Label>
        <Select
          value={dateFormat}
          onValueChange={(value) => onPropertyChange('dateFormat', value === 'none' ? undefined : value)}
        >
          <SelectTrigger id="date-format" className="mt-1 w-full">
            <SelectValue placeholder="Select a display format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Browser Default</SelectItem>
            {COMMON_DATE_FORMATS.map(f => (
              <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Controls how the date is shown to the user.</p>
      </div>

      {/* Minimum Date Picker */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium block">Minimum Selectable Date</Label>
        <Popover open={isMinDatePopoverOpen} onOpenChange={setIsMinDatePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full justify-start text-left font-normal mt-1"
            >
              <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
              {selectedMinDateObj ? format(selectedMinDateObj, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedMinDateObj}
              onSelect={(date) => handleDateSelect(date, 'minDate', setIsMinDatePopoverOpen)}
              disabled={(date) => selectedMaxDateObj ? date > selectedMaxDateObj : false}
              initialFocus
            />
            <div className="p-2 border-t flex justify-end bg-muted/50">
                <Button variant="ghost" size="sm" onClick={() => handleDateSelect(undefined, 'minDate', setIsMinDatePopoverOpen)}>Clear</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Maximum Date Picker */} generalizing the clear button
      <div className="space-y-1.5">
        <Label className="text-xs font-medium block">Maximum Selectable Date</Label>
        <Popover open={isMaxDatePopoverOpen} onOpenChange={setIsMaxDatePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full justify-start text-left font-normal mt-1"
            >
              <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
              {selectedMaxDateObj ? format(selectedMaxDateObj, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedMaxDateObj}
              onSelect={(date) => handleDateSelect(date, 'maxDate', setIsMaxDatePopoverOpen)}
              disabled={(date) => selectedMinDateObj ? date < selectedMinDateObj : false}
              initialFocus
            />
             <div className="p-2 border-t flex justify-end bg-muted/50">
                <Button variant="ghost" size="sm" onClick={() => handleDateSelect(undefined, 'maxDate', setIsMaxDatePopoverOpen)}>Clear</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {/* TODO: Add more robust validation UI if minDate > maxDate (e.g., an error message) */}
    </div>
  );
} 