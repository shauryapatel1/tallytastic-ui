
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, Wand2, Sparkles, FileText, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { FormField, AIFormPrompt } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function AIFormGenerator({ onFormGenerated }: { onFormGenerated: (formData: any) => void }) {
  const [prompt, setPrompt] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<"prompt" | "options" | "preview">("prompt");
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [aiPrompt, setAiPrompt] = useState<AIFormPrompt>({
    industry: "general",
    purpose: "collect_info",
    formType: "contact"
  });
  const { toast } = useToast();
  const { user } = useAuth();

  // Industry options for the form
  const industries = [
    { value: "general", label: "General" },
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "finance", label: "Finance" },
    { value: "technology", label: "Technology" },
    { value: "hospitality", label: "Hospitality" }
  ];

  // Form purpose options
  const purposes = [
    { value: "collect_info", label: "Collect Information" },
    { value: "feedback", label: "Get Feedback" },
    { value: "survey", label: "Survey" },
    { value: "registration", label: "Registration" },
    { value: "application", label: "Application" },
    { value: "order", label: "Order Form" }
  ];

  // Form type templates
  const formTypes = [
    { value: "contact", label: "Contact Form" },
    { value: "feedback", label: "Feedback Form" },
    { value: "survey", label: "Survey" },
    { value: "registration", label: "Event Registration" },
    { value: "application", label: "Job Application" },
    { value: "order", label: "Order Form" },
    { value: "custom", label: "Custom Form" }
  ];

  const handleNextStep = () => {
    if (generationStep === "prompt") {
      if (!formTitle.trim()) {
        toast({
          title: "Form title required",
          description: "Please enter a title for your form",
          variant: "destructive",
        });
        return;
      }
      setGenerationStep("options");
    } else if (generationStep === "options") {
      handleGenerate();
    }
  };

  const handlePreviousStep = () => {
    if (generationStep === "options") {
      setGenerationStep("prompt");
    } else if (generationStep === "preview") {
      setGenerationStep("options");
    }
  };

  const handleGenerate = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to create forms",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Combine all the inputs into a more structured prompt for the AI
      const fullPrompt = `
        Create a ${aiPrompt.formType} form for the ${aiPrompt.industry} industry. 
        Purpose: ${aiPrompt.purpose}.
        Additional details: ${prompt}
      `;
      
      console.log("Generating form with AI prompt:", fullPrompt);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate form fields based on the form type and industry
      const generatedFields = generateFormFieldsBasedOnType(aiPrompt.formType, aiPrompt.industry);
      setFormFields(generatedFields);
      
      setGenerationStep("preview");
      
      toast({
        title: "Form template generated",
        description: "Your AI-generated form template is ready for review.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Generation failed",
        description: "Failed to generate the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveForm = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to create forms",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Prepare the form data for saving
      const formData = {
        title: formTitle,
        description: prompt,
        fields: formFields,
        user_id: user.id,
      };
      
      // Save the form to the database
      const { data, error } = await supabase
        .from('forms')
        .insert([formData])
        .select()
        .single();
        
      if (error) {
        console.error("Error creating form:", error);
        throw error;
      }
      
      onFormGenerated(data);
      
      toast({
        title: "Form created!",
        description: "Your AI-generated form has been saved.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Save failed",
        description: "Failed to save the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFormFieldsBasedOnType = (formType: string, industry: string): FormField[] => {
    // This would ideally be replaced with an actual AI API call
    // For now, we'll use predefined templates based on the form type
    
    switch (formType) {
      case "contact":
        return [
          {
            id: crypto.randomUUID(),
            type: "text",
            label: "Full Name",
            required: true,
            placeholder: "Enter your full name",
          },
          {
            id: crypto.randomUUID(),
            type: "email",
            label: "Email Address",
            required: true,
            placeholder: "your@email.com",
          },
          {
            id: crypto.randomUUID(),
            type: industry === "healthcare" ? "phone" : "text",
            label: "Phone Number",
            required: industry === "healthcare",
            placeholder: "Your phone number",
          },
          {
            id: crypto.randomUUID(),
            type: "textarea",
            label: "Message",
            required: true,
            placeholder: "How can we help you?",
          },
          {
            id: crypto.randomUUID(),
            type: "checkbox",
            label: "I agree to be contacted about my inquiry",
            required: true,
          }
        ];
      
      case "feedback":
        return [
          {
            id: crypto.randomUUID(),
            type: "text",
            label: "Name",
            required: false,
            placeholder: "Your name (optional)",
          },
          {
            id: crypto.randomUUID(),
            type: "email",
            label: "Email",
            required: false,
            placeholder: "Your email (optional)",
          },
          {
            id: crypto.randomUUID(),
            type: "radio",
            label: "How would you rate your experience?",
            required: true,
            options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
          },
          {
            id: crypto.randomUUID(),
            type: "textarea",
            label: "What did you like most?",
            required: false,
            placeholder: "Tell us what you enjoyed",
          },
          {
            id: crypto.randomUUID(),
            type: "textarea",
            label: "What could we improve?",
            required: true,
            placeholder: "Please share your suggestions",
          }
        ];
      
      case "survey":
        return [
          {
            id: crypto.randomUUID(),
            type: "text",
            label: "Name",
            required: false,
            placeholder: "Your name",
          },
          {
            id: crypto.randomUUID(),
            type: "email",
            label: "Email",
            required: industry !== "general",
            placeholder: "Your email address",
          },
          {
            id: crypto.randomUUID(),
            type: "radio",
            label: industry === "education" ? "What's your role?" : "How did you hear about us?",
            required: true,
            options: industry === "education" 
              ? ["Student", "Teacher", "Parent", "Administrator", "Other"]
              : ["Social Media", "Search Engine", "Word of Mouth", "Advertisement", "Other"],
          },
          {
            id: crypto.randomUUID(),
            type: "checkbox",
            label: "Which of the following apply to you?",
            required: false,
            options: industry === "technology" 
              ? ["I use technology daily", "I work in tech", "I'm interested in new products", "I follow tech news"]
              : ["I'm a regular customer", "I'm a new customer", "I'm researching options", "I'm making a purchase soon"],
          },
          {
            id: crypto.randomUUID(),
            type: "textarea",
            label: "Any additional comments?",
            required: false,
            placeholder: "Share your thoughts",
          }
        ];
      
      case "registration":
        return [
          {
            id: crypto.randomUUID(),
            type: "text",
            label: "Full Name",
            required: true,
            placeholder: "Enter your full name",
          },
          {
            id: crypto.randomUUID(),
            type: "email",
            label: "Email Address",
            required: true,
            placeholder: "your@email.com",
          },
          {
            id: crypto.randomUUID(),
            type: "phone",
            label: "Phone Number",
            required: true,
            placeholder: "Your phone number",
          },
          {
            id: crypto.randomUUID(),
            type: "select",
            label: industry === "education" ? "Course Selection" : "Event Selection",
            required: true,
            options: industry === "education" 
              ? ["Introduction to Programming", "Advanced Mathematics", "Data Science Basics", "Web Development"]
              : ["Morning Session", "Afternoon Session", "Full Day", "VIP Experience"],
          },
          {
            id: crypto.randomUUID(),
            type: "checkbox",
            label: "I agree to the terms and conditions",
            required: true,
          }
        ];
      
      case "application":
        return [
          {
            id: crypto.randomUUID(),
            type: "text",
            label: "Full Name",
            required: true,
            placeholder: "Enter your full name",
          },
          {
            id: crypto.randomUUID(),
            type: "email",
            label: "Email Address",
            required: true,
            placeholder: "your@email.com",
          },
          {
            id: crypto.randomUUID(),
            type: "phone",
            label: "Phone Number",
            required: true,
            placeholder: "Your phone number",
          },
          {
            id: crypto.randomUUID(),
            type: "textarea",
            label: "Professional Experience",
            required: true,
            placeholder: "Briefly describe your relevant experience",
          },
          {
            id: crypto.randomUUID(),
            type: "file",
            label: "Resume/CV",
            required: true,
          },
          {
            id: crypto.randomUUID(),
            type: "textarea",
            label: "Cover Letter",
            required: false,
            placeholder: "Why are you interested in this position?",
          },
          {
            id: crypto.randomUUID(),
            type: "checkbox",
            label: "I certify that all information provided is accurate",
            required: true,
          }
        ];
      
      case "order":
        return [
          {
            id: crypto.randomUUID(),
            type: "text",
            label: "Full Name",
            required: true,
            placeholder: "Enter your full name",
          },
          {
            id: crypto.randomUUID(),
            type: "email",
            label: "Email Address",
            required: true,
            placeholder: "your@email.com",
          },
          {
            id: crypto.randomUUID(),
            type: "text",
            label: "Shipping Address",
            required: true,
            placeholder: "Enter your shipping address",
          },
          {
            id: crypto.randomUUID(),
            type: industry === "hospitality" ? "date" : "select",
            label: industry === "hospitality" ? "Preferred Delivery Date" : "Product Selection",
            required: true,
            options: industry !== "hospitality" ? ["Basic Package", "Standard Package", "Premium Package", "Custom Order"] : undefined,
          },
          {
            id: crypto.randomUUID(),
            type: "number",
            label: "Quantity",
            required: true,
            placeholder: "1",
          },
          {
            id: crypto.randomUUID(),
            type: "textarea",
            label: "Special Instructions",
            required: false,
            placeholder: "Any special requirements for your order",
          }
        ];
      
      default: // For custom forms, provide a basic starting template
        return [
          {
            id: crypto.randomUUID(),
            type: "text",
            label: "Name",
            required: true,
            placeholder: "Enter your name",
          },
          {
            id: crypto.randomUUID(),
            type: "email",
            label: "Email",
            required: true,
            placeholder: "Enter your email",
          },
          {
            id: crypto.randomUUID(),
            type: "textarea",
            label: "Message",
            required: false,
            placeholder: "Enter your message",
          }
        ];
    }
  };

  const renderFormPreview = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{formTitle}</h2>
          {prompt && <p className="text-sm text-gray-600">{prompt}</p>}
        </div>
        
        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
          {formFields.map((field) => (
            <div key={field.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <Badge variant="outline" className="text-xs">
                  {field.type}
                </Badge>
              </div>
              
              {field.type === "text" || field.type === "email" || field.type === "phone" && (
                <Input placeholder={field.placeholder} disabled />
              )}
              
              {field.type === "number" && (
                <Input type="number" placeholder={field.placeholder} disabled />
              )}
              
              {field.type === "textarea" && (
                <Textarea placeholder={field.placeholder} disabled />
              )}
              
              {field.type === "checkbox" && !field.options && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" disabled />
                  <span className="text-sm text-gray-600">{field.label}</span>
                </div>
              )}
              
              {field.type === "select" && field.options && (
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option, i) => (
                      <SelectItem key={i} value={option.toLowerCase().replace(/\s+/g, '-')}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {field.type === "radio" && field.options && (
                <div className="space-y-1">
                  {field.options.map((option, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="radio" name={field.id} disabled />
                      <span className="text-sm text-gray-600">{option}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {field.type === "date" && (
                <Input type="date" disabled />
              )}
              
              {field.type === "file" && (
                <Input type="file" disabled />
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePreviousStep}>
            Back to Options
          </Button>
          <Button onClick={handleSaveForm} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Form
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  if (generationStep === "preview") {
    return renderFormPreview();
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      {generationStep === "prompt" && (
        <>
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-indigo-500" />
              Generate Form with AI
            </h3>
            <p className="text-sm text-muted-foreground">
              Describe your form and we'll create it for you using AI.
            </p>
          </div>
          
          <div className="space-y-3">
            <div>
              <Input
                placeholder="Form Title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>
            <div>
              <Textarea
                placeholder="Describe the form you want to create (e.g., 'A contact form for a restaurant with name, email, phone number, and preferred reservation date')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleNextStep} 
            disabled={!formTitle.trim()}
            className="w-full"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Next: Configure Options
          </Button>
        </>
      )}

      {generationStep === "options" && (
        <>
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              Configure AI Form Options
            </h3>
            <p className="text-sm text-muted-foreground">
              Customize the AI generation settings for "{formTitle}"
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry</label>
              <Select
                value={aiPrompt.industry}
                onValueChange={(value) => setAiPrompt({...aiPrompt, industry: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Form Purpose</label>
              <Select
                value={aiPrompt.purpose}
                onValueChange={(value) => setAiPrompt({...aiPrompt, purpose: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Purpose" />
                </SelectTrigger>
                <SelectContent>
                  {purposes.map((purpose) => (
                    <SelectItem key={purpose.value} value={purpose.value}>
                      {purpose.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Form Type</label>
              <Select
                value={aiPrompt.formType}
                onValueChange={(value) => setAiPrompt({...aiPrompt, formType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Form Type" />
                </SelectTrigger>
                <SelectContent>
                  {formTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="advanced-settings">
                <AccordionTrigger className="text-sm font-medium">Advanced Settings</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500">Form Complexity</label>
                      <div className="flex items-center">
                        <span className="text-xs mr-2">Simple</span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          defaultValue="3"
                          className="w-full"
                        />
                        <span className="text-xs ml-2">Complex</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={handlePreviousStep}>
              Back
            </Button>
            <Button 
              onClick={handleNextStep} 
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Form
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
