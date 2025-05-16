import type { FormFieldDefinition, FormFieldStyleOptions, FormFieldType } from "@/types/forms";
import { cn } from "@/lib/utils";

interface HeadingPresenterProps {
  field: FormFieldDefinition & { type: Extract<FormFieldType, 'heading'> };
}

// Helper to get Tailwind width class from styleOptions
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

export function HeadingPresenter({ field }: HeadingPresenterProps) {
  const {
    label, // For heading, label is the content
    level = 2, // Default to <h2> if level is not specified
    styleOptions = { labelIsVisible: true }, // Though labelIsVisible is less relevant here, keep for consistency
  } = field;

  const widthClass = getWidthClass(styleOptions.width);

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  // Define base classes for headings, can be customized further or moved to a theme
  const headingSizeClasses = {
    1: "text-3xl font-bold",
    2: "text-2xl font-semibold",
    3: "text-xl font-semibold",
    4: "text-lg font-medium",
    5: "text-base font-medium",
    6: "text-sm font-medium",
  };

  return (
    <div
      className={cn("flex flex-col", widthClass)} // Use flex-col for consistency, though heading is simple
      style={{
        backgroundColor: styleOptions.containerBackgroundColor,
        borderColor: styleOptions.containerBorderColor,
        padding: styleOptions.containerPadding,
        borderWidth: styleOptions.containerBorderColor ? '1px' : '0',
        borderStyle: styleOptions.containerBorderColor ? 'solid' : 'none',
      }}
    >
      <HeadingTag 
        className={cn(
            "break-words", // Ensure long headings wrap
            headingSizeClasses[level as keyof typeof headingSizeClasses], 
            // Apply text color if specified, otherwise it inherits
          )}
        style={{ color: styleOptions.labelTextColor }} // Using labelTextColor for heading text color
      >
        {label}
      </HeadingTag>
      {/* Description is typically not shown for a heading element itself, but if needed: */}
      {/* {field.description && <p className="text-xs text-muted-foreground mt-1">{field.description}</p>} */}
    </div>
  );
} 