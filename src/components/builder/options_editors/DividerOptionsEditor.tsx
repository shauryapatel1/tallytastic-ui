// In src/components/builder/options_editors/DividerOptionsEditor.tsx
// import type { FormFieldDefinition } from '@/types/forms';

export interface DividerOptionsEditorProps {
  // field?: FormFieldDefinition; // Optional, if we want to pass it for future use or consistency
}

export function DividerOptionsEditor({ /* field */ }: DividerOptionsEditorProps) {
  return (
    <div className="p-1"> {/* Added small padding for inset feel */}
      <p className="text-sm text-muted-foreground italic">
        This is a visual divider. It currently has no specific options beyond its visibility and label (if used for accessibility), which are managed in the general properties section.
      </p>
      {/* Future considerations could include:
        - Margin top/bottom
        - Thickness
        - Style (solid, dashed, dotted)
        - Color
        For now, these would be handled by advanced custom CSS if available, or not at all.
      */}
    </div>
  );
} 