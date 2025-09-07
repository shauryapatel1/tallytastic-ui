
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Form } from "@/lib/types";
import { FormResponse } from "@/lib/types";
import { Circle } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'form_created' | 'form_published' | 'form_response';
  timestamp: string;
  data: {
    formId?: string;
    formTitle?: string;
    responseId?: string;
  };
}

interface ActivityFeedProps {
  forms?: Form[];
  responses?: FormResponse[];
  isLoading?: boolean;
}

export function ActivityFeed({ forms = [], responses = [], isLoading = false }: ActivityFeedProps) {
  // Create activity items from forms and responses
  const activities: ActivityItem[] = [
    // Form creations
    ...forms.map(form => ({
      id: `form-created-${form.id}`,
      type: 'form_created' as const,
      timestamp: form.created_at,
      data: {
        formId: form.id,
        formTitle: form.title
      }
    })),
    
    // Form publications (filter for published forms and assume they were published at update time)
    ...forms
      .filter(form => form.status === 'published')
      .map(form => ({
        id: `form-published-${form.id}`,
        type: 'form_published' as const,
        timestamp: form.updated_at,
        data: {
          formId: form.id,
          formTitle: form.title
        }
      })),
    
    // Form responses
    ...responses.map(response => {
      // Find the form for this response
      const relatedForm = forms.find(form => form.id === response.form_id);
      
      return {
        id: `form-response-${response.id}`,
        type: 'form_response' as const,
        timestamp: response.submitted_at,
        data: {
          formId: response.form_id,
          formTitle: relatedForm?.title || "Unknown Form",
          responseId: response.id
        }
      };
    })
  ];
  
  // Sort activities by timestamp (most recent first)
  const sortedActivities = activities.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  
  // Take only the 10 most recent activities
  const recentActivities = sortedActivities.slice(0, 10);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-3">
                <ActivityIcon type={activity.type} />
                <div>
                  <p className="text-sm">
                    <ActivityMessage activity={activity} />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        )}
      </CardContent>
    </Card>
  );
}

function ActivityIcon({ type }: { type: ActivityItem['type'] }) {
  const colors = {
    form_created: "text-blue-500",
    form_published: "text-green-500",
    form_response: "text-amber-500"
  };
  
  return <Circle className={`h-2 w-2 mt-1.5 ${colors[type]}`} />;
}

function ActivityMessage({ activity }: { activity: ActivityItem }) {
  const formTitle = activity.data.formTitle || "a form";
  
  switch (activity.type) {
    case 'form_created':
      return <span>You created <strong>{formTitle}</strong></span>;
    case 'form_published':
      return <span>You published <strong>{formTitle}</strong></span>;
    case 'form_response':
      return <span>New submission for <strong>{formTitle}</strong></span>;
    default:
      return <span>Unknown activity</span>;
  }
}
