
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { Link } from "react-router-dom";

interface FormSettingsHeaderProps {
  title: string;
  isSaving: boolean;
  onSave: () => void;
  formId: string;
}

export function FormSettingsHeader({ title, isSaving, onSave, formId }: FormSettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="text-slate-600 dark:text-slate-300">
          <Link to={`/dashboard/forms/${formId}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Editor
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Form settings and configuration</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isSaving ? (
          <Button disabled className="bg-indigo-500 hover:bg-indigo-600">
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
          </Button>
        ) : (
          <Button onClick={onSave} className="bg-indigo-500 hover:bg-indigo-600">
            <Save className="h-4 w-4 mr-2" /> Save Settings
          </Button>
        )}
      </div>
    </div>
  );
}
