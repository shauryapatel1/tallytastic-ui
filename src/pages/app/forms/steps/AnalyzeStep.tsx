import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { responseService } from "@/lib/formService";
import { BarChart3, Download, Eye, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface ContextType {
  formData: any;
  navigationState: any;
}

export default function AnalyzeStep() {
  const { formData } = useOutletContext<ContextType>();
  
  const { data: responses } = useQuery({
    queryKey: ['responses', formData.id],
    queryFn: () => responseService.getFormResponses(formData.id),
    enabled: !!formData.id
  });

  const isPublished = formData?.status === 'published';
  const responseCount = responses?.length || 0;
  
  // Calculate basic analytics
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentResponses = responses?.filter(r => 
    new Date(r.submittedAt) >= lastWeek
  ) || [];

  if (!isPublished) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics & Insights
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            View response data and form performance metrics.
          </p>
        </div>

        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Analytics Available
          </h3>
          <p className="text-gray-500 mb-4">
            Publish your form to start collecting responses and view analytics.
          </p>
          <Badge variant="secondary">Form Not Published</Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics & Insights
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Track form performance and response data.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/dashboard/forms/${formData.id}/responses`}>
              <Eye className="w-4 h-4 mr-2" />
              View All Responses
            </Link>
          </Button>
          <Button variant="outline" size="sm" disabled={responseCount === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responseCount}</div>
            <p className="text-xs text-muted-foreground">
              All time submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentResponses.length}</div>
            <p className="text-xs text-muted-foreground">
              New responses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Form Status</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Live</div>
            <p className="text-xs text-muted-foreground">
              Accepting responses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {responseCount === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No responses yet</p>
              <p className="text-sm">Share your form to start collecting responses</p>
            </div>
          ) : (
            <div className="space-y-3">
              {responses?.slice(0, 5).map((response) => (
                <div key={response.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">New response</p>
                    <p className="text-xs text-gray-500">
                      {new Date(response.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Submitted
                  </Badge>
                </div>
              ))}
              
              {responseCount > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/dashboard/forms/${formData.id}/responses`}>
                      View All {responseCount} Responses
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-gray-500">
          <span className="text-green-600">✓ Analytics are being tracked</span>
        </div>
        
        <Button variant="outline" asChild>
          <Link to={`/dashboard/forms/${formData.id}/responses`}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Full Analytics
          </Link>
        </Button>
      </div>
    </div>
  );
}