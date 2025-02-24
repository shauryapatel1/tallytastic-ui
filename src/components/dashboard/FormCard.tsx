
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
import { Copy, Eye, Pencil } from "lucide-react";

interface FormCardProps {
  form: Form;
}

export const FormCard = ({ form }: FormCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-1">{form.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-primary/60 line-clamp-2">
          {form.description || "No description"}
        </p>
        <div className="mt-4 text-xs text-primary/40">
          Last updated {formatDistanceToNow(new Date(form.updated_at), { addSuffix: true })}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/dashboard/forms/${form.id}`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/dashboard/forms/${form.id}/preview`}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Link>
        </Button>
        <Button variant="ghost" size="sm">
          <Copy className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};
