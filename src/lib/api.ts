
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
}: {
  title: string;
  description: string;
}) {
  const { data, error } = await supabase
    .from("forms")
    .insert([
      {
        title,
        description,
        fields: [],
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Form;
}
