import { 
  FileText, Clipboard, MessageSquare, ShoppingCart, 
  CalendarDays, PieChart, BriefcaseBusiness, Bug, Gauge
} from "lucide-react";
import { TemplateType } from "./types";

/**
 * Template metadata for UI display.
 * Each template ID must have a corresponding generator in templateDefinitions.ts
 */
export const templates: TemplateType[] = [
  // Blank template - always first
  {
    id: "blank",
    name: "Blank Form",
    description: "Start from scratch with a blank canvas",
    icon: <FileText className="h-8 w-8" />,
    category: "basic"
  },
  
  // Business templates
  {
    id: "lead_capture",
    name: "Lead Capture",
    description: "Collect potential customer information with company details and inquiry type",
    icon: <Gauge className="h-8 w-8" />,
    category: "business"
  },
  {
    id: "job_application",
    name: "Job Application",
    description: "Multi-section form for collecting resumes, experience, and cover letters",
    icon: <BriefcaseBusiness className="h-8 w-8" />,
    category: "business"
  },
  
  // Feedback templates
  {
    id: "product_feedback",
    name: "Product Feedback",
    description: "Gather ratings, likes, and improvement suggestions for products",
    icon: <ShoppingCart className="h-8 w-8" />,
    category: "feedback"
  },
  {
    id: "nps_survey",
    name: "NPS Survey",
    description: "Measure Net Promoter Score with 0-10 rating and follow-up questions",
    icon: <PieChart className="h-8 w-8" />,
    category: "feedback"
  },
  
  // Event templates
  {
    id: "event_registration",
    name: "Event Registration",
    description: "Register attendees with contact info, ticket type, and dietary needs",
    icon: <CalendarDays className="h-8 w-8" />,
    category: "events"
  },
  
  // Technical templates
  {
    id: "bug_report",
    name: "Bug Report",
    description: "Structured issue reporting with priority, steps to reproduce, and screenshots",
    icon: <Bug className="h-8 w-8" />,
    category: "technical"
  }
];

/**
 * Get template by ID
 */
export const getTemplateById = (id: string): TemplateType | undefined => {
  return templates.find(t => t.id === id);
};

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category: TemplateType['category']): TemplateType[] => {
  return templates.filter(t => t.category === category);
};

/**
 * Get all templates except blank
 */
export const getRealTemplates = (): TemplateType[] => {
  return templates.filter(t => t.id !== "blank");
};
