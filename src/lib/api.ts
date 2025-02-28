
import { supabase } from "./supabase";
import { Form } from "./types";

export async function getForms() {
  try {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
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
}: {
  title: string;
  description: string;
  templateId?: string;
}) {
  try {
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
    default:
      return [];
  }
}
