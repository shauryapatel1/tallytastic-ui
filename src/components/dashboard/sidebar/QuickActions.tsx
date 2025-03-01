
import { Link } from "react-router-dom";
import { Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps {
  isCollapsed: boolean;
}

export function QuickActions({ isCollapsed }: QuickActionsProps) {
  const { toast } = useToast();

  const handleNavigation = (href: string) => {
    if (href === "/dashboard/forms/ai") {
      toast({
        title: "AI Assistant",
        description: "This feature is coming soon!",
      });
      return false;
    }
    return true;
  };

  return (
    <div className="px-3 py-2">
      <h4 className={cn(
        "text-xs uppercase text-gray-500 font-semibold mb-2",
        isCollapsed && "text-center"
      )}>
        {!isCollapsed && "Quick Actions"}
      </h4>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "flex flex-col items-center justify-center h-20 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all",
            isCollapsed && "col-span-2"
          )}
          asChild
        >
          <Link to="/dashboard/forms/new">
            <Sparkles className="h-5 w-5 mb-1" />
            {!isCollapsed && <span className="text-xs">New Form</span>}
          </Link>
        </Button>
        
        {!isCollapsed && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex flex-col items-center justify-center h-20 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all"
            onClick={() => {
              toast({
                title: "AI Assistant",
                description: "This feature is coming soon!",
              });
            }}
          >
            <Zap className="h-5 w-5 mb-1" />
            <span className="text-xs">AI Help</span>
          </Button>
        )}
      </div>
    </div>
  );
}
