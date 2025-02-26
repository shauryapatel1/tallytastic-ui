
import { 
  FileText, Clipboard, MessageSquare, CreditCard, 
  CalendarDays, BarChart, Users
} from "lucide-react";
import { TemplateType } from "./types";

export const templates: TemplateType[] = [
  {
    id: "blank",
    name: "Blank Form",
    description: "Start from scratch with a blank canvas",
    icon: <FileText className="h-8 w-8 text-indigo-600" />,
    category: "basic"
  },
  {
    id: "contact",
    name: "Contact Form",
    description: "Basic contact information collection",
    icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
    category: "basic"
  },
  {
    id: "survey",
    name: "Feedback Survey",
    description: "Get user feedback and ratings",
    icon: <Clipboard className="h-8 w-8 text-indigo-600" />,
    category: "feedback"
  },
  {
    id: "customer",
    name: "Customer Survey",
    description: "Collect customer satisfaction data",
    icon: <Users className="h-8 w-8 text-indigo-600" />,
    category: "feedback"
  },
  {
    id: "payment",
    name: "Payment Form",
    description: "Collect payment details securely",
    icon: <CreditCard className="h-8 w-8 text-indigo-600" />,
    category: "data"
  },
  {
    id: "event",
    name: "Event Registration",
    description: "Register attendees for your event",
    icon: <CalendarDays className="h-8 w-8 text-indigo-600" />,
    category: "popular"
  },
  {
    id: "quiz",
    name: "Quiz or Assessment",
    description: "Test knowledge with scored questions",
    icon: <BarChart className="h-8 w-8 text-indigo-600" />,
    category: "popular"
  },
];
