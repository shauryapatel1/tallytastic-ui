import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface ParagraphOptionsEditorProps {
  content: string | undefined;
  onPropertyChange: (
    propertyName: 'content',
    value: string | undefined
  ) => void;
}

export function ParagraphOptionsEditor({
  content,
  onPropertyChange,
}: ParagraphOptionsEditorProps) {
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onPropertyChange('content', e.target.value);
  };

  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor="paragraph-content" className="text-xs font-medium">
          Paragraph Text
        </Label>
        <Textarea
          id="paragraph-content"
          value={content || ''} // Controlled component
          onChange={handleContentChange}
          placeholder="Enter your paragraph text here... This text will be displayed directly in the form."
          className="mt-1 min-h-[120px]" // Example minimum height
          rows={5} // Default rows
        />
        <p className="text-xs text-muted-foreground mt-1">
          This content will be displayed as a block of text in the form.
          {/* TODO: Future: Add note about Markdown or simple rich text if supported */}
        </p>
      </div>
      {/* TODO: Future: Add controls for text alignment if desired as a specific property */}
    </div>
  );
} 