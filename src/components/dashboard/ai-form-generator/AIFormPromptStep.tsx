
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface AIFormPromptStepProps {
  formTitle: string;
  prompt: string;
  onFormTitleChange: (title: string) => void;
  onPromptChange: (prompt: string) => void;
  onNext: () => void;
}

export function AIFormPromptStep({
  formTitle,
  prompt,
  onFormTitleChange,
  onPromptChange,
  onNext
}: AIFormPromptStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-indigo-500" />
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-semibold">
            Generate Form with AI
          </span>
        </h3>
        <p className="text-sm text-muted-foreground">
          Describe your form and we'll create it for you using AI magic.
        </p>
      </div>
      
      <Card className="overflow-hidden border-indigo-100/20 shadow-md">
        <CardContent className="p-5 space-y-4">
          <div className="space-y-2">
            <label htmlFor="form-title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Form Title
            </label>
            <Input
              id="form-title"
              placeholder="Enter a descriptive title for your form"
              value={formTitle}
              onChange={(e) => onFormTitleChange(e.target.value)}
              className="border-indigo-100/30 focus-visible:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="form-prompt" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Describe Your Form
            </label>
            <Textarea
              id="form-prompt"
              placeholder="Describe the form you want to create (e.g., 'A contact form for a restaurant with name, email, phone number, and preferred reservation date')"
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              rows={4}
              className="border-indigo-100/30 focus-visible:ring-indigo-500"
            />
            <p className="text-xs text-muted-foreground mt-1">
              The more details you provide, the better AI can understand your needs.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Button 
        onClick={onNext} 
        disabled={!formTitle.trim()}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium"
      >
        <Wand2 className="mr-2 h-4 w-4" />
        Next: Configure Options
      </Button>
    </motion.div>
  );
}
