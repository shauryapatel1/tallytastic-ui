import type { FormSectionDefinition } from '@/types/forms';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface SectionPropertiesEditorProps {
  section: FormSectionDefinition;
  onUpdate: (updates: Partial<Omit<FormSectionDefinition, 'id' | 'fields'>>) => void;
}

export function SectionPropertiesEditor({
  section,
  onUpdate,
}: SectionPropertiesEditorProps) {

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Section Properties</h3>
      <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>General</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor={`section-title-${section.id}`}>Section Title</Label>
              <Input
                id={`section-title-${section.id}`}
                name="title" // Key for FormSectionDefinition
                value={section.title}
                onChange={handleInputChange}
                placeholder="E.g., Personal Information"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`section-description-${section.id}`}>Section Description (Optional)</Label>
              <Textarea
                id={`section-description-${section.id}`}
                name="description" // Key for FormSectionDefinition
                value={section.description || ''}
                onChange={handleInputChange}
                placeholder="Provide a brief description or instructions for this section."
                rows={3}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* TODO: Add more section-specific properties here if any arise */}
    </div>
  );
} 