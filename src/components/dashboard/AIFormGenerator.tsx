import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Wand2 } from "lucide-react";
import { FormField, AIFormPrompt } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AIFormGeneratorProps {
  onFieldsGenerated: (fields: FormField[]) => void;
  onClose: () => void;
}

// Define proper FieldOption objects
const createOption = (label: string) => ({
  id: crypto.randomUUID(),
  label,
  value: label.toLowerCase().replace(/\s+/g, '_')
});

// Updated form templates with proper types
const getFormTemplate = (formType: string, industry: string): FormField[] => {
  const baseId = () => crypto.randomUUID();
  
  switch (formType) {
    case "contact":
      return [
        {
          id: baseId(),
          name: baseId(),
          type: "text",
          label: "Full Name",
          isRequired: true,
          placeholder: "Enter your full name",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "email",
          label: "Email Address",
          isRequired: true,
          placeholder: "your@email.com",
        },
        {
          id: baseId(),
          name: baseId(),
          type: industry === "healthcare" ? "tel" : "text",
          label: "Phone Number",
          isRequired: industry === "healthcare",
          placeholder: "Your phone number",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "textarea",
          label: "Message",
          isRequired: true,
          placeholder: "How can we help you?",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "checkbox",
          label: "I agree to be contacted about my inquiry",
          isRequired: true,
        }
      ];

    case "feedback":
      return [
        {
          id: baseId(),
          name: baseId(),
          type: "text",
          label: "Name",
          isRequired: false,
          placeholder: "Your name (optional)",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "email",
          label: "Email",
          isRequired: false,
          placeholder: "Your email (optional)",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "radio",
          label: "How would you rate your experience?",
          isRequired: true,
          options: [
            createOption("Excellent"),
            createOption("Good"),
            createOption("Average"),
            createOption("Poor"),
            createOption("Very Poor")
          ],
        },
        {
          id: baseId(),
          name: baseId(),
          type: "textarea",
          label: "What did you like most?",
          isRequired: false,
          placeholder: "Tell us what you enjoyed",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "textarea",
          label: "What could we improve?",
          isRequired: true,
          placeholder: "Please share your suggestions",
        }
      ];

    case "survey":
      return [
        {
          id: baseId(),
          name: baseId(),
          type: "text",
          label: "Name",
          isRequired: false,
          placeholder: "Your name",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "select",
          label: industry === "education" ? "What's your role?" : "How did you hear about us?",
          isRequired: true,
          options: industry === "education" 
            ? [
                createOption("Student"),
                createOption("Teacher"),
                createOption("Administrator"),
                createOption("Parent"),
                createOption("Other")
              ]
            : [
                createOption("Social Media"),
                createOption("Google Search"),
                createOption("Friend Referral"),
                createOption("Advertisement"),
                createOption("Other")
              ],
        }
      ];

    case "registration":
      return [
        {
          id: baseId(),
          name: baseId(),
          type: "text",
          label: "Full Name",
          isRequired: true,
          placeholder: "Enter your full name",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "email",
          label: "Email Address",
          isRequired: true,
          placeholder: "your@email.com",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "tel",
          label: "Phone Number",
          isRequired: true,
          placeholder: "Your phone number",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "checkbox",
          label: "I agree to the terms and conditions",
          isRequired: true,
        }
      ];

    case "application":
      return [
        {
          id: baseId(),
          name: baseId(),
          type: "text",
          label: "Full Name",
          isRequired: true,
          placeholder: "Enter your full name",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "email",
          label: "Email Address",
          isRequired: true,
          placeholder: "your@email.com",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "tel",
          label: "Phone Number",
          isRequired: true,
          placeholder: "Your phone number",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "textarea",
          label: "Professional Experience",
          isRequired: true,
          placeholder: "Briefly describe your relevant experience",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "file",
          label: "Resume/CV",
          isRequired: true,
        },
        {
          id: baseId(),
          name: baseId(),
          type: "textarea",
          label: "Cover Letter",
          isRequired: false,
          placeholder: "Why are you interested in this position?",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "checkbox",
          label: "I certify that all information provided is accurate",
          isRequired: true,
        }
      ];

    default:
      return [
        {
          id: baseId(),
          name: baseId(),
          type: "text",
          label: "Name",
          isRequired: true,
          placeholder: "Enter your name",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "email",
          label: "Email",
          isRequired: true,
          placeholder: "Enter your email",
        },
        {
          id: baseId(),
          name: baseId(),
          type: "textarea",
          label: "Message",
          isRequired: false,
          placeholder: "Enter your message",
        }
      ];
  }
};

export function AIFormGenerator({ onFieldsGenerated, onClose }: AIFormGeneratorProps) {
  const [step, setStep] = useState<"prompt" | "preview">("prompt");
  const [prompt, setPrompt] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [formType, setFormType] = useState("");
  const [generatedFields, setGeneratedFields] = useState<FormField[]>([]);
  const { toast } = useToast();

  const handleGenerateFields = () => {
    if (!formType) {
      toast({
        title: "Please select a form type",
        variant: "destructive"
      });
      return;
    }

    const fields = getFormTemplate(formType, industry);
    setGeneratedFields(fields);
    setStep("preview");
  };

  const handleUseFields = () => {
    onFieldsGenerated(generatedFields);
    onClose();
    toast({
      title: "Fields added successfully!",
      description: `${generatedFields.length} fields have been added to your form.`
    });
  };

  if (step === "preview") {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Generated Form Preview
          </CardTitle>
          <CardDescription>
            Review the generated fields and customize as needed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {generatedFields.map((field) => (
              <div key={field.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium">
                    {field.label} {field.isRequired && <span className="text-red-500">*</span>}
                  </label>
                  <Badge variant="outline" className="text-xs">
                    {field.type}
                  </Badge>
                </div>
                
                {(field.type === "text" || field.type === "email" || field.type === "tel") && (
                  <Input placeholder={field.placeholder} disabled />
                )}
                
                {field.type === "number" && (
                  <Input type="number" placeholder={field.placeholder} disabled />
                )}
                
                {field.type === "textarea" && (
                  <Textarea placeholder={field.placeholder} disabled />
                )}
                
                {field.type === "select" && field.options && (
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option.id} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {field.type === "radio" && field.options && (
                  <div className="space-y-2">
                    {field.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <input type="radio" disabled />
                        <label className="text-sm">{option.label}</label>
                      </div>
                    ))}
                  </div>
                )}
                
                {field.type === "checkbox" && (
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" disabled />
                    <label className="text-sm">{field.label}</label>
                  </div>
                )}
                
                {field.type === "file" && (
                  <Input type="file" disabled />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep("prompt")}>
              Back to Edit
            </Button>
            <Button onClick={handleUseFields}>
              <Plus className="h-4 w-4 mr-2" />
              Use These Fields
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          AI Form Generator
        </CardTitle>
        <CardDescription>
          Describe your form and we'll generate the fields for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Industry (Optional)</label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="hospitality">Hospitality</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Form Type</label>
            <Select value={formType} onValueChange={setFormType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a form type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contact">Contact Form</SelectItem>
                <SelectItem value="feedback">Feedback Form</SelectItem>
                <SelectItem value="survey">Survey Form</SelectItem>
                <SelectItem value="registration">Registration Form</SelectItem>
                <SelectItem value="application">Application Form</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleGenerateFields}>
            <Wand2 className="h-4 w-4 mr-2" />
            Generate Fields
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}