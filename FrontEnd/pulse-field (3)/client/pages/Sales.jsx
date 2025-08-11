import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  UserPlus, 
  Calendar, 
  BarChart3,
  Award,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Eye,
  Download,
  Plus,
  FileText,
  ExternalLink,
  PieChart,
  Activity,
  AlertCircle,
  CheckCircle
} from "lucide-react";

// Enhanced sales data with regional and time tracking
const salesLeads = [
  {
    id: "LEAD-001",
    name: "Pula Municipality",
    contact: "Marija Novak",
    phone: "+385 52 123 456",
    email: "marija.novak@pula.hr",
    value: 65000,
    probability: 85,
    stage: "Proposal",
    source: "Referral",
    region: "Istria",
    product: "LRSU Management",
    created: "2024-01-10",
    nextAction: "2024-01-20",
    assignee: "Ana Marić",
    status: "Hot",
    timeSpent: 15,
    lastActivity: "2024-01-15"
  },
  {
    id: "LEAD-002",
    name: "Dubrovnik Tourism Board",
    contact: "Petar Matić",
    phone: "+385 20 987 654",
    email: "petar.matic@dubrovnik-tourism.hr",
    value: 45000,
    probability: 60,
    stage: "Negotiation",
    source: "Cold Call",
    region: "Dubrovnik-Neretva",
    product: "Tourism Management",
    created: "2024-01-05",
    nextAction: "2024-01-18",
    assignee: "Marko Petrović",
    status: "Warm",
    timeSpent: 22,
    lastActivity: "2024-01-14"
  },
  {
    id: "LEAD-003",
    name: "Karlovac County",
    contact: "Ana Božić",
    phone: "+385 47 555 123",
    email: "ana.bozic@karlovac-county.hr",
    value: 95000,
    probability: 40,
    stage: "Discovery",
    source: "Website",
    region: "Karlovac",
    product: "Full Suite",
    created: "2024-01-12",
    nextAction: "2024-01-25",
    assignee: "Petra Babić",
    status: "Cold",
    timeSpent: 8,
    lastActivity: "2024-01-13"
  },
  {
    id: "LEAD-004",
    name: "Zadar Port Authority",
    contact: "Luka Marinić",
    phone: "+385 23 666 789",
    email: "luka.marinic@zadar-port.hr",
    value: 75000,
    probability: 90,
    stage: "Closing",
    source: "Partner",
    region: "Zadar",
    product: "Port Management",
    created: "2023-12-20",
    nextAction: "2024-01-16",
    assignee: "Ana Marić",
    status: "Hot",
    timeSpent: 35,
    lastActivity: "2024-01-15"
  }
];

// Sales analytics data
const salesMetrics = {
  totalPipeline: 280000,
  monthlyTarget: 200000,
  monthlyActual: 125000,
  conversionRate: 68,
  avgDealSize: 58750,
  leadsThisMonth: 12,
  dealsClosedThisMonth: 3,
  forecastAccuracy: 85
};

const monthlyData = [
  { month: "Aug", target: 180000, actual: 165000, leads: 8 },
  { month: "Sep", target: 190000, actual: 185000, leads: 10 },
  { month: "Oct", target: 200000, actual: 195000, leads: 9 },
  { month: "Nov", target: 210000, actual: 178000, leads: 11 },
  { month: "Dec", target: 200000, actual: 220000, leads: 13 },
  { month: "Jan", target: 200000, actual: 125000, leads: 12 }
];

const regionData = [
  { region: "Zagreb", value: 95000, deals: 2, percentage: 34 },
  { region: "Split-Dalmatia", value: 65000, deals: 1, percentage: 23 },
  { region: "Istria", value: 75000, deals: 1, percentage: 27 },
  { region: "Others", value: 45000, deals: 1, percentage: 16 }
];

const productData = [
  { product: "LRSU Management", value: 140000, deals: 3 },
  { product: "Tourism Management", value: 45000, deals: 1 },
  { product: "Port Management", value: 75000, deals: 1 },
  { product: "Full Suite", value: 95000, deals: 2 }
];

const teamPerformance = [
  { 
    name: "Ana Marić", 
    leadsAssigned: 8, 
    dealsWon: 3, 
    revenue: 145000, 
    conversionRate: 75,
    avgDealTime: 28,
    activities: 45
  },
  { 
    name: "Marko Petrović", 
    leadsAssigned: 6, 
    dealsWon: 2, 
    revenue: 90000, 
    conversionRate: 66,
    avgDealTime: 32,
    activities: 38
  },
  { 
    name: "Petra Babić", 
    leadsAssigned: 4, 
    dealsWon: 1, 
    revenue: 45000, 
    conversionRate: 50,
    avgDealTime: 45,
    activities: 28
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case "Hot": return "bg-red-100 text-red-800 border-red-200";
    case "Warm": return "bg-orange-100 text-orange-800 border-orange-200";
    case "Cold": return "bg-blue-100 text-blue-800 border-blue-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStageColor = (stage) => {
  switch (stage) {
    case "Discovery": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Proposal": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Negotiation": return "bg-orange-100 text-orange-800 border-orange-200";
    case "Closing": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const SimpleBarChart = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(item => item.actual));
  
  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-6" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const targetHeight = (item.target / maxValue) * height * 0.8;
          const actualHeight = (item.actual / maxValue) * height * 0.8;
          
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="flex items-end space-x-1" style={{ height: `${height * 0.8}px` }}>
                <div
                  className="w-6 bg-blue-200 rounded-t"
                  style={{ height: `${targetHeight}px` }}
                  title={`Target: ${formatCurrency(item.target)}`}
                />
                <div
                  className="w-6 bg-blue-600 rounded-t"
                  style={{ height: `${actualHeight}px` }}
                  title={`Actual: ${formatCurrency(item.actual)}`}
                />
              </div>
              <span className="text-xs font-medium">{item.month}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-200 rounded"></div>
          <span>Target</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span>Actual</span>
        </div>
      </div>
    </div>
  );
};

const SimplePieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <div className="flex-1">
                <div className="text-xs font-medium">{item.region}</div>
                <div className="text-xs text-gray-600">{formatCurrency(item.value)} ({percentage}%)</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Sales() {
  const [leadsList, setLeadsList] = useState(salesLeads);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");
  
  const [newLead, setNewLead] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    value: "",
    probability: 50,
    stage: "Discovery",
    source: "",
    region: "",
    product: "",
    assignee: "",
    nextAction: "",
    notes: ""
  });

  const handleInputChange = (field, value) => {
    setNewLead(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddLead = () => {
    if (!newLead.name || !newLead.contact || !newLead.value) {
      alert("Please fill in all required fields");
      return;
    }

    const lead = {
      id: `LEAD-${String(leadsList.length + 1).padStart(3, '0')}`,
      ...newLead,
      value: parseFloat(newLead.value) || 0,
      created: new Date().toISOString().split('T')[0],
      status: newLead.probability >= 70 ? "Hot" : newLead.probability >= 40 ? "Warm" : "Cold",
      timeSpent: 0,
      lastActivity: new Date().toISOString().split('T')[0]
    };

    setLeadsList(prev => [lead, ...prev]);
    setNewLead({
      name: "",
      contact: "",
      phone: "",
      email: "",
      value: "",
      probability: 50,
      stage: "Discovery",
      source: "",
      region: "",
      product: "",
      assignee: "",
      nextAction: "",
      notes: ""
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive sales performance and pipeline management
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Sales Lead</DialogTitle>
                <DialogDescription>
                  Create a new sales opportunity in your pipeline.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company/Organization *</Label>
                    <Input
                      id="name"
                      placeholder="Enter company name"
                      value={newLead.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Person *</Label>
                    <Input
                      id="contact"
                      placeholder="Enter contact name"
                      value={newLead.contact}
                      onChange={(e) => handleInputChange('contact', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+385 XX XXX XXXX"
                      value={newLead.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@company.hr"
                      value={newLead.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value">Deal Value (€) *</Label>
                    <Input
                      id="value"
                      type="number"
                      placeholder="50000"
                      value={newLead.value}
                      onChange={(e) => handleInputChange('value', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="probability">Probability (%)</Label>
                    <Input
                      id="probability"
                      type="number"
                      min="0"
                      max="100"
                      value={newLead.probability}
                      onChange={(e) => handleInputChange('probability', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage</Label>
                    <Select value={newLead.stage} onValueChange={(value) => handleInputChange('stage', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Discovery">Discovery</SelectItem>
                        <SelectItem value="Proposal">Proposal</SelectItem>
                        <SelectItem value="Negotiation">Negotiation</SelectItem>
                        <SelectItem value="Closing">Closing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source">Lead Source</Label>
                    <Select value={newLead.source} onValueChange={(value) => handleInputChange('source', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Referral">Referral</SelectItem>
                        <SelectItem value="Cold Call">Cold Call</SelectItem>
                        <SelectItem value="Partner">Partner</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Select value={newLead.region} onValueChange={(value) => handleInputChange('region', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Zagreb">Zagreb</SelectItem>
                        <SelectItem value="Split-Dalmatia">Split-Dalmatia</SelectItem>
                        <SelectItem value="Istria">Istria</SelectItem>
                        <SelectItem value="Zadar">Zadar</SelectItem>
                        <SelectItem value="Karlovac">Karlovac</SelectItem>
                        <SelectItem value="Dubrovnik-Neretva">Dubrovnik-Neretva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product">Product</Label>
                    <Select value={newLead.product} onValueChange={(value) => handleInputChange('product', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LRSU Management">LRSU Management</SelectItem>
                        <SelectItem value="Tourism Management">Tourism Management</SelectItem>
                        <SelectItem value="Port Management">Port Management</SelectItem>
                        <SelectItem value="Full Suite">Full Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignee">Assigned To</Label>
                    <Select value={newLead.assignee} onValueChange={(value) => handleInputChange('assignee', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign team member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ana Marić">Ana Marić</SelectItem>
                        <SelectItem value="Marko Petrović">Marko Petrović</SelectItem>
                        <SelectItem value="Petra Babić">Petra Babić</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nextAction">Next Action Date</Label>
                    <Input
                      id="nextAction"
                      type="date"
                      value={newLead.nextAction}
                      onChange={(e) => handleInputChange('nextAction', e.target.value)}
                    />
                  </div>
                  <div></div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes about this lead..."
                    value={newLead.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddLead} className="bg-blue-600 hover:bg-blue-700">
                  Add Lead
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Pipeline</p>
                <p className="text-3xl font-bold text-blue-900">{formatCurrency(salesMetrics.totalPipeline)}</p>
                <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Monthly Achievement</p>
                <p className="text-3xl font-bold text-green-900">{formatCurrency(salesMetrics.monthlyActual)}</p>
                <div className="mt-2">
                  <Progress value={(salesMetrics.monthlyActual / salesMetrics.monthlyTarget) * 100} className="h-2" />
                  <p className="text-xs text-green-600 mt-1">{Math.round((salesMetrics.monthlyActual / salesMetrics.monthlyTarget) * 100)}% of target</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Conversion Rate</p>
                <p className="text-3xl font-bold text-orange-900">{salesMetrics.conversionRate}%</p>
                <p className="text-xs text-orange-600 mt-1">+5% from last month</p>
              </div>
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Avg Deal Size</p>
                <p className="text-3xl font-bold text-purple-900">{formatCurrency(salesMetrics.avgDealSize)}</p>
                <p className="text-xs text-purple-600 mt-1">+8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Monthly Performance</span>
            </CardTitle>
            <CardDescription>Target vs Actual Revenue (Last 6 Months)</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={monthlyData} height={250} />
          </CardContent>
        </Card>

        {/* Regional Distribution */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-green-600" />
              <span>Regional Distribution</span>
            </CardTitle>
            <CardDescription>Sales Pipeline by Region</CardDescription>
          </CardHeader>
          <CardContent>
            <SimplePieChart data={regionData} />
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-600" />
            <span>Team Performance</span>
          </CardTitle>
          <CardDescription>Sales team metrics and comparisons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamPerformance.map((member, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{member.name}</h4>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    {formatCurrency(member.revenue)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Leads</p>
                    <p className="font-medium">{member.leadsAssigned}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Won</p>
                    <p className="font-medium">{member.dealsWon}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Conv. Rate</p>
                    <p className="font-medium">{member.conversionRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Days</p>
                    <p className="font-medium">{member.avgDealTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Activities</p>
                    <p className="font-medium">{member.activities}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Leads Pipeline */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span>Active Sales Pipeline</span>
          </CardTitle>
          <CardDescription>Current leads and opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leadsList.map((lead) => (
              <div key={lead.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-800">{lead.name}</h4>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                      <Badge className={getStageColor(lead.stage)}>
                        {lead.stage}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{lead.contact}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{lead.region}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{formatCurrency(lead.value)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{lead.timeSpent}h spent</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Probability: {lead.probability}%</span>
                      <span>Product: {lead.product}</span>
                      <span>Assigned: {lead.assignee}</span>
                      <span>Next Action: {lead.nextAction}</span>
                    </div>

                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${lead.probability}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
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
