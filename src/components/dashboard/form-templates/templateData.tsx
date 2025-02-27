
import { 
  FileText, Clipboard, MessageSquare, CreditCard, 
  CalendarDays, BarChart, Users, ShoppingCart, 
  BookOpen, GraduationCap, Award, PieChart,
  BriefcaseBusiness, FileQuestion, ClipboardCheck, 
  HandHeart, Star, Building2, Pizza
} from "lucide-react";
import { TemplateType } from "./types";

export const templates: TemplateType[] = [
  // Basic templates
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
    id: "newsletter",
    name: "Newsletter Signup",
    description: "Collect email addresses for newsletters",
    icon: <ClipboardCheck className="h-8 w-8 text-indigo-600" />,
    category: "basic"
  },
  {
    id: "rsvp",
    name: "RSVP Form",
    description: "Response form for event invitations",
    icon: <CalendarDays className="h-8 w-8 text-indigo-600" />,
    category: "basic"
  },
  
  // Feedback templates
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
    id: "product_feedback",
    name: "Product Feedback",
    description: "Gather specific product improvement ideas",
    icon: <ShoppingCart className="h-8 w-8 text-indigo-600" />,
    category: "feedback"
  },
  {
    id: "nps_survey",
    name: "NPS Survey",
    description: "Measure Net Promoter Score",
    icon: <PieChart className="h-8 w-8 text-indigo-600" />,
    category: "feedback"
  },
  {
    id: "review",
    name: "Review Collection",
    description: "Collect detailed reviews with ratings",
    icon: <Star className="h-8 w-8 text-indigo-600" />,
    category: "feedback"
  },
  
  // Data Collection templates
  {
    id: "payment",
    name: "Payment Form",
    description: "Collect payment details securely",
    icon: <CreditCard className="h-8 w-8 text-indigo-600" />,
    category: "data"
  },
  {
    id: "job_application",
    name: "Job Application",
    description: "Collect resumes and applicant information",
    icon: <BriefcaseBusiness className="h-8 w-8 text-indigo-600" />,
    category: "data"
  },
  {
    id: "donation",
    name: "Donation Form",
    description: "Collect charitable contributions",
    icon: <HandHeart className="h-8 w-8 text-indigo-600" />,
    category: "data"
  },
  {
    id: "order_form",
    name: "Order Form",
    description: "Collect product orders and shipping info",
    icon: <ShoppingCart className="h-8 w-8 text-indigo-600" />,
    category: "data"
  },
  {
    id: "registration",
    name: "User Registration",
    description: "Sign up new users for your platform",
    icon: <Users className="h-8 w-8 text-indigo-600" />,
    category: "data"
  },
  
  // Popular templates
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
    icon: <FileQuestion className="h-8 w-8 text-indigo-600" />,
    category: "popular"
  },
  {
    id: "course_evaluation",
    name: "Course Evaluation",
    description: "Gather feedback on educational courses",
    icon: <GraduationCap className="h-8 w-8 text-indigo-600" />,
    category: "popular"
  },
  {
    id: "contest_entry",
    name: "Contest Entry",
    description: "Collect submissions for contests",
    icon: <Award className="h-8 w-8 text-indigo-600" />,
    category: "popular"
  },
  {
    id: "food_order",
    name: "Food Order Form",
    description: "Take food orders with customizations",
    icon: <Pizza className="h-8 w-8 text-indigo-600" />,
    category: "popular"
  },
];
