export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      forms: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          status: "draft" | "published" | "archived"
          version: number
          definition_sections: Json // Representing FormSectionDefinition[]
          custom_success_message: string | null
          redirect_url: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          status?: "draft" | "published" | "archived"
          version?: number
          definition_sections: Json // Representing FormSectionDefinition[]
          custom_success_message?: string | null
          redirect_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          status?: "draft" | "published" | "archived"
          version?: number
          definition_sections?: Json // Representing FormSectionDefinition[]
          custom_success_message?: string | null
          redirect_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forms_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      form_responses: {
        Row: {
          id: string
          form_id: string
          created_at: string
          submitted_at: string 
          data: Json // Representing FormValues
        }
        Insert: {
          id?: string
          form_id: string
          created_at?: string
          submitted_at?: string
          data: Json // Representing FormValues
        }
        Update: {
          id?: string
          form_id?: string
          created_at?: string
          submitted_at?: string
          data?: Json // Representing FormValues
        }
        Relationships: [
          {
            foreignKeyName: "form_responses_form_id_fkey"
            columns: ["form_id"]
            referencedRelation: "forms"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for JSONB columns to be used in services
// These would ideally be more tightly coupled or generated if Supabase offered deeper JSON typing
import type { FormSectionDefinition, FormValues } from './forms'; // Assuming forms.ts exists or will be updated

export type FormDefinitionSectionsSupabase = FormSectionDefinition[];
export type FormResponseDataSupabase = FormValues; 