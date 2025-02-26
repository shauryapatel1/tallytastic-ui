
import { ReactNode } from "react";

export type TemplateType = {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  category: "basic" | "feedback" | "data" | "popular";
};
