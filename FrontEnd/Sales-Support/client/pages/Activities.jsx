import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  User,
  Video,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  Paperclip,
  Euro,
  Flag,
  Bug,
  HelpCircle,
  Star,
  Zap,
  Edit,
  Eye,
  Upload,
  MapPin,
  Trash2
} from "lucide-react";

// Enhanced activities data with all requested fields
const activities = [
  {
    id: 1,
    activityType: "Call",
    category: "Support",
    linkedClient: "Zagreb Municipality",
    unitType: "Government",
    date: "2024-01-15",
    time: "14:30",
    responsible: ["Ana Marić"],
    status: "Done",
    deadline: "2024-01-15",
    reminderDate: "2024-01-14",
    nextStep: "Follow-up call on contract renewal",
    nextStepDate: "2024-01-25",
    notes: "Resolved ticketing system issue. Client very satisfied with response time.",
    attachments: ["call_notes.pdf", "solution_guide.docx"],
    costPerActivity: 50,
    premiumSupport: true,
    activityLog: [
      { user: "Ana Marić", action: "Created", timestamp: "2024-01-15 09:00" },
      { user: "Ana Marić", action: "Completed", timestamp: "2024-01-15 15:00" }
    ],
    priority: "High"
  },
  {
    id: 2,
    activityType: "Email",
    category: "Sales",
    linkedClient: "Sports Club Dinamo",
    unitType: "Independent",
    date: "2024-01-15",
    time: "10:15",
    responsible: ["Marko Petrović"],
    status: "In Progress",
    deadline: "2024-01-18",
    reminderDate: "2024-01-17",
    nextStep: "Send detailed proposal with pricing",
    nextStepDate: "2024-01-20",
    notes: "Following up on contract proposal. Client interested in premium features.",
    attachments: ["proposal_draft.pdf"],
    costPerActivity: 0,
    premiumSupport: false,
    activityLog: [
      { user: "Marko Petrović", action: "Created", timestamp: "2024-01-15 08:30" },
      { user: "Marko Petrović", action: "Updated", timestamp: "2024-01-15 11:00" }
    ],
    priority: "Medium"
  },
  {
    id: 3,
    activityType: "In-person Meeting",
    category: "Sales",
    linkedClient: "Split City Council",
    unitType: "Government",
    date: "2024-01-16",
    time: "09:00",
    responsible: ["Ana Marić"],
    status: "To Do",
    deadline: "2024-01-16",
    reminderDate: "2024-01-15",
    nextStep: "Prepare technical implementation plan",
    nextStepDate: "2024-01-18",
    notes: "Demo presentation scheduled. Prepare laptop and demo environment.",
    attachments: ["demo_presentation.pptx", "technical_specs.pdf"],
    costPerActivity: 120,
    premiumSupport: false,
    activityLog: [
      { user: "Ana Marić", action: "Created", timestamp: "2024-01-10 14:00" }
    ],
    priority: "High"
  },
  {
    id: 4,
    activityType: "Online Meeting",
    category: "Support",
    linkedClient: "Tech Solutions Ltd",
    unitType: "Independent",
    date: "2024-01-17",
    time: "15:00",
    responsible: ["Petra Babić"],
    status: "To Do",
    deadline: "2024-01-17",
    reminderDate: "2024-01-16",
    nextStep: "Create knowledge base article",
    nextStepDate: "2024-01-19",
    notes: "Weekly check-in meeting. Review system performance and updates.",
    attachments: [],
    costPerActivity: 25,
    premiumSupport: true,
    activityLog: [
      { user: "Petra Babić", action: "Created", timestamp: "2024-01-12 10:00" }
    ],
    priority: "Medium"
  }
];

// Client address lookup for location functionality
const clientAddresses = {
  "Zagreb Municipality": "Trg bana Jelačića 1, Zagreb, Croatia",
  "Sports Club Dinamo": "Maksimirska 128, Zagreb, Croatia",
  "Split City Council": "Peristil bb, Split, Croatia",
  "Tech Solutions Ltd": "Ilica 242, Zagreb, Croatia",
  "Pula Municipality": "Forum 3, Pula, Croatia",
  "Dubrovnik Tourism Board": "Stradun 1, Dubrovnik, Croatia",
  "Karlovac County": "Petra Zrinskog 1, Karlovac, Croatia",
  "Zadar Port Authority": "Liburnska obala 6, Zadar, Croatia"
};

// Enhanced filter and reference data
const activityTypes = ["All Types", "Call", "Email", "Online Meeting", "In-person Meeting"];
const categories = ["All Categories", "Sales", "Support"];
const statuses = ["All Statuses", "To Do", "In Progress", "Done"];
const teamMembers = ["All Members", "Ana Marić", "Marko Petrović", "Petra Babić", "Luka Novak", "Sofia Antić"];
const priorities = ["All Priorities", "Low", "Medium", "High", "Urgent"];
const defaultClients = ["All Clients", "Zagreb Municipality", "Sports Club Dinamo", "Split City Council", "Tech Solutions Ltd"];

const getStatusColor = (status) => {
  switch (status) {
    case "To Do": return "bg-blue-100 text-blue-800 border-blue-200";
    case "In Progress": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Done": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "Low": return "bg-green-100 text-green-800 border-green-200";
    case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "High": return "bg-orange-100 text-orange-800 border-orange-200";
    case "Urgent": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getCategoryColor = (category) => {
  switch (category) {
    case "Sales": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Support": return "bg-purple-100 text-purple-800 border-purple-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getCategoryIconBackground = (category) => {
  switch (category) {
    case "Sales": return "bg-gradient-to-br from-blue-50 to-blue-200";
    case "Support": return "bg-gradient-to-br from-purple-50 to-purple-200";
    default: return "bg-gradient-to-br from-gray-50 to-gray-200";
  }
};

const getTicketTypeColor = (ticketType) => {
  switch (ticketType) {
    case "Bug": return "bg-red-100 text-red-800 border-red-200";
    case "Question": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Feature": return "bg-green-100 text-green-800 border-green-200";
    case "Enhancement": return "bg-purple-100 text-purple-800 border-purple-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getActivityTypeIcon = (type) => {
  switch (type) {
    case "Call": return <Phone className="h-4 w-4" />;
    case "Email": return <Mail className="h-4 w-4" />;
    case "Online Meeting": return <Video className="h-4 w-4" />;
    case "In-person Meeting": return <Users className="h-4 w-4" />;
    default: return <User className="h-4 w-4" />;
  }
};

const getTicketTypeIcon = (type) => {
  switch (type) {
    case "Bug": return <Bug className="h-3 w-3" />;
    case "Question": return <HelpCircle className="h-3 w-3" />;
    case "Feature": return <Star className="h-3 w-3" />;
    case "Enhancement": return <Zap className="h-3 w-3" />;
    default: return <FileText className="h-3 w-3" />;
  }
};


export default function Activities() {
  // Initialize activities from localStorage or use default activities
  const [activitiesList, setActivitiesList] = useState(() => {
    const savedActivities = localStorage.getItem('activitiesList');
    if (savedActivities) {
      const parsed = JSON.parse(savedActivities);
      // Merge saved activities with default activities, avoiding duplicates
      const existingIds = parsed.map(a => a.id);
      const newDefaultActivities = activities.filter(a => !existingIds.includes(a.id));
      return [...parsed, ...newDefaultActivities];
    }
    return activities;
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedMember, setSelectedMember] = useState("All Members");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedClient, setSelectedClient] = useState("All Clients");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");


  // Dynamic clients list based on organizations + activities
  const clients = React.useMemo(() => {
    const stored = localStorage.getItem('organizationData');
    const orgNames = stored ? JSON.parse(stored).map(o => o.organizationName) : [];
    const activityClients = [...new Set(activitiesList.map(activity => activity.linkedClient))];
    const allClients = [...new Set([...defaultClients, ...orgNames, ...activityClients])];
    return allClients.filter(client => client !== "All Clients").sort().concat(["All Clients"]).reverse();
  }, [activitiesList]);

  const organizationsList = React.useMemo(() => {
    const stored = localStorage.getItem('organizationData');
    return stored ? JSON.parse(stored) : [];
  }, []);



  // Form state for new activity
  const [newActivity, setNewActivity] = useState({
    activityType: "",
    category: "Support", // Auto-set based on user role
    linkedClient: "",
    unitType: "Government", // Changed from clientType
    date: new Date().toISOString().split('T')[0], // Current date
    time: new Date().toTimeString().slice(0, 5), // Current time HH:MM
    responsible: [], // Changed to array for multiple selection
    status: "To Do",
    deadline: "",
    reminderDate: "",
    nextStep: "",
    nextStepDate: "",
    notes: "",
    attachments: [],
    costPerActivity: 0,
    ticketType: "Question",
    premiumSupport: false,
    priority: "Medium"
    // Removed isTicket
  });

  // Edit form state
  const [editActivity, setEditActivity] = useState({
    id: "",
    activityType: "",
    category: "",
    linkedClient: "",
    unitType: "Government",
    date: "",
    time: "",
    responsible: [],
    status: "",
    deadline: "",
    reminderDate: "",
    nextStep: "",
    nextStepDate: "",
    notes: "",
    attachments: [],
    costPerActivity: 0,
    premiumSupport: false,
    priority: ""
  });

  const availableMembersForNew = React.useMemo(() => {
    const org = organizationsList.find(o => o.organizationName === newActivity.linkedClient);
    const defaults = ["Ana Marić", "Marko Petrović", "Petra Babić", "Luka Novak", "Sofia Antić"];
    return org?.responsibleMembers?.length ? org.responsibleMembers : defaults;
  }, [organizationsList, newActivity.linkedClient]);

  const availableMembersForEdit = React.useMemo(() => {
    const org = organizationsList.find(o => o.organizationName === editActivity.linkedClient);
    const defaults = ["Ana Marić", "Marko Petrović", "Petra Babić", "Luka Novak", "Sofia Antić"];
    return org?.responsibleMembers?.length ? org.responsibleMembers : defaults;
  }, [organizationsList, editActivity.linkedClient]);

  // Filtered activities
  const filteredActivities = activitiesList.filter((activity) => {
    const responsibleString = Array.isArray(activity.responsible) ? activity.responsible.join(", ") : activity.responsible;
    const matchesSearch = activity.linkedClient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         responsibleString.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All Types" || activity.activityType === selectedType;
    const matchesCategory = selectedCategory === "All Categories" || activity.category === selectedCategory;
    const matchesStatus = selectedStatus === "All Statuses" || activity.status === selectedStatus;
    const matchesMember = selectedMember === "All Members" || responsibleString.includes(selectedMember);
    const matchesPriority = selectedPriority === "All Priorities" || activity.priority === selectedPriority;
    const matchesClient = selectedClient === "All Clients" || activity.linkedClient === selectedClient;
    const matchesFromDate = !fromDate || activity.date >= fromDate;
    const matchesToDate = !toDate || activity.date <= toDate;

    return matchesSearch && matchesType && matchesCategory && matchesStatus &&
           matchesMember && matchesPriority && matchesClient && matchesFromDate && matchesToDate;
  });

  const handleInputChange = (field, value) => {
    setNewActivity(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddActivity = () => {
    if (!newActivity.activityType || !newActivity.linkedClient || !newActivity.date || !newActivity.time) {
      alert("Please fill in all required fields");
      return;
    }


    const activity = {
      id: activitiesList.length + 1,
      ...newActivity,
      costPerActivity: parseFloat(newActivity.costPerActivity) || 0,
      activityLog: [
        { user: newActivity.responsible, action: "Created", timestamp: new Date().toLocaleString() }
      ]
    };

    const updatedActivities = [activity, ...activitiesList];
    setActivitiesList(updatedActivities);
    localStorage.setItem('activitiesList', JSON.stringify(updatedActivities));
    setNewActivity({
      activityType: "",
      category: "Support",
      linkedClient: "",
      unitType: "Government",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      responsible: [],
      status: "To Do",
      deadline: "",
      reminderDate: "",
      nextStep: "",
      nextStepDate: "",
      notes: "",
      attachments: [],
      costPerActivity: 0,
      premiumSupport: false,
      priority: "Medium"
    });
    setIsDialogOpen(false);
  };

  const handleViewActivity = (activity) => {
    setSelectedActivity(activity);
    setIsViewDialogOpen(true);
  };

  const handleOpenMaps = (clientName) => {
    const address = clientAddresses[clientName];
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      alert("Address not available for this client");
    }
  };

  const handleEditActivity = (activity) => {
    setEditActivity({
      id: activity.id,
      activityType: activity.activityType,
      category: activity.category,
      linkedClient: activity.linkedClient,
      unitType: activity.unitType || "Government",
      date: activity.date,
      time: activity.time,
      responsible: activity.responsible || [],
      status: activity.status,
      deadline: activity.deadline,
      reminderDate: activity.reminderDate,
      nextStep: activity.nextStep,
      nextStepDate: activity.nextStepDate,
      notes: activity.notes,
      attachments: activity.attachments || [],
      costPerActivity: activity.costPerActivity,
      premiumSupport: activity.premiumSupport,
      priority: activity.priority
    });
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (field, value) => {
    setEditActivity(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateActivity = () => {
    if (!editActivity.activityType || !editActivity.linkedClient || !editActivity.date || !editActivity.time) {
      alert("Please fill in all required fields");
      return;
    }

    const updatedActivity = {
      ...editActivity,
      costPerActivity: parseFloat(editActivity.costPerActivity) || 0,
      activityLog: [
        ...activitiesList.find(a => a.id === editActivity.id)?.activityLog || [],
        { user: editActivity.responsible, action: "Updated", timestamp: new Date().toLocaleString() }
      ]
    };

    const updatedActivitiesList = activitiesList.map(activity =>
      activity.id === editActivity.id ? updatedActivity : activity
    );
    setActivitiesList(updatedActivitiesList);
    localStorage.setItem('activitiesList', JSON.stringify(updatedActivitiesList));

    setIsEditDialogOpen(false);
    setIsViewDialogOpen(false); // Close view dialog too
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("All Types");
    setSelectedCategory("All Categories");
    setSelectedStatus("All Statuses");
    setSelectedMember("All Members");
    setSelectedPriority("All Priorities");
    setSelectedClient("All Clients");
    setFromDate("");
    setToDate("");
  };

  const handleDeleteActivity = (id) => {
    const updated = activitiesList.filter(a => a.id !== id);
    setActivitiesList(updated);
    localStorage.setItem('activitiesList', JSON.stringify(updated));
  };

  const handleBulkDeleteByClient = () => {
    if (!selectedClient || selectedClient === "All Clients") return;
    const should = window.confirm(`Delete all activities for ${selectedClient}?`);
    if (!should) return;
    const updated = activitiesList.filter(a => a.linkedClient !== selectedClient);
    setActivitiesList(updated);
    localStorage.setItem('activitiesList', JSON.stringify(updated));
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activities & Tickets</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive activity tracking and ticket management system
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => open && setIsDialogOpen(open)}>
          <div className="flex items-center gap-2">
            <a href="/projects">
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">Create Project</Button>
            </a>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Activity
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Create New Activity</DialogTitle>
              <DialogDescription>
                Add a comprehensive activity with full tracking capabilities
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Activity Type */}
              <div className="space-y-2">
                <Label htmlFor="activityType">Activity Type *</Label>
                <Select value={newActivity.activityType} onValueChange={(value) => handleInputChange('activityType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Call">Call</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Online Meeting">Online Meeting</SelectItem>
                    <SelectItem value="In-person Meeting">In-person Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category - Horizontal Radio Buttons */}
              <div className="space-y-3">
                <Label>Category *</Label>
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="category-sales"
                      name="category"
                      value="Sales"
                      checked={newActivity.category === "Sales"}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor="category-sales" className="text-sm font-medium">Sales</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="category-support"
                      name="category"
                      value="Support"
                      checked={newActivity.category === "Support"}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor="category-support" className="text-sm font-medium">Support</Label>
                  </div>
                </div>
              </div>

              {/* Client & Unit Type */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedClient">Linked Client *</Label>
                  <Select value={newActivity.linkedClient} onValueChange={(value) => handleInputChange('linkedClient', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.filter(c => c !== "All Clients").sort().map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Unit Type - Horizontal Radio Buttons */}
                <div className="space-y-3">
                  <Label>Unit Type</Label>
                  <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="unit-government"
                        name="unitType"
                        value="Government"
                        checked={newActivity.unitType === "Government"}
                        onChange={(e) => handleInputChange('unitType', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <Label htmlFor="unit-government" className="text-sm font-medium">Government</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="unit-independent"
                        name="unitType"
                        value="Independent"
                        checked={newActivity.unitType === "Independent"}
                        onChange={(e) => handleInputChange('unitType', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <Label htmlFor="unit-independent" className="text-sm font-medium">Independent</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newActivity.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newActivity.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                </div>
              </div>

              {/* Responsible Team Members - Checkboxes */}
              <div className="space-y-3">
                <Label>Responsible Team Members *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {availableMembersForNew.map((member) => (
                    <div key={member} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`responsible-${member.replace(' ', '-').toLowerCase()}`}
                        checked={newActivity.responsible.includes(member)}
                        onChange={(e) => {
                          const updatedResponsible = e.target.checked
                            ? [...newActivity.responsible, member]
                            : newActivity.responsible.filter(m => m !== member);
                          handleInputChange('responsible', updatedResponsible);
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                      />
                      <Label htmlFor={`responsible-${member.replace(' ', '-').toLowerCase()}`} className="text-sm font-medium">
                        {member}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status, Priority & Deadline */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newActivity.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="To Do" className={getStatusColor("To Do") + " hover:opacity-90"}>To Do</SelectItem>
                      <SelectItem value="In Progress" className={getStatusColor("In Progress") + " hover:opacity-90"}>In Progress</SelectItem>
                      <SelectItem value="Done" className={getStatusColor("Done") + " hover:opacity-90"}>Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newActivity.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low" className={getPriorityColor("Low") + " hover:opacity-90"}>Low</SelectItem>
                      <SelectItem value="Medium" className={getPriorityColor("Medium") + " hover:opacity-90"}>Medium</SelectItem>
                      <SelectItem value="High" className={getPriorityColor("High") + " hover:opacity-90"}>High</SelectItem>
                      <SelectItem value="Urgent" className={getPriorityColor("Urgent") + " hover:opacity-90"}>Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newActivity.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                  />
                </div>
              </div>

              {/* Reminder & Next Step Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reminderDate">Reminder Date</Label>
                  <Input
                    id="reminderDate"
                    type="date"
                    value={newActivity.reminderDate}
                    onChange={(e) => handleInputChange('reminderDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextStepDate">Next Step Date</Label>
                  <Input
                    id="nextStepDate"
                    type="date"
                    value={newActivity.nextStepDate}
                    onChange={(e) => handleInputChange('nextStepDate', e.target.value)}
                  />
                </div>
              </div>

              {/* Next Step */}
              <div className="space-y-2">
                <Label htmlFor="nextStep">Next Step</Label>
                <Input
                  id="nextStep"
                  placeholder="Describe the next action to be taken"
                  value={newActivity.nextStep}
                  onChange={(e) => handleInputChange('nextStep', e.target.value)}
                />
              </div>

              {/* Activity Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costPerActivity">Cost (��)</Label>
                  <Input
                    id="costPerActivity"
                    type="number"
                    placeholder="0"
                    value={newActivity.costPerActivity}
                    onChange={(e) => handleInputChange('costPerActivity', e.target.value)}
                  />
                </div>
                <div className="space-y-2 flex items-center gap-4 pt-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="premiumSupport"
                      checked={newActivity.premiumSupport}
                      onChange={(e) => handleInputChange('premiumSupport', e.target.checked)}
                    />
                    <Label htmlFor="premiumSupport">Premium</Label>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter activity notes and details..."
                  value={newActivity.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddActivity} className="bg-blue-600 hover:bg-blue-700">
                Create Activity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Filters */}
      <Card className="border border-blue-200 bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Advanced Activity Filters</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
              >
                <Filter className="h-4 w-4 mr-1" />
                Reset Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDeleteByClient}
                disabled={selectedClient === "All Clients"}
                className="border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50"
                title="Delete all activities for the selected client"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Activities
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search activities, clients, or notes..." 
                className="pl-10 bg-background/80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-background/80">
                  <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className={`bg-background/80 ${selectedCategory !== "All Categories" ? getCategoryColor(selectedCategory) : ""}`}>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className={category !== "All Categories" ? getCategoryColor(category) + " hover:opacity-90" : "hover:bg-gray-50"}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className={`bg-background/80 ${selectedStatus !== "All Statuses" ? getStatusColor(selectedStatus) : ""}`}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className={status !== "All Statuses" ? getStatusColor(status) + " hover:opacity-90" : "hover:bg-gray-50"}
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>

            {/* Filter Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="bg-background/80">
                  <SelectValue placeholder="Client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client} value={client}>{client}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger className="bg-background/80">
                  <SelectValue placeholder="Team Member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member} value={member}>{member}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className={`bg-background/80 ${selectedPriority !== "All Priorities" ? getPriorityColor(selectedPriority) : ""}`}>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem
                      key={priority}
                      value={priority}
                      className={priority !== "All Priorities" ? getPriorityColor(priority) + " hover:opacity-90" : "hover:bg-gray-50"}
                    >
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>

            {/* Date Range Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromDate" className="text-sm font-medium text-gray-700">From Date</Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-background/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toDate" className="text-sm font-medium text-gray-700">To Date</Label>
                <Input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-background/80"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="border-blue-200/50 bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg mt-1 ${getCategoryIconBackground(activity.category)}`}>
                    {getActivityTypeIcon(activity.activityType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3 mt-1">
                      <h3 className="font-semibold text-foreground">{activity.linkedClient}</h3>
                      <Badge variant="outline" className={getCategoryColor(activity.category)}>
                        {activity.category}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                      {activity.isTicket && (
                        <Badge variant="outline" className={getTicketTypeColor(activity.ticketType)}>
                          {getTicketTypeIcon(activity.ticketType)}
                          <span className="ml-1">{activity.ticketType}</span>
                        </Badge>
                      )}
                      {activity.premiumSupport && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Star className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{activity.notes}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{activity.date} at {activity.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{Array.isArray(activity.responsible) ? activity.responsible.join(", ") : activity.responsible}</span>
                      </div>
                      <div
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                        onClick={() => handleOpenMaps(activity.linkedClient)}
                        title="View client location on Google Maps"
                      >
                        <MapPin className="h-3 w-3" />
                        <span className="hover:underline">Location</span>
                      </div>
                      {activity.deadline && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Due: {activity.deadline}</span>
                        </div>
                      )}
                      {activity.costPerActivity > 0 && (
                        <div className="flex items-center space-x-1">
                          <Euro className="h-3 w-3" />
                          <span>€{activity.costPerActivity}</span>
                        </div>
                      )}
                    </div>

                    {activity.nextStep && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                        <strong>Next Step:</strong> {activity.nextStep}
                        {activity.nextStepDate && <span className="ml-2 text-muted-foreground">({activity.nextStepDate})</span>}
                      </div>
                    )}

                    {activity.attachments.length > 0 && (
                      <div className="mt-2 flex items-center space-x-1">
                        <Paperclip className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {activity.attachments.length} attachment(s)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2 mt-1">
                  <Badge variant="outline" className={getPriorityColor(activity.priority)}>
                    {activity.priority}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewActivity(activity)}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditActivity(activity)}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Activity Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedActivity && getActivityTypeIcon(selectedActivity.activityType)}
              <span>{selectedActivity?.linkedClient} - Activity Details</span>
            </DialogTitle>
            <DialogDescription>
              Comprehensive activity and ticket information
            </DialogDescription>
          </DialogHeader>
          
          {selectedActivity && (
            <div className="space-y-6">
              {/* Status Overview */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Badge className={getStatusColor(selectedActivity.status)}>
                    {selectedActivity.status}
                  </Badge>
                  <p className="text-xs text-gray-600 mt-1">Status</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Badge className={getPriorityColor(selectedActivity.priority)}>
                    {selectedActivity.priority}
                  </Badge>
                  <p className="text-xs text-gray-600 mt-1">Priority</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Badge className={getCategoryColor(selectedActivity.category)}>
                    {selectedActivity.category}
                  </Badge>
                  <p className="text-xs text-gray-600 mt-1">Category</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="font-bold text-blue-800">€{selectedActivity.costPerActivity}</p>
                  <p className="text-xs text-gray-600 mt-1">Cost</p>
                </div>
              </div>

              {/* Activity Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-800">Activity Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Activity Type</p>
                      <p className="text-sm text-gray-600">{selectedActivity.activityType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date & Time</p>
                      <p className="text-sm text-gray-600">{selectedActivity.date} at {selectedActivity.time}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Responsible</p>
                      <p className="text-sm text-gray-600">{selectedActivity.responsible}</p>
                    </div>
                    {selectedActivity.deadline && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Deadline</p>
                        <p className="text-sm text-gray-600">{selectedActivity.deadline}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-800">Client & Ticket Info</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Linked Client</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-600">{selectedActivity.linkedClient} ({selectedActivity.unitType || selectedActivity.clientType})</p>
                        <button
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors text-xs hover:bg-blue-50 rounded px-2 py-1"
                          onClick={() => handleOpenMaps(selectedActivity.linkedClient)}
                          title="View client location on Google Maps"
                        >
                          <MapPin className="h-3 w-3" />
                          <span>Location</span>
                        </button>
                      </div>
                    </div>
                    {selectedActivity.isTicket && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Ticket Type</p>
                        <div className="flex items-center space-x-2">
                          {getTicketTypeIcon(selectedActivity.ticketType)}
                          <span className="text-sm text-gray-600">{selectedActivity.ticketType}</span>
                        </div>
                      </div>
                    )}
                    {selectedActivity.premiumSupport && (
                      <div>
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Star className="h-3 w-3 mr-1" />
                          Premium Support
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              {selectedActivity.nextStep && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-800">Next Steps</h3>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedActivity.nextStep}</p>
                    {selectedActivity.nextStepDate && (
                      <p className="text-xs text-gray-600 mt-2">Scheduled for: {selectedActivity.nextStepDate}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-800">Notes</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{selectedActivity.notes}</p>
                </div>
              </div>

              {/* Attachments */}
              {selectedActivity.attachments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-800">Attachments</h3>
                  <div className="space-y-2">
                    {selectedActivity.attachments.map((attachment, idx) => (
                      <div key={idx} className="flex items-center space-x-2 p-2 bg-blue-50 rounded border">
                        <Paperclip className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-700">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity Log */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-800">Activity Log</h3>
                <div className="space-y-2">
                  {selectedActivity.activityLog.map((log, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                      <User className="h-3 w-3 text-gray-600" />
                      <span className="font-medium">{log.user}</span>
                      <span className="text-gray-600">{log.action}</span>
                      <span className="text-gray-500 text-xs ml-auto">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setIsViewDialogOpen(false);
                handleEditActivity(selectedActivity);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Activity Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Activity/Ticket</DialogTitle>
            <DialogDescription>
              Update activity or support ticket information with full tracking capabilities.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Activity Type & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-activityType">Activity Type *</Label>
                <Select value={editActivity.activityType} onValueChange={(value) => handleEditInputChange('activityType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Call">Call</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Online Meeting">Online Meeting</SelectItem>
                    <SelectItem value="In-person Meeting">In-person Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Category - Horizontal Radio Buttons */}
              <div className="space-y-3">
                <Label>Category *</Label>
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="edit-category-sales"
                      name="editCategory"
                      value="Sales"
                      checked={editActivity.category === "Sales"}
                      onChange={(e) => handleEditInputChange('category', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor="edit-category-sales" className="text-sm font-medium">Sales</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="edit-category-support"
                      name="editCategory"
                      value="Support"
                      checked={editActivity.category === "Support"}
                      onChange={(e) => handleEditInputChange('category', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor="edit-category-support" className="text-sm font-medium">Support</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Client & Unit Type */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-linkedClient">Linked Client *</Label>
                <Select value={editActivity.linkedClient} onValueChange={(value) => handleEditInputChange('linkedClient', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.filter(c => c !== "All Clients").sort().map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Unit Type - Horizontal Radio Buttons */}
              <div className="space-y-3">
                <Label>Unit Type</Label>
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="edit-unit-government"
                      name="editUnitType"
                      value="Government"
                      checked={editActivity.unitType === "Government"}
                      onChange={(e) => handleEditInputChange('unitType', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor="edit-unit-government" className="text-sm font-medium">Government</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="edit-unit-independent"
                      name="editUnitType"
                      value="Independent"
                      checked={editActivity.unitType === "Independent"}
                      onChange={(e) => handleEditInputChange('unitType', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor="edit-unit-independent" className="text-sm font-medium">Independent</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editActivity.date}
                  onChange={(e) => handleEditInputChange('date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time">Time *</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editActivity.time}
                  onChange={(e) => handleEditInputChange('time', e.target.value)}
                />
              </div>
            </div>

            {/* Responsible Team Members - Checkboxes */}
            <div className="space-y-3">
              <Label>Responsible Team Members *</Label>
              <div className="grid grid-cols-2 gap-3">
                {availableMembersForEdit.map((member) => (
                  <div key={member} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-responsible-${member.replace(' ', '-').toLowerCase()}`}
                      checked={Array.isArray(editActivity.responsible) ? editActivity.responsible.includes(member) : false}
                      onChange={(e) => {
                        const currentResponsible = Array.isArray(editActivity.responsible) ? editActivity.responsible : [];
                        const updatedResponsible = e.target.checked
                          ? [...currentResponsible, member]
                          : currentResponsible.filter(m => m !== member);
                        handleEditInputChange('responsible', updatedResponsible);
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                    />
                    <Label htmlFor={`edit-responsible-${member.replace(' ', '-').toLowerCase()}`} className="text-sm font-medium">
                      {member}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status, Priority & Deadline */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editActivity.status} onValueChange={(value) => handleEditInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do" className={getStatusColor("To Do") + " hover:opacity-90"}>To Do</SelectItem>
                    <SelectItem value="In Progress" className={getStatusColor("In Progress") + " hover:opacity-90"}>In Progress</SelectItem>
                    <SelectItem value="Done" className={getStatusColor("Done") + " hover:opacity-90"}>Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select value={editActivity.priority} onValueChange={(value) => handleEditInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low" className={getPriorityColor("Low") + " hover:opacity-90"}>Low</SelectItem>
                    <SelectItem value="Medium" className={getPriorityColor("Medium") + " hover:opacity-90"}>Medium</SelectItem>
                    <SelectItem value="High" className={getPriorityColor("High") + " hover:opacity-90"}>High</SelectItem>
                    <SelectItem value="Urgent" className={getPriorityColor("Urgent") + " hover:opacity-90"}>Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-deadline">Deadline</Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={editActivity.deadline}
                  onChange={(e) => handleEditInputChange('deadline', e.target.value)}
                />
              </div>
            </div>

            {/* Reminder & Next Step Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-reminderDate">Reminder Date</Label>
                <Input
                  id="edit-reminderDate"
                  type="date"
                  value={editActivity.reminderDate}
                  onChange={(e) => handleEditInputChange('reminderDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-nextStepDate">Next Step Date</Label>
                <Input
                  id="edit-nextStepDate"
                  type="date"
                  value={editActivity.nextStepDate}
                  onChange={(e) => handleEditInputChange('nextStepDate', e.target.value)}
                />
              </div>
            </div>

            {/* Next Step */}
            <div className="space-y-2">
              <Label htmlFor="edit-nextStep">Next Step</Label>
              <Input
                id="edit-nextStep"
                placeholder="Describe the next action to be taken"
                value={editActivity.nextStep}
                onChange={(e) => handleEditInputChange('nextStep', e.target.value)}
              />
            </div>

            {/* Activity Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-costPerActivity">Cost (€)</Label>
                <Input
                  id="edit-costPerActivity"
                  type="number"
                  placeholder="0"
                  value={editActivity.costPerActivity}
                  onChange={(e) => handleEditInputChange('costPerActivity', e.target.value)}
                />
              </div>
              <div className="space-y-2 flex items-center gap-4 pt-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-premiumSupport"
                    checked={editActivity.premiumSupport}
                    onChange={(e) => handleEditInputChange('premiumSupport', e.target.checked)}
                  />
                  <Label htmlFor="edit-premiumSupport">Premium</Label>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                placeholder="Enter activity notes and details..."
                value={editActivity.notes}
                onChange={(e) => handleEditInputChange('notes', e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateActivity} className="bg-blue-600 hover:bg-blue-700">
              Update Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
