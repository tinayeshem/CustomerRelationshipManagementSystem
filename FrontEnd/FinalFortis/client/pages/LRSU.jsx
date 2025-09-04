import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building, 
  MapPin, 
  Users, 
  Crown,
  Euro,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Heart,
  Star,
  Building2,
  Landmark,
  School,
  Eye,
  Edit,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Sample LRSU data with urgency indicators
const lrsuData = [
  {
    id: 1,
    name: "Zagreb Municipality",
    taxId: "12345678901",
    address: "Trg bana Jelačića 1, Zagreb",
    county: "Zagreb",
    rulingParty: "HDZ",
    mayor: "Milan Bandić",
    budgetSize: 2500000,
    contactPersons: [
      { name: "Ana Marić", role: "IT Director", phone: "+385 1 234 5678", email: "ana.maric@zagreb.hr" }
    ],
    notes: "Major client using SOM system. Very satisfied with services.",
    status: "Client",
    type: "Municipality",
    institutions: ["Zagreb Public Library", "Zagreb Zoo", "Technical Museum"],
    coordinates: { lat: 45.8150, lng: 15.9819 },
    lastContact: "2024-01-10",
    nextFollowUp: "2024-01-25",
    priority: "high",
    contractExpiry: "2025-12-31"
  },
  {
    id: 2,
    name: "Split City",
    taxId: "98765432109",
    address: "Peristil bb, Split",
    county: "Split-Dalmatia",
    rulingParty: "SDP",
    mayor: "Ivica Puljak",
    budgetSize: 1800000,
    contactPersons: [
      { name: "Marko Petrović", role: "Deputy Mayor", phone: "+385 21 345 678", email: "marko.petrovic@split.hr" }
    ],
    notes: "Potential for expansion into tourism management systems.",
    status: "Negotiation in Progress",
    type: "City",
    institutions: ["Split Museum", "Marjan Park Administration"],
    coordinates: { lat: 43.5081, lng: 16.4402 },
    lastContact: "2024-01-12",
    nextFollowUp: "2024-01-15",
    priority: "urgent",
    contractExpiry: "2024-02-28"
  },
  {
    id: 3,
    name: "Osijek Municipality",
    taxId: "11223344556",
    address: "Županijska 2, Osijek",
    county: "Osijek-Baranja",
    rulingParty: "HDZ",
    mayor: "Ivan Radić",
    budgetSize: 950000,
    contactPersons: [
      { name: "Petra Kovačić", role: "IT Coordinator", phone: "+385 31 234 567", email: "petra.kovacic@osijek.hr" }
    ],
    notes: "Former client, contract expired in 2023. Open to renewal.",
    status: "Former Client",
    type: "Municipality",
    institutions: ["Osijek University", "Croatian National Theatre"],
    coordinates: { lat: 45.5550, lng: 18.6955 },
    lastContact: "2023-12-15",
    nextFollowUp: "2024-02-01",
    priority: "medium",
    contractExpiry: "2023-12-31"
  },
  {
    id: 4,
    name: "Rijeka Port Authority",
    taxId: "55667788990",
    address: "Riva 1, Rijeka",
    county: "Primorje-Gorski Kotar",
    rulingParty: "SDP",
    mayor: "Marko Filipović",
    budgetSize: 3200000,
    contactPersons: [
      { name: "Luka Marinović", role: "General Manager", phone: "+385 51 987 654", email: "luka.marinovic@rijeka-port.hr" }
    ],
    notes: "High-value potential client. Interested in logistics management.",
    status: "Potential Client",
    type: "County",
    institutions: ["Maritime Museum", "Port Operations Center"],
    coordinates: { lat: 45.3271, lng: 14.4422 },
    lastContact: "2024-01-08",
    nextFollowUp: "2024-03-15",
    priority: "low",
    contractExpiry: null
  },
  {
    id: 5,
    name: "Varaždin City",
    taxId: "66778899001",
    address: "Gradska ul. 1, Varaždin",
    county: "Varaždin",
    rulingParty: "HDZ",
    mayor: "Neven Bosilj",
    budgetSize: 1200000,
    contactPersons: [
      { name: "Martina Babić", role: "Finance Director", phone: "+385 42 123 456", email: "martina.babic@varazdin.hr" }
    ],
    notes: "Recently contacted. Showed interest in our demo.",
    status: "Not Contacted",
    type: "City",
    institutions: ["Varaždin Castle", "City Theatre"],
    coordinates: { lat: 46.3058, lng: 16.3364 },
    lastContact: null,
    nextFollowUp: "2024-01-20",
    priority: "medium",
    contractExpiry: null
  }
];

const counties = ["All Counties", "Zagreb", "Split-Dalmatia", "Osijek-Baranja", "Primorje-Gorski Kotar", "Varaždin"];
const parties = ["All Parties", "HDZ", "SDP", "Most", "IDS"];
const statuses = ["All Statuses", "Client", "Former Client", "Potential Client", "Negotiation in Progress", "Not Contacted", "Rejected"];
const types = ["All Types", "Municipality", "City", "County"];
const budgetRanges = ["All Budgets", "Under €1M", "€1M - €2M", "€2M - €5M", "Over €5M"];

const getStatusColor = (status) => {
  switch (status) {
    case "Client": return "bg-green-100 text-green-800 border-green-200";
    case "Former Client": return "bg-orange-100 text-orange-800 border-orange-200";
    case "Potential Client": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Negotiation in Progress": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Not Contacted": return "bg-gray-100 text-gray-800 border-gray-200";
    case "Rejected": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-blue-100 text-blue-800 border-blue-200";
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

const getUrgencyIndicator = (nextFollowUp, priority) => {
  if (!nextFollowUp) return { color: "text-gray-400", icon: Clock };
  
  const followUpDate = new Date(nextFollowUp);
  const today = new Date();
  const diffTime = followUpDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return { color: "text-red-600", icon: AlertTriangle, label: "Overdue" };
  if (diffDays <= 3) return { color: "text-red-500", icon: Clock, label: `Due in ${diffDays}d` };
  if (diffDays <= 7) return { color: "text-orange-500", icon: Clock, label: `Due in ${diffDays}d` };
  return { color: "text-green-500", icon: CheckCircle, label: `Due in ${diffDays}d` };
};

const getTypeIcon = (type) => {
  switch (type) {
    case "Municipality": return <Building className="h-4 w-4" />;
    case "City": return <Building2 className="h-4 w-4" />;
    case "County": return <Landmark className="h-4 w-4" />;
    default: return <Building className="h-4 w-4" />;
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case "Municipality": return "from-blue-500 to-blue-600";
    case "City": return "from-blue-600 to-blue-700";
    case "County": return "from-blue-400 to-blue-500";
    default: return "from-gray-400 to-slate-400";
  }
};

const formatBudget = (amount) => {
  return `€${(amount / 1000).toFixed(0)}K`;
};

const matchesBudgetRange = (budget, range) => {
  switch (range) {
    case "Under €1M": return budget < 1000000;
    case "€1M - €2M": return budget >= 1000000 && budget < 2000000;
    case "€2M - €5M": return budget >= 2000000 && budget < 5000000;
    case "Over €5M": return budget >= 5000000;
    default: return true;
  }
};

export default function LRSU() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("All Counties");
  const [selectedParty, setSelectedParty] = useState("All Parties");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedBudget, setSelectedBudget] = useState("All Budgets");
  const [selectedLRSU, setSelectedLRSU] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [lrsuList, setLrsuList] = useState(lrsuData.map(lrsu => ({ ...lrsu, isFavorite: false })));

  // Form state for new LRSU
  const [formData, setFormData] = useState({
    name: "",
    taxId: "",
    address: "",
    county: "",
    rulingParty: "",
    mayor: "",
    budgetSize: "",
    contactName: "",
    contactRole: "",
    contactPhone: "",
    contactEmail: "",
    notes: "",
    status: "",
    type: "",
    institutions: ""
  });

  // Form state for editing LRSU
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    taxId: "",
    address: "",
    county: "",
    rulingParty: "",
    mayor: "",
    budgetSize: "",
    contactName: "",
    contactRole: "",
    contactPhone: "",
    contactEmail: "",
    notes: "",
    status: "",
    type: "",
    institutions: ""
  });

  const filteredData = lrsuList.filter((lrsu) => {
    const matchesSearch = lrsu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lrsu.mayor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lrsu.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCounty = selectedCounty === "All Counties" || lrsu.county === selectedCounty;
    const matchesParty = selectedParty === "All Parties" || lrsu.rulingParty === selectedParty;
    const matchesStatus = selectedStatus === "All Statuses" || lrsu.status === selectedStatus;
    const matchesType = selectedType === "All Types" || lrsu.type === selectedType;
    const matchesBudget = selectedBudget === "All Budgets" || matchesBudgetRange(lrsu.budgetSize, selectedBudget);

    return matchesSearch && matchesCounty && matchesParty && matchesStatus && matchesType && matchesBudget;
  });

  const handleAddLRSU = () => {
    const newLRSU = {
      id: lrsuList.length + 1,
      name: formData.name,
      taxId: formData.taxId,
      address: formData.address,
      county: formData.county,
      rulingParty: formData.rulingParty,
      mayor: formData.mayor,
      budgetSize: parseInt(formData.budgetSize) || 0,
      contactPersons: [{
        name: formData.contactName,
        role: formData.contactRole,
        phone: formData.contactPhone,
        email: formData.contactEmail
      }],
      notes: formData.notes,
      status: formData.status,
      type: formData.type,
      institutions: formData.institutions.split(',').map(i => i.trim()).filter(i => i),
      coordinates: { lat: 0, lng: 0 },
      lastContact: null,
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: "medium",
      contractExpiry: null,
      isFavorite: false
    };

    setLrsuList([...lrsuList, newLRSU]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setFormData({
      name: "", taxId: "", address: "", county: "", rulingParty: "", mayor: "",
      budgetSize: "", contactName: "", contactRole: "", contactPhone: "", contactEmail: "",
      notes: "", status: "", type: "", institutions: ""
    });
  };

  const handleViewDetails = (lrsu) => {
    setSelectedLRSU(lrsu);
    setIsViewDialogOpen(true);
  };

  const handleEditLRSU = (lrsu) => {
    setEditFormData({
      id: lrsu.id,
      name: lrsu.name,
      taxId: lrsu.taxId,
      address: lrsu.address,
      county: lrsu.county,
      rulingParty: lrsu.rulingParty,
      mayor: lrsu.mayor,
      budgetSize: lrsu.budgetSize.toString(),
      contactName: lrsu.contactPersons[0]?.name || "",
      contactRole: lrsu.contactPersons[0]?.role || "",
      contactPhone: lrsu.contactPersons[0]?.phone || "",
      contactEmail: lrsu.contactPersons[0]?.email || "",
      notes: lrsu.notes,
      status: lrsu.status,
      type: lrsu.type,
      institutions: lrsu.institutions.join(", ")
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateLRSU = () => {
    const updatedLRSU = {
      ...lrsuList.find(l => l.id === editFormData.id),
      name: editFormData.name,
      taxId: editFormData.taxId,
      address: editFormData.address,
      county: editFormData.county,
      rulingParty: editFormData.rulingParty,
      mayor: editFormData.mayor,
      budgetSize: parseInt(editFormData.budgetSize) || 0,
      contactPersons: [{
        name: editFormData.contactName,
        role: editFormData.contactRole,
        phone: editFormData.contactPhone,
        email: editFormData.contactEmail
      }],
      notes: editFormData.notes,
      status: editFormData.status,
      type: editFormData.type,
      institutions: editFormData.institutions.split(',').map(i => i.trim()).filter(i => i),
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setLrsuList(lrsuList.map(lrsu =>
      lrsu.id === editFormData.id ? updatedLRSU : lrsu
    ));
    setIsEditDialogOpen(false);
  };

  const handleToggleFavorite = (lrsuId) => {
    setLrsuList(lrsuList.map(lrsu =>
      lrsu.id === lrsuId ? { ...lrsu, isFavorite: !lrsu.isFavorite } : lrsu
    ));
  };

  const handleOpenMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Professional Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xl">
              <Building className="h-10 w-10" />
            </div>
            <div className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-blue-800 mb-2">
          LRSU Database
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Local & Regional Self-Government Units Management
        </p>
      </div>

      {/* Filters Section */}
      <Card className="border border-blue-200 bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-dark-blue">
                <Filter className="h-5 w-5" />
                <span>Advanced Filters</span>
              </CardTitle>
              <CardDescription>Filter and search through your LRSU database</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFiltersOpen((o) => !o)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                aria-expanded={isFiltersOpen}
                aria-controls="lrsu-filters-content"
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
        <CardContent id="lrsu-filters-content" className={isFiltersOpen ? "space-y-4" : "hidden"}>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
            <Input 
              placeholder="Search by name, mayor, or address..." 
              className="pl-10 bg-white border-blue-200 focus:border-dark-blue"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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

            <Select value={selectedParty} onValueChange={setSelectedParty}>
              <SelectTrigger className="bg-white border-blue-200">
                <SelectValue placeholder="Party" />
              </SelectTrigger>
              <SelectContent>
                {parties.map((party) => (
                  <SelectItem key={party} value={party}>{party}</SelectItem>
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

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-white border-blue-200">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedBudget} onValueChange={setSelectedBudget}>
              <SelectTrigger className="bg-white border-blue-200">
                <SelectValue placeholder="Budget Range" />
              </SelectTrigger>
              <SelectContent>
                {budgetRanges.map((range) => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Count and Actions */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-600">
              Found {filteredData.length} LRSU{filteredData.length !== 1 ? 's' : ''}
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
                    Add New LRSU
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New LRSU</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new Local/Regional Self-Government Unit
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">LRSU Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter LRSU name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID (OIB) *</Label>
                      <Input
                        id="taxId"
                        value={formData.taxId}
                        onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                        placeholder="Enter tax ID"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Enter full address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="county">County *</Label>
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
                    <div className="space-y-2">
                      <Label htmlFor="rulingParty">Ruling Party *</Label>
                      <Select value={formData.rulingParty} onValueChange={(value) => setFormData({...formData, rulingParty: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select party" />
                        </SelectTrigger>
                        <SelectContent>
                          {parties.slice(1).map((party) => (
                            <SelectItem key={party} value={party}>{party}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mayor">Mayor *</Label>
                      <Input
                        id="mayor"
                        value={formData.mayor}
                        onChange={(e) => setFormData({...formData, mayor: e.target.value})}
                        placeholder="Enter mayor name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budgetSize">Budget Size (€)</Label>
                      <Input
                        id="budgetSize"
                        type="number"
                        value={formData.budgetSize}
                        onChange={(e) => setFormData({...formData, budgetSize: e.target.value})}
                        placeholder="Enter budget amount"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {types.slice(1).map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
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
                      <Label htmlFor="institutions">Associated Institutions</Label>
                      <Input
                        id="institutions"
                        value={formData.institutions}
                        onChange={(e) => setFormData({...formData, institutions: e.target.value})}
                        placeholder="Enter institutions separated by commas"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="notes">Notes/Observations</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Enter any notes or observations"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddLRSU} className="bg-dark-blue hover:bg-dark-blue-hover text-white">
                      Add LRSU
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LRSU Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.map((lrsu) => {
          const urgency = getUrgencyIndicator(lrsu.nextFollowUp, lrsu.priority);
          const UrgencyIcon = urgency.icon;
          
          return (
            <Card key={lrsu.id} className="border border-blue-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className={`h-3 bg-gradient-to-r ${getTypeColor(lrsu.type)}`} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getTypeColor(lrsu.type)} flex items-center justify-center text-white shadow-lg`}>
                      {getTypeIcon(lrsu.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-800 leading-tight">
                        {lrsu.name}
                      </CardTitle>
                      <p className="text-sm text-blue-600 font-medium flex items-center">
                        <Crown className="h-3 w-3 mr-1" />
                        {lrsu.mayor}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={`${getStatusColor(lrsu.status)} border text-xs`}>
                      {lrsu.status}
                    </Badge>
                    <Badge className={`${getPriorityColor(lrsu.priority)} border text-xs`}>
                      {lrsu.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Urgency Indicator */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center space-x-2">
                    <UrgencyIcon className={`h-4 w-4 ${urgency.color}`} />
                    <span className={`text-sm font-medium ${urgency.color}`}>
                      Next Follow-up: {urgency.label}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                    {lrsu.type}
                  </Badge>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs">{lrsu.county}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Euro className="h-3 w-3" />
                      <span className="text-xs">{formatBudget(lrsu.budgetSize)} budget</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="h-3 w-3" />
                      <span className="text-xs">{lrsu.rulingParty}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Building className="h-3 w-3" />
                      <span className="text-xs">Tax ID: {lrsu.taxId}</span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-700 font-medium">Address</p>
                      <p className="text-xs text-gray-600">{lrsu.address}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-all duration-200"
                      onClick={() => handleOpenMaps(lrsu.address)}
                      title="View location on Google Maps"
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      Maps
                    </Button>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-sm text-gray-700 font-medium mb-2">Key Contact</p>
                  {lrsu.contactPersons.map((contact, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-xs font-medium text-gray-800">{contact.name} - {contact.role}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{contact.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{contact.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleViewDetails(lrsu)}
                  >
                    <Eye className="h-3 w-3 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleEditLRSU(lrsu)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className={`border-blue-200 hover:bg-blue-50 ${
                      lrsu.isFavorite
                        ? "text-yellow-500 bg-yellow-50"
                        : "text-blue-600"
                    }`}
                    onClick={() => handleToggleFavorite(lrsu.id)}
                  >
                    <Star className={`h-3 w-3 ${lrsu.isFavorite ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-dark-blue" />
              <span>{selectedLRSU?.name} - Complete Details</span>
            </DialogTitle>
            <DialogDescription>
              Comprehensive information for {selectedLRSU?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLRSU && (
            <div className="space-y-6">
              {/* Status Overview */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <Badge className={`${getStatusColor(selectedLRSU.status)} mb-2`}>
                      {selectedLRSU.status}
                    </Badge>
                    <p className="text-xs text-gray-600">Current Status</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <Badge className={`${getPriorityColor(selectedLRSU.priority)} mb-2`}>
                      {selectedLRSU.priority.toUpperCase()}
                    </Badge>
                    <p className="text-xs text-gray-600">Priority Level</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-dark-blue">{formatBudget(selectedLRSU.budgetSize)}</p>
                    <p className="text-xs text-gray-600">Annual Budget</p>
                  </div>
                </Card>
              </div>

              {/* Detailed Information */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-dark-blue">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Full Name</Label>
                      <p className="text-sm text-gray-700">{selectedLRSU.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Tax ID (OIB)</Label>
                      <p className="text-sm text-gray-700">{selectedLRSU.taxId}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Type</Label>
                      <p className="text-sm text-gray-700">{selectedLRSU.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">County</Label>
                      <p className="text-sm text-gray-700">{selectedLRSU.county}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Address</Label>
                      <p className="text-sm text-gray-700">{selectedLRSU.address}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-dark-blue">Political & Administrative</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Mayor</Label>
                      <p className="text-sm text-gray-700">{selectedLRSU.mayor}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Ruling Party</Label>
                      <p className="text-sm text-gray-700">{selectedLRSU.rulingParty}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Last Contact</Label>
                      <p className="text-sm text-gray-700">
                        {selectedLRSU.lastContact ? new Date(selectedLRSU.lastContact).toLocaleDateString() : 'Never contacted'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Next Follow-up</Label>
                      <p className="text-sm text-gray-700">
                        {selectedLRSU.nextFollowUp ? new Date(selectedLRSU.nextFollowUp).toLocaleDateString() : 'Not scheduled'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-dark-blue">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedLRSU.contactPersons.map((contact, idx) => (
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

              {/* Associated Institutions */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-dark-blue">Associated Institutions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLRSU.institutions.map((institution, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700">
                      <School className="h-3 w-3 mr-1" />
                      {institution}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedLRSU.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-dark-blue">Notes & Observations</h3>
                  <Card className="p-4 bg-yellow-50 border-yellow-200">
                    <p className="text-sm text-gray-700">{selectedLRSU.notes}</p>
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
                handleEditLRSU(selectedLRSU);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit LRSU
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit LRSU Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit LRSU</DialogTitle>
            <DialogDescription>
              Update LRSU information and contact details
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-800">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">LRSU Name *</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    placeholder="Enter LRSU name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-taxId">Tax ID *</Label>
                  <Input
                    id="edit-taxId"
                    value={editFormData.taxId}
                    onChange={(e) => setEditFormData({...editFormData, taxId: e.target.value})}
                    placeholder="Enter tax ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type *</Label>
                  <Select value={editFormData.type} onValueChange={(value) => setEditFormData({...editFormData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Municipality">Municipality</SelectItem>
                      <SelectItem value="City">City</SelectItem>
                      <SelectItem value="County">County</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="Varaždin">Varaždin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Address *</Label>
                  <Input
                    id="edit-address"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                    placeholder="Enter full address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-budgetSize">Budget Size (���) *</Label>
                  <Input
                    id="edit-budgetSize"
                    type="number"
                    value={editFormData.budgetSize}
                    onChange={(e) => setEditFormData({...editFormData, budgetSize: e.target.value})}
                    placeholder="2500000"
                  />
                </div>
              </div>
            </div>

            {/* Political & Leadership Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-800">Political & Leadership</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-mayor">Mayor/Leader *</Label>
                  <Input
                    id="edit-mayor"
                    value={editFormData.mayor}
                    onChange={(e) => setEditFormData({...editFormData, mayor: e.target.value})}
                    placeholder="Enter mayor/leader name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-rulingParty">Ruling Party *</Label>
                  <Select value={editFormData.rulingParty} onValueChange={(value) => setEditFormData({...editFormData, rulingParty: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ruling party" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HDZ">HDZ</SelectItem>
                      <SelectItem value="SDP">SDP</SelectItem>
                      <SelectItem value="Most">Most</SelectItem>
                      <SelectItem value="IDS">IDS</SelectItem>
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
                      <SelectItem value="Client">Client</SelectItem>
                      <SelectItem value="Former Client">Former Client</SelectItem>
                      <SelectItem value="Potential Client">Potential Client</SelectItem>
                      <SelectItem value="Negotiation in Progress">Negotiation in Progress</SelectItem>
                      <SelectItem value="Not Contacted">Not Contacted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-institutions">Institutions</Label>
                  <Input
                    id="edit-institutions"
                    value={editFormData.institutions}
                    onChange={(e) => setEditFormData({...editFormData, institutions: e.target.value})}
                    placeholder="Library, Museum, School (comma separated)"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-800">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-contactName">Contact Person Name</Label>
                  <Input
                    id="edit-contactName"
                    value={editFormData.contactName}
                    onChange={(e) => setEditFormData({...editFormData, contactName: e.target.value})}
                    placeholder="Ana Marić"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contactRole">Contact Role</Label>
                  <Input
                    id="edit-contactRole"
                    value={editFormData.contactRole}
                    onChange={(e) => setEditFormData({...editFormData, contactRole: e.target.value})}
                    placeholder="IT Director"
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
                    placeholder="ana.maric@zagreb.hr"
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
                  placeholder="LRSU notes, relationship details, important information..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateLRSU} className="bg-blue-600 hover:bg-blue-700 text-white">
              Update LRSU
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <Card className="border border-blue-200 bg-blue-50">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-blue-800 mb-2">No LRSUs found</h3>
            <p className="text-blue-600 mb-4">
              Try adjusting your filters or search terms.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCounty("All Counties");
                setSelectedParty("All Parties");
                setSelectedStatus("All Statuses");
                setSelectedType("All Types");
                setSelectedBudget("All Budgets");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
