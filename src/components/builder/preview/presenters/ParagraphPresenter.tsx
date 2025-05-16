import type { FormFieldDefinition, FormFieldStyleOptions, FormFieldType } from "@/types/forms";
import { cn } from "@/lib/utils";

export interface ParagraphPresenterProps {
  field: FormFieldDefinition & { type: Extract<FormFieldType, 'paragraph'>; content?: string };
}

// Helper to get Tailwind width class from styleOptions (can be shared if moved to a utils file)
const getWidthClass = (width: FormFieldStyleOptions['width']) => {
  switch (width) {
    case '1/2': return 'w-1/2';
    case '1/3': return 'w-1/3';
    case '2/3': return 'w-2/3';
    case 'auto': return 'w-auto';
    case 'full':
    default: return 'w-full';
  }
};

export function ParagraphPresenter({ field }: ParagraphPresenterProps) {
  const {
    content,
    styleOptions = { labelIsVisible: true }, // Default though labelIsVisible not directly used for content here
  } = field;

  const widthClass = getWidthClass(styleOptions.width);

  const containerStyles: React.CSSProperties = {
    backgroundColor: styleOptions.containerBackgroundColor,
    borderColor: styleOptions.containerBorderColor,
    padding: styleOptions.containerPadding,
    borderWidth: styleOptions.containerBorderColor ? '1px' : '0',
    borderStyle: styleOptions.containerBorderColor ? 'solid' : 'none',
  };

  const textStyles: React.CSSProperties = {
    color: styleOptions.inputTextColor, // Using inputTextColor for paragraph content as per spec
  };

  // Render an empty styled div if content is empty, to still show the container styles if any.
  // Alternatively, could return null if !content to render nothing.
  // For preview, showing the styled block even if empty might be useful.

  return (
    <div
      className={cn("flex flex-col", widthClass)} // flex-col for consistency
      style={containerStyles}
    >
      <p 
        style={textStyles} 
        className="text-sm whitespace-pre-wrap break-words" // Added break-words
      >
        {content || ""} {/* Render content or empty string if undefined */}
        {/* V1: Plain text rendering. Future: HTML/Markdown parsing */}
      </p>
      {/* field.label and field.description are not typically rendered for 'paragraph' type directly */}
    </div>
  );
} 