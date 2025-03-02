import { supabase } from "./supabase";
import { Form } from "./types";
import { User } from "./auth";

export async function getForms() {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Form[];
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw error;
  }
}

export async function createForm({
  title,
  description,
  templateId,
  user,
}: {
  title: string;
  description: string;
  templateId?: string;
  user: User | null;
}) {
  try {
    if (!user) throw new Error("User not authenticated");
    
    console.log("Creating form with template:", templateId);
    
    // This would eventually get template data from a templates API
    const templateFields = templateId ? getTemplateFields(templateId) : [];

    const { data, error } = await supabase
      .from("forms")
      .insert([
        {
          title,
          description,
          fields: templateFields,
          user_id: user.id, // Add user_id to link form to current user
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating form:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("No data returned from form creation");
    }
    
    console.log("Form created successfully:", data);
    return data as Form;
  } catch (error) {
    console.error("Error creating form:", error);
    throw error;
  }
}

export async function getForm(id: string) {
  try {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Form;
  } catch (error) {
    console.error(`Error fetching form ${id}:`, error);
    throw error;
  }
}

export async function updateForm(id: string, updates: Partial<Form>) {
  try {
    const { data, error } = await supabase
      .from("forms")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Form;
  } catch (error) {
    console.error(`Error updating form ${id}:`, error);
    throw error;
  }
}

// Helper function to get template fields
function getTemplateFields(templateId: string) {
  switch (templateId) {
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
          placeholder: "Enter your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          label: "Message",
          required: true,
          placeholder: "How can we help you?",
        },
      ];
    case "survey":
      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          label: "Name",
          required: false,
          placeholder: "Enter your name",
        },
        {
          id: crypto.randomUUID(),
          type: "radio",
          label: "How would you rate our service?",
          required: true,
          options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          label: "What could we improve?",
          required: false,
          placeholder: "Please let us know your thoughts",
        },
      ];
    case "payment":
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
          placeholder: "Enter your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "select",
          label: "Payment Method",
          required: true,
          options: ["Credit Card", "PayPal", "Bank Transfer"],
        },
        {
          id: crypto.randomUUID(),
          type: "number",
          label: "Amount",
          required: true,
          placeholder: "Enter amount",
        },
      ];
    case "event":
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
          placeholder: "Enter your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "select",
          label: "Number of Attendees",
          required: true,
          options: ["1", "2", "3", "4", "5+"],
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          label: "I agree to the terms and conditions",
          required: true,
        },
      ];
    case "donation":
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
          placeholder: "Enter your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "select",
          label: "Donation Amount",
          required: true,
          options: ["$10", "$25", "$50", "$100", "Other"],
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          label: "Make this a monthly donation",
          required: false,
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          label: "Comments",
          required: false,
          placeholder: "Any additional comments",
        },
      ];
    case "quiz":
      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          label: "Your Name",
          required: true,
          placeholder: "Enter your name",
        },
        {
          id: crypto.randomUUID(),
          type: "email",
          label: "Email Address",
          required: true,
          placeholder: "Enter your email address for results",
        },
        {
          id: crypto.randomUUID(),
          type: "radio",
          label: "Question 1: What is the capital of France?",
          required: true,
          options: ["Paris", "London", "Berlin", "Madrid"],
        },
        {
          id: crypto.randomUUID(),
          type: "radio",
          label: "Question 2: Which planet is closest to the sun?",
          required: true,
          options: ["Mercury", "Venus", "Earth", "Mars"],
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          label: "I want to receive my score by email",
          required: false,
        },
      ];
    case "lead_capture":
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
          placeholder: "Enter your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "text",
          label: "Company",
          required: false,
          placeholder: "Enter your company name",
        },
        {
          id: crypto.randomUUID(),
          type: "phone",
          label: "Phone Number",
          required: false,
          placeholder: "Enter your phone number",
        },
        {
          id: crypto.randomUUID(),
          type: "select",
          label: "How did you hear about us?",
          required: false,
          options: ["Google", "Social Media", "Friend/Colleague", "Event", "Other"],
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          label: "I'd like to receive updates about your products and services",
          required: false,
        },
      ];
    case "newsletter":
      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          label: "Name",
          required: false,
          placeholder: "Enter your name",
        },
        {
          id: crypto.randomUUID(),
          type: "email",
          label: "Email Address",
          required: true,
          placeholder: "Enter your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          label: "Weekly newsletter",
          required: false,
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          label: "Monthly product updates",
          required: false,
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          label: "Special offers and promotions",
          required: false,
        },
      ];
    case "feedback":
      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          label: "Name",
          required: false,
          placeholder: "Enter your name",
        },
        {
          id: crypto.randomUUID(),
          type: "email",
          label: "Email Address",
          required: false,
          placeholder: "Enter your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "radio",
          label: "Overall, how satisfied are you with our product/service?",
          required: true,
          options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          label: "What do you like most about our product/service?",
          required: false,
          placeholder: "Please share your thoughts",
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          label: "How could we improve our product/service?",
          required: false,
          placeholder: "Please share your suggestions",
        },
        {
          id: crypto.randomUUID(),
          type: "radio",
          label: "How likely are you to recommend us to a friend or colleague?",
          required: false,
          options: ["Extremely likely", "Very likely", "Somewhat likely", "Not so likely", "Not at all likely"],
        },
      ];
    case "job_application":
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
          placeholder: "Enter your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "text",
          label: "Phone Number",
          required: true,
          placeholder: "Enter your phone number",
        },
        {
          id: crypto.randomUUID(),
          type: "select",
          label: "Position Applied For",
          required: true,
          options: ["Software Developer", "UI/UX Designer", "Product Manager", "Marketing Specialist", "Other"],
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          label: "Cover Letter",
          required: false,
          placeholder: "Tell us why you're interested in this position",
        },
        {
          id: crypto.randomUUID(),
          type: "file",
          label: "Resume/CV",
          required: true,
          placeholder: "Upload your resume (PDF, DOC, DOCX)",
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          label: "I certify that all information provided is true and complete",
          required: true,
        },
      ];
    default:
      return [];
  }
}
