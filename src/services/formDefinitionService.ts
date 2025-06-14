
import { supabase } from "@/integrations/supabase/client";
import type { FormDefinition } from "@/types/forms";

// Save a new form definition
export async function saveFormDefinition(form: FormDefinition, userId: string) {
  const { error } = await supabase
    .from("forms")
    .insert([
      {
        id: form.id,
        user_id: userId,
        created_at: form.createdAt,
        updated_at: form.updatedAt,
        title: form.title,
        description: form.description ?? "",
        status: form.status ?? "draft",
        version: form.version,
        definition_sections: form.sections,
        custom_success_message: form.customSuccessMessage ?? null,
        redirect_url: form.redirectUrl ?? null
      }
    ]);
  if (error) throw error;
  return true;
}

// Update an existing form definition
export async function updateFormDefinition(form: FormDefinition) {
  const { error } = await supabase
    .from("forms")
    .update({
      updated_at: new Date().toISOString(),
      title: form.title,
      description: form.description ?? "",
      status: form.status ?? "draft",
      version: form.version,
      definition_sections: form.sections,
      custom_success_message: form.customSuccessMessage ?? null,
      redirect_url: form.redirectUrl ?? null
    })
    .eq("id", form.id);
  if (error) throw error;
  return true;
}
