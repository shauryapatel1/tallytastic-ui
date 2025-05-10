
import { useState } from "react";
import { DashboardLayout } from "./Layout";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ArrowUpRight, Users, ArrowDownIcon, Calendar, ChevronDownIcon } from "lucide-react";

// Mock data for analytics
const getAnalyticsData = async (period = "7d") => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate daily data for the past period
  const days = period === "30d" ? 30 : period === "90d" ? 90 : 7;
  const dailyData = [];
  
  // Current date
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random data values that increase over time to show growth
    const baseline = days - i;
    const submissions = Math.floor(baseline * 1.5 + Math.random() * baseline);
    const views = submissions + Math.floor(Math.random() * baseline * 3);
    const conversionRate = (submissions / views) * 100;
    
    dailyData.push({
      date: date.toISOString().split('T')[0],
      views,
      submissions,
      conversionRate: parseFloat(conversionRate.toFixed(1))
    });
  }
  
  // Calculate summary statistics
  const totalViews = dailyData.reduce((sum, day) => sum + day.views, 0);
  const totalSubmissions = dailyData.reduce((sum, day) => sum + day.submissions, 0);
  const avgConversionRate = parseFloat(((totalSubmissions / totalViews) * 100).toFixed(1));
  
  // Calculate growth (comparing first half vs second half of period)
  const halfIndex = Math.floor(days / 2);
  const firstHalfSubmissions = dailyData.slice(0, halfIndex).reduce((sum, day) => sum + day.submissions, 0);
  const secondHalfSubmissions = dailyData.slice(halfIndex).reduce((sum, day) => sum + day.submissions, 0);
  const submissionsGrowth = firstHalfSubmissions === 0 
    ? 100 
    : parseFloat((((secondHalfSubmissions - firstHalfSubmissions) / firstHalfSubmissions) * 100).toFixed(1));
  
  // Calculate most active form (just mock data)
  const topForms = [
    { id: "form1", name: "Contact Form", submissions: Math.floor(totalSubmissions * 0.4) },
    { id: "form2", name: "Feedback Survey", submissions: Math.floor(totalSubmissions * 0.3) },
    { id: "form3", name: "Event Registration", submissions: Math.floor(totalSubmissions * 0.2) },
    { id: "form4", name: "Newsletter Signup", submissions: totalSubmissions - Math.floor(totalSubmissions * 0.9) },
  ];
  
  // Calculate most active times (just mock data)
  const timeData = [
    { time: "00:00 - 04:00", submissions: Math.floor(totalSubmissions * 0.05) },
    { time: "04:00 - 08:00", submissions: Math.floor(totalSubmissions * 0.1) },
    { time: "08:00 - 12:00", submissions: Math.floor(totalSubmissions * 0.35) },
    { time: "12:00 - 16:00", submissions: Math.floor(totalSubmissions * 0.25) },
    { time: "16:00 - 20:00", submissions: Math.floor(totalSubmissions * 0.2) },
    { time: "20:00 - 24:00", submissions: totalSubmissions - Math.floor(totalSubmissions * 0.95) },
  ];
  
  return {
    summary: {
      views: totalViews,
      submissions: totalSubmissions,
      conversionRate: avgConversionRate,
      submissionsGrowth
    },
    dailyData,
    topForms,
    timeData
  };
};

export default function Analytics() {
  const { toast } = useToast();
  const [period, setPeriod] = useState("7d");
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["analytics", period],
    queryFn: () => getAnalyticsData(period),
  });

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };

  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Your analytics report is being prepared for download.",
    });
    // In a real app, this would trigger a download
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Track performance and get insights from your forms.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select defaultValue={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-[160px]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <SelectValue placeholder="Select period" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={handleExport}>Export</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="hover:shadow-md transition-all">
                <CardHeader className="h-24 animate-pulse bg-muted"></CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Views</CardDescription>
                  <div className="flex items-end justify-between">
                    <CardTitle className="text-2xl">{data?.summary.views.toLocaleString()}</CardTitle>
                    <div className="text-muted-foreground text-xs font-medium">
                      In the last {period === '7d' ? '7 days' : period === '30d' ? '30 days' : '90 days'}
                    </div>
                  </div>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Submissions</CardDescription>
                  <div className="flex items-end justify-between">
                    <CardTitle className="text-2xl">{data?.summary.submissions.toLocaleString()}</CardTitle>
                    <div className={`flex items-center text-xs font-medium ${data?.summary.submissionsGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data?.summary.submissionsGrowth > 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(data?.summary.submissionsGrowth || 0)}%
                    </div>
                  </div>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Conversion Rate</CardDescription>
                  <div className="flex items-end justify-between">
                    <CardTitle className="text-2xl">{data?.summary.conversionRate}%</CardTitle>
                    <div className="text-muted-foreground text-xs font-medium">
                      Submissions / Views
                    </div>
                  </div>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Top Form</CardDescription>
                  <div className="flex items-end justify-between">
                    <CardTitle className="text-lg truncate">{data?.topForms[0].name}</CardTitle>
                    <div className="text-muted-foreground text-xs font-medium">
                      {data?.topForms[0].submissions.toLocaleString()} submissions
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="forms">Form Performance</TabsTrigger>
                <TabsTrigger value="time">Time Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Submissions Over Time</CardTitle>
                    <CardDescription>Daily form submission activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={data?.dailyData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="submissions"
                            name="Submissions"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                          />
                          <Line type="monotone" dataKey="views" name="Views" stroke="#82ca9d" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Rate Trend</CardTitle>
                    <CardDescription>Daily form conversion rate (Submissions/Views)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={data?.dailyData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="conversionRate"
                            name="Conversion Rate (%)"
                            stroke="#ff7300"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="forms" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Form Performance</CardTitle>
                    <CardDescription>Submissions by form</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data?.topForms}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="submissions" name="Submissions" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="time" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Submission Time Analysis</CardTitle>
                    <CardDescription>When your forms are submitted</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data?.timeData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="submissions" name="Submissions" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
