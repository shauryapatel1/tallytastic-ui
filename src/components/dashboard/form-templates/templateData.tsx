
import { 
  FileText, Clipboard, MessageSquare, CreditCard, 
  CalendarDays, BarChart, Users, ShoppingCart, 
  BookOpen, GraduationCap, Award, PieChart,
  BriefcaseBusiness, FileQuestion, ClipboardCheck, 
  HandHeart, Star, Building2, Pizza, Gauge,
  Headphones, PercentCircle, BookHeart, Activity,
  BadgeInfo, Bug, Car, CreditCardIcon, PartyPopper,
  Camera, Home, Wallet, Clock, HeartPulse, MessagesSquare,
  Pencil, Bus, Lightbulb, UserCheck, CircleDollarSign,
  Eye, Glasses, Utensils, PanelRight, CircleUserRound,
  School, CheckCircle, BrainCircuit, Sparkles, Baby
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
  {
    id: "consent",
    name: "Consent Form",
    description: "Obtain documented user permissions",
    icon: <CheckCircle className="h-8 w-8 text-indigo-600" />,
    category: "basic"
  },
  {
    id: "profile",
    name: "User Profile",
    description: "Collect user biographical information",
    icon: <CircleUserRound className="h-8 w-8 text-indigo-600" />,
    category: "basic"
  },
  {
    id: "membership",
    name: "Membership Application",
    description: "Process new member signups",
    icon: <UserCheck className="h-8 w-8 text-indigo-600" />,
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
  {
    id: "service_feedback",
    name: "Service Feedback",
    description: "Evaluate customer service quality",
    icon: <Headphones className="h-8 w-8 text-indigo-600" />,
    category: "feedback"
  },
  {
    id: "website_feedback",
    name: "Website Feedback",
    description: "Get feedback on your website experience",
    icon: <PanelRight className="h-8 w-8 text-indigo-600" />,
    category: "feedback"
  },
  {
    id: "event_feedback",
    name: "Event Feedback",
    description: "Collect post-event attendee opinions",
    icon: <PartyPopper className="h-8 w-8 text-indigo-600" />,
    category: "feedback"
  },
  {
    id: "exit_survey",
    name: "Exit Survey",
    description: "Understand why users are leaving",
    icon: <MessagesSquare className="h-8 w-8 text-indigo-600" />,
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
  {
    id: "lead_capture",
    name: "Lead Capture",
    description: "Collect potential customer information",
    icon: <Gauge className="h-8 w-8 text-indigo-600" />,
    category: "data"
  },
  {
    id: "booking",
    name: "Booking Form",
    description: "Schedule appointments and bookings",
    icon: <Clock className="h-8 w-8 text-indigo-600" />,
    category: "data"
  },
  {
    id: "real_estate",
    name: "Real Estate Inquiry",
    description: "Collect property interest information",
    icon: <Home className="h-8 w-8 text-indigo-600" />,
    category: "data"
  },
  {
    id: "quote_request",
    name: "Quote Request",
    description: "Generate customized price quotes",
    icon: <CircleDollarSign className="h-8 w-8 text-indigo-600" />,
    category: "data"
  },
  {
    id: "file_upload",
    name: "File Upload Form",
    description: "Collect documents and files",
    icon: <Camera className="h-8 w-8 text-indigo-600" />,
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
  {
    id: "medical_intake",
    name: "Medical Intake Form",
    description: "Collect patient medical history",
    icon: <HeartPulse className="h-8 w-8 text-indigo-600" />,
    category: "popular"
  },
  {
    id: "satisfaction_survey",
    name: "Satisfaction Survey",
    description: "Measure customer satisfaction levels",
    icon: <PercentCircle className="h-8 w-8 text-indigo-600" />,
    category: "popular"
  },
  {
    id: "poll",
    name: "Quick Poll",
    description: "Run simple opinion polls",
    icon: <Activity className="h-8 w-8 text-indigo-600" />,
    category: "popular"
  },
  {
    id: "bug_report",
    name: "Bug Report Form",
    description: "Collect software issue details",
    icon: <Bug className="h-8 w-8 text-indigo-600" />,
    category: "popular"
  },
  {
    id: "contact_request",
    name: "Contact Request",
    description: "Let users request callbacks",
    icon: <BadgeInfo className="h-8 w-8 text-indigo-600" />,
    category: "popular"
  },
];
