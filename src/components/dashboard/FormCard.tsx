
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
import { Copy, Eye, Pencil, MoreHorizontal, Clock, CheckCircle, Edit, Share2, Trash, ExternalLink, FileText, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface FormCardProps {
  form: Form;
  responseCount?: number;
}

export const FormCard = ({ form, responseCount = 0 }: FormCardProps) => {
  const { toast } = useToast();
  const formattedDate = formatDistanceToNow(new Date(form.updated_at), { 
    addSuffix: true 
  });

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
    <Card className="overflow-hidden transition-all hover:shadow-md group border-indigo-100">
      <CardHeader className="pb-2 pt-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={form.status === 'published' ? "default" : "outline"} className="px-2 py-0 h-5">
                {form.status === 'published' ? (
                  <><Send className="mr-1 h-3 w-3" /> Published</>
                ) : (
                  <><FileText className="mr-1 h-3 w-3" /> Draft</>
                )}
              </Badge>
              {form.status === 'published' && (
                <Badge variant="secondary" className="px-2 py-0 h-5 bg-green-100 text-green-700">
                  <CheckCircle className="mr-1 h-3 w-3" /> Live
                </Badge>
              )}
            </div>
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
                <Link to={`/app/forms/${form.id}/build`} className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Form
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/app/forms/${form.id}/preview`} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Form
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                <Share2 className="mr-2 h-4 w-4" />
                Share Form
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/app/forms/${form.id}/analyze`} className="cursor-pointer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Responses
                </Link>
              </DropdownMenuItem>
              {form.status === 'published' && (
                <DropdownMenuItem asChild>
                  <Link to={`/app/forms/${form.id}/share`} className="cursor-pointer">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Form
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleDeleteForm}>
                <Trash className="mr-2 h-4 w-4" />
                Delete Form
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <p className="text-sm text-primary/60 line-clamp-2 min-h-[48px]">
          {form.description || "No description provided for this form."}
        </p>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center text-xs text-primary/50">
            <Clock className="mr-1 h-3 w-3" />
            {formattedDate}
          </div>
          {responseCount > 0 ? (
            <Link 
              to={`/app/forms/${form.id}/analyze`}
              className="text-xs font-medium flex items-center hover:text-primary transition-colors"
            >
              <Badge variant="secondary" className="px-2 py-0 h-5 bg-blue-100 text-blue-700 hover:bg-blue-200">
                <CheckCircle className="mr-1 h-3 w-3" />
                {responseCount} {responseCount === 1 ? 'response' : 'responses'}
              </Badge>
            </Link>
          ) : (
            <span className="text-xs text-muted-foreground">No responses yet</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-3 grid grid-cols-3 gap-2">
        <Button variant="ghost" size="sm" asChild className="h-8 hover:bg-indigo-100 hover:text-indigo-700">
          <Link to={`/app/forms/${form.id}/build`}>
            <Pencil className="mr-2 h-3 w-3" />
            Edit
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild className="h-8 hover:bg-indigo-100 hover:text-indigo-700">
          <Link to={`/app/forms/${form.id}/preview`}>
            <Eye className="mr-2 h-3 w-3" />
            Preview
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 hover:bg-indigo-100 hover:text-indigo-700" 
          onClick={handleCopyLink}
        >
          <Copy className="mr-2 h-3 w-3" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};
