
import { FormFieldDefinition } from "@/types/forms";

const createFieldOption = (label: string) => ({
  id: crypto.randomUUID(),
  label,
  value: label.toLowerCase().replace(/\s+/g, '_')
});

export const generateFormFieldsBasedOnType = (formType: string, industry: string): FormFieldDefinition[] => {
  // This would ideally be replaced with an actual AI API call
  // For now, we'll use predefined templates based on the form type
  
  switch (formType) {
    case "contact":
      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          name: "full_name",
          label: "Full Name",
          isRequired: true,
          placeholder: "Enter your full name",
        },
        {
          id: crypto.randomUUID(),
          type: "email",
          name: "email",
          label: "Email Address",
          isRequired: true,
          placeholder: "your@email.com",
        },
        {
          id: crypto.randomUUID(),
          type: industry === "healthcare" ? "tel" : "text",
          name: "phone",
          label: "Phone Number",
          isRequired: industry === "healthcare",
          placeholder: "Your phone number",
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          name: "message",
          label: "Message",
          isRequired: true,
          placeholder: "How can we help you?",
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          name: "agree_contact",
          label: "I agree to be contacted about my inquiry",
          isRequired: true,
        }
      ];
    
    case "feedback":
      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          name: "name",
          label: "Name",
          isRequired: false,
          placeholder: "Your name (optional)",
        },
        {
          id: crypto.randomUUID(),
          type: "email",
          name: "email",
          label: "Email",
          isRequired: false,
          placeholder: "Your email (optional)",
        },
        {
          id: crypto.randomUUID(),
          type: "radio",
          name: "experience_rating",
          label: "How would you rate your experience?",
          isRequired: true,
          options: ["Excellent", "Good", "Average", "Poor", "Very Poor"].map(createFieldOption),
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          name: "liked_most",
          label: "What did you like most?",
          isRequired: false,
          placeholder: "Tell us what you enjoyed",
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          name: "improvements",
          label: "What could we improve?",
          isRequired: true,
          placeholder: "Please share your suggestions",
        }
      ];
    
    case "survey":
      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          name: "name",
          label: "Name",
          isRequired: false,
          placeholder: "Your name",
        },
        {
          id: crypto.randomUUID(),
          type: "email",
          name: "email",
          label: "Email",
          isRequired: industry !== "general",
          placeholder: "Your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "radio",
          name: "role_or_source",
          label: industry === "education" ? "What's your role?" : "How did you hear about us?",
          isRequired: true,
          options: (industry === "education" 
            ? ["Student", "Teacher", "Parent", "Administrator", "Other"]
            : ["Social Media", "Search Engine", "Word of Mouth", "Advertisement", "Other"]
          ).map(createFieldOption),
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          name: "applies_to_you",
          label: "Which of the following apply to you?",
          isRequired: false,
          options: (industry === "technology" 
            ? ["I use technology daily", "I work in tech", "I'm interested in new products", "I follow tech news"]
            : ["I'm a regular customer", "I'm a new customer", "I'm researching options", "I'm making a purchase soon"]
          ).map(createFieldOption),
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          name: "additional_comments",
          label: "Any additional comments?",
          isRequired: false,
          placeholder: "Share your thoughts",
        }
      ];
    
    case "registration":
      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          name: "full_name",
          label: "Full Name",
          isRequired: true,
          placeholder: "Enter your full name",
        },
        {
          id: crypto.randomUUID(),
          type: "email",
          name: "email",
          label: "Email Address",
          isRequired: true,
          placeholder: "your@email.com",
        },
        {
          id: crypto.randomUUID(),
          type: "tel",
          name: "phone",
          label: "Phone Number",
          isRequired: true,
          placeholder: "Your phone number",
        },
        {
          id: crypto.randomUUID(),
          type: "select",
          name: "selection",
          label: industry === "education" ? "Course Selection" : "Event Selection",
          isRequired: true,
          options: (industry === "education" 
            ? ["Introduction to Programming", "Advanced Mathematics", "Data Science Basics", "Web Development"]
            : ["Morning Session", "Afternoon Session", "Full Day", "VIP Experience"]
          ).map(createFieldOption),
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          name: "agree_terms",
          label: "I agree to the terms and conditions",
          isRequired: true,
        }
      ];
    
    case "application":
      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          name: "full_name",
          label: "Full Name",
          isRequired: true,
          placeholder: "Enter your full name",
        },
        {
          id: crypto.randomUUID(),
          type: "email",
          name: "email",
          label: "Email Address",
          isRequired: true,
          placeholder: "your@email.com",
        },
        {
          id: crypto.randomUUID(),
          type: "tel",
          name: "phone",
          label: "Phone Number",
          isRequired: true,
          placeholder: "Your phone number",
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          name: "experience",
          label: "Professional Experience",
          isRequired: true,
          placeholder: "Briefly describe your relevant experience",
        },
        {
          id: crypto.randomUUID(),
          type: "file",
          name: "resume",
          label: "Resume/CV",
          isRequired: true,
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          name: "cover_letter",
          label: "Cover Letter",
          isRequired: false,
          placeholder: "Why are you interested in this position?",
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          name: "certify_accurate",
          label: "I certify that all information provided is accurate",
          isRequired: true,
        }
      ];
    
    case "order":
      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          name: "full_name",
          label: "Full Name",
          isRequired: true,
          placeholder: "Enter your full name",
        },
        {
          id: crypto.randomUUID(),
          type: "email",
          name: "email",
          label: "Email Address",
          isRequired: true,
          placeholder: "your@email.com",
        },
        {
          id: crypto.randomUUID(),
          type: "text",
          name: "shipping_address",
          label: "Shipping Address",
          isRequired: true,
          placeholder: "Enter your shipping address",
        },
        {
          id: crypto.randomUUID(),
          type: industry === "hospitality" ? "date" : "select",
          name: industry === "hospitality" ? "delivery_date" : "product_selection",
          label: industry === "hospitality" ? "Preferred Delivery Date" : "Product Selection",
          isRequired: true,
          options: industry !== "hospitality" ? ["Basic Package", "Standard Package", "Premium Package", "Custom Order"].map(createFieldOption) : undefined,
        },
        {
          id: crypto.randomUUID(),
          type: "number",
          name: "quantity",
          label: "Quantity",
          isRequired: true,
          placeholder: "1",
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          name: "special_instructions",
          label: "Special Instructions",
          isRequired: false,
          placeholder: "Any special requirements for your order",
        }
      ];
    
    default: // For custom forms, provide a basic starting template
      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          name: "name",
          label: "Name",
          isRequired: true,
          placeholder: "Enter your name",
        },
        {
          id: crypto.randomUUID(),
          type: "email",
          name: "email",
          label: "Email",
          isRequired: true,
          placeholder: "Enter your email",
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          name: "message",
          label: "Message",
          isRequired: false,
          placeholder: "Enter your message",
        }
      ];
  }
};
