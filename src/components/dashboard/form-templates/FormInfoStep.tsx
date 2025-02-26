
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";

interface FormInfoStepProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  handleNext: (e: React.FormEvent) => void;
  isPending: boolean;
}

export const FormInfoStep = ({
  title,
  setTitle,
  description,
  setDescription,
  handleNext,
  isPending,
}: FormInfoStepProps) => {
  return (
    <form onSubmit={handleNext} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Form Title <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          placeholder="Enter a title for your form"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-base"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description <span className="text-primary/40">(optional)</span>
        </label>
        <Textarea
          id="description"
          placeholder="Enter a description for your form"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="resize-none"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          Next <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
        </Button>
      </div>
    </form>
  );
};
