import { useState } from "react";
import { getKAMNames } from "@/constants/teamMembers";
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
  Building,
  MapPin,
  Euro,
  Calendar,
  User,
  FileText,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Download,
  Paperclip,
  Users,
  DollarSign,
  CreditCard,
  Clock,
  Star,
  Filter,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Enhanced client data with urgency indicators
const clientData = [
  {
    id: 1,
    name: "Zagreb Municipality",
    type: "LRSU",
    clientType: "Municipality",
    contractType: "Tender",
    contractValue: 45000,
    vatAmount: 11250,
    contractStart: "2024-01-01",
    contractEnd: "2026-12-31",
    paymentMethod: "Monthly",
    paymentDeadline: "15th of month",
    kam: "Ana Marić",
    status: "Active",
    county: "Zagreb",
    address: "Trg bana Jelačića 1, Zagreb, Croatia",
    contactPersons: [
      { name: "Ivan Horvat", role: "IT Manager", phone: "+385 1 234 5678", email: "ivan.horvat@zagreb.hr" }
    ],
    notes: "Excellent relationship. Always pays on time. Looking to expand services.",
    revenue: 45000,
    costs: 32000,
    profitability: 28.9,
    attachments: ["contract_2024.pdf", "service_agreement.pdf"],
    relatedContacts: ["Split Municipality", "Osijek City"],
    lastContact: "2024-01-10",
    nextPayment: "2024-01-15",
    contractRenewal: "2026-11-01",
    priority: "high"
  },
  {
    id: 2,
    name: "Sports Club Dinamo",
    type: "Club",
    clientType: "Sports Club",
    contractType: "Justification",
    contractValue: 12000,
    vatAmount: 3000,
    contractStart: "2024-03-01",
    contractEnd: "2025-02-28",
    paymentMethod: "Quarterly",
    paymentDeadline: "End of quarter",
    kam: "Marko Petrović",
    status: "Active",
    county: "Zagreb",
    address: "Maksimirska 128, Zagreb, Croatia",
    contactPersons: [
      { name: "Petra Kovač", role: "Secretary", phone: "+385 1 987 6543", email: "petra@dinamo.hr" }
    ],
    notes: "Growing club with potential for upgrade. Good payment history.",
    revenue: 12000,
    costs: 9500,
    profitability: 20.8,
    attachments: ["contract_dinamo.pdf"],
    relatedContacts: ["HNK Hajduk", "NK Osijek"],
    lastContact: "2024-01-08",
    nextPayment: "2024-03-31",
    contractRenewal: "2024-12-01",
    priority: "medium"
  },
  {
    id: 3,
    name: "Split City Council",
    type: "LRSU",
    clientType: "City",
    contractType: "Tender",
    contractValue: 75000,
    vatAmount: 18750,
    contractStart: "2024-06-01",
    contractEnd: "2027-05-31",
    paymentMethod: "Monthly",
    paymentDeadline: "30th of month",
    kam: "Ana Marić",
    status: "Potential",
    county: "Split-Dalmatia",
    address: "Peristil bb, Split, Croatia",
    contactPersons: [
      { name: "Luka Milic", role: "Deputy Mayor", phone: "+385 21 555 123", email: "luka.milic@split.hr" }
    ],
    notes: "High-value prospect. Currently in final negotiation phase.",
    revenue: 0,
    costs: 5000,
    profitability: -100,
    attachments: ["proposal_split.pdf", "demo_presentation.pdf"],
    relatedContacts: ["Rijeka Port", "Zadar Municipality"],
    lastContact: "2024-01-12",
    nextPayment: null,
    contractRenewal: null,
    priority: "urgent"
  },
  {
    id: 4,
    name: "Tech Solutions Ltd",
    type: "Company",
    clientType: "SME",
    contractType: "Direct",
    contractValue: 25000,
    vatAmount: 6250,
    contractStart: "2023-09-01",
    contractEnd: "2024-08-31",
    paymentMethod: "Bi-annual",
    paymentDeadline: "March 31, September 30",
    kam: "Marko Petrović",
    status: "Expired",
    county: "Zagreb",
    address: "Ilica 242, Zagreb, Croatia",
    contactPersons: [
      { name: "Stjepan Novak", role: "CEO", phone: "+385 1 444 7890", email: "stjepan@techsolutions.hr" }
    ],
    notes: "Contract expired. Needs renewal follow-up. Good technical partnership.",
    revenue: 25000,
    costs: 18000,
    profitability: 28.0,
    attachments: ["expired_contract.pdf", "renewal_proposal.pdf"],
    relatedContacts: ["Digital Craft", "Code Factory"],
    lastContact: "2023-12-15",
    nextPayment: null,
    contractRenewal: "2024-01-15",
    priority: "urgent"
  },
  {
    id: 5,
    name: "Crafters Association Zagreb",
    type: "Association",
    clientType: "Craftsmen",
    contractType: "Justification",
    contractValue: 8000,
    vatAmount: 2000,
    contractStart: "2024-02-01",
    contractEnd: "2025-01-31",
    paymentMethod: "Annual",
    paymentDeadline: "February 28",
    kam: "Petra Babić",
    status: "Active",
    county: "Zagreb",
    address: "Praška 3, Zagreb, Croatia",
    contactPersons: [
      { name: "Marija Craft", role: "President", phone: "+385 1 333 2222", email: "marija@crafters-zg.hr" }
    ],
    notes: "Reliable small client. Potential to connect with other associations.",
    revenue: 8000,
    costs: 6200,
    profitability: 22.5,
    attachments: ["association_contract.pdf"],
    relatedContacts: ["Craftsmen Union", "Trade Association"],
    lastContact: "2024-01-05",
    nextPayment: "2025-02-28",
    contractRenewal: "2024-11-01",
    priority: "low"
  }
];

const clientTypes = ["All Types", "LRSU", "Club", "Company", "Association"];
const contractTypes = ["All Contracts", "Tender", "Justification", "Direct"];
const statuses = ["All Statuses", "Active", "Expired", "Potential"];
const counties = ["All Counties", "Zagreb", "Split-Dalmatia", "Osijek-Baranja", "Primorje-Gorski Kotar"];
const contractValueRanges = ["All Values", "Under €10K", "€10K - €25K", "€25K - €50K", "Over €50K"];
const financialHealth = ["All Health", "Profitable", "Break-even", "Loss-making"];
const kamList = ["All KAMs", ...getKAMNames()];
const paymentMethods = ["Monthly", "Quarterly", "Bi-annual", "Annual"];

const getStatusColor = (status) => {
  switch (status) {
    case "Active": return "bg-green-100 text-green-800 border-green-200";
    case "Expired": return "bg-red-100 text-red-800 border-red-200";
    case "Potential": return "bg-blue-100 text-blue-800 border-blue-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "urgent": return "bg-red-100 text-red-800 border-red-200";
    case "high": return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low": return "bg-green-100 text-green-800 border-green-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getProfitabilityColor = (profitability) => {
  if (profitability > 20) return "text-green-600";
  if (profitability > 0) return "text-yellow-600";
  return "text-red-600";
};

const getProfitabilityIcon = (profitability) => {
  if (profitability > 0) return <TrendingUp className="h-3 w-3" />;
  return <TrendingDown className="h-3 w-3" />;
};

const getPaymentUrgency = (nextPayment, status) => {
  if (!nextPayment || status !== "Active") return { color: "text-gray-400", icon: Clock, label: "N/A" };
  
  const paymentDate = new Date(nextPayment);
  const today = new Date();
  const diffTime = paymentDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return { color: "text-red-600", icon: AlertTriangle, label: "Overdue" };
  if (diffDays <= 3) return { color: "text-red-500", icon: Clock, label: `${diffDays}d` };
  if (diffDays <= 7) return { color: "text-orange-500", icon: Clock, label: `${diffDays}d` };
  return { color: "text-green-500", icon: CheckCircle, label: `${diffDays}d` };
};

const formatCurrency = (amount) => {
  return `€${amount.toLocaleString()}`;
};

const matchesContractValue = (value, range) => {
  switch (range) {
    case "Under €10K": return value < 10000;
    case "€10K - €25K": return value >= 10000 && value < 25000;
    case "€25K - €50K": return value >= 25000 && value < 50000;
    case "Over €50K": return value >= 50000;
    default: return true;
  }
};

const matchesFinancialHealth = (profitability, health) => {
  switch (health) {
    case "Profitable": return profitability > 5;
    case "Break-even": return profitability >= -5 && profitability <= 5;
    case "Loss-making": return profitability < -5;
    default: return true;
  }
};

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedContract, setSelectedContract] = useState("All Contracts");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedCounty, setSelectedCounty] = useState("All Counties");
  const [selectedValue, setSelectedValue] = useState("All Values");
  const [selectedHealth, setSelectedHealth] = useState("All Health");
  const [selectedKAM, setSelectedKAM] = useState("All KAMs");
  const [sortBy, setSortBy] = useState("name");
  const [selectedClient, setSelectedClient] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [clientList, setClientList] = useState(clientData.map(client => ({ ...client, isFavorite: false })));

  // Form state for new client
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    clientType: "",
    contractType: "",
    contractValue: "",
    vatAmount: "",
    contractStart: "",
    contractEnd: "",
    paymentMethod: "",
    paymentDeadline: "",
    kam: "",
    status: "",
    county: "",
    address: "",
    contactName: "",
    contactRole: "",
    contactPhone: "",
    contactEmail: "",
    notes: "",
    relatedContacts: ""
  });

  // Form state for editing client
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    type: "",
    clientType: "",
    contractType: "",
    contractValue: "",
    vatAmount: "",
    contractStart: "",
    contractEnd: "",
    paymentMethod: "",
    paymentDeadline: "",
    kam: "",
    status: "",
    county: "",
    address: "",
    contactName: "",
    contactRole: "",
    contactPhone: "",
    contactEmail: "",
    notes: "",
    relatedContacts: ""
  });

  const filteredData = clientList.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.kam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All Types" || client.type === selectedType;
    const matchesContract = selectedContract === "All Contracts" || client.contractType === selectedContract;
    const matchesStatus = selectedStatus === "All Statuses" || client.status === selectedStatus;
    const matchesCounty = selectedCounty === "All Counties" || client.county === selectedCounty;
    const matchesValue = selectedValue === "All Values" || matchesContractValue(client.contractValue, selectedValue);
    const matchesHealth = selectedHealth === "All Health" || matchesFinancialHealth(client.profitability, selectedHealth);
    const matchesKAM = selectedKAM === "All KAMs" || client.kam === selectedKAM;

    return matchesSearch && matchesType && matchesContract && matchesStatus && 
           matchesCounty && matchesValue && matchesHealth && matchesKAM;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "name": return a.name.localeCompare(b.name);
      case "value": return b.contractValue - a.contractValue;
      case "profitability": return b.profitability - a.profitability;
      default: return 0;
    }
  });

  const handleAddClient = () => {
    const newClient = {
      id: clientList.length + 1,
      name: formData.name,
      type: formData.type,
      clientType: formData.clientType,
      contractType: formData.contractType,
      contractValue: parseInt(formData.contractValue) || 0,
      vatAmount: parseInt(formData.vatAmount) || 0,
      contractStart: formData.contractStart,
      contractEnd: formData.contractEnd,
      paymentMethod: formData.paymentMethod,
      paymentDeadline: formData.paymentDeadline,
      kam: formData.kam,
      status: formData.status,
      county: formData.county,
      address: formData.address,
      contactPersons: [{
        name: formData.contactName,
        role: formData.contactRole,
        phone: formData.contactPhone,
        email: formData.contactEmail
      }],
      notes: formData.notes,
      revenue: formData.status === "Active" ? parseInt(formData.contractValue) || 0 : 0,
      costs: Math.round((parseInt(formData.contractValue) || 0) * 0.7),
      profitability: 30,
      attachments: [],
      relatedContacts: formData.relatedContacts.split(',').map(c => c.trim()).filter(c => c),
      lastContact: new Date().toISOString().split('T')[0],
      nextPayment: formData.status === "Active" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
      contractRenewal: formData.contractEnd ? new Date(new Date(formData.contractEnd).getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
      priority: "medium",
      isFavorite: false
    };

    setClientList([...clientList, newClient]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setFormData({
      name: "", type: "", clientType: "", contractType: "", contractValue: "", vatAmount: "",
      contractStart: "", contractEnd: "", paymentMethod: "", paymentDeadline: "", kam: "", status: "",
      county: "", address: "", contactName: "", contactRole: "", contactPhone: "", contactEmail: "", notes: "", relatedContacts: ""
    });
  };

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };

  const handleEditClient = (client) => {
    setEditFormData({
      id: client.id,
      name: client.name,
      type: client.type,
      clientType: client.clientType,
      contractType: client.contractType,
      contractValue: client.contractValue.toString(),
      vatAmount: client.vatAmount.toString(),
      contractStart: client.contractStart,
      contractEnd: client.contractEnd,
      paymentMethod: client.paymentMethod,
      paymentDeadline: client.paymentDeadline,
      kam: client.kam,
      status: client.status,
      county: client.county,
      address: client.address || "",
      contactName: client.contactPersons[0]?.name || "",
      contactRole: client.contactPersons[0]?.role || "",
      contactPhone: client.contactPersons[0]?.phone || "",
      contactEmail: client.contactPersons[0]?.email || "",
      notes: client.notes,
      relatedContacts: client.relatedContacts.join(", ")
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateClient = () => {
    const updatedClient = {
      ...clientList.find(c => c.id === editFormData.id),
      name: editFormData.name,
      type: editFormData.type,
      clientType: editFormData.clientType,
      contractType: editFormData.contractType,
      contractValue: parseInt(editFormData.contractValue) || 0,
      vatAmount: parseInt(editFormData.vatAmount) || 0,
      contractStart: editFormData.contractStart,
      contractEnd: editFormData.contractEnd,
      paymentMethod: editFormData.paymentMethod,
      paymentDeadline: editFormData.paymentDeadline,
      kam: editFormData.kam,
      status: editFormData.status,
      county: editFormData.county,
      address: editFormData.address,
      contactPersons: [{
        name: editFormData.contactName,
        role: editFormData.contactRole,
        phone: editFormData.contactPhone,
        email: editFormData.contactEmail
      }],
      notes: editFormData.notes,
      relatedContacts: editFormData.relatedContacts.split(',').map(c => c.trim()).filter(c => c),
      revenue: editFormData.status === "Active" ? parseInt(editFormData.contractValue) || 0 : 0,
      costs: Math.round((parseInt(editFormData.contractValue) || 0) * 0.7),
      profitability: editFormData.status === "Active" ? 30 : -100,
      lastContact: new Date().toISOString().split('T')[0],
      nextPayment: editFormData.status === "Active" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
      contractRenewal: editFormData.contractEnd ? new Date(new Date(editFormData.contractEnd).getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null
    };

    setClientList(clientList.map(client =>
      client.id === editFormData.id ? updatedClient : client
    ));
    setIsEditDialogOpen(false);
  };

  const handleToggleFavorite = (clientId) => {
    setClientList(clientList.map(client =>
      client.id === clientId ? { ...client, isFavorite: !client.isFavorite } : client
    ));
  };

  const handleOpenMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xl">
              <Users className="h-10 w-10" />
            </div>
            <div className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-blue-800 mb-2">
          Client Database
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Comprehensive client management and relationship tracking
        </p>
      </div>

      {/* Filters Section */}
      <Card className="border border-blue-200 bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-blue-800">
                <Filter className="h-5 w-5" />
                <span>Advanced Client Filters</span>
              </CardTitle>
              <CardDescription>Filter and analyze your client portfolio</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFiltersOpen((o) => !o)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                aria-expanded={isFiltersOpen}
                aria-controls="client-filters-content"
              >
                {isFiltersOpen ? (
                  <ChevronUp className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-1" />
                )}
                {isFiltersOpen ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent id="client-filters-content" className={isFiltersOpen ? "space-y-4" : "hidden"}>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
            <Input 
              placeholder="Search clients, KAM, or notes..." 
              className="pl-10 bg-white border-blue-200 focus:border-blue-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Rows */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-white border-blue-200">
                <SelectValue placeholder="Client Type" />
              </SelectTrigger>
              <SelectContent>
                {clientTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-white border-blue-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger className="bg-white border-blue-200">
                <SelectValue placeholder="County" />
              </SelectTrigger>
              <SelectContent>
                {counties.map((county) => (
                  <SelectItem key={county} value={county}>{county}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedKAM} onValueChange={setSelectedKAM}>
              <SelectTrigger className="bg-white border-blue-200">
                <SelectValue placeholder="KAM" />
              </SelectTrigger>
              <SelectContent>
                {kamList.map((kam) => (
                  <SelectItem key={kam} value={kam}>{kam}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results and Actions */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-600">
              Found {sortedData.length} client{sortedData.length !== 1 ? 's' : ''}
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-blue-200 text-dark-blue hover:bg-light-blue">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-dark-blue hover:bg-dark-blue-hover text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new client
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Client Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter client name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Client Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientTypes.slice(1).map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="clientType">Detailed Type</Label>
                      <Select value={formData.clientType} onValueChange={(value) => setFormData({...formData, clientType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select detailed type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Municipality">Municipality</SelectItem>
                          <SelectItem value="City">City</SelectItem>
                          <SelectItem value="County">County</SelectItem>
                          <SelectItem value="Sports Club">Sports Club</SelectItem>
                          <SelectItem value="SME">SME</SelectItem>
                          <SelectItem value="Craftsmen">Craftsmen</SelectItem>
                          <SelectItem value="Association">Association</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contractType">Contract Type *</Label>
                      <Select value={formData.contractType} onValueChange={(value) => setFormData({...formData, contractType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select contract type" />
                        </SelectTrigger>
                        <SelectContent>
                          {contractTypes.slice(1).map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contractValue">Contract Value (€)</Label>
                      <Input
                        id="contractValue"
                        type="number"
                        value={formData.contractValue}
                        onChange={(e) => setFormData({...formData, contractValue: e.target.value})}
                        placeholder="Enter contract value"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vatAmount">VAT Amount (€)</Label>
                      <Input
                        id="vatAmount"
                        type="number"
                        value={formData.vatAmount}
                        onChange={(e) => setFormData({...formData, vatAmount: e.target.value})}
                        placeholder="Enter VAT amount"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contractStart">Contract Start Date</Label>
                      <Input
                        id="contractStart"
                        type="date"
                        value={formData.contractStart}
                        onChange={(e) => setFormData({...formData, contractStart: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contractEnd">Contract End Date</Label>
                      <Input
                        id="contractEnd"
                        type="date"
                        value={formData.contractEnd}
                        onChange={(e) => setFormData({...formData, contractEnd: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method} value={method}>{method}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentDeadline">Payment Deadline</Label>
                      <Input
                        id="paymentDeadline"
                        value={formData.paymentDeadline}
                        onChange={(e) => setFormData({...formData, paymentDeadline: e.target.value})}
                        placeholder="e.g., 15th of month"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kam">Key Account Manager</Label>
                      <Select value={formData.kam} onValueChange={(value) => setFormData({...formData, kam: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select KAM" />
                        </SelectTrigger>
                        <SelectContent>
                          {kamList.slice(1).map((kam) => (
                            <SelectItem key={kam} value={kam}>{kam}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.slice(1).map((status) => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="county">County</Label>
                      <Select value={formData.county} onValueChange={(value) => setFormData({...formData, county: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                          {counties.slice(1).map((county) => (
                            <SelectItem key={county} value={county}>{county}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Enter full address"
                      />
                    </div>

                    {/* Contact Information */}
                    <div className="col-span-2">
                      <h3 className="text-lg font-semibold mb-4 text-dark-blue">Contact Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactName">Contact Name</Label>
                          <Input
                            id="contactName"
                            value={formData.contactName}
                            onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                            placeholder="Enter contact name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactRole">Contact Role</Label>
                          <Input
                            id="contactRole"
                            value={formData.contactRole}
                            onChange={(e) => setFormData({...formData, contactRole: e.target.value})}
                            placeholder="Enter contact role"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPhone">Phone</Label>
                          <Input
                            id="contactPhone"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                            placeholder="Enter phone number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactEmail">Email</Label>
                          <Input
                            id="contactEmail"
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                            placeholder="Enter email address"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="relatedContacts">Related Contacts</Label>
                      <Input
                        id="relatedContacts"
                        value={formData.relatedContacts}
                        onChange={(e) => setFormData({...formData, relatedContacts: e.target.value})}
                        placeholder="Enter related contacts separated by commas"
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="notes">Notes/Comments</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Enter any notes or comments"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddClient} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Add Client
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedData.map((client) => {
          const paymentUrgency = getPaymentUrgency(client.nextPayment, client.status);
          const UrgencyIcon = paymentUrgency.icon;
          
          return (
            <Card key={client.id} className="border border-blue-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-dark-blue to-blue-600 flex items-center justify-center text-white shadow-lg">
                      <Building className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-800 leading-tight">
                        {client.name}
                      </CardTitle>
                      <p className="text-sm text-blue-600 font-medium flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        KAM: {client.kam}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={`${getStatusColor(client.status)} border text-xs`}>
                      {client.status}
                    </Badge>
                    <Badge className={`${getPriorityColor(client.priority)} border text-xs`}>
                      {client.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Payment Urgency Indicator */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center space-x-2">
                    <UrgencyIcon className={`h-4 w-4 ${paymentUrgency.color}`} />
                    <span className={`text-sm font-medium ${paymentUrgency.color}`}>
                      Next Payment: {paymentUrgency.label}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                    {client.type}
                  </Badge>
                </div>

                {/* Contract Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FileText className="h-3 w-3" />
                      <span className="text-xs">{client.contractType}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Euro className="h-3 w-3" />
                      <span className="text-xs">{formatCurrency(client.contractValue + client.vatAmount)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CreditCard className="h-3 w-3" />
                      <span className="text-xs">{client.paymentMethod}</span>
                    </div>
                    <div
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 cursor-pointer transition-all duration-200 hover:bg-blue-50 rounded p-1 -m-1"
                      onClick={() => handleOpenMaps(client.address)}
                      title="Click to view on Google Maps"
                    >
                      <MapPin className="h-4 w-4" />
                      <span className="text-xs hover:underline font-medium">{client.address || client.county}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Overview */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-sm text-gray-700 font-medium mb-2">Financial Overview</p>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="text-gray-600">Revenue</p>
                      <p className="font-medium text-green-600">{formatCurrency(client.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Costs</p>
                      <p className="font-medium text-red-600">{formatCurrency(client.costs)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Profit Margin</p>
                      <div className={`flex items-center space-x-1 font-medium ${getProfitabilityColor(client.profitability)}`}>
                        {getProfitabilityIcon(client.profitability)}
                        <span>{client.profitability.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleViewDetails(client)}
                  >
                    <Eye className="h-3 w-3 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleEditClient(client)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className={`border-blue-200 hover:bg-blue-50 ${
                      client.isFavorite
                        ? "text-yellow-500 bg-yellow-50"
                        : "text-blue-600"
                    }`}
                    onClick={() => handleToggleFavorite(client.id)}
                  >
                    <Star className={`h-3 w-3 ${client.isFavorite ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-dark-blue" />
              <span>{selectedClient?.name} - Complete Profile</span>
            </DialogTitle>
            <DialogDescription>
              Comprehensive client information and relationship details
            </DialogDescription>
          </DialogHeader>
          
          {selectedClient && (
            <div className="space-y-6">
              {/* Status Overview */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <Badge className={`${getStatusColor(selectedClient.status)} mb-2`}>
                      {selectedClient.status}
                    </Badge>
                    <p className="text-xs text-gray-600">Status</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-dark-blue">{formatCurrency(selectedClient.contractValue)}</p>
                    <p className="text-xs text-gray-600">Contract Value</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className={`flex items-center justify-center space-x-1 ${getProfitabilityColor(selectedClient.profitability)}`}>
                      {getProfitabilityIcon(selectedClient.profitability)}
                      <span className="text-lg font-bold">{selectedClient.profitability.toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-gray-600">Profitability</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <Badge className={`${getPriorityColor(selectedClient.priority)} mb-2`}>
                      {selectedClient.priority.toUpperCase()}
                    </Badge>
                    <p className="text-xs text-gray-600">Priority</p>
                  </div>
                </Card>
              </div>

              {/* Detailed Information */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-dark-blue">Client Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Client Name</Label>
                      <p className="text-sm text-gray-700">{selectedClient.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Type</Label>
                      <p className="text-sm text-gray-700">{selectedClient.type} - {selectedClient.clientType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">County</Label>
                      <p className="text-sm text-gray-700">{selectedClient.county}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Address</Label>
                      <div
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors group"
                        onClick={() => handleOpenMaps(selectedClient.address)}
                        title="Click to view on Google Maps"
                      >
                        <MapPin className="h-4 w-4" />
                        <p className="text-sm group-hover:underline">{selectedClient.address || 'Address not available'}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Key Account Manager</Label>
                      <p className="text-sm text-gray-700">{selectedClient.kam}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Last Contact</Label>
                      <p className="text-sm text-gray-700">
                        {selectedClient.lastContact ? new Date(selectedClient.lastContact).toLocaleDateString() : 'Never contacted'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-dark-blue">Contract Details</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Contract Type</Label>
                      <p className="text-sm text-gray-700">{selectedClient.contractType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Contract Period</Label>
                      <p className="text-sm text-gray-700">
                        {new Date(selectedClient.contractStart).toLocaleDateString()} - {new Date(selectedClient.contractEnd).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Payment Method</Label>
                      <p className="text-sm text-gray-700">{selectedClient.paymentMethod}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Payment Deadline</Label>
                      <p className="text-sm text-gray-700">{selectedClient.paymentDeadline}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Next Payment</Label>
                      <p className="text-sm text-gray-700">
                        {selectedClient.nextPayment ? new Date(selectedClient.nextPayment).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-dark-blue">Financial Overview</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedClient.revenue)}</p>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(selectedClient.costs)}</p>
                      <p className="text-sm text-gray-600">Total Costs</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedClient.revenue - selectedClient.costs)}</p>
                      <p className="text-sm text-gray-600">Net Profit</p>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-dark-blue">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedClient.contactPersons.map((contact, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="space-y-2">
                        <p className="font-medium text-gray-800">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.role}</p>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{contact.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span>{contact.email}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Attachments & Related Contacts */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-dark-blue">Attachments</h3>
                  <div className="space-y-2">
                    {selectedClient.attachments.map((attachment, idx) => (
                      <div key={idx} className="flex items-center space-x-2 p-2 bg-blue-50 rounded border border-blue-100">
                        <Paperclip className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-700">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-dark-blue">Related Contacts</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedClient.relatedContacts.map((contact, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700">
                        {contact}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedClient.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-dark-blue">Notes & Comments</h3>
                  <Card className="p-4 bg-yellow-50 border-yellow-200">
                    <p className="text-sm text-gray-700">{selectedClient.notes}</p>
                  </Card>
                </div>
              )}
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
                handleEditClient(selectedClient);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update client information and contract details
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-800">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Client Name *</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    placeholder="Enter client name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type *</Label>
                  <Select value={editFormData.type} onValueChange={(value) => setEditFormData({...editFormData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LRSU">LRSU</SelectItem>
                      <SelectItem value="Club">Club</SelectItem>
                      <SelectItem value="Company">Company</SelectItem>
                      <SelectItem value="Association">Association</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-clientType">Client Type *</Label>
                  <Input
                    id="edit-clientType"
                    value={editFormData.clientType}
                    onChange={(e) => setEditFormData({...editFormData, clientType: e.target.value})}
                    placeholder="e.g., Municipality, Sports Club"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-county">County *</Label>
                  <Select value={editFormData.county} onValueChange={(value) => setEditFormData({...editFormData, county: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zagreb">Zagreb</SelectItem>
                      <SelectItem value="Split-Dalmatia">Split-Dalmatia</SelectItem>
                      <SelectItem value="Osijek-Baranja">Osijek-Baranja</SelectItem>
                      <SelectItem value="Primorje-Gorski Kotar">Primorje-Gorski Kotar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                  placeholder="Enter full address"
                />
              </div>
            </div>

            {/* Contract Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-800">Contract Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-contractType">Contract Type *</Label>
                  <Select value={editFormData.contractType} onValueChange={(value) => setEditFormData({...editFormData, contractType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tender">Tender</SelectItem>
                      <SelectItem value="Justification">Justification</SelectItem>
                      <SelectItem value="Direct">Direct</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status *</Label>
                  <Select value={editFormData.status} onValueChange={(value) => setEditFormData({...editFormData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Potential">Potential</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contractValue">Contract Value (€) *</Label>
                  <Input
                    id="edit-contractValue"
                    type="number"
                    value={editFormData.contractValue}
                    onChange={(e) => setEditFormData({...editFormData, contractValue: e.target.value})}
                    placeholder="25000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-vatAmount">VAT Amount (€)</Label>
                  <Input
                    id="edit-vatAmount"
                    type="number"
                    value={editFormData.vatAmount}
                    onChange={(e) => setEditFormData({...editFormData, vatAmount: e.target.value})}
                    placeholder="6250"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contractStart">Contract Start *</Label>
                  <Input
                    id="edit-contractStart"
                    type="date"
                    value={editFormData.contractStart}
                    onChange={(e) => setEditFormData({...editFormData, contractStart: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contractEnd">Contract End *</Label>
                  <Input
                    id="edit-contractEnd"
                    type="date"
                    value={editFormData.contractEnd}
                    onChange={(e) => setEditFormData({...editFormData, contractEnd: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-paymentMethod">Payment Method *</Label>
                  <Select value={editFormData.paymentMethod} onValueChange={(value) => setEditFormData({...editFormData, paymentMethod: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Bi-annual">Bi-annual</SelectItem>
                      <SelectItem value="Annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-paymentDeadline">Payment Deadline</Label>
                  <Input
                    id="edit-paymentDeadline"
                    value={editFormData.paymentDeadline}
                    onChange={(e) => setEditFormData({...editFormData, paymentDeadline: e.target.value})}
                    placeholder="15th of month"
                  />
                </div>
              </div>
            </div>

            {/* Management & Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-800">Management & Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-kam">Key Account Manager *</Label>
                  <Select value={editFormData.kam} onValueChange={(value) => setEditFormData({...editFormData, kam: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select KAM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ana Marić">Ana Marić</SelectItem>
                      <SelectItem value="Marko Petrović">Marko Petrović</SelectItem>
                      <SelectItem value="Petra Babić">Petra Babić</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contactName">Contact Person Name</Label>
                  <Input
                    id="edit-contactName"
                    value={editFormData.contactName}
                    onChange={(e) => setEditFormData({...editFormData, contactName: e.target.value})}
                    placeholder="Ivan Horvat"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contactRole">Contact Role</Label>
                  <Input
                    id="edit-contactRole"
                    value={editFormData.contactRole}
                    onChange={(e) => setEditFormData({...editFormData, contactRole: e.target.value})}
                    placeholder="IT Manager"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contactPhone">Contact Phone</Label>
                  <Input
                    id="edit-contactPhone"
                    value={editFormData.contactPhone}
                    onChange={(e) => setEditFormData({...editFormData, contactPhone: e.target.value})}
                    placeholder="+385 1 234 5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contactEmail">Contact Email</Label>
                  <Input
                    id="edit-contactEmail"
                    type="email"
                    value={editFormData.contactEmail}
                    onChange={(e) => setEditFormData({...editFormData, contactEmail: e.target.value})}
                    placeholder="ivan.horvat@company.hr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-relatedContacts">Related Contacts</Label>
                  <Input
                    id="edit-relatedContacts"
                    value={editFormData.relatedContacts}
                    onChange={(e) => setEditFormData({...editFormData, relatedContacts: e.target.value})}
                    placeholder="Contact 1, Contact 2, Contact 3"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-800">Notes & Comments</h3>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                  placeholder="Client notes, relationship details, important information..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateClient} className="bg-blue-600 hover:bg-blue-700 text-white">
              Update Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
