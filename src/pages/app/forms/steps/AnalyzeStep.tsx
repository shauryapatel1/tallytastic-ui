import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import FormsApi from "@/lib/api/forms";
import { 
  BarChart3, Users, Clock, TrendingUp, TrendingDown, Eye, Target, 
  AlertCircle, ArrowUp, ArrowDown, Minus, PieChart, Activity
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, Tooltip, Legend, AreaChart, Area
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Analytics & Insights
          </h2>
          <p className="text-muted-foreground">
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
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">
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
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Analytics & Insights
          </h2>
          <p className="text-muted-foreground">
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
        
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Analytics & Insights
          </h2>
          <p className="text-muted-foreground">
            Unable to load analytics data at this time.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <p className="text-muted-foreground">
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
  const weeklyChange = analytics?.weeklyComparison?.percentageChange || 0;

  // Prepare chart data - last 14 days for cleaner display
  const trendData = (analytics?.dailyTrend || []).slice(-14).map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const chartConfig = {
    views: { label: "Views", color: "hsl(var(--primary))" },
    starts: { label: "Starts", color: "hsl(var(--secondary))" },
    completes: { label: "Completions", color: "hsl(142 76% 36%)" }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Analytics & Insights
        </h2>
        <p className="text-muted-foreground">
          Track how your form is performing and understand user behavior.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              Started filling the form
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
            <div className="flex items-center text-xs">
              {weeklyChange > 0 ? (
                <span className="text-green-600 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {weeklyChange}% vs last week
                </span>
              ) : weeklyChange < 0 ? (
                <span className="text-red-600 flex items-center">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  {Math.abs(weeklyChange)}% vs last week
                </span>
              ) : (
                <span className="text-muted-foreground flex items-center">
                  <Minus className="h-3 w-3 mr-1" />
                  No change
                </span>
              )}
            </div>
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

      {/* Submission Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Submission Trends
          </CardTitle>
          <CardDescription>
            Daily form activity over the last 14 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trendData.some(d => d.views > 0 || d.starts > 0 || d.completes > 0) ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompletes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                  name="Views"
                />
                <Area 
                  type="monotone" 
                  dataKey="completes" 
                  stroke="hsl(142 76% 36%)" 
                  fillOpacity={1} 
                  fill="url(#colorCompletes)" 
                  name="Completions"
                />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No activity data yet</p>
                <p className="text-sm">Share your form to start collecting data</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for different analytics views */}
      <Tabs defaultValue="completion" className="space-y-4">
        <TabsList>
          <TabsTrigger value="completion">Completion Rate</TabsTrigger>
          <TabsTrigger value="fields">Field Statistics</TabsTrigger>
          <TabsTrigger value="dropoff">Drop-off Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="completion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Completion Funnel
              </CardTitle>
              <CardDescription>
                Track how users progress through your form
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Completion Rate</span>
                <span className="text-2xl font-bold">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-3" />
              
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{analytics?.views || 0}</div>
                  <div className="text-sm text-muted-foreground">Views</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{analytics?.starts || 0}</div>
                  <div className="text-sm text-muted-foreground">Started</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{analytics?.completes || 0}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>

              {/* Weekly comparison */}
              {analytics?.weeklyComparison && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Weekly Performance</h4>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-lg font-bold">{analytics.weeklyComparison.thisWeek}</span>
                      <span className="text-sm text-muted-foreground ml-1">this week</span>
                    </div>
                    <div className="text-muted-foreground">vs</div>
                    <div>
                      <span className="text-lg font-bold">{analytics.weeklyComparison.lastWeek}</span>
                      <span className="text-sm text-muted-foreground ml-1">last week</span>
                    </div>
                    {weeklyChange !== 0 && (
                      <Badge variant={weeklyChange > 0 ? "default" : "destructive"}>
                        {weeklyChange > 0 ? '+' : ''}{weeklyChange}%
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Field-Level Statistics
              </CardTitle>
              <CardDescription>
                Response rates and value distribution per field
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.fieldStats && analytics.fieldStats.length > 0 ? (
                <div className="space-y-4">
                  {analytics.fieldStats.map((field) => (
                    <div key={field.fieldId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{field.fieldLabel}</h4>
                          <Badge variant="outline" className="text-xs">{field.fieldType}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{field.fillRate}%</div>
                          <div className="text-xs text-muted-foreground">fill rate</div>
                        </div>
                      </div>
                      <Progress value={field.fillRate} className="h-2 mb-2" />
                      <div className="text-xs text-muted-foreground">
                        {field.responseCount} of {analytics.completes} responses
                      </div>
                      
                      {/* Top values for choice fields */}
                      {field.topValues && field.topValues.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs font-medium text-muted-foreground mb-2">
                            Top responses:
                          </div>
                          <div className="space-y-1">
                            {field.topValues.map((v, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <span className="truncate flex-1">{v.value}</span>
                                <span className="text-muted-foreground ml-2">
                                  {v.count} ({v.percentage}%)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No field statistics available yet</p>
                  <p className="text-sm">Collect more responses to see field-level data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dropoff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Drop-off Analysis
              </CardTitle>
              <CardDescription>
                Identify where users abandon your form
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.dropOffPoints && analytics.dropOffPoints.length > 0 ? (
                <div className="space-y-3">
                  {analytics.dropOffPoints.map((point, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 bg-destructive/5 border border-destructive/20 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{point.fieldLabel}</p>
                        <p className="text-sm text-muted-foreground">
                          {point.dropOffs} user{point.dropOffs !== 1 ? 's' : ''} dropped off here
                        </p>
                      </div>
                      <Badge variant="destructive">
                        {point.dropOffs} drops
                      </Badge>
                    </div>
                  ))}
                  
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">💡 Tips to reduce drop-offs</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Simplify complex fields or break them into smaller steps</li>
                      <li>• Make optional fields clearly marked</li>
                      <li>• Add helpful placeholder text or descriptions</li>
                      <li>• Consider if all fields are truly necessary</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingDown className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No drop-off data recorded yet</p>
                  <p className="text-sm">
                    Drop-offs are tracked when users abandon the form at specific fields
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Peak Hours */}
          {analytics?.peakSubmissionHours && analytics.peakSubmissionHours.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Peak Submission Hours</CardTitle>
                <CardDescription>
                  When your form receives the most submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analytics.peakSubmissionHours.map((h) => (
                    <Badge key={h.hour} variant="secondary" className="text-sm">
                      {h.hour.toString().padStart(2, '0')}:00 - {h.count} submissions
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <h4 className="font-medium text-primary">Form Health</h4>
              <p className="text-sm mt-1">
                {completionRate > 70 ? 'Excellent' : 
                 completionRate > 50 ? 'Good' : 
                 completionRate > 30 ? 'Fair' : 'Needs Improvement'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {completionRate > 70 
                  ? 'Your form is performing very well!' 
                  : 'Consider optimizing fields that cause drop-offs'
                }
              </p>
            </div>
            
            <div className="p-4 bg-green-500/10 rounded-lg">
              <h4 className="font-medium text-green-700">Engagement</h4>
              <p className="text-sm mt-1">
                {analytics?.views && analytics.views > 0 ? 'Active' : 'No Activity'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {analytics?.views && analytics.views > 0 
                  ? `${analytics.views} total views recorded`
                  : 'Share your form to start getting responses'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
