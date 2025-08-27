import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  PieChart, 
  ArrowRight,
  Users,
  Clock,
  DollarSign,
  Target,
  Activity,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  Download,
  Filter,
  Eye,
  Zap,
  Brain,
  Star,
  MapPin
} from "lucide-react";

// Sample analytics data
const timeSpentData = [
  { client: "Zagreb Municipality", activities: 15, tickets: 8, totalHours: 45, avgResolution: 2.5 },
  { client: "Sports Club Dinamo", activities: 12, tickets: 5, totalHours: 28, avgResolution: 3.2 },
  { client: "Split City Council", activities: 8, tickets: 12, totalHours: 52, avgResolution: 4.1 },
  { client: "Tech Solutions Ltd", activities: 22, tickets: 18, totalHours: 67, avgResolution: 1.8 },
  { client: "Pula Municipality", activities: 6, tickets: 3, totalHours: 18, avgResolution: 2.8 }
];

const frequentRequestsData = [
  { type: "System Integration", count: 28, category: "Feature", avgTime: 8.5, trend: "up" },
  { type: "User Training", count: 24, category: "Support", avgTime: 2.3, trend: "stable" },
  { type: "Bug Fixes", count: 19, category: "Bug", avgTime: 1.2, trend: "down" },
  { type: "Data Migration", count: 15, category: "Feature", avgTime: 12.4, trend: "up" },
  { type: "Performance Issues", count: 12, category: "Bug", avgTime: 3.7, trend: "down" },
  { type: "Custom Reports", count: 11, category: "Enhancement", avgTime: 6.8, trend: "stable" }
];

const teamComparison = [
  {
    name: "Ana Marić",
    activities: 45,
    tickets: 32,
    avgResolution: 2.1,
    clientSatisfaction: 4.8,
    revenue: 145000,
    efficiency: 92,
    specialization: "LRSU"
  },
  {
    name: "Marko Petrović",
    activities: 38,
    tickets: 28,
    avgResolution: 2.8,
    clientSatisfaction: 4.6,
    revenue: 98000,
    efficiency: 87,
    specialization: "Sales"
  },
  {
    name: "Petra Babić",
    activities: 28,
    tickets: 22,
    avgResolution: 3.2,
    clientSatisfaction: 4.5,
    revenue: 67000,
    efficiency: 85,
    specialization: "Support"
  }
];

const clientFinancials = [
  {
    client: "Zagreb Municipality",
    revenue: 45000,
    costs: 32000,
    profit: 13000,
    margin: 28.9,
    timeSpent: 45,
    profitPerHour: 289,
    status: "profitable",
    risk: "low"
  },
  {
    client: "Sports Club Dinamo",
    revenue: 12000,
    costs: 9500,
    profit: 2500,
    margin: 20.8,
    timeSpent: 28,
    profitPerHour: 89,
    status: "profitable",
    risk: "medium"
  },
  {
    client: "Split City Council",
    revenue: 0,
    costs: 5000,
    profit: -5000,
    margin: -100,
    timeSpent: 52,
    profitPerHour: -96,
    status: "loss",
    risk: "high"
  },
  {
    client: "Tech Solutions Ltd",
    revenue: 25000,
    costs: 18000,
    profit: 7000,
    margin: 28.0,
    timeSpent: 67,
    profitPerHour: 104,
    status: "profitable",
    risk: "low"
  }
];

const activityTrends = [
  { month: "Aug", activities: 85, tickets: 32, sales: 2 },
  { month: "Sep", activities: 92, tickets: 28, sales: 3 },
  { month: "Oct", activities: 78, tickets: 35, sales: 1 },
  { month: "Nov", activities: 105, tickets: 42, sales: 4 },
  { month: "Dec", activities: 118, tickets: 38, sales: 5 },
  { month: "Jan", activities: 87, tickets: 25, sales: 2 }
];

const supportIssuesByType = [
  { type: "Bug", count: 45, percentage: 32, avgResolution: 1.8, priority: "high" },
  { type: "Question", count: 38, percentage: 27, avgResolution: 0.5, priority: "medium" },
  { type: "Feature", count: 28, percentage: 20, avgResolution: 8.2, priority: "medium" },
  { type: "Enhancement", count: 21, percentage: 15, avgResolution: 5.4, priority: "low" },
  { type: "Training", count: 8, percentage: 6, avgResolution: 2.1, priority: "low" }
];

const salesByRegion = [
  { region: "Zagreb", deals: 8, revenue: 245000, growth: 15, kam: "Ana Marić" },
  { region: "Split-Dalmatia", deals: 5, revenue: 178000, growth: 8, kam: "Marko Petrović" },
  { region: "Istria", deals: 3, revenue: 95000, growth: 22, kam: "Ana Marić" },
  { region: "Osijek-Baranja", deals: 2, revenue: 67000, growth: -5, kam: "Petra Babić" },
  { region: "Others", deals: 4, revenue: 89000, growth: 12, kam: "Mixed" }
];

const forecastingData = {
  supportWorkload: {
    nextMonth: { tickets: 35, hours: 120, confidence: 85 },
    nextQuarter: { tickets: 105, hours: 360, confidence: 78 },
    trends: "Increasing complexity in integration requests"
  },
  highDemandClients: [
    { client: "Zagreb Municipality", demandScore: 92, risk: "medium", reason: "Expansion planning" },
    { client: "Tech Solutions Ltd", demandScore: 88, risk: "low", reason: "Growing business" },
    { client: "Split City Council", demandScore: 76, risk: "high", reason: "Budget constraints" }
  ],
  profitabilityAnalysis: {
    mostProfitable: "Zagreb Municipality",
    leastProfitable: "Split City Council",
    avgMargin: 19.4,
    recommendation: "Focus on LRSU sector, reduce time on potential clients"
  },
  upsellRecommendations: [
    { client: "Sports Club Dinamo", opportunity: "Premium Support", value: 5000, probability: 75 },
    { client: "Tech Solutions Ltd", opportunity: "Advanced Analytics", value: 12000, probability: 68 },
    { client: "Zagreb Municipality", opportunity: "Mobile App", value: 25000, probability: 82 }
  ]
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusColor = (status) => {
  switch (status) {
    case "profitable": return "text-green-600 bg-green-100";
    case "loss": return "text-red-600 bg-red-100";
    case "break-even": return "text-yellow-600 bg-yellow-100";
    default: return "text-gray-600 bg-gray-100";
  }
};

const getRiskColor = (risk) => {
  switch (risk) {
    case "low": return "text-green-600 bg-green-100";
    case "medium": return "text-yellow-600 bg-yellow-100";
    case "high": return "text-red-600 bg-red-100";
    default: return "text-gray-600 bg-gray-100";
  }
};

const getTrendIcon = (trend) => {
  switch (trend) {
    case "up": return <TrendingUp className="h-3 w-3 text-green-600" />;
    case "down": return <TrendingDown className="h-3 w-3 text-red-600" />;
    default: return <div className="h-3 w-3 rounded-full bg-gray-400" />;
  }
};

const SimpleLineChart = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(item => Math.max(item.activities, item.tickets, item.sales * 20)));
  
  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-6" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const activitiesHeight = (item.activities / maxValue) * height * 0.8;
          const ticketsHeight = (item.tickets / maxValue) * height * 0.8;
          const salesHeight = ((item.sales * 20) / maxValue) * height * 0.8;
          
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="flex items-end space-x-1" style={{ height: `${height * 0.8}px` }}>
                <div
                  className="w-4 bg-blue-400 rounded-t"
                  style={{ height: `${activitiesHeight}px` }}
                  title={`Activities: ${item.activities}`}
                />
                <div
                  className="w-4 bg-red-400 rounded-t"
                  style={{ height: `${ticketsHeight}px` }}
                  title={`Tickets: ${item.tickets}`}
                />
                <div
                  className="w-4 bg-green-400 rounded-t"
                  style={{ height: `${salesHeight}px` }}
                  title={`Sales: ${item.sales}`}
                />
              </div>
              <span className="text-xs font-medium">{item.month}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-400 rounded"></div>
          <span>Activities</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-400 rounded"></div>
          <span>Tickets</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-400 rounded"></div>
          <span>Sales</span>
        </div>
      </div>
    </div>
  );
};

export default function Reports() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [selectedTeamMember, setSelectedTeamMember] = useState("all");

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive business intelligence and forecasting dashboard
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Time Spent Analysis */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Time Spent Analysis</span>
          </CardTitle>
          <CardDescription>Detailed breakdown of time allocation per client and activity type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeSpentData.map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{item.client}</h4>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {item.totalHours}h total
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Activities</p>
                    <p className="font-medium">{item.activities}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tickets</p>
                    <p className="font-medium">{item.tickets}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Hours</p>
                    <p className="font-medium">{item.totalHours}h</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Resolution</p>
                    <p className="font-medium">{item.avgResolution}h</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Most Frequent Requests */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            <span>Most Frequent Requests</span>
          </CardTitle>
          <CardDescription>Top support requests and tickets by frequency and resolution time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {frequentRequestsData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getTrendIcon(item.trend)}
                  <div>
                    <h4 className="font-medium">{item.type}</h4>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{item.count}</p>
                    <p className="text-gray-600">requests</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{item.avgTime}h</p>
                    <p className="text-gray-600">avg time</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Performance Comparison */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-600" />
            <span>Team Performance Comparison</span>
          </CardTitle>
          <CardDescription>Detailed team member metrics and performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamComparison.map((member, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-gray-800">{member.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {member.specialization}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{member.clientSatisfaction}/5.0</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Activities</p>
                    <p className="font-medium">{member.activities}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tickets</p>
                    <p className="font-medium">{member.tickets}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Resolution</p>
                    <p className="font-medium">{member.avgResolution}h</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Revenue</p>
                    <p className="font-medium">{formatCurrency(member.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Efficiency</p>
                    <p className="font-medium">{member.efficiency}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Satisfaction</p>
                    <p className="font-medium">{member.clientSatisfaction}/5</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Client Financial Summaries */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>Client Financial Summaries</span>
          </CardTitle>
          <CardDescription>Profitability analysis and financial performance per client</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientFinancials.map((client, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{client.client}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                    <Badge className={getRiskColor(client.risk)}>
                      {client.risk} risk
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Revenue</p>
                    <p className="font-medium text-green-600">{formatCurrency(client.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Costs</p>
                    <p className="font-medium text-red-600">{formatCurrency(client.costs)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Profit</p>
                    <p className={`font-medium ${client.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(client.profit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Margin</p>
                    <p className={`font-medium ${client.margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {client.margin.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Time Spent</p>
                    <p className="font-medium">{client.timeSpent}h</p>
                  </div>
                  <div>
                    <p className="text-gray-600">€/Hour</p>
                    <p className={`font-medium ${client.profitPerHour >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      €{client.profitPerHour}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trends and Forecasting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Volume Trends */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Activity Volume Trends</span>
            </CardTitle>
            <CardDescription>6-month activity, ticket, and sales trends</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleLineChart data={activityTrends} height={250} />
          </CardContent>
        </Card>

        {/* Support Issues by Type */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span>Support Issues by Type</span>
            </CardTitle>
            <CardDescription>Breakdown of support requests and resolution times</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supportIssuesByType.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{issue.type}</h4>
                    <p className="text-sm text-gray-600">{issue.percentage}% of total</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium">{issue.count}</p>
                      <p className="text-gray-600">issues</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{issue.avgResolution}h</p>
                      <p className="text-gray-600">avg time</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Driven Forecasting */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI-Driven Forecasting</span>
          </CardTitle>
          <CardDescription>Predictive analytics and business recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Support Workload Projections */}
          <div className="p-4 bg-white rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-3 flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Support Workload Projections</span>
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center p-3 bg-purple-50 rounded">
                <p className="text-sm text-purple-600">Next Month</p>
                <p className="font-bold text-purple-800">{forecastingData.supportWorkload.nextMonth.tickets} tickets</p>
                <p className="text-xs text-purple-600">{forecastingData.supportWorkload.nextMonth.hours}h estimated</p>
                <p className="text-xs text-purple-500">{forecastingData.supportWorkload.nextMonth.confidence}% confidence</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <p className="text-sm text-purple-600">Next Quarter</p>
                <p className="font-bold text-purple-800">{forecastingData.supportWorkload.nextQuarter.tickets} tickets</p>
                <p className="text-xs text-purple-600">{forecastingData.supportWorkload.nextQuarter.hours}h estimated</p>
                <p className="text-xs text-purple-500">{forecastingData.supportWorkload.nextQuarter.confidence}% confidence</p>
              </div>
            </div>
            <p className="text-sm text-purple-700 italic">{forecastingData.supportWorkload.trends}</p>
          </div>

          {/* High-Demand Clients */}
          <div className="p-4 bg-white rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-3 flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>High-Demand Clients</span>
            </h4>
            <div className="space-y-2">
              {forecastingData.highDemandClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <div>
                    <p className="font-medium text-purple-800">{client.client}</p>
                    <p className="text-xs text-purple-600">{client.reason}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                      Score: {client.demandScore}
                    </Badge>
                    <Badge className={getRiskColor(client.risk)}>
                      {client.risk}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upsell Recommendations */}
          <div className="p-4 bg-white rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-3 flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Upsell/Price Increase Recommendations</span>
            </h4>
            <div className="space-y-2">
              {forecastingData.upsellRecommendations.map((rec, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <div>
                    <p className="font-medium text-purple-800">{rec.client}</p>
                    <p className="text-xs text-purple-600">{rec.opportunity}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-purple-800">{formatCurrency(rec.value)}</span>
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      {rec.probability}% likely
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profitability Analysis */}
          <div className="p-4 bg-white rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-3 flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Profitability Analysis</span>
            </h4>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center p-2 bg-green-50 rounded">
                <p className="text-xs text-green-600">Most Profitable</p>
                <p className="font-medium text-green-800">{forecastingData.profitabilityAnalysis.mostProfitable}</p>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <p className="text-xs text-red-600">Least Profitable</p>
                <p className="font-medium text-red-800">{forecastingData.profitabilityAnalysis.leastProfitable}</p>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <p className="text-xs text-blue-600">Avg Margin</p>
                <p className="font-medium text-blue-800">{forecastingData.profitabilityAnalysis.avgMargin}%</p>
              </div>
            </div>
            <p className="text-sm text-purple-700 italic">{forecastingData.profitabilityAnalysis.recommendation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Sales by Region/KAM */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <span>Sales by Region & KAM</span>
          </CardTitle>
          <CardDescription>Regional sales performance and KAM effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {salesByRegion.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{region.region}</h4>
                  <p className="text-sm text-gray-600">KAM: {region.kam}</p>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{region.deals}</p>
                    <p className="text-gray-600">deals</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{formatCurrency(region.revenue)}</p>
                    <p className="text-gray-600">revenue</p>
                  </div>
                  <div className="text-center">
                    <p className={`font-medium ${region.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {region.growth >= 0 ? '+' : ''}{region.growth}%
                    </p>
                    <p className="text-gray-600">growth</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
