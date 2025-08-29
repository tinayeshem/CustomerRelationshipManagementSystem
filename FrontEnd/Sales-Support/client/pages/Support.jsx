import { useState, useEffect } from "react";
import { TEAM_MEMBERS } from "@/constants/teamMembers";
import { useAuth } from "@/contexts/AuthContext";
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
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3,
  CheckCircle,
  Star,
  Target,
  Award,
  Users,
  Phone,
  Mail,
  Calendar,
  Eye,
  FileText,
  Download,
  Filter,
  Search,
  User,
  ExternalLink,
  Plus
} from "lucide-react";

// Sample support data with urgency indicators
const supportTickets = [
  {
    id: "SUP-001",
    title: "Login Authentication Issues",
    client: "Zagreb Municipality",
    priority: "urgent",
    status: "open",
    assignee: "Ana Marić",
    created: "2024-01-15T10:30:00",
    dueDate: "2024-01-15T18:00:00",
    category: "Bug",
    type: "Technical",
    premium: true,
    description: "Users unable to login to the system since morning update",
    timeSpent: 3.5,
    estimatedTime: 4
  },
  {
    id: "SUP-002", 
    title: "Report Generation Timeout",
    client: "Split City Council",
    priority: "high",
    status: "in-progress",
    assignee: "Marko Petrović",
    created: "2024-01-14T14:20:00",
    dueDate: "2024-01-16T12:00:00",
    category: "Feature",
    type: "Technical",
    premium: false,
    description: "Large reports timing out during generation process",
    timeSpent: 5.2,
    estimatedTime: 8
  },
  {
    id: "SUP-003",
    title: "User Training Session Request", 
    client: "Sports Club Dinamo",
    priority: "medium",
    status: "pending",
    assignee: "Petra Babić",
    created: "2024-01-13T09:15:00",
    dueDate: "2024-01-20T17:00:00",
    category: "Training",
    type: "Support",
    premium: true,
    description: "Request for advanced user training session",
    timeSpent: 1,
    estimatedTime: 6
  },
  {
    id: "SUP-004",
    title: "API Integration Help",
    client: "Tech Solutions Ltd",
    priority: "low",
    status: "resolved",
    assignee: "Ana Marić",
    created: "2024-01-12T16:45:00",
    dueDate: "2024-01-18T16:45:00",
    category: "Question",
    type: "Technical",
    premium: false,
    description: "Guidance needed for third-party API integration",
    timeSpent: 4.8,
    estimatedTime: 4
  }
];

const teamMembers = TEAM_MEMBERS.map((member, index) => {
  const supportData = [
    { role: "Senior Support Engineer", activeTickets: 5, resolvedToday: 3, avgResolutionTime: "2.4h", rating: 4.8, bonusProgress: 85 },
    { role: "Support Engineer", activeTickets: 7, resolvedToday: 2, avgResolutionTime: "3.1h", rating: 4.6, bonusProgress: 72 },
    { role: "Support Specialist", activeTickets: 4, resolvedToday: 4, avgResolutionTime: "1.8h", rating: 4.9, bonusProgress: 94 },
    { role: "Junior Support", activeTickets: 3, resolvedToday: 2, avgResolutionTime: "2.8h", rating: 4.5, bonusProgress: 68 },
    { role: "Support Specialist", activeTickets: 6, resolvedToday: 3, avgResolutionTime: "2.2h", rating: 4.7, bonusProgress: 79 }
  ];

  return {
    name: member.name,
    ...supportData[index]
  };
});

const getPriorityColor = (priority) => {
  switch (priority) {
    case "urgent": return "bg-red-100 text-red-800 border-red-200";
    case "high": return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "open": return "bg-red-100 text-red-800 border-red-200";
    case "in-progress": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "pending": return "bg-blue-100 text-blue-800 border-blue-200";
    case "resolved": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getUrgencyColor = (dueDate, priority) => {
  const due = new Date(dueDate);
  const now = new Date();
  const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (diffHours < 0) return "text-red-600";
  if (diffHours < 2 && priority === "urgent") return "text-red-500";
  if (diffHours < 8 && (priority === "urgent" || priority === "high")) return "text-orange-500";
  return "text-green-500";
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
};

export default function Support() {
  const { user } = useAuth();
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [isHighPriorityDialogOpen, setIsHighPriorityDialogOpen] = useState(false);
  const [isOverdueDialogOpen, setIsOverdueDialogOpen] = useState(false);
  const [isPremiumDialogOpen, setIsPremiumDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    client: "",
    priority: "medium",
    category: "Bug",
    assignees: [],
    description: "",
    premium: false,
  });

  const storedOrgs = typeof window !== "undefined" ? localStorage.getItem("organizationData") : null;
  const orgNames = storedOrgs ? JSON.parse(storedOrgs).map(o => o.organizationName) : [];
  const defaultClients = ["Zagreb Municipality", "Sports Club Dinamo", "Split City Council", "Tech Solutions Ltd"];
  const clients = Array.from(new Set([...defaultClients, ...orgNames]));

  // Load activities and derive support tickets from localStorage
  const [activitiesList, setActivitiesList] = useState([]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('activitiesList');
      setActivitiesList(saved ? JSON.parse(saved) : []);
    } catch { setActivitiesList([]); }
    const handler = () => {
      try {
        const saved = localStorage.getItem('activitiesList');
        setActivitiesList(saved ? JSON.parse(saved) : []);
      } catch {}
    };
    window.addEventListener('activitiesListUpdated', handler);
    return () => window.removeEventListener('activitiesListUpdated', handler);
  }, []);

  const derivedTickets = (Array.isArray(activitiesList) ? activitiesList : [])
    .filter(a => a?.isTicket || a?.ticketType)
    .map(a => {
      const priority = (a.priority || "").toString().toLowerCase();
      const statusRaw = (a.status || "").toString().toLowerCase();
      const status = statusRaw === 'to do' || statusRaw === 'todo' ? 'open'
        : statusRaw === 'in progress' ? 'in-progress'
        : statusRaw === 'done' ? 'resolved' : statusRaw;
      const createdIso = (() => {
        const dt = `${a.date || ''}T${a.time || '00:00'}`;
        const d = new Date(dt);
        return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
      })();
      const dueIso = a.deadline ? new Date(`${a.deadline}T23:59:59`).toISOString() : null;
      const assignee = Array.isArray(a.responsible) ? a.responsible.join(', ') : (a.responsible || '');
      const title = a.notes || `${a.ticketType || 'Ticket'} - ${a.linkedClient || ''}`;
      return {
        id: `TKT-${a.id}`,
        title,
        client: a.linkedClient || '',
        priority,
        status,
        assignee,
        created: createdIso,
        dueDate: dueIso,
        category: a.ticketType || '',
        type: 'Support',
        premium: !!a.premiumSupport,
        description: a.notes || ''
      };
    });

  const allTickets = derivedTickets.length > 0 ? derivedTickets : supportTickets;

  const highPriorityTickets = allTickets.filter(ticket =>
    ticket.priority === "urgent" || ticket.priority === "high"
  );

  const overdueTickets = allTickets.filter(ticket => {
    if (!ticket.dueDate) return false;
    const dueDate = new Date(ticket.dueDate);
    const now = new Date();
    return dueDate < now && ticket.status !== "resolved";
  });

  const premiumTickets = allTickets.filter(ticket => ticket.premium);

  const showHighPriorityTickets = () => {
    setSelectedTickets(highPriorityTickets);
    setIsHighPriorityDialogOpen(true);
  };

  const showOverdueItems = () => {
    setSelectedTickets(overdueTickets);
    setIsOverdueDialogOpen(true);
  };

  const showPremiumSupport = () => {
    setSelectedTickets(premiumTickets);
    setIsPremiumDialogOpen(true);
  };


  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-end mb-4">
        <Button
          onClick={() => setIsRegisterDialogOpen(true)}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Register Ticket
        </Button>
      </div>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-dark-blue to-primary text-white shadow-xl">
              <Users className="h-10 w-10" />
            </div>
            <div className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 rounded-full bg-light-blue">
              <AlertTriangle className="h-4 w-4 text-dark-blue" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-dark-blue mb-2">
          Support Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Comprehensive support ticket management and team performance tracking
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="border border-blue-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-3 text-white shadow-lg">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold text-dark-blue">{allTickets.filter(t => t.status !== "resolved").length}</p>
            <p className="text-sm text-gray-600">Open Tickets</p>
            <div className="mt-2">
              <Badge className="bg-red-100 text-red-800 text-xs">
                {highPriorityTickets.length} High Priority
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-3 text-white shadow-lg">
              <Clock className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold text-dark-blue">2.4h</p>
            <p className="text-sm text-gray-600">Avg Resolution Time</p>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800 text-xs">
                -12% from last week
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-3 text-white shadow-lg">
              <Star className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold text-dark-blue">4.7</p>
            <p className="text-sm text-gray-600">Customer Rating</p>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800 text-xs">
                +0.2 from last month
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3 text-white shadow-lg">
              <CheckCircle className="h-6 w-6" />
            </div>
            <p className="text-2xl font-bold text-dark-blue">94%</p>
            <p className="text-sm text-gray-600">Resolution Rate</p>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800 text-xs">
                +3% from last month
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border border-blue-200 bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-dark-blue">Quick Actions</CardTitle>
          <CardDescription>Access frequently used support management features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button
              onClick={showHighPriorityTickets}
              className="w-full h-24 flex flex-col items-center justify-center gap-2 text-center bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
            >
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm">High Priority Tickets</span>
              <Badge className="bg-red-700 text-white">{highPriorityTickets.length}</Badge>
            </Button>

            <Button
              onClick={showOverdueItems}
              className="w-full h-24 flex flex-col items-center justify-center gap-2 text-center bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
            >
              <Clock className="h-6 w-6" />
              <span className="text-sm">Overdue Items</span>
              <Badge className="bg-orange-700 text-white">{overdueTickets.length}</Badge>
            </Button>

            <Button
              onClick={showPremiumSupport}
              className="w-full h-24 flex flex-col items-center justify-center gap-2 text-center bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
            >
              <Star className="h-6 w-6" />
              <span className="text-sm">Premium Support</span>
              <Badge className="bg-blue-700 text-white">{premiumTickets.length}</Badge>
            </Button>

          </div>
        </CardContent>
      </Card>

      {/* Recent Tickets and Team Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card className="border border-blue-200 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-dark-blue">Recent Tickets</span>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...allTickets].sort((a,b) => new Date(b.created) - new Date(a.created)).slice(0, 3).map((ticket) => (
              <div key={ticket.id} className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex-shrink-0">
                  <Badge className={`${getPriorityColor(ticket.priority)} text-xs`}>
                    {ticket.priority.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">{ticket.title}</p>
                  <p className="text-xs text-gray-600">{ticket.client} • {formatTimeAgo(ticket.created)}</p>
                </div>
                <div className="flex-shrink-0">
                  <Badge className={`${getStatusColor(ticket.status)} text-xs`}>
                    {ticket.status}
                  </Badge>
                </div>
                <div className={`flex-shrink-0 text-xs font-medium ${getUrgencyColor(ticket.dueDate, ticket.priority)}`}>
                  <Clock className="h-3 w-3 inline mr-1" />
                  Due {new Date(ticket.dueDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card className="border border-blue-200 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-dark-blue">Team Performance</span>
              <Button variant="ghost" size="sm">
                <BarChart3 className="h-4 w-4 mr-1" />
                Details
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-800">{member.name}</p>
                    <p className="text-xs text-gray-600">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-sm font-medium">{member.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
                  <div>Active: <span className="font-medium text-gray-800">{member.activeTickets}</span></div>
                  <div>Resolved: <span className="font-medium text-gray-800">{member.resolvedToday}</span></div>
                  <div>Avg Time: <span className="font-medium text-gray-800">{member.avgResolutionTime}</span></div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Bonus Progress</span>
                    <span className="font-medium text-gray-800">{member.bonusProgress}%</span>
                  </div>
                  <Progress value={member.bonusProgress} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* High Priority Tickets Dialog */}
      <Dialog open={isHighPriorityDialogOpen} onOpenChange={setIsHighPriorityDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>High Priority Tickets</span>
            </DialogTitle>
            <DialogDescription>
              Urgent and high priority support tickets requiring immediate attention
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {highPriorityTickets.map((ticket) => (
              <Card key={ticket.id} className="p-4 border-l-4 border-l-red-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{ticket.id}</Badge>
                      {ticket.premium && <Badge className="bg-yellow-100 text-yellow-800">PREMIUM</Badge>}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{ticket.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>Client: <span className="font-medium">{ticket.client}</span></div>
                      <div>Assignee: <span className="font-medium">{ticket.assignee}</span></div>
                      <div>Created: <span className="font-medium">{formatTimeAgo(ticket.created)}</span></div>
                      <div>Due: <span className={`font-medium ${getUrgencyColor(ticket.dueDate, ticket.priority)}`}>
                        {new Date(ticket.dueDate).toLocaleString()}
                      </span></div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Badge className={`${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </Badge>
                    <Button size="sm" className="bg-dark-blue hover:bg-dark-blue-hover text-white">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHighPriorityDialogOpen(false)}>
              Close
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <ExternalLink className="h-4 w-4 mr-2" />
              Export List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Overdue Items Dialog */}
      <Dialog open={isOverdueDialogOpen} onOpenChange={setIsOverdueDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span>Overdue Items</span>
            </DialogTitle>
            <DialogDescription>
              Support tickets that have passed their due dates
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {overdueTickets.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Overdue Items!</h3>
                <p className="text-gray-600">Great job! All tickets are on track.</p>
              </div>
            ) : (
              overdueTickets.map((ticket) => (
                <Card key={ticket.id} className="p-4 border-l-4 border-l-orange-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className="bg-red-100 text-red-800">OVERDUE</Badge>
                        <Badge variant="outline">{ticket.id}</Badge>
                        <Badge className={`${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">{ticket.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                        <div>Client: <span className="font-medium">{ticket.client}</span></div>
                        <div>Assignee: <span className="font-medium">{ticket.assignee}</span></div>
                        <div>Was Due: <span className="font-medium text-red-600">
                          {new Date(ticket.dueDate).toLocaleString()}
                        </span></div>
                        <div>Days Overdue: <span className="font-medium text-red-600">
                          {Math.ceil((new Date().getTime() - new Date(ticket.dueDate).getTime()) / (1000 * 60 * 60 * 24))}
                        </span></div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Badge className={`${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </Badge>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Escalate
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOverdueDialogOpen(false)}>
              Close
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Premium Support Dialog */}
      <Dialog open={isPremiumDialogOpen} onOpenChange={setIsPremiumDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span>Premium Support Tickets</span>
            </DialogTitle>
            <DialogDescription>
              Special priority tickets from premium support clients
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {premiumTickets.map((ticket) => (
              <Card key={ticket.id} className="p-4 border-l-4 border-l-yellow-500 bg-yellow-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-yellow-200 text-yellow-800">PREMIUM</Badge>
                      <Badge variant="outline">{ticket.id}</Badge>
                      <Badge className={`${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{ticket.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>Client: <span className="font-medium">{ticket.client}</span></div>
                      <div>Assignee: <span className="font-medium">{ticket.assignee}</span></div>
                      <div>SLA: <span className="font-medium text-green-600">4 hours</span></div>
                      <div>Time Remaining: <span className="font-medium">
                        {new Date(ticket.dueDate) > new Date() ? "On track" : "Overdue"}
                      </span></div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Badge className={`${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </Badge>
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Priority
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPremiumDialogOpen(false)}>
              Close
            </Button>
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
              <FileText className="h-4 w-4 mr-2" />
              SLA Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Register Ticket Dialog */}
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register Support Ticket</DialogTitle>
            <DialogDescription>
              Create a new support ticket. It will also appear in Activities.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="ticket-title">Title *</Label>
              <Input id="ticket-title" value={newTicket.title} onChange={(e) => setNewTicket(v => ({...v, title: e.target.value}))} placeholder="Short issue summary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-client">Client *</Label>
                <Select value={newTicket.client} onValueChange={(val) => setNewTicket(v => ({...v, client: val}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assignees *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TEAM_MEMBERS.map(m => (
                    <label key={m.name} className="flex items-center space-x-2 p-2 rounded bg-background/50">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                        checked={Array.isArray(newTicket.assignees) ? newTicket.assignees.includes(m.name) : false}
                        onChange={(e) => {
                          const current = Array.isArray(newTicket.assignees) ? newTicket.assignees : [];
                          const updated = e.target.checked
                            ? [...current, m.name]
                            : current.filter(n => n !== m.name);
                          setNewTicket(v => ({...v, assignees: updated}));
                        }}
                      />
                      <span className="text-sm">{m.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-priority">Priority</Label>
                <Select value={newTicket.priority} onValueChange={(val) => setNewTicket(v => ({...v, priority: val}))}>
                  <SelectTrigger className={newTicket.priority ? getPriorityColor(newTicket.priority) + " bg-opacity-20" : ""}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent" className={getPriorityColor("urgent") + " hover:opacity-90"}>Urgent</SelectItem>
                    <SelectItem value="high" className={getPriorityColor("high") + " hover:opacity-90"}>High</SelectItem>
                    <SelectItem value="medium" className={getPriorityColor("medium") + " hover:opacity-90"}>Medium</SelectItem>
                    <SelectItem value="low" className={getPriorityColor("low") + " hover:opacity-90"}>Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticket-category">Category</Label>
                <Select value={newTicket.category} onValueChange={(val) => setNewTicket(v => ({...v, category: val}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bug">Bug</SelectItem>
                    <SelectItem value="Question">Question</SelectItem>
                    <SelectItem value="Feature">Feature</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-description">Description</Label>
              <Textarea id="ticket-description" rows={4} value={newTicket.description} onChange={(e) => setNewTicket(v => ({...v, description: e.target.value}))} placeholder="Describe the issue..." />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <input id="ticket-premium" type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded" checked={newTicket.premium} onChange={(e) => setNewTicket(v => ({...v, premium: e.target.checked}))} />
              <Label htmlFor="ticket-premium">Premium</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegisterDialogOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              if (!newTicket.title || !newTicket.client || !Array.isArray(newTicket.assignees) || newTicket.assignees.length === 0) {
                alert("Please fill in title, client and at least one assignee");
                return;
              }
              try {
                const saved = localStorage.getItem('activitiesList');
                const list = saved ? JSON.parse(saved) : [];
                const now = new Date();
                const mapPriority = (p) => p === 'urgent' ? 'Urgent' : p === 'high' ? 'High' : p === 'low' ? 'Low' : 'Medium';
                const activity = {
                  id: (list?.[0]?.id || 0) + list.length + 1,
                  activityType: 'Email',
                  category: 'Support',
                  linkedClient: newTicket.client,
                  unitType: 'Government',
                  date: now.toISOString().split('T')[0],
                  time: now.toTimeString().slice(0,5),
                  responsible: newTicket.assignees,
                  status: 'To Do',
                  deadline: '',
                  reminderDate: '',
                  nextStep: '',
                  nextStepDate: '',
                  notes: newTicket.description || newTicket.title,
                  attachments: [],
                  costPerActivity: 0,
                  premiumSupport: !!newTicket.premium,
                  ticketType: newTicket.category,
                  isTicket: true,
                  priority: mapPriority(newTicket.priority),
                };
                const updated = [activity, ...list];
                localStorage.setItem('activitiesList', JSON.stringify(updated));
                window.dispatchEvent(new Event('activitiesListUpdated'));
                setIsRegisterDialogOpen(false);
                setNewTicket({ title: '', client: '', priority: 'medium', category: 'Bug', assignees: [], description: '', premium: false });
                alert('Ticket registered successfully');
              } catch (e) {
                console.error('Failed to register ticket', e);
                alert('Failed to register ticket');
              }
            }}>Register Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
