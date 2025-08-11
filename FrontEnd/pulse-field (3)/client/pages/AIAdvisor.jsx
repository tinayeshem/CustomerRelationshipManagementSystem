import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Bot, 
  Lightbulb, 
  TrendingUp,
  Users,
  AlertTriangle,
  Calendar,
  MapPin,
  DollarSign,
  MessageCircle,
  Star,
  Zap,
  Target,
  Clock,
  BarChart3,
  TrendingDown,
  Activity,
  Eye
} from "lucide-react";

const aiInsights = [
  {
    id: 1,
    type: "contact",
    priority: "high",
    title: "Client Inactivity Alert",
    description: "Zagreb Municipality hasn't been contacted in 15 days. Historical data shows they respond well to Friday calls between 2-4 PM.",
    action: "Schedule follow-up call",
    client: "Zagreb Municipality",
    icon: Clock,
    color: "from-blue-500 to-blue-600",
    impact: "High revenue client - €45K contract"
  },
  {
    id: 2,
    type: "upsell",
    priority: "medium", 
    title: "Upselling Opportunity Detected",
    description: "Sports Club Dinamo has increased usage by 40% this quarter. Perfect timing for package upgrade discussion.",
    action: "Prepare upgrade proposal",
    client: "Sports Club Dinamo",
    icon: TrendingUp,
    color: "from-dark-blue to-blue-700",
    impact: "Potential 30% revenue increase"
  },
  {
    id: 3,
    type: "meeting",
    priority: "high",
    title: "Location-Based Meeting Optimization",
    description: "Split City Council and Rijeka Port Authority are 90km apart. Schedule consecutive meetings to optimize travel costs.",
    action: "Plan regional trip",
    client: "Multiple clients",
    icon: MapPin,
    color: "from-light-blue to-blue-500",
    impact: "Save €200 in travel costs"
  },
  {
    id: 4,
    type: "alert",
    priority: "urgent",
    title: "Support Frequency Spike",
    description: "Osijek Municipality submitted 5 tickets this week (300% above average). Potential system issue or training need.",
    action: "Investigate and respond",
    client: "Osijek Municipality",
    icon: AlertTriangle,
    color: "from-red-500 to-red-600",
    impact: "Risk of client dissatisfaction"
  },
  {
    id: 5,
    type: "lead",
    priority: "medium",
    title: "Similar Client Pattern Match",
    description: "Varaždin City profile matches 89% with Zagreb Municipality success pattern. High conversion probability.",
    action: "Initiate contact sequence",
    client: "Varaždin City",
    icon: Users,
    color: "from-green-500 to-green-600",
    impact: "Potential €30K new contract"
  },
  {
    id: 6,
    type: "forecast",
    priority: "medium",
    title: "Support Workload Projection",
    description: "AI predicts 25% increase in support tickets next month based on seasonal patterns and new client onboarding.",
    action: "Plan resource allocation",
    client: "Team Planning",
    icon: BarChart3,
    color: "from-purple-500 to-purple-600",
    impact: "Proactive capacity management"
  }
];

const quickActions = [
  { icon: Calendar, label: "Meetings to Schedule", count: "3", color: "bg-blue-600", metric: "This week" },
  { icon: Users, label: "Follow-up Required", count: "7", color: "bg-dark-blue", metric: "Overdue contacts" },
  { icon: TrendingUp, label: "Upsell Opportunities", count: "4", color: "bg-light-blue", metric: "Ready prospects" },
  { icon: Target, label: "New Lead Matches", count: "12", color: "bg-blue-500", metric: "High probability" }
];

const getPriorityColor = (priority) => {
  switch (priority) {
    case "urgent": return "bg-red-100 text-red-800 border-red-200";
    case "high": return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium": return "bg-blue-100 text-blue-800 border-blue-200";
    default: return "bg-green-100 text-green-800 border-green-200";
  }
};

export default function AIAdvisor() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Professional Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-dark-blue to-primary text-white shadow-xl">
              <Bot className="h-10 w-10" />
            </div>
            <div className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 rounded-full bg-light-blue">
              <Zap className="h-4 w-4 text-dark-blue" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-dark-blue mb-2">
          AI Advisor
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Intelligent business insights and proactive recommendations
        </p>
        
        {/* AI Chat Interface */}
        <Card className="max-w-md mx-auto border border-blue-200 bg-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-dark-blue">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <Input 
                placeholder="Ask me about your business insights..." 
                className="border-blue-200 focus:border-dark-blue"
              />
              <Button size="sm" className="bg-dark-blue hover:bg-dark-blue-hover text-white">
                <Zap className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card key={index} className="border border-blue-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mx-auto mb-3 text-white shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="font-semibold text-gray-700 text-sm">{action.label}</p>
                <p className="text-2xl font-bold text-dark-blue">{action.count}</p>
                <p className="text-xs text-gray-500 mt-1">{action.metric}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Insights Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Lightbulb className="h-6 w-6 text-blue-600 mr-2" />
            AI-Powered Business Insights
          </h2>
          <Badge className="bg-dark-blue text-white px-4 py-2">
            <Activity className="h-4 w-4 mr-1" />
            Live Analysis
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {aiInsights.map((insight) => {
            const Icon = insight.icon;
            return (
              <Card key={insight.id} className="border border-blue-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${insight.color}`} />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${insight.color} flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-800 leading-tight">
                          {insight.title}
                        </CardTitle>
                        <p className="text-sm text-blue-600 font-medium">{insight.client}</p>
                      </div>
                    </div>
                    <Badge className={`${getPriorityColor(insight.priority)} border text-xs`}>
                      {insight.priority.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-3 leading-relaxed text-sm">{insight.description}</p>
                  
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 mb-4">
                    <p className="text-xs text-blue-700 font-medium mb-1">Potential Impact</p>
                    <p className="text-xs text-blue-600">{insight.impact}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button className={`flex-1 bg-gradient-to-r ${insight.color} text-white hover:shadow-lg transition-all duration-200`}>
                      <Star className="h-3 w-3 mr-2" />
                      {insight.action}
                    </Button>
                    <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI System Status */}
      <Card className="border border-blue-200 bg-gradient-to-r from-blue-50 to-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-dark-blue flex items-center justify-center text-white">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">AI System Status</h3>
                <p className="text-sm text-gray-600">Real-time business intelligence and recommendations</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
              <p className="text-xs text-gray-500">Last scan: 2 minutes ago</p>
              <p className="text-xs text-gray-500">Next update: 28 minutes</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <p className="text-lg font-bold text-dark-blue">156</p>
              <p className="text-xs text-gray-600">Data Points Analyzed</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <p className="text-lg font-bold text-dark-blue">94%</p>
              <p className="text-xs text-gray-600">Prediction Accuracy</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <p className="text-lg font-bold text-dark-blue">€12.5K</p>
              <p className="text-xs text-gray-600">Revenue Identified</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
