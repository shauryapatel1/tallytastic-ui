import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import FormsApi from "@/lib/api/forms";
import { BarChart3, Users, Clock, TrendingUp, Eye, Target, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ContextType {
  formData: any;
  navigationState: any;
}

export default function AnalyzeStep() {
  const { formData } = useOutletContext<ContextType>();

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['form-analytics', formData.id],
    queryFn: () => FormsApi.getAnalyticsSummary(formData.id),
    enabled: formData.status === 'published'
  });

  if (formData.status !== 'published') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics & Insights
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Publish your form to start collecting analytics data.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Analytics Not Available
            </CardTitle>
            <CardDescription>
              Your form needs to be published to collect analytics data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">
                Publish your form to start tracking views, submissions, and user behavior.
              </p>
              <Badge variant="outline">Draft</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics & Insights
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Track how your form is performing and understand user behavior.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics & Insights
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Unable to load analytics data at this time.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Failed to load analytics data. Please try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completionRate = analytics?.completionRate || 0;
  const avgTimeMinutes = analytics?.avgTime ? Math.round(analytics.avgTime / 60) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics & Insights
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Track how your form is performing and understand user behavior.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.views || 0}</div>
            <p className="text-xs text-muted-foreground">
              People who viewed your form
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Form Starts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.starts || 0}</div>
            <p className="text-xs text-muted-foreground">
              People who started filling the form
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.completes || 0}</div>
            <p className="text-xs text-muted-foreground">
              Successfully submitted forms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgTimeMinutes ? `${avgTimeMinutes}m` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average completion time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Completion Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Completion Rate
          </CardTitle>
          <CardDescription>
            Percentage of users who complete your form after starting it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Completion Rate</span>
            <span className="text-sm text-muted-foreground">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
          <div className="text-sm text-muted-foreground">
            {analytics?.starts || 0} started, {analytics?.completes || 0} completed
          </div>
        </CardContent>
      </Card>

      {/* Drop-off Points */}
      {analytics?.dropOffPoints && analytics.dropOffPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Drop-off Analysis</CardTitle>
            <CardDescription>
              Fields where users commonly abandon your form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.dropOffPoints.map((point, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Field: {point.fieldId}</p>
                    <p className="text-sm text-gray-500">{point.dropOffs} abandonment(s)</p>
                  </div>
                  <Badge variant="outline">
                    {point.dropOffs} drops
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Form Health</h4>
                <p className="text-sm text-blue-700 mt-1">
                  {completionRate > 70 ? 'Excellent' : 
                   completionRate > 50 ? 'Good' : 
                   completionRate > 30 ? 'Fair' : 'Needs Improvement'}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  {completionRate > 70 
                    ? 'Your form is performing very well!' 
                    : 'Consider optimizing fields that cause drop-offs'
                  }
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">Engagement</h4>
                <p className="text-sm text-green-700 mt-1">
                  {analytics?.views > 0 ? 'Active' : 'No Activity'}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  {analytics?.views > 0 
                    ? `${analytics.views} total views recorded`
                    : 'Share your form to start getting responses'
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}