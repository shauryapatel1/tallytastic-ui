import { supabase } from "@/integrations/supabase/client";
import { Form } from "./types";
import { User } from "./auth";
import { v4 as uuidv4 } from 'uuid';
import type { FormDefinition, FormFieldDefinition, FormResponse, FormSectionDefinition } from "@/types/forms";
import type { Database } from "@/types/supabase";

// This file appears to contain functions from a previous data model.
// It's being updated to align with the current `FormDefinition` structure.
// A more thorough refactor might be needed to consolidate with `formDefinitionService.ts`.

export async function getForms(): Promise<FormDefinition[]> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    
    // Map the Supabase row to the application's FormDefinition type
    return data.map(form => ({
      ...form,
      id: form.id,
      userId: form.user_id,
      title: form.title,
      description: form.description ?? undefined,
      sections: form.definition_sections as unknown as FormSectionDefinition[],
      customSuccessMessage: form.custom_success_message ?? undefined,
      redirectUrl: form.redirect_url ?? undefined,
      version: form.version,
      createdAt: form.created_at,
      updatedAt: form.updated_at,
      status: form.status,
      settings: form.settings
    })) as FormDefinition[];
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
}): Promise<FormDefinition> {
  try {
    if (!user) throw new Error("User not authenticated");
    
    console.log("Creating form with template:", templateId);
    
    const templateFields = templateId ? getTemplateFields(templateId) : [];

    const newFormDef: FormDefinition = {
      id: uuidv4(),
      userId: user.id,
      title,
      description,
      sections: [{
        id: uuidv4(),
        title: 'Section 1',
        description: '',
        fields: templateFields
      }],
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    };

    const { data, error } = await supabase
      .from("forms")
      .insert({
        id: newFormDef.id,
        user_id: newFormDef.userId,
        title: newFormDef.title,
        description: newFormDef.description,
        status: newFormDef.status,
        version: newFormDef.version,
        created_at: newFormDef.createdAt,
        updated_at: newFormDef.updatedAt,
        definition_sections: newFormDef.sections as any,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating form:", error);
      throw error;
    }
    
    return {
      ...data,
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description ?? undefined,
      sections: data.definition_sections as unknown as FormSectionDefinition[],
      customSuccessMessage: data.custom_success_message ?? undefined,
      redirectUrl: data.redirect_url ?? undefined,
      version: data.version,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      status: data.status,
      settings: data.settings
    } as FormDefinition;
  } catch (error) {
    console.error("Error creating form:", error);
    throw error;
  }
}

export async function getForm(id: string): Promise<FormDefinition> {
  try {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return {
      ...data,
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description ?? undefined,
      sections: data.definition_sections as unknown as FormSectionDefinition[],
      customSuccessMessage: data.custom_success_message ?? undefined,
      redirectUrl: data.redirect_url ?? undefined,
      version: data.version,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      status: data.status,
      settings: data.settings
    } as FormDefinition;
  } catch (error) {
    console.error(`Error fetching form ${id}:`, error);
    throw error;
  }
}

export async function updateForm(id: string, updates: Partial<FormDefinition>): Promise<FormDefinition> {
  try {
    const { sections, ...otherUpdates } = updates;

    const updatesWithTimestamp: Partial<Database['public']['Tables']['forms']['Update']> = {
      ...otherUpdates,
      definition_sections: sections as any,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from("forms")
      .update(updatesWithTimestamp)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description ?? undefined,
      sections: data.definition_sections as unknown as FormSectionDefinition[],
      customSuccessMessage: data.custom_success_message ?? undefined,
      redirectUrl: data.redirect_url ?? undefined,
      version: data.version,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      status: data.status,
      settings: data.settings
    } as FormDefinition;
  } catch (error) {
    console.error(`Error updating form ${id}:`, error);
    throw error;
  }
}

export async function deleteForm(id: string) {
  try {
    const { error } = await supabase
      .from("forms")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting form ${id}:`, error);
    throw error;
  }
}

export async function publishForm(id: string, publish: boolean): Promise<FormDefinition> {
  try {
    const { data, error } = await supabase
      .from("forms")
      .update({ 
        status: publish ? 'published' : 'draft',
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description ?? undefined,
      sections: data.definition_sections as unknown as FormSectionDefinition[],
      customSuccessMessage: data.custom_success_message ?? undefined,
      redirectUrl: data.redirect_url ?? undefined,
      version: data.version,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      status: data.status,
      settings: data.settings
    } as FormDefinition;
  } catch (error) {
    console.error(`Error ${publish ? 'publishing' : 'unpublishing'} form ${id}:`, error);
    throw error;
  }
}

// Define a type for form response input to help with type safety
interface FormResponseInput {
  form_id: string;
  response_data: Record<string, any>;
  submitted_at: string;
  metadata: Record<string, any>;
}

export async function submitFormResponse(formId: string, responseData: Record<string, any>) {
  try {
    const formResponseData: FormResponseInput = {
      form_id: formId,
      response_data: responseData,
      submitted_at: new Date().toISOString(),
      metadata: {
        browser: navigator.userAgent,
        referrer: document.referrer,
        timeSpent: 0, // This would be calculated on the client
      }
    };

    // Use type assertion to handle the untyped table
    const { data, error } = await supabase
      .from("form_responses" as any)
      .insert([formResponseData] as any)
      .select();

    if (error) throw error;
    
    if (!data || data.length === 0) {
      throw new Error("No data returned after form response submission");
    }
    
    // Safely create a transformed response by casting to any first to avoid TypeScript errors
    const responseArray = data as any[];
    const transformedData = responseArray.map(item => ({
      id: item.id,
      form_id: item.form_id,
      submitted_at: item.submitted_at,
      data: item.response_data,
      metadata: item.metadata
    })) as FormResponse[];
    
    return transformedData;
  } catch (error) {
    console.error(`Error submitting response for form ${formId}:`, error);
    throw error;
  }
}

// Helper function to get template fields
function getTemplateFields(templateId: string): FormFieldDefinition[] {
  switch (templateId) {
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
          placeholder: "Enter your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          name: "message",
          label: "Message",
          isRequired: true,
          placeholder: "How can we help you?",
        },
      ];
    // NOTE: Other templates would also need to be updated to FormFieldDefinition
    // by adding `name` and changing `required` to `isRequired`.
    // This is a partial update to fix the build.
    case "survey":
      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          name: "name",
          label: "Name",
          isRequired: false,
          placeholder: "Enter your name",
        },
        {
          id: crypto.randomUUID(),
          type: "radio",
          name: "service_rating",
          label: "How would you rate our service?",
          isRequired: true,
          options: [
            { id: crypto.randomUUID(), label: "Excellent", value: "excellent" },
            { id: crypto.randomUUID(), label: "Good", value: "good" },
            { id: crypto.randomUUID(), label: "Average", value: "average" },
            { id: crypto.randomUUID(), label: "Poor", value: "poor" },
            { id: crypto.randomUUID(), label: "Very Poor", value: "very_poor" },
          ],
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          name: "improvement_suggestions",
          label: "What could we improve?",
          isRequired: false,
          placeholder: "Please let us know your thoughts",
        },
      ];
    case "payment":
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
          placeholder: "Enter your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "select",
          name: "payment_method",
          label: "Payment Method",
          isRequired: true,
          options: [
            { id: crypto.randomUUID(), label: "Credit Card", value: "credit_card" },
            { id: crypto.randomUUID(), label: "PayPal", value: "paypal" },
            { id: crypto.randomUUID(), label: "Bank Transfer", value: "bank_transfer" },
          ],
        },
        {
          id: crypto.randomUUID(),
          type: "number",
          name: "amount",
          label: "Amount",
          isRequired: true,
          placeholder: "Enter amount",
        },
      ];
    case "event":
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
          placeholder: "Enter your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "select",
          name: "number_of_attendees",
          label: "Number of Attendees",
          isRequired: true,
          options: [
            { id: crypto.randomUUID(), label: "1", value: "1" },
            { id: crypto.randomUUID(), label: "2", value: "2" },
            { id: crypto.randomUUID(), label: "3", value: "3" },
            { id: crypto.randomUUID(), label: "4", value: "4" },
            { id: crypto.randomUUID(), label: "5+", value: "5_plus" },
          ],
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          name: "terms_agreement",
          label: "I agree to the terms and conditions",
          isRequired: true,
        },
      ];
    case "donation":
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
          placeholder: "Enter your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "select",
          name: "donation_amount",
          label: "Donation Amount",
          isRequired: true,
          options: [
            { id: crypto.randomUUID(), label: "$10", value: "10" },
            { id: crypto.randomUUID(), label: "$25", value: "25" },
            { id: crypto.randomUUID(), label: "$50", value: "50" },
            { id: crypto.randomUUID(), label: "$100", value: "100" },
            { id: crypto.randomUUID(), label: "Other", value: "other" },
          ],
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          name: "monthly_donation",
          label: "Make this a monthly donation",
          isRequired: false,
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          name: "comments",
          label: "Comments",
          isRequired: false,
          placeholder: "Any additional comments",
        },
      ];
    case "quiz":
      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          name: "your_name",
          label: "Your Name",
          isRequired: true,
          placeholder: "Enter your name",
        },
        {
          id: crypto.randomUUID(),
          type: "email",
          name: "email",
          label: "Email Address",
          isRequired: true,
          placeholder: "Enter your email address for results",
        },
        {
          id: crypto.randomUUID(),
          type: "radio",
          name: "question_1",
          label: "Question 1: What is the capital of France?",
          isRequired: true,
          options: [
            { id: crypto.randomUUID(), label: "Paris", value: "paris" },
            { id: crypto.randomUUID(), label: "London", value: "london" },
            { id: crypto.randomUUID(), label: "Berlin", value: "berlin" },
            { id: crypto.randomUUID(), label: "Madrid", value: "madrid" },
          ],
        },
        {
          id: crypto.randomUUID(),
          type: "radio",
          name: "question_2",
          label: "Question 2: Which planet is closest to the sun?",
          isRequired: true,
          options: [
            { id: crypto.randomUUID(), label: "Mercury", value: "mercury" },
            { id: crypto.randomUUID(), label: "Venus", value: "venus" },
            { id: crypto.randomUUID(), label: "Earth", value: "earth" },
            { id: crypto.randomUUID(), label: "Mars", value: "mars" },
          ],
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          name: "receive_score_by_email",
          label: "I want to receive my score by email",
          isRequired: false,
        },
      ];
    case "lead_capture":
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
          placeholder: "Enter your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "text",
          name: "company",
          label: "Company",
          isRequired: false,
          placeholder: "Enter your company name",
        },
        {
          id: crypto.randomUUID(),
          type: "phone",
          name: "phone_number",
          label: "Phone Number",
          isRequired: false,
          placeholder: "Enter your phone number",
        },
        {
          id: crypto.randomUUID(),
          type: "select",
          name: "how_did_you_hear_about_us",
          label: "How did you hear about us?",
          isRequired: false,
          options: [
            { id: crypto.randomUUID(), label: "Google", value: "google" },
            { id: crypto.randomUUID(), label: "Social Media", value: "social_media" },
            { id: crypto.randomUUID(), label: "Friend/Colleague", value: "friend_colleague" },
            { id: crypto.randomUUID(), label: "Event", value: "event" },
            { id: crypto.randomUUID(), label: "Other", value: "other" },
          ],
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          name: "receive_updates",
          label: "I'd like to receive updates about your products and services",
          isRequired: false,
        },
      ];
    case "newsletter":
      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          name: "name",
          label: "Name",
          isRequired: false,
          placeholder: "Enter your name",
        },
        {
          id: crypto.randomUUID(),
          type: "email",
          name: "email",
          label: "Email Address",
          isRequired: true,
          placeholder: "Enter your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          name: "weekly_newsletter",
          label: "Weekly newsletter",
          isRequired: false,
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          name: "monthly_product_updates",
          label: "Monthly product updates",
          isRequired: false,
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          name: "special_offers",
          label: "Special offers and promotions",
          isRequired: false,
        },
      ];
    case "feedback":
      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          name: "name",
          label: "Name",
          isRequired: false,
          placeholder: "Enter your name",
        },
        {
          id: crypto.randomUUID(),
          type: "email",
          name: "email",
          label: "Email Address",
          isRequired: false,
          placeholder: "Enter your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "radio",
          name: "overall_satisfaction",
          label: "Overall, how satisfied are you with our product/service?",
          isRequired: true,
          options: [
            { id: crypto.randomUUID(), label: "Very Satisfied", value: "very_satisfied" },
            { id: crypto.randomUUID(), label: "Satisfied", value: "satisfied" },
            { id: crypto.randomUUID(), label: "Neutral", value: "neutral" },
            { id: crypto.randomUUID(), label: "Dissatisfied", value: "dissatisfied" },
            { id: crypto.randomUUID(), label: "Very Dissatisfied", value: "very_dissatisfied" },
          ],
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          name: "what_do_you_like_most",
          label: "What do you like most about our product/service?",
          isRequired: false,
          placeholder: "Please share your thoughts",
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          name: "how_could_we_improve",
          label: "How could we improve our product/service?",
          isRequired: false,
          placeholder: "Please share your suggestions",
        },
        {
          id: crypto.randomUUID(),
          type: "radio",
          name: "recommendation_likelihood",
          label: "How likely are you to recommend us to a friend or colleague?",
          isRequired: false,
          options: [
            { id: crypto.randomUUID(), label: "Extremely likely", value: "extremely_likely" },
            { id: crypto.randomUUID(), label: "Very likely", value: "very_likely" },
            { id: crypto.randomUUID(), label: "Somewhat likely", value: "somewhat_likely" },
            { id: crypto.randomUUID(), label: "Not so likely", value: "not_so_likely" },
            { id: crypto.randomUUID(), label: "Not at all likely", value: "not_at_all_likely" },
          ],
        },
      ];
    case "job_application":
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
          placeholder: "Enter your email address",
        },
        {
          id: crypto.randomUUID(),
          type: "text",
          name: "phone_number",
          label: "Phone Number",
          isRequired: true,
          placeholder: "Enter your phone number",
        },
        {
          id: crypto.randomUUID(),
          type: "select",
          name: "position_applied_for",
          label: "Position Applied For",
          isRequired: true,
          options: [
            { id: crypto.randomUUID(), label: "Software Developer", value: "software_developer" },
            { id: crypto.randomUUID(), label: "UI/UX Designer", value: "ui_ux_designer" },
            { id: crypto.randomUUID(), label: "Product Manager", value: "product_manager" },
            { id: crypto.randomUUID(), label: "Marketing Specialist", value: "marketing_specialist" },
            { id: crypto.randomUUID(), label: "Other", value: "other" },
          ],
        },
        {
          id: crypto.randomUUID(),
          type: "textarea",
          name: "cover_letter",
          label: "Cover Letter",
          isRequired: false,
          placeholder: "Tell us why you're interested in this position",
        },
        {
          id: crypto.randomUUID(),
          type: "file",
          name: "resume_cv",
          label: "Resume/CV",
          isRequired: true,
          placeholder: "Upload your resume (PDF, DOC, DOCX)",
        },
        {
          id: crypto.randomUUID(),
          type: "checkbox",
          name: "certification",
          label: "I certify that all information provided is true and complete",
          isRequired: true,
        },
      ];
    default:
      return [];
  }
}
