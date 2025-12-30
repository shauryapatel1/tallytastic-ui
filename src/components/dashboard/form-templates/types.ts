import { ReactNode } from "react";

export type TemplateCategory = "basic" | "business" | "feedback" | "events" | "technical";

export type TemplateType = {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  category: TemplateCategory;
};
