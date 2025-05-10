
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PredictiveAnalytics as PredictiveAnalyticsType } from "@/lib/types";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { ArrowUp, ArrowDown, Clock } from "lucide-react";

interface PredictiveAnalyticsProps {
  formId: string;
}

export function PredictiveAnalytics({ formId }: PredictiveAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<string>("trends");
  
  // Mock data for demonstration
  const mockData: PredictiveAnalyticsType = {
    submissionTrends: {
      daily: [12, 15, 10, 14, 20, 25, 18],
      weekly: [65, 72, 85, 93, 87],
      monthly: [220, 310, 290, 350],
      forecast: [18, 22, 25, 30, 28, 32, 35]
    },
    conversionOptimization: {
      currentRate: 0.35,
      suggestions: [
        "Add progress indicator to multi-step form",
        "Reduce number of required fields",
        "Add social proof elements near submit button",
        "Improve form error handling with inline validation"
      ],
      predictedImprovement: 0.12
    },
    timingRecommendations: {
      bestDaysToPublish: ["Tuesday", "Wednesday", "Thursday"],
      bestTimesToPublish: ["10:00 AM", "2:00 PM", "7:00 PM"]
    },
    audienceInsights: {
      segments: [
        {
          name: "Mobile Users",
          size: 0.64,
          conversionRate: 0.28,
          averageTimeSpent: 95
        },
        {
          name: "Desktop Users",
          size: 0.36,
          conversionRate: 0.42,
          averageTimeSpent: 120
        },
        {
          name: "First-time Visitors",
          size: 0.55,
          conversionRate: 0.25,
          averageTimeSpent: 85
        },
        {
          name: "Returning Visitors",
          size: 0.45,
          conversionRate: 0.48,
          averageTimeSpent: 130
        }
      ]
    }
  };
  
  const generateTrendData = () => {
    // Generate daily data for the past week and forecast for the next week
    const today = new Date();
    const dailyData = [];
    
    // Past data (7 days)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dailyData.push({
        date: date.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }),
        submissions: mockData.submissionTrends.daily[6-i],
        type: "actual"
      });
    }
    
    // Forecast data (7 days)
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dailyData.push({
        date: date.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }),
        submissions: mockData.submissionTrends.forecast[i-1],
        type: "forecast"
      });
    }
    
    return dailyData;
  };
  
  const trendData = generateTrendData();
  
  const conversionData = [
    { name: "Current", rate: mockData.conversionOptimization.currentRate * 100 },
    { name: "Predicted", rate: (mockData.conversionOptimization.currentRate + mockData.conversionOptimization.predictedImprovement) * 100 }
  ];
  
  const audienceData = mockData.audienceInsights.segments.map(segment => ({
    name: segment.name,
    conversionRate: segment.conversionRate * 100,
    size: segment.size * 100,
    timeSpent: segment.averageTimeSpent
  }));
  
  const renderTrendChart = () => {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Submission Trends & Forecast</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: any) => [value, 'Submissions']} 
                  labelFormatter={(label: any) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="submissions" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Submissions"
                  connectNulls
                />
                {trendData.findIndex(item => item.type === "forecast") > -1 && (
                  <Line 
                    type="monotone" 
                    dataKey="submissions" 
                    stroke="#82ca9d"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Forecast"
                    connectNulls
                    data={trendData.filter(item => item.type === "forecast")}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm">This Week</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="flex items-end gap-2">
                <span className="text-2xl font-semibold">
                  {mockData.submissionTrends.daily.reduce((a, b) => a + b, 0)}
                </span>
                <span className="text-xs text-green-600 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  12%
                </span>
              </div>
              <p className="text-xs text-gray-500">vs. last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm">This Month</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="flex items-end gap-2">
                <span className="text-2xl font-semibold">
                  {mockData.submissionTrends.weekly.reduce((a, b) => a + b, 0)}
                </span>
                <span className="text-xs text-green-600 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  8%
                </span>
              </div>
              <p className="text-xs text-gray-500">vs. last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm">Projected</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="flex items-end gap-2">
                <span className="text-2xl font-semibold">
                  {mockData.submissionTrends.forecast.reduce((a, b) => a + b, 0)}
                </span>
                <span className="text-xs text-green-600 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  15%
                </span>
              </div>
              <p className="text-xs text-gray-500">next 7 days</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderConversionOptimization = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium mb-2">Conversion Rate Improvement</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Conversion Rate']} />
                  <Bar dataKey="rate" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <div className="bg-indigo-50 rounded-md p-4 h-full">
              <h3 className="text-sm font-medium mb-2">Potential Improvement</h3>
              <div className="flex items-end mb-4">
                <span className="text-3xl font-bold text-indigo-600">
                  +{(mockData.conversionOptimization.predictedImprovement * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Implementing the suggested optimizations could increase your conversion rate from
                <span className="font-medium"> {(mockData.conversionOptimization.currentRate * 100).toFixed(1)}%</span> to
                <span className="font-medium"> {((mockData.conversionOptimization.currentRate + mockData.conversionOptimization.predictedImprovement) * 100).toFixed(1)}%</span>.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Suggested Optimizations</h3>
          <div className="space-y-2">
            {mockData.conversionOptimization.suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="bg-indigo-100 rounded-full p-1 mr-3 mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12L11 15L16 9" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="#6366F1" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm">{suggestion}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-green-600 font-medium flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      Est. {Math.round(Math.random() * 10) + 2}% improvement
                    </span>
                    <span className="text-xs text-gray-400 mx-2">•</span>
                    <Badge variant="outline" className="text-xs">
                      {['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)]} to implement
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const renderTimingRecommendations = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-base">Best Days to Publish</CardTitle>
              <CardDescription>Based on historical form performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {mockData.timingRecommendations.bestDaysToPublish.map((day, index) => (
                  <div key={day} className="flex items-center">
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center mr-3 ${
                      index === 0 ? 'bg-indigo-500 text-white' :
                      index === 1 ? 'bg-indigo-400 text-white' :
                      'bg-indigo-300 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{day}</p>
                      <p className="text-xs text-gray-500">
                        {index === 0 ? 'Best performance' :
                         index === 1 ? 'High engagement' :
                         'Good conversion rate'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-base">Best Times to Publish</CardTitle>
              <CardDescription>Optimal hours for form engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {mockData.timingRecommendations.bestTimesToPublish.map((time, index) => (
                  <div key={time} className="flex items-center">
                    <div className="rounded-full w-8 h-8 flex items-center justify-center mr-3 bg-blue-100 text-blue-600">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{time}</p>
                      <p className="text-xs text-gray-500">
                        {index === 0 ? 'Morning peak • +42% submissions' :
                         index === 1 ? 'Afternoon peak • +35% submissions' :
                         'Evening peak • +28% submissions'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-gray-50 rounded-md p-4">
          <h3 className="text-sm font-medium mb-2">Seasonal Insights</h3>
          <p className="text-sm text-gray-600">
            Your form typically sees higher engagement at the beginning of the month and at the end of quarters. Consider planning major form updates or promotions around these times.
          </p>
        </div>
      </div>
    );
  };
  
  const renderAudienceInsights = () => {
    return (
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Segment</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Size</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Conversion Rate</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Avg. Time Spent</th>
              </tr>
            </thead>
            <tbody>
              {mockData.audienceInsights.segments.map((segment, index) => (
                <tr key={segment.name} className="border-b border-gray-200">
                  <td className="px-4 py-3 text-sm">{segment.name}</td>
                  <td className="px-4 py-3 text-sm">{(segment.size * 100).toFixed(0)}%</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{(segment.conversionRate * 100).toFixed(1)}%</span>
                      {segment.conversionRate > 0.3 ? (
                        <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 text-xs">
                          Above avg
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-xs">
                          Below avg
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{segment.averageTimeSpent}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-3">Segment Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={audienceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="conversionRate" name="Conversion Rate (%)" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="timeSpent" name="Time Spent (s)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Key Insight</h3>
            <p className="text-sm">
              <span className="font-medium">Desktop users</span> spend <span className="font-medium">26% more time</span> on your form and have a <span className="font-medium">50% higher</span> conversion rate than mobile users, yet they only make up 36% of your audience.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Recommendation</h3>
            <p className="text-sm">
              Consider optimizing the mobile experience to increase conversion rates for the 64% of users accessing your form on mobile devices.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive Analytics</CardTitle>
        <CardDescription>
          AI-powered insights and predictions for your forms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="trends">Submission Trends</TabsTrigger>
            <TabsTrigger value="conversion">Conversion Optimization</TabsTrigger>
            <TabsTrigger value="timing">Timing Recommendations</TabsTrigger>
            <TabsTrigger value="audience">Audience Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="space-y-4">
            {renderTrendChart()}
          </TabsContent>
          
          <TabsContent value="conversion" className="space-y-4">
            {renderConversionOptimization()}
          </TabsContent>
          
          <TabsContent value="timing" className="space-y-4">
            {renderTimingRecommendations()}
          </TabsContent>
          
          <TabsContent value="audience" className="space-y-4">
            {renderAudienceInsights()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
