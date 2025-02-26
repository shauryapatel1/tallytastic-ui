
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { Copy, Eye, Pencil, MoreHorizontal, Clock, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FormCardProps {
  form: Form;
}

export const FormCard = ({ form }: FormCardProps) => {
  const { toast } = useToast();
  const formattedDate = formatDistanceToNow(new Date(form.updated_at), { 
    addSuffix: true 
  });

  const getStatusColor = () => {
    if (form.published) return "bg-green-500";
    return "bg-amber-500";
  };

  const getResponseCount = () => {
    // This would eventually come from the API
    return Math.floor(Math.random() * 50);
  };

  const handleCopyLink = () => {
    // In a real app, this would be the actual sharable link
    const shareableLink = `${window.location.origin}/f/${form.id}`;
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Form link copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy link",
          description: "Please try again",
          variant: "destructive",
        });
      });
  };

  const handleDeleteForm = () => {
    // This would call an API to delete the form in a real app
    toast({
      title: "Not implemented",
      description: "Form deletion is not implemented in this demo",
    });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md group">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className={cn("h-2 w-2 rounded-full", getStatusColor())} 
                 title={form.published ? "Published" : "Draft"} />
            <CardTitle className="line-clamp-1 text-xl">{form.title}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/forms/${form.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/forms/${form.id}/preview`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleDeleteForm}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-primary/60 line-clamp-2 min-h-[40px]">
          {form.description || "No description"}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-xs text-primary/50">
            <Clock className="mr-1 h-3 w-3" />
            {formattedDate}
          </div>
          <div className="text-xs font-medium">
            {getResponseCount()} responses
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-secondary/30 p-3 grid grid-cols-3 gap-2">
        <Button variant="ghost" size="sm" asChild className="h-8">
          <Link to={`/dashboard/forms/${form.id}`}>
            <Pencil className="mr-2 h-3 w-3" />
            Edit
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild className="h-8">
          <Link to={`/dashboard/forms/${form.id}/preview`}>
            <Eye className="mr-2 h-3 w-3" />
            Preview
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="h-8" onClick={handleCopyLink}>
          <Copy className="mr-2 h-3 w-3" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};
