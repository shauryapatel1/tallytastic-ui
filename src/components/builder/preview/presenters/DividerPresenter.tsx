import type { FormFieldDefinition, FormFieldStyleOptions, FormFieldType } from "@/types/forms";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export interface DividerPresenterProps {
  field: FormFieldDefinition & { type: Extract<FormFieldType, 'divider'> };
}

// Helper to get Tailwind width class from styleOptions (can be shared if moved to a utils file)
const getWidthClass = (width: FormFieldStyleOptions['width']) => {
  switch (width) {
    case '1/2': return 'w-1/2';
    case '1/3': return 'w-1/3';
    case '2/3': return 'w-2/3';
    case 'auto': return 'w-auto'; // w-auto might need items-center on parent to actually center
    case 'full':
    default: return 'w-full';
  }
};

export function DividerPresenter({ field }: DividerPresenterProps) {
  const { styleOptions = {} } = field;

  const widthClass = getWidthClass(styleOptions.width);

  // For V1, containerPadding will be represented by a fixed vertical margin (e.g., my-4).
  // If styleOptions.containerPadding is intended to hold Tailwind margin classes like "my-2" or "py-4",
  // it could be directly included in the className: cn("flex items-center", widthClass, styleOptions.containerPadding || "my-4")
  // For now, let's use a sensible default like "my-4" (which gives margin top and bottom).
  const marginClass = "my-4"; 

  return (
    <div
      className={cn(
        "flex", // Using flex to help with alignment if width is not full
        widthClass,
        marginClass,
        styleOptions.width !== 'full' && styleOptions.width !== undefined ? "justify-center" : ""
      )}
      // Inline styles for container background/border are less relevant for a divider,
      // but applying them for completeness if ever needed.
      style={{
        backgroundColor: styleOptions.containerBackgroundColor, 
        // borderColor: styleOptions.containerBorderColor, // This would be for the container, not the line
        // padding: styleOptions.containerPadding, // Using marginClass instead for spacing
      }}
    >
      <Separator 
        className={cn(
            (styleOptions.width === 'full' || !styleOptions.width || styleOptions.width === 'auto') 
                ? 'w-full' // If container is full or auto, separator itself should be full width of its immediate parent
                : 'flex-grow', // If container has a specific fractional width, separator should grow within it.
                               // This might be tricky with justify-center on parent. `w-full` might be better here too.
                               // Let's simplify: separator should generally try to be w-full of its container.
            "w-full" // Overriding previous logic for simplicity: Separator is always full width of its direct container.
        )}
        // To apply styleOptions.containerBorderColor to the separator line color:
        // style={{ borderColor: styleOptions.containerBorderColor }} 
        // However, Separator uses its own theme-based border color. For V1, we accept default.
      />
    </div>
  );
} 