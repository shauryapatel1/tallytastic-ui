
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Tag, AlertTriangle } from "lucide-react";
import { FormResponse, ResponseAnalysis, SentimentAnalysis } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

interface ResponseIntelligenceProps {
  formId: string;
  isLoading?: boolean;
}

export function ResponseIntelligence({ formId, isLoading = false }: ResponseIntelligenceProps) {
  const [activeTab, setActiveTab] = useState<string>("sentiment");
  
  // Mocked responses for demonstration
  const mockResponses: FormResponse[] = [
    {
      id: "resp1",
      form_id: formId,
      submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      data: {
        name: "John Doe",
        email: "john@example.com",
        feedback: "I absolutely love your product! It's been a game changer for my workflow."
      },
      metadata: {
        browser: "Chrome",
        device: "Desktop",
        location: "New York, USA",
        timeSpent: 145,
        completionRate: 100
      },
      analysis: {
        sentiment: {
          score: 0.8,
          label: "positive",
          confidence: 0.9
        },
        categories: ["Product Feedback", "Positive Experience"],
        isAnomaly: false,
        tags: ["Enthusiastic", "Feature Lover"]
      }
    },
    {
      id: "resp2",
      form_id: formId,
      submitted_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      data: {
        name: "Jane Smith",
        email: "jane@example.com",
        feedback: "The interface is confusing and I couldn't figure out how to save my progress."
      },
      metadata: {
        browser: "Safari",
        device: "Mobile",
        location: "London, UK",
        timeSpent: 210,
        completionRate: 100
      },
      analysis: {
        sentiment: {
          score: -0.5,
          label: "negative",
          confidence: 0.8
        },
        categories: ["UI/UX Issues", "Usability Problems"],
        isAnomaly: false,
        tags: ["Confused", "Navigation Issues"]
      }
    },
    {
      id: "resp3",
      form_id: formId,
      submitted_at: new Date().toISOString(),
      data: {
        name: "Carlos Rodriguez",
        email: "carlos@example.com",
        feedback: "I think the product is okay. Some things work well, others need improvement."
      },
      metadata: {
        browser: "Firefox",
        device: "Tablet",
        location: "Madrid, Spain",
        timeSpent: 95,
        completionRate: 100
      },
      analysis: {
        sentiment: {
          score: 0.1,
          label: "neutral",
          confidence: 0.7
        },
        categories: ["General Feedback", "Mixed Opinion"],
        isAnomaly: false,
        tags: ["Balanced View", "Improvement Suggestions"]
      }
    },
    {
      id: "resp4",
      form_id: formId,
      submitted_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
      data: {
        name: "Unknown",
        email: "testtest@test.test",
        feedback: "asdflkjasldkfj asldkfj alskdfj alskdjf alskdjflaksdjflaksjdflkajsd flkajsd lkfja lsdkjf"
      },
      metadata: {
        browser: "Unknown",
        device: "Desktop",
        location: "Unknown",
        timeSpent: 3,
        completionRate: 100
      },
      analysis: {
        sentiment: {
          score: 0,
          label: "neutral",
          confidence: 0.5
        },
        categories: ["Spam"],
        isAnomaly: true,
        anomalyScore: 0.94,
        tags: ["Suspicious", "Bot"]
      }
    }
  ];
  
  const renderSentimentDistribution = () => {
    const positive = mockResponses.filter(r => r.analysis?.sentiment?.label === "positive").length;
    const neutral = mockResponses.filter(r => r.analysis?.sentiment?.label === "neutral").length;
    const negative = mockResponses.filter(r => r.analysis?.sentiment?.label === "negative").length;
    const total = positive + neutral + negative;
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Positive</span>
            </div>
            <span>{Math.round((positive / total) * 100)}%</span>
          </div>
          <Progress value={(positive / total) * 100} className="h-2 bg-gray-200" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
              <span>Neutral</span>
            </div>
            <span>{Math.round((neutral / total) * 100)}%</span>
          </div>
          <Progress value={(neutral / total) * 100} className="h-2 bg-gray-200" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Negative</span>
            </div>
            <span>{Math.round((negative / total) * 100)}%</span>
          </div>
          <Progress value={(negative / total) * 100} className="h-2 bg-gray-200" />
        </div>
      </div>
    );
  };
  
  const renderSentimentBadge = (sentiment: SentimentAnalysis | undefined) => {
    if (!sentiment) return null;
    
    const color = 
      sentiment.label === "positive" ? "bg-green-100 text-green-800 border-green-200" :
      sentiment.label === "negative" ? "bg-red-100 text-red-800 border-red-200" :
      "bg-gray-100 text-gray-800 border-gray-200";
      
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} border`}>
        {sentiment.label.charAt(0).toUpperCase() + sentiment.label.slice(1)}
      </span>
    );
  };
  
  const renderTagCloud = () => {
    // Extract and count all tags
    const tagCounts: Record<string, number> = {};
    mockResponses.forEach(response => {
      response.analysis?.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return (
      <div className="flex flex-wrap gap-2">
        {Object.entries(tagCounts).map(([tag, count]) => (
          <Badge key={tag} variant="outline" className="flex items-center gap-1">
            {tag}
            <span className="text-xs bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center ml-1">
              {count}
            </span>
          </Badge>
        ))}
      </div>
    );
  };
  
  const renderCategories = () => {
    // Extract and count all categories
    const categoryCounts: Record<string, number> = {};
    mockResponses.forEach(response => {
      response.analysis?.categories?.forEach(category => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
    });
    
    return (
      <div className="space-y-3">
        {Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).map(([category, count]) => (
          <div key={category} className="flex justify-between items-center">
            <span>{category}</span>
            <Progress value={(count / mockResponses.length) * 100} className="w-40 h-2" />
            <span className="text-sm text-gray-500">{count}</span>
          </div>
        ))}
      </div>
    );
  };
  
  const renderAnomalies = () => {
    const anomalies = mockResponses.filter(r => r.analysis?.isAnomaly);
    
    if (anomalies.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500">
          <div className="flex justify-center mb-2">
            <AlertTriangle className="h-10 w-10 text-gray-400" />
          </div>
          <p>No anomalies detected in the current responses.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {anomalies.map(anomaly => (
          <Card key={anomaly.id} className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-sm font-medium">Anomaly Detected</CardTitle>
                <Badge variant="outline" className="bg-yellow-100 border-yellow-200 text-yellow-800">
                  Score: {(anomaly.analysis?.anomalyScore || 0).toFixed(2)}
                </Badge>
              </div>
              <CardDescription>
                Submitted {new Date(anomaly.submitted_at).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="font-medium mb-1">Reason:</p>
                <p className="text-gray-600">
                  {anomaly.analysis?.categories?.includes("Spam") 
                    ? "This submission appears to be spam based on content patterns and submission behavior."
                    : "This submission has unusual patterns compared to other responses."}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm">
                Review
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                Mark as Spam
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Intelligence</CardTitle>
        <CardDescription>
          AI-powered insights from your form responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sentiment" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sentiment" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-3">Sentiment Distribution</h3>
              {renderSentimentDistribution()}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Recent Submissions</h3>
              <div className="space-y-3">
                {mockResponses
                  .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
                  .slice(0, 3)
                  .map(response => (
                    <div key={response.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{response.data.name}</p>
                          <p className="text-sm text-gray-500">{response.data.email}</p>
                        </div>
                        {renderSentimentBadge(response.analysis?.sentiment)}
                      </div>
                      <p className="mt-2 text-sm">"{response.data.feedback}"</p>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-4">Response Categories</h3>
              {renderCategories()}
            </div>
          </TabsContent>
          
          <TabsContent value="tags">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-medium">Response Tags</h3>
              </div>
              {renderTagCloud()}
            </div>
          </TabsContent>
          
          <TabsContent value="anomalies">
            {renderAnomalies()}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-gray-500">
          Based on {mockResponses.length} responses • Last updated {new Date().toLocaleString()}
        </div>
        <Button variant="outline" size="sm">
          Refresh Analysis
        </Button>
      </CardFooter>
    </Card>
  );
}
