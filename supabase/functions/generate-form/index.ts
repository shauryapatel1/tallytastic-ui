import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a form schema generator. Given a form title, purpose description, and optional industry, you generate a complete JSON form definition.

CRITICAL: Return ONLY valid JSON. No markdown, no code fences, no explanation text.

The form definition must follow this exact structure:
{
  "title": "string",
  "description": "string",
  "sections": [
    {
      "id": "uuid-string",
      "title": "string (optional)",
      "fields": [
        {
          "id": "uuid-string",
          "name": "snake_case_field_name",
          "type": "text|textarea|email|number|tel|select|radio|checkbox|date|rating|file",
          "label": "string",
          "description": "string (optional)",
          "placeholder": "string (optional)",
          "isRequired": boolean,
          "options": [{"id": "uuid", "label": "string", "value": "string"}] (for select/radio only),
          "minLength": number (optional, for text),
          "maxLength": number (optional, for text),
          "min": number (optional, for number),
          "max": number (optional, for number),
          "maxFileSizeMB": number (optional, for file),
          "allowedFileTypes": [".pdf", ".doc"] (optional, for file),
          "maxRating": number (optional, for rating, default 5),
          "ratingType": "star" (for rating)
        }
      ]
    }
  ]
}

Field type guidelines:
- "text": Short text input (names, titles, short answers)
- "textarea": Long text input (messages, descriptions, comments)
- "email": Email address input
- "number": Numeric input (age, quantity, ratings)
- "tel": Phone number input
- "select": Dropdown with single selection (categories, choices)
- "radio": Radio buttons for mutually exclusive options (yes/no, ratings)
- "checkbox": Single checkbox for agreements/consents
- "date": Date picker
- "rating": Star rating (1-5 or 1-10)
- "file": File upload (resumes, documents)

Best practices:
1. Use logical field order (name, email, then specifics)
2. Group related fields in sections when form is complex
3. Make contact fields (name, email) required
4. Use appropriate placeholders as examples
5. Include consent/agreement checkbox for business forms
6. Use "name" property with snake_case for form data keys
7. Generate unique UUIDs for all ids
8. Add validation (minLength, maxLength) where appropriate

Generate 4-10 fields based on the purpose complexity.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, purpose, industry } = await req.json();
    
    if (!title || !purpose) {
      return new Response(
        JSON.stringify({ error: "Title and purpose are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userPrompt = `Generate a form with the following details:
- Title: ${title}
- Purpose: ${purpose}
${industry ? `- Industry: ${industry}` : ""}

Create an appropriate form schema with relevant fields for this use case.`;

    console.log("Calling Lovable AI Gateway for form generation...");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to generate form. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in AI response:", data);
      return new Response(
        JSON.stringify({ error: "Failed to generate form content" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON from the response (handle potential markdown wrapping)
    let formSchema;
    try {
      // Try direct parse first
      formSchema = JSON.parse(content);
    } catch {
      // Try extracting JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        formSchema = JSON.parse(jsonMatch[1].trim());
      } else {
        // Try finding JSON object in the response
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          formSchema = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
        } else {
          throw new Error("Could not extract JSON from response");
        }
      }
    }

    console.log("Form schema generated successfully");
    
    return new Response(
      JSON.stringify({ formSchema }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-form error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
