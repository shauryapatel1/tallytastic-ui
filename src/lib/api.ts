
import { supabase } from "./supabase";
import { Form } from "./types";

export async function getForms() {
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Form[];
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

  if (error) throw error;
  return data as Form;
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
    default:
      return [];
  }
}
