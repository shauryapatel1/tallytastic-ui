import { FormDefinition } from "@/lib/form/types";
import { v4 as uuidv4 } from "uuid";

const now = new Date().toISOString();

// Helper to create consistent field IDs and options
const createFieldId = () => uuidv4();
const createOption = (label: string) => ({
  id: uuidv4(),
  label,
  value: label.toLowerCase().replace(/\s+/g, '_')
});

/**
 * Template definitions that generate valid FormDefinition objects.
 * Each template includes:
 * - Unique field IDs
 * - name property on all fields (for form data keys)
 * - Validation rules where appropriate
 * - Proper field types and configurations
 */
export const templateDefinitions: Record<string, () => FormDefinition> = {
  /**
   * Lead Capture Form
   * Purpose: Collect potential customer information
   * Fields: Name, email, phone, company, inquiry type
   */
  lead_capture: () => ({
    id: uuidv4(),
    title: "Lead Capture Form",
    description: "Collect potential customer information",
    sections: [{
      id: uuidv4(),
      title: "Contact Information",
      fields: [
        {
          id: createFieldId(),
          name: "full_name",
          type: "text",
          label: "Full Name",
          isRequired: true,
          placeholder: "Enter your full name",
          minLength: 2,
          maxLength: 100
        },
        {
          id: createFieldId(),
          name: "email",
          type: "email",
          label: "Email Address",
          isRequired: true,
          placeholder: "your@email.com"
        },
        {
          id: createFieldId(),
          name: "phone",
          type: "tel",
          label: "Phone Number",
          isRequired: false,
          placeholder: "(555) 123-4567"
        },
        {
          id: createFieldId(),
          name: "company",
          type: "text",
          label: "Company Name",
          isRequired: false,
          placeholder: "Your company",
          maxLength: 100
        },
        {
          id: createFieldId(),
          name: "inquiry_type",
          type: "select",
          label: "How can we help you?",
          isRequired: true,
          options: [
            createOption("Product Demo"),
            createOption("Pricing Information"),
            createOption("Partnership Opportunities"),
            createOption("Support"),
            createOption("Other")
          ]
        }
      ]
    }],
    status: "draft",
    version: 1,
    createdAt: now,
    updatedAt: now
  }),

  /**
   * Product Feedback Form
   * Purpose: Gather product improvement ideas
   * Fields: Product name, rating, likes, improvements, recommendation
   */
  product_feedback: () => ({
    id: uuidv4(),
    title: "Product Feedback Form",
    description: "Gather specific product improvement ideas",
    sections: [{
      id: uuidv4(),
      title: "Your Feedback",
      fields: [
        {
          id: createFieldId(),
          name: "product_name",
          type: "text",
          label: "Product Name",
          isRequired: true,
          placeholder: "Which product are you reviewing?",
          maxLength: 100
        },
        {
          id: createFieldId(),
          name: "overall_rating",
          type: "radio",
          label: "Overall Rating",
          isRequired: true,
          options: [
            createOption("Excellent"),
            createOption("Good"),
            createOption("Average"),
            createOption("Poor"),
            createOption("Very Poor")
          ]
        },
        {
          id: createFieldId(),
          name: "likes",
          type: "textarea",
          label: "What do you like most about this product?",
          isRequired: false,
          placeholder: "Tell us what you love...",
          rows: 3,
          maxLength: 1000
        },
        {
          id: createFieldId(),
          name: "improvements",
          type: "textarea",
          label: "What could be improved?",
          isRequired: true,
          placeholder: "Share your improvement suggestions...",
          rows: 4,
          minLength: 10,
          maxLength: 2000
        },
        {
          id: createFieldId(),
          name: "would_recommend",
          type: "checkbox",
          label: "Would you recommend this product to others?",
          isRequired: false
        }
      ]
    }],
    status: "draft",
    version: 1,
    createdAt: now,
    updatedAt: now
  }),

  /**
   * Event Registration Form
   * Purpose: Register attendees for events
   * Fields: Name, email, phone, organization, ticket type, dietary needs
   */
  event_registration: () => ({
    id: uuidv4(),
    title: "Event Registration Form",
    description: "Register attendees for your event",
    sections: [{
      id: uuidv4(),
      title: "Registration Details",
      fields: [
        {
          id: createFieldId(),
          name: "full_name",
          type: "text",
          label: "Full Name",
          isRequired: true,
          placeholder: "Enter your full name",
          minLength: 2,
          maxLength: 100
        },
        {
          id: createFieldId(),
          name: "email",
          type: "email",
          label: "Email Address",
          isRequired: true,
          placeholder: "your@email.com"
        },
        {
          id: createFieldId(),
          name: "phone",
          type: "tel",
          label: "Phone Number",
          isRequired: true,
          placeholder: "(555) 123-4567"
        },
        {
          id: createFieldId(),
          name: "organization",
          type: "text",
          label: "Organization/Company",
          isRequired: false,
          placeholder: "Your organization",
          maxLength: 100
        },
        {
          id: createFieldId(),
          name: "ticket_type",
          type: "select",
          label: "Ticket Type",
          isRequired: true,
          options: [
            createOption("General Admission"),
            createOption("VIP"),
            createOption("Student"),
            createOption("Group (5+)")
          ]
        },
        {
          id: createFieldId(),
          name: "dietary_restrictions",
          type: "textarea",
          label: "Dietary Restrictions or Special Needs",
          isRequired: false,
          placeholder: "Let us know about any accommodations needed...",
          rows: 3,
          maxLength: 500
        }
      ]
    }],
    status: "draft",
    version: 1,
    createdAt: now,
    updatedAt: now
  }),

  /**
   * NPS Survey Form
   * Purpose: Measure Net Promoter Score
   * Fields: NPS rating (0-10), reason, optional contact info
   */
  nps_survey: () => ({
    id: uuidv4(),
    title: "NPS Survey",
    description: "Measure Net Promoter Score",
    sections: [{
      id: uuidv4(),
      title: "Your Experience",
      fields: [
        {
          id: createFieldId(),
          name: "nps_score",
          type: "rating",
          label: "How likely are you to recommend us to a friend or colleague?",
          isRequired: true,
          maxRating: 10,
          ratingType: "number_scale"
        },
        {
          id: createFieldId(),
          name: "reason",
          type: "textarea",
          label: "What's the main reason for your score?",
          isRequired: false,
          placeholder: "Tell us more about your experience...",
          rows: 4,
          maxLength: 2000
        },
        {
          id: createFieldId(),
          name: "name",
          type: "text",
          label: "Name (optional)",
          isRequired: false,
          placeholder: "Your name",
          maxLength: 100
        },
        {
          id: createFieldId(),
          name: "email",
          type: "email",
          label: "Email (optional)",
          isRequired: false,
          placeholder: "your@email.com"
        }
      ]
    }],
    status: "draft",
    version: 1,
    createdAt: now,
    updatedAt: now
  }),

  /**
   * Job Application Form
   * Purpose: Collect resumes and applicant information
   * Multi-section: Personal Info, Position & Experience
   */
  job_application: () => ({
    id: uuidv4(),
    title: "Job Application Form",
    description: "Collect resumes and applicant information",
    sections: [
      {
        id: uuidv4(),
        title: "Personal Information",
        fields: [
          {
            id: createFieldId(),
            name: "full_name",
            type: "text",
            label: "Full Name",
            isRequired: true,
            placeholder: "Enter your full name",
            minLength: 2,
            maxLength: 100
          },
          {
            id: createFieldId(),
            name: "email",
            type: "email",
            label: "Email Address",
            isRequired: true,
            placeholder: "your@email.com"
          },
          {
            id: createFieldId(),
            name: "phone",
            type: "tel",
            label: "Phone Number",
            isRequired: true,
            placeholder: "(555) 123-4567"
          },
          {
            id: createFieldId(),
            name: "city",
            type: "text",
            label: "Current City",
            isRequired: true,
            placeholder: "City, State",
            maxLength: 100
          }
        ]
      },
      {
        id: uuidv4(),
        title: "Position & Experience",
        fields: [
          {
            id: createFieldId(),
            name: "position",
            type: "text",
            label: "Position Applied For",
            isRequired: true,
            placeholder: "Job title",
            maxLength: 100
          },
          {
            id: createFieldId(),
            name: "experience_years",
            type: "select",
            label: "Years of Experience",
            isRequired: true,
            options: [
              createOption("0-1 years"),
              createOption("2-5 years"),
              createOption("6-10 years"),
              createOption("10+ years")
            ]
          },
          {
            id: createFieldId(),
            name: "resume",
            type: "file",
            label: "Resume/CV",
            isRequired: true,
            allowedFileTypes: [".pdf", ".doc", ".docx"],
            maxFileSizeMB: 5
          },
          {
            id: createFieldId(),
            name: "cover_letter",
            type: "textarea",
            label: "Cover Letter",
            isRequired: false,
            placeholder: "Why are you interested in this position?",
            rows: 5,
            maxLength: 5000
          }
        ]
      }
    ],
    status: "draft",
    version: 1,
    createdAt: now,
    updatedAt: now
  }),

  /**
   * Bug Report Form
   * Purpose: Collect software issue details
   * Fields: Summary, priority, steps to reproduce, expected/actual behavior, browser, screenshots
   */
  bug_report: () => ({
    id: uuidv4(),
    title: "Bug Report Form",
    description: "Collect software issue details",
    sections: [{
      id: uuidv4(),
      title: "Issue Details",
      fields: [
        {
          id: createFieldId(),
          name: "summary",
          type: "text",
          label: "Bug Summary",
          isRequired: true,
          placeholder: "Brief description of the issue",
          minLength: 5,
          maxLength: 200
        },
        {
          id: createFieldId(),
          name: "priority",
          type: "select",
          label: "Priority Level",
          isRequired: true,
          options: [
            createOption("Critical"),
            createOption("High"),
            createOption("Medium"),
            createOption("Low")
          ]
        },
        {
          id: createFieldId(),
          name: "steps_to_reproduce",
          type: "textarea",
          label: "Steps to Reproduce",
          isRequired: true,
          placeholder: "1. Go to...\n2. Click on...\n3. See error...",
          rows: 5,
          minLength: 20,
          maxLength: 3000
        },
        {
          id: createFieldId(),
          name: "expected_behavior",
          type: "textarea",
          label: "Expected Behavior",
          isRequired: true,
          placeholder: "What should have happened?",
          rows: 3,
          minLength: 10,
          maxLength: 1000
        },
        {
          id: createFieldId(),
          name: "actual_behavior",
          type: "textarea",
          label: "Actual Behavior",
          isRequired: true,
          placeholder: "What actually happened?",
          rows: 3,
          minLength: 10,
          maxLength: 1000
        },
        {
          id: createFieldId(),
          name: "browser_device",
          type: "text",
          label: "Browser/Device",
          isRequired: false,
          placeholder: "Chrome 120, iPhone 14, etc.",
          maxLength: 100
        },
        {
          id: createFieldId(),
          name: "screenshots",
          type: "file",
          label: "Screenshots",
          isRequired: false,
          allowedFileTypes: [".png", ".jpg", ".jpeg", ".gif"],
          maxFileSizeMB: 10
        }
      ]
    }],
    status: "draft",
    version: 1,
    createdAt: now,
    updatedAt: now
  }),

  /**
   * Contact Form
   * Purpose: General contact inquiries
   * Fields: Name, email, phone, subject, message
   */
  contact_form: () => ({
    id: uuidv4(),
    title: "Contact Form",
    description: "General contact inquiries",
    sections: [{
      id: uuidv4(),
      title: "Get in Touch",
      fields: [
        {
          id: createFieldId(),
          name: "full_name",
          type: "text",
          label: "Full Name",
          isRequired: true,
          placeholder: "Your name",
          minLength: 2,
          maxLength: 100
        },
        {
          id: createFieldId(),
          name: "email",
          type: "email",
          label: "Email Address",
          isRequired: true,
          placeholder: "your@email.com"
        },
        {
          id: createFieldId(),
          name: "phone",
          type: "tel",
          label: "Phone Number",
          isRequired: false,
          placeholder: "(555) 123-4567"
        },
        {
          id: createFieldId(),
          name: "subject",
          type: "select",
          label: "Subject",
          isRequired: true,
          options: [
            createOption("General Inquiry"),
            createOption("Support Request"),
            createOption("Feedback"),
            createOption("Partnership"),
            createOption("Other")
          ]
        },
        {
          id: createFieldId(),
          name: "message",
          type: "textarea",
          label: "Message",
          isRequired: true,
          placeholder: "How can we help you?",
          rows: 5,
          minLength: 10,
          maxLength: 2000
        }
      ]
    }],
    status: "draft",
    version: 1,
    createdAt: now,
    updatedAt: now
  }),

  /**
   * Newsletter Signup Form
   * Purpose: Email list subscription
   * Fields: Email, name, interests, frequency preference
   */
  newsletter_signup: () => ({
    id: uuidv4(),
    title: "Newsletter Signup",
    description: "Subscribe to our newsletter",
    sections: [{
      id: uuidv4(),
      title: "Stay Updated",
      fields: [
        {
          id: createFieldId(),
          name: "email",
          type: "email",
          label: "Email Address",
          isRequired: true,
          placeholder: "your@email.com"
        },
        {
          id: createFieldId(),
          name: "first_name",
          type: "text",
          label: "First Name",
          isRequired: false,
          placeholder: "Your first name",
          maxLength: 50
        },
        {
          id: createFieldId(),
          name: "interests",
          type: "checkbox",
          label: "Topics of Interest",
          isRequired: false,
          options: [
            createOption("Product Updates"),
            createOption("Industry News"),
            createOption("Tips & Tutorials"),
            createOption("Company News"),
            createOption("Promotions & Offers")
          ]
        },
        {
          id: createFieldId(),
          name: "frequency",
          type: "radio",
          label: "How often would you like to hear from us?",
          isRequired: true,
          options: [
            createOption("Daily"),
            createOption("Weekly"),
            createOption("Monthly")
          ]
        }
      ]
    }],
    status: "draft",
    version: 1,
    createdAt: now,
    updatedAt: now
  }),

  /**
   * Quote Request Form
   * Purpose: Collect service/product quote requests
   * Multi-section: Contact Info, Project Details
   */
  quote_request: () => ({
    id: uuidv4(),
    title: "Quote Request Form",
    description: "Request a custom quote for our services",
    sections: [
      {
        id: uuidv4(),
        title: "Contact Information",
        fields: [
          {
            id: createFieldId(),
            name: "full_name",
            type: "text",
            label: "Full Name",
            isRequired: true,
            placeholder: "Your name",
            minLength: 2,
            maxLength: 100
          },
          {
            id: createFieldId(),
            name: "email",
            type: "email",
            label: "Email Address",
            isRequired: true,
            placeholder: "your@email.com"
          },
          {
            id: createFieldId(),
            name: "phone",
            type: "tel",
            label: "Phone Number",
            isRequired: true,
            placeholder: "(555) 123-4567"
          },
          {
            id: createFieldId(),
            name: "company",
            type: "text",
            label: "Company Name",
            isRequired: false,
            placeholder: "Your company",
            maxLength: 100
          }
        ]
      },
      {
        id: uuidv4(),
        title: "Project Details",
        fields: [
          {
            id: createFieldId(),
            name: "service_type",
            type: "select",
            label: "Service Type",
            isRequired: true,
            options: [
              createOption("Consulting"),
              createOption("Development"),
              createOption("Design"),
              createOption("Marketing"),
              createOption("Other")
            ]
          },
          {
            id: createFieldId(),
            name: "budget_range",
            type: "radio",
            label: "Budget Range",
            isRequired: true,
            options: [
              createOption("Under $5,000"),
              createOption("$5,000 - $15,000"),
              createOption("$15,000 - $50,000"),
              createOption("$50,000+")
            ]
          },
          {
            id: createFieldId(),
            name: "timeline",
            type: "select",
            label: "Desired Timeline",
            isRequired: true,
            options: [
              createOption("ASAP"),
              createOption("1-2 weeks"),
              createOption("1 month"),
              createOption("2-3 months"),
              createOption("Flexible")
            ]
          },
          {
            id: createFieldId(),
            name: "project_description",
            type: "textarea",
            label: "Project Description",
            isRequired: true,
            placeholder: "Describe your project requirements...",
            rows: 5,
            minLength: 20,
            maxLength: 3000
          }
        ]
      }
    ],
    status: "draft",
    version: 1,
    createdAt: now,
    updatedAt: now
  }),

  /**
   * Booking Form
   * Purpose: Appointment/service booking
   * Fields: Contact info, date, time slot, service type, notes
   */
  booking_form: () => ({
    id: uuidv4(),
    title: "Booking Form",
    description: "Schedule an appointment or service",
    sections: [{
      id: uuidv4(),
      title: "Book Your Appointment",
      fields: [
        {
          id: createFieldId(),
          name: "full_name",
          type: "text",
          label: "Full Name",
          isRequired: true,
          placeholder: "Your name",
          minLength: 2,
          maxLength: 100
        },
        {
          id: createFieldId(),
          name: "email",
          type: "email",
          label: "Email Address",
          isRequired: true,
          placeholder: "your@email.com"
        },
        {
          id: createFieldId(),
          name: "phone",
          type: "tel",
          label: "Phone Number",
          isRequired: true,
          placeholder: "(555) 123-4567"
        },
        {
          id: createFieldId(),
          name: "service",
          type: "select",
          label: "Service Type",
          isRequired: true,
          options: [
            createOption("Consultation"),
            createOption("Assessment"),
            createOption("Training Session"),
            createOption("Follow-up"),
            createOption("Other")
          ]
        },
        {
          id: createFieldId(),
          name: "preferred_date",
          type: "date",
          label: "Preferred Date",
          isRequired: true
        },
        {
          id: createFieldId(),
          name: "preferred_time",
          type: "select",
          label: "Preferred Time Slot",
          isRequired: true,
          options: [
            createOption("9:00 AM - 10:00 AM"),
            createOption("10:00 AM - 11:00 AM"),
            createOption("11:00 AM - 12:00 PM"),
            createOption("1:00 PM - 2:00 PM"),
            createOption("2:00 PM - 3:00 PM"),
            createOption("3:00 PM - 4:00 PM"),
            createOption("4:00 PM - 5:00 PM")
          ]
        },
        {
          id: createFieldId(),
          name: "notes",
          type: "textarea",
          label: "Additional Notes",
          isRequired: false,
          placeholder: "Anything we should know before your appointment?",
          rows: 3,
          maxLength: 1000
        }
      ]
    }],
    status: "draft",
    version: 1,
    createdAt: now,
    updatedAt: now
  }),

  /**
   * Customer Feedback Form
   * Purpose: Detailed customer satisfaction feedback
   * Multi-section: Experience Rating, Details
   */
  customer_feedback: () => ({
    id: uuidv4(),
    title: "Customer Feedback Form",
    description: "Help us improve your experience",
    sections: [
      {
        id: uuidv4(),
        title: "Rate Your Experience",
        fields: [
          {
            id: createFieldId(),
            name: "overall_satisfaction",
            type: "rating",
            label: "Overall Satisfaction",
            isRequired: true,
            maxRating: 5,
            ratingType: "star"
          },
          {
            id: createFieldId(),
            name: "service_quality",
            type: "radio",
            label: "Service Quality",
            isRequired: true,
            options: [
              createOption("Excellent"),
              createOption("Good"),
              createOption("Average"),
              createOption("Poor")
            ]
          },
          {
            id: createFieldId(),
            name: "value_for_money",
            type: "radio",
            label: "Value for Money",
            isRequired: true,
            options: [
              createOption("Excellent"),
              createOption("Good"),
              createOption("Average"),
              createOption("Poor")
            ]
          }
        ]
      },
      {
        id: uuidv4(),
        title: "Tell Us More",
        fields: [
          {
            id: createFieldId(),
            name: "what_went_well",
            type: "textarea",
            label: "What did we do well?",
            isRequired: false,
            placeholder: "Share what you liked...",
            rows: 3,
            maxLength: 1000
          },
          {
            id: createFieldId(),
            name: "improvements",
            type: "textarea",
            label: "How can we improve?",
            isRequired: false,
            placeholder: "Share your suggestions...",
            rows: 3,
            maxLength: 1000
          },
          {
            id: createFieldId(),
            name: "would_recommend",
            type: "radio",
            label: "Would you recommend us to others?",
            isRequired: true,
            options: [
              createOption("Definitely"),
              createOption("Probably"),
              createOption("Not sure"),
              createOption("Probably not"),
              createOption("Definitely not")
            ]
          },
          {
            id: createFieldId(),
            name: "email",
            type: "email",
            label: "Email (optional, for follow-up)",
            isRequired: false,
            placeholder: "your@email.com"
          }
        ]
      }
    ],
    status: "draft",
    version: 1,
    createdAt: now,
    updatedAt: now
  }),

  /**
   * Feature Request Form
   * Purpose: Collect product feature suggestions
   * Fields: Title, category, description, priority, use case, contact
   */
  feature_request: () => ({
    id: uuidv4(),
    title: "Feature Request Form",
    description: "Submit your product feature ideas",
    sections: [{
      id: uuidv4(),
      title: "Suggest a Feature",
      fields: [
        {
          id: createFieldId(),
          name: "feature_title",
          type: "text",
          label: "Feature Title",
          isRequired: true,
          placeholder: "Brief title for your feature idea",
          minLength: 5,
          maxLength: 100
        },
        {
          id: createFieldId(),
          name: "category",
          type: "select",
          label: "Category",
          isRequired: true,
          options: [
            createOption("User Interface"),
            createOption("Performance"),
            createOption("Integration"),
            createOption("Reporting"),
            createOption("Mobile"),
            createOption("Other")
          ]
        },
        {
          id: createFieldId(),
          name: "priority",
          type: "radio",
          label: "How important is this feature to you?",
          isRequired: true,
          options: [
            createOption("Critical - I can't work without it"),
            createOption("High - Would significantly improve my workflow"),
            createOption("Medium - Nice to have"),
            createOption("Low - Just an idea")
          ]
        },
        {
          id: createFieldId(),
          name: "description",
          type: "textarea",
          label: "Feature Description",
          isRequired: true,
          placeholder: "Describe the feature in detail...",
          rows: 4,
          minLength: 20,
          maxLength: 2000
        },
        {
          id: createFieldId(),
          name: "use_case",
          type: "textarea",
          label: "Use Case",
          isRequired: true,
          placeholder: "How would you use this feature? What problem does it solve?",
          rows: 3,
          minLength: 10,
          maxLength: 1000
        },
        {
          id: createFieldId(),
          name: "email",
          type: "email",
          label: "Email (for updates on this request)",
          isRequired: false,
          placeholder: "your@email.com"
        }
      ]
    }],
    status: "draft",
    version: 1,
    createdAt: now,
    updatedAt: now
  })
};

/**
 * Get available template IDs
 */
export const getTemplateIds = (): string[] => {
  return Object.keys(templateDefinitions);
};

/**
 * Check if a template exists
 */
export const hasTemplate = (templateId: string): boolean => {
  return templateId in templateDefinitions;
};

/**
 * Get template count
 */
export const getTemplateCount = (): number => {
  return Object.keys(templateDefinitions).length;
};
