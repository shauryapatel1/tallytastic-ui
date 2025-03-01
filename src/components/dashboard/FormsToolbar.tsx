
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Grid, Search, SortDesc } from "lucide-react";
import { motion } from "framer-motion";

interface FormsToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  viewMode: "grid" | "insights";
  setViewMode: (mode: "grid" | "insights") => void;
}

export const FormsToolbar = ({ 
  searchTerm, 
  setSearchTerm, 
  sortBy, 
  setSortBy,
  viewMode,
  setViewMode
}: FormsToolbarProps) => {
  return (
    <motion.div 
      className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-white p-4 rounded-lg border shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/40" />
        <Input
          placeholder="Search forms..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-4 ml-auto">
        <Tabs defaultValue={viewMode} className="w-[200px]" onValueChange={(v) => setViewMode(v as "grid" | "insights")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid">
              <Grid className="mr-2 h-4 w-4" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="insights">
              <BarChart className="mr-2 h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SortDesc className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated_at">Last Updated</SelectItem>
            <SelectItem value="title">Form Title</SelectItem>
            <SelectItem value="responses">Response Count</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};
