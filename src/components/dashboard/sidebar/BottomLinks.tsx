import { Link } from "react-router-dom";
import { Home, HelpCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionStatus } from "./SubscriptionStatus";

interface BottomLinksProps {
  isCollapsed: boolean;
}

export function BottomLinks({ isCollapsed }: BottomLinksProps) {
  const { logout } = useAuth();
  const { toast } = useToast();

  return (
    <div className="mt-auto">
      {/* Subscription Status */}
      <SubscriptionStatus isCollapsed={isCollapsed} />
      
      {/* Navigation Links */}
      <div className="p-3 border-t">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start mb-1 px-2",
            isCollapsed && "justify-center"
          )}
          asChild
        >
          <Link to="/">
            <Home className={cn(
              "h-5 w-5", 
              isCollapsed ? "mr-0" : "mr-2",
              "text-gray-500 group-hover:text-indigo-600"
            )} />
            {!isCollapsed && "Home"}
          </Link>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start mb-1 px-2",
            isCollapsed && "justify-center"
          )}
          onClick={() => {
            toast({
              title: "Help Center",
              description: "The help documentation is coming soon!",
            });
          }}
        >
          <HelpCircle className={cn(
            "h-5 w-5", 
            isCollapsed ? "mr-0" : "mr-2"
          )} />
          {!isCollapsed && "Help"}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start mb-1 px-2 text-red-500 hover:text-red-600 hover:bg-red-50",
            isCollapsed && "justify-center"
          )}
          onClick={() => logout()}
        >
          <LogOut className={cn(
            "h-5 w-5", 
            isCollapsed ? "mr-0" : "mr-2"
          )} />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
}
