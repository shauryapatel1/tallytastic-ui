
import { FormField } from "@/lib/types";

export const generateFormFieldsBasedOnType = (formType: string, industry: string): FormField[] => {
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
