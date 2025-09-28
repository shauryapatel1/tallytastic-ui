import { FormDefinition, FormFieldDefinition } from "@/lib/form/types";
import { v4 as uuidv4 } from "uuid";

const now = new Date().toISOString();

// Helper to create consistent field IDs and options
const createFieldId = () => uuidv4();
const createOption = (label: string) => ({
  id: uuidv4(),
  label,
  value: label.toLowerCase().replace(/\s+/g, '_')
});

// Template definitions that generate valid FormDefinition objects
export const templateDefinitions: Record<string, () => FormDefinition> = {
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
          type: "text",
          label: "Full Name",
          isRequired: true,
          placeholder: "Enter your full name"
        },
        {
          id: createFieldId(),
          type: "email",
          label: "Email Address",
          isRequired: true,
          placeholder: "your@email.com"
        },
        {
          id: createFieldId(),
          type: "tel",
          label: "Phone Number",
          isRequired: false,
          placeholder: "(555) 123-4567"
        },
        {
          id: createFieldId(),
          type: "text",
          label: "Company Name",
          isRequired: false,
          placeholder: "Your company"
        },
        {
          id: createFieldId(),
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
          type: "text",
          label: "Product Name",
          isRequired: true,
          placeholder: "Which product are you reviewing?"
        },
        {
          id: createFieldId(),
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
          type: "textarea",
          label: "What do you like most about this product?",
          isRequired: false,
          placeholder: "Tell us what you love...",
          rows: 3
        },
        {
          id: createFieldId(),
          type: "textarea",
          label: "What could be improved?",
          isRequired: true,
          placeholder: "Share your improvement suggestions...",
          rows: 4
        },
        {
          id: createFieldId(),
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
          type: "text",
          label: "Full Name",
          isRequired: true,
          placeholder: "Enter your full name"
        },
        {
          id: createFieldId(),
          type: "email",
          label: "Email Address",
          isRequired: true,
          placeholder: "your@email.com"
        },
        {
          id: createFieldId(),
          type: "tel",
          label: "Phone Number",
          isRequired: true,
          placeholder: "(555) 123-4567"
        },
        {
          id: createFieldId(),
          type: "text",
          label: "Organization/Company",
          isRequired: false,
          placeholder: "Your organization"
        },
        {
          id: createFieldId(),
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
          type: "textarea",
          label: "Dietary Restrictions or Special Needs",
          isRequired: false,
          placeholder: "Let us know about any accommodations needed...",
          rows: 3
        }
      ]
    }],
    status: "draft",
    version: 1,
    createdAt: now,
    updatedAt: now
  }),

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
          type: "rating",
          label: "How likely are you to recommend us to a friend or colleague?",
          isRequired: true,
          maxRating: 10,
          ratingType: "number_scale"
        },
        {
          id: createFieldId(),
          type: "textarea",
          label: "What's the main reason for your score?",
          isRequired: false,
          placeholder: "Tell us more about your experience...",
          rows: 4
        },
        {
          id: createFieldId(),
          type: "text",
          label: "Name (optional)",
          isRequired: false,
          placeholder: "Your name"
        },
        {
          id: createFieldId(),
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
            type: "text",
            label: "Full Name",
            isRequired: true,
            placeholder: "Enter your full name"
          },
          {
            id: createFieldId(),
            type: "email",
            label: "Email Address",
            isRequired: true,
            placeholder: "your@email.com"
          },
          {
            id: createFieldId(),
            type: "tel",
            label: "Phone Number",
            isRequired: true,
            placeholder: "(555) 123-4567"
          },
          {
            id: createFieldId(),
            type: "text",
            label: "Current City",
            isRequired: true,
            placeholder: "City, State"
          }
        ]
      },
      {
        id: uuidv4(),
        title: "Position & Experience",
        fields: [
          {
            id: createFieldId(),
            type: "text",
            label: "Position Applied For",
            isRequired: true,
            placeholder: "Job title"
          },
          {
            id: createFieldId(),
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
            type: "file",
            label: "Resume/CV",
            isRequired: true,
            allowedFileTypes: [".pdf", ".doc", ".docx"],
            maxFileSizeMB: 5
          },
          {
            id: createFieldId(),
            type: "textarea",
            label: "Cover Letter",
            isRequired: false,
            placeholder: "Why are you interested in this position?",
            rows: 5
          }
        ]
      }
    ],
    status: "draft",
    version: 1,
    createdAt: now,
    updatedAt: now
  }),

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
          type: "text",
          label: "Bug Summary",
          isRequired: true,
          placeholder: "Brief description of the issue"
        },
        {
          id: createFieldId(),
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
          type: "textarea",
          label: "Steps to Reproduce",
          isRequired: true,
          placeholder: "1. Go to...\n2. Click on...\n3. See error...",
          rows: 5
        },
        {
          id: createFieldId(),
          type: "textarea",
          label: "Expected Behavior",
          isRequired: true,
          placeholder: "What should have happened?",
          rows: 3
        },
        {
          id: createFieldId(),
          type: "textarea",
          label: "Actual Behavior",
          isRequired: true,
          placeholder: "What actually happened?",
          rows: 3
        },
        {
          id: createFieldId(),
          type: "text",
          label: "Browser/Device",
          isRequired: false,
          placeholder: "Chrome 120, iPhone 14, etc."
        },
        {
          id: createFieldId(),
          type: "file",
          label: "Screenshots",
          isRequired: false,
          allowedFileTypes: [".png", ".jpg", ".gif"],
          maxFileSizeMB: 10
        }
      ]
    }],
    status: "draft",
    version: 1,
    createdAt: now,
    updatedAt: now
  })
};