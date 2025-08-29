// Sales.jsx
import { useMemo, useState } from "react";
import { TEAM_MEMBER_NAMES } from "@/constants/teamMembers";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Calendar, BarChart3, Award, TrendingUp, Users, DollarSign, Target,
  MapPin, Clock, Eye, Plus, PieChart, Activity as ActivityIcon, X, UserPlus
} from "lucide-react";

// ---------------- Seed data (unchanged) ----------------
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

const salesMetrics = {
  totalPipeline: 280000,
  monthlyTarget: 200000,
  monthlyActual: 125000,
  conversionRate: 68,
  avgDealSize: 58750,
};

const monthlyData = [
  { month: "Aug", target: 180000, actual: 165000 },
  { month: "Sep", target: 190000, actual: 185000 },
  { month: "Oct", target: 200000, actual: 195000 },
  { month: "Nov", target: 210000, actual: 178000 },
  { month: "Dec", target: 200000, actual: 220000 },
  { month: "Jan", target: 200000, actual: 125000 },
];

const regionData = [
  { region: "Zagreb", value: 95000 },
  { region: "Split-Dalmatia", value: 65000 },
  { region: "Istria", value: 75000 },
  { region: "Others", value: 45000 },
];

const teamDirectory = TEAM_MEMBER_NAMES;

// ---------------- Helpers ----------------
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
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-EU", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(amount);

const SimpleBarChart = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map((d) => d.actual));
  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-6" style={{ height }}>
        {data.map((d) => {
          const t = (d.target / maxValue) * height * 0.8;
          const a = (d.actual / maxValue) * height * 0.8;
          return (
            <div key={d.month} className="flex flex-col items-center space-y-2">
              <div className="flex items-end space-x-1" style={{ height: height * 0.8 }}>
                <div className="w-6 bg-blue-200 rounded-t" style={{ height: t }} title={`Target: ${formatCurrency(d.target)}`} />
                <div className="w-6 bg-blue-600 rounded-t" style={{ height: a }} title={`Actual: ${formatCurrency(d.actual)}`} />
              </div>
              <span className="text-xs font-medium">{d.month}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1"><div className="w-3 h-3 bg-blue-200 rounded" /><span>Target</span></div>
        <div className="flex items-center space-x-1"><div className="w-3 h-3 bg-blue-600 rounded" /><span>Actual</span></div>
      </div>
    </div>
  );
};

const SimplePieLegend = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];
  return (
    <div className="grid grid-cols-2 gap-4">
      {data.map((d, i) => (
        <div key={d.region} className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded" style={{ background: colors[i % colors.length] }} />
          <div className="flex-1">
            <div className="text-xs font-medium">{d.region}</div>
            <div className="text-xs text-gray-600">
              {formatCurrency(d.value)} ({((d.value / total) * 100).toFixed(1)}%)
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ---------------- Small editors ----------------
function ContactsEditor({ contacts, onChange }) {
  const update = (idx, field, value) => {
    const next = contacts.map((c, i) => (i === idx ? { ...c, [field]: value } : c));
    onChange(next);
  };
  const add = () => onChange([...contacts, { name: "", role: "", phone: "", email: "" }]);
  const remove = (idx) => onChange(contacts.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="font-medium">Contact Person(s)</Label>
        <Button type="button" size="sm" variant="outline" onClick={add}>
          <UserPlus className="w-4 h-4 mr-1" /> Add contact
        </Button>
      </div>
      {contacts.map((c, idx) => (
        <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-gray-50 p-3 rounded">
          <div>
            <Label>Name *</Label>
            <Input value={c.name} onChange={(e) => update(idx, "name", e.target.value)} placeholder="e.g. Marija Novak" />
          </div>
          <div>
            <Label>Role</Label>
            <Input value={c.role} onChange={(e) => update(idx, "role", e.target.value)} placeholder="e.g. CFO" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={c.phone} onChange={(e) => update(idx, "phone", e.target.value)} placeholder="+385 XX XXX XXXX" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Email</Label>
              <Input type="email" value={c.email} onChange={(e) => update(idx, "email", e.target.value)} placeholder="name@company.hr" />
            </div>
            <Button type="button" variant="ghost" onClick={() => remove(idx)} className="self-end">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamSelector({ team, onChange }) {
  const toggle = (person) =>
    onChange(team.includes(person) ? team.filter((p) => p !== person) : [...team, person]);

  return (
    <div className="space-y-2">
      <Label>Assigned Team</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {teamDirectory.map((p) => (
          <label key={p} className="flex items-center gap-2 rounded border p-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={team.includes(p)}
              onChange={() => toggle(p)}
            />
            <span className="text-sm">{p}</span>
          </label>
        ))}
      </div>
      {team.length > 0 && (
        <p className="text-xs text-gray-500">Selected: {team.join(", ")}</p>
      )}
    </div>
  );
}

// ---------------- Main Component ----------------
export default function Sales() {
  // Normalize seed → ensure each lead has contacts[] & team[]
  const normalizedSeed = useMemo(
    () =>
      salesLeads.map((l) => ({
        ...l,
        contacts: l.contacts || (l.contact ? [{ name: l.contact, role: "Primary", phone: l.phone, email: l.email }] : []),
        team: l.team || [],
      })),
    []
  );

  const [leadsList, setLeadsList] = useState([]);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // ------- New lead form -------
  const [newLead, setNewLead] = useState({
    name: "",
    contacts: [{ name: "", role: "Primary", phone: "", email: "" }],
    value: "",
    probability: 50,
    stage: "Discovery",
    source: "",
    region: "",
    product: "",
    assignee: "",
    team: [],
    nextAction: "",
    notes: "",
  });
  const handleNewChange = (field, value) => setNewLead((p) => ({ ...p, [field]: value }));

  const handleAddLead = () => {
    if (!newLead.name || !newLead.contacts[0]?.name || !newLead.value) {
      alert("Please fill required fields: company, at least 1 contact, and deal value.");
      return;
    }
    const id = `LEAD-${String(leadsList.length + 1).padStart(3, "0")}`;
    const today = new Date().toISOString().split("T")[0];
    const status = newLead.probability >= 70 ? "Hot" : newLead.probability >= 40 ? "Warm" : "Cold";

    const lead = {
      id,
      name: newLead.name,
      contacts: newLead.contacts,
      contact: newLead.contacts[0]?.name || "", // convenience
      phone: newLead.contacts[0]?.phone || "",
      email: newLead.contacts[0]?.email || "",
      value: parseFloat(newLead.value) || 0,
      probability: newLead.probability,
      stage: newLead.stage,
      source: newLead.source,
      region: newLead.region,
      product: newLead.product,
      assignee: newLead.assignee,
      team: newLead.team,
      created: today,
      nextAction: newLead.nextAction,
      status,
      timeSpent: 0,
      lastActivity: today,
      notes: newLead.notes,
    };

    setLeadsList((prev) => [lead, ...prev]);
    setNewLead({
      name: "",
      contacts: [{ name: "", role: "Primary", phone: "", email: "" }],
      value: "",
      probability: 50,
      stage: "Discovery",
      source: "",
      region: "",
      product: "",
      assignee: "",
      team: [],
      nextAction: "",
      notes: "",
    });
    setIsNewOpen(false);
  };

  // ------- Filters -------
  const [filters, setFilters] = useState({
    search: "",
    stage: "All",
    status: "All",
    region: "All",
    product: "All",
    assignee: "All",
    minVal: "",
    maxVal: "",
    dateFrom: "",
    dateTo: "",
  });
  const resetFilters = () =>
    setFilters({
      search: "",
      stage: "All",
      status: "All",
      region: "All",
      product: "All",
      assignee: "All",
      minVal: "",
      maxVal: "",
      dateFrom: "",
      dateTo: "",
    });

  const filteredLeads = useMemo(() => {
    return leadsList.filter((l) => {
      const text = `${l.name} ${l.region} ${l.product} ${l.assignee} ${l.contacts?.map((c) => c.name).join(" ")}`.toLowerCase();
      if (filters.search && !text.includes(filters.search.toLowerCase())) return false;
      if (filters.stage !== "All" && l.stage !== filters.stage) return false;
      if (filters.status !== "All" && l.status !== filters.status) return false;
      if (filters.region !== "All" && l.region !== filters.region) return false;
      if (filters.product !== "All" && l.product !== filters.product) return false;
      if (filters.assignee !== "All" && l.assignee !== filters.assignee) return false;
      if (filters.minVal && Number(l.value) < Number(filters.minVal)) return false;
      if (filters.maxVal && Number(l.value) > Number(filters.maxVal)) return false;
      // Date range checks (Next Action)
      if (filters.dateFrom && (!l.nextAction || l.nextAction < filters.dateFrom)) return false;
      if (filters.dateTo && (!l.nextAction || l.nextAction > filters.dateTo)) return false;
      return true;
    });
  }, [leadsList, filters]);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Dashboard</h1>
          <p className="text-muted-foreground mt-1">Comprehensive sales performance and pipeline management</p>
        </div>
        <div className="flex items-center space-x-4">
          <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" /> New Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Add New Sales Lead</DialogTitle>
                <DialogDescription>Create a new sales opportunity in your pipeline.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company/Organization *</Label>
                    <Input id="name" placeholder="Enter company name"
                      value={newLead.name} onChange={(e) => handleNewChange("name", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Stage</Label>
                    <Select value={newLead.stage} onValueChange={(v) => handleNewChange("stage", v)}>
                      <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Discovery">Discovery</SelectItem>
                        <SelectItem value="Proposal">Proposal</SelectItem>
                        <SelectItem value="Negotiation">Negotiation</SelectItem>
                        <SelectItem value="Closing">Closing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* MULTIPLE CONTACTS */}
                <ContactsEditor
                  contacts={newLead.contacts}
                  onChange={(c) => handleNewChange("contacts", c)}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Deal Value (€) *</Label>
                    <Input type="number" placeholder="50000"
                      value={newLead.value} onChange={(e) => handleNewChange("value", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Probability (%)</Label>
                    <Input type="number" min="0" max="100"
                      value={newLead.probability} onChange={(e) => handleNewChange("probability", parseInt(e.target.value || "0", 10))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Next Action Date</Label>
                    <Input type="date" value={newLead.nextAction} onChange={(e) => handleNewChange("nextAction", e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Lead Source</Label>
                    <Select value={newLead.source} onValueChange={(v) => handleNewChange("source", v)}>
                      <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
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
                    <Label>Region</Label>
                    <Select value={newLead.region} onValueChange={(v) => handleNewChange("region", v)}>
                      <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
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
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Select value={newLead.product} onValueChange={(v) => handleNewChange("product", v)}>
                      <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LRSU Management">LRSU Management</SelectItem>
                        <SelectItem value="Tourism Management">Tourism Management</SelectItem>
                        <SelectItem value="Port Management">Port Management</SelectItem>
                        <SelectItem value="Full Suite">Full Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Owner (Assignee)</Label>
                    <Select value={newLead.assignee} onValueChange={(v) => handleNewChange("assignee", v)}>
                      <SelectTrigger><SelectValue placeholder="Assign owner" /></SelectTrigger>
                      <SelectContent>
                        {teamDirectory.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <TeamSelector team={newLead.team} onChange={(t) => handleNewChange("team", t)} />
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea rows={3} placeholder="Additional notes about this lead..."
                    value={newLead.notes} onChange={(e) => handleNewChange("notes", e.target.value)} />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewOpen(false)}>Cancel</Button>
                <Button onClick={handleAddLead} className="bg-blue-600 hover:bg-blue-700">Add Lead</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
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
                  <Progress value={Math.min(100, (salesMetrics.monthlyActual / salesMetrics.monthlyTarget) * 100)} className="h-2" />
                  <p className="text-xs text-green-600 mt-1">
                    {Math.round((salesMetrics.monthlyActual / salesMetrics.monthlyTarget) * 100)}% of target
                  </p>
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

      {/* Charts (removed per request) */}
      <div className="hidden">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Monthly Performance</span>
            </CardTitle>
            <CardDescription>Target vs Actual Revenue (Last 6 Months)</CardDescription>
          </CardHeader>
          <CardContent><SimpleBarChart data={monthlyData} height={250} /></CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-green-600" />
              <span>Regional Distribution</span>
            </CardTitle>
            <CardDescription>Sales Pipeline by Region</CardDescription>
          </CardHeader>
          <CardContent><SimplePieLegend data={regionData} /></CardContent>
        </Card>
      </div>

      {/* -------- FILTERS BAR -------- */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ActivityIcon className="h-5 w-5 text-blue-600" />
            <span>Active Sales Pipeline</span>
          </CardTitle>
          <CardDescription>Current leads and opportunities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <Input
              placeholder="Search company/contact…"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            />
            <Select value={filters.stage} onValueChange={(v) => setFilters((f) => ({ ...f, stage: v }))}>
              <SelectTrigger><SelectValue placeholder="Filter by Stage" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All stages</SelectItem>
                <SelectItem value="Discovery">Discovery</SelectItem>
                <SelectItem value="Proposal">Proposal</SelectItem>
                <SelectItem value="Negotiation">Negotiation</SelectItem>
                <SelectItem value="Closing">Closing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}>
              <SelectTrigger><SelectValue placeholder="Filter by Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All statuses</SelectItem>
                <SelectItem value="Hot">Hot</SelectItem>
                <SelectItem value="Warm">Warm</SelectItem>
                <SelectItem value="Cold">Cold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.region} onValueChange={(v) => setFilters((f) => ({ ...f, region: v }))}>
              <SelectTrigger><SelectValue placeholder="Filter by Region" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All regions</SelectItem>
                <SelectItem value="Zagreb">Zagreb</SelectItem>
                <SelectItem value="Split-Dalmatia">Split-Dalmatia</SelectItem>
                <SelectItem value="Istria">Istria</SelectItem>
                <SelectItem value="Zadar">Zadar</SelectItem>
                <SelectItem value="Karlovac">Karlovac</SelectItem>
                <SelectItem value="Dubrovnik-Neretva">Dubrovnik-Neretva</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.product} onValueChange={(v) => setFilters((f) => ({ ...f, product: v }))}>
              <SelectTrigger><SelectValue placeholder="Filter by Product" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All products</SelectItem>
                <SelectItem value="LRSU Management">LRSU Management</SelectItem>
                <SelectItem value="Tourism Management">Tourism Management</SelectItem>
                <SelectItem value="Port Management">Port Management</SelectItem>
                <SelectItem value="Full Suite">Full Suite</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.assignee} onValueChange={(v) => setFilters((f) => ({ ...f, assignee: v }))}>
              <SelectTrigger><SelectValue placeholder="Filter by Owner" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All owners</SelectItem>
                {teamDirectory.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Input type="number" placeholder="Minimum Value €" value={filters.minVal}
              onChange={(e) => setFilters((f) => ({ ...f, minVal: e.target.value }))} />
            <Input type="number" placeholder="Maximum Value €" value={filters.maxVal}
              onChange={(e) => setFilters((f) => ({ ...f, maxVal: e.target.value }))} />
            <Input type="date" placeholder="Start Date" value={filters.dateFrom}
              onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))} />
            <Input type="date" placeholder="End Date" value={filters.dateTo}
              onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))} />
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetFilters} className="w-full">Reset Filters</Button>
            </div>
          </div>

          {/* Leads list */}
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h4 className="font-semibold text-gray-800">{lead.name}</h4>
                      <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                      <Badge className={getStageColor(lead.stage)}>{lead.stage}</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{lead.contacts?.[0]?.name || lead.contact || "—"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{lead.region}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{formatCurrency(lead.value)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{lead.timeSpent}h spent</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                      <span>Probability: {lead.probability}%</span>
                      <span>Product: {lead.product}</span>
                      <span>Owner: {lead.assignee || "—"}</span>
                      <span>Team: {lead.team?.length ? `${lead.team.length} member(s)` : "—"}</span>
                      <span>Next Action: {lead.nextAction || "—"}</span>
                    </div>

                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${lead.probability}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setSelectedLead(lead);
                        setIsViewOpen(true);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredLeads.length === 0 && (
              <p className="text-sm text-gray-500">No deals match your filters.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* -------- VIEW DIALOG -------- */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedLead?.name} — <span className="text-sm font-normal">Complete Profile</span>
            </DialogTitle>
            <DialogDescription>Comprehensive client information and deal details.</DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-6">
              {/* Top badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-gray-500">Status</p>
                  <div className="mt-1"><Badge className={getStatusColor(selectedLead.status)}>{selectedLead.status}</Badge></div>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-gray-500">Contract Value</p>
                  <p className="text-lg font-semibold">{formatCurrency(selectedLead.value)}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-gray-500">Probability</p>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedLead.probability} className="h-2 flex-1" />
                    <span className="text-sm">{selectedLead.probability}%</span>
                  </div>
                </div>
              </div>

              {/* Client & Deal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Client Information</h4>
                  <div className="text-sm space-y-1">
                    <div><span className="text-gray-500">Region:</span> {selectedLead.region || "—"}</div>
                    <div><span className="text-gray-500">Product:</span> {selectedLead.product || "—"}</div>
                    <div><span className="text-gray-500">Source:</span> {selectedLead.source || "—"}</div>
                    <div><span className="text-gray-500">Created:</span> {selectedLead.created || "—"}</div>
                    <div><span className="text-gray-500">Last Activity:</span> {selectedLead.lastActivity || "—"}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Deal Details</h4>
                  <div className="text-sm space-y-1">
                    <div><span className="text-gray-500">Stage:</span> {selectedLead.stage}</div>
                    <div><span className="text-gray-500">Owner:</span> {selectedLead.assignee || "—"}</div>
                    <div><span className="text-gray-500">Team:</span> {selectedLead.team?.length ? selectedLead.team.join(", ") : "—"}</div>
                    <div><span className="text-gray-500">Next Action:</span> {selectedLead.nextAction || "—"}</div>
                    <div><span className="text-gray-500">Time Spent:</span> {selectedLead.timeSpent}h</div>
                  </div>
                </div>
              </div>

              {/* Contacts */}
              <div>
                <h4 className="font-semibold mb-2">Contacts</h4>
                <div className="space-y-2">
                  {(selectedLead.contacts || []).map((c, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm p-2 rounded border">
                      <span className="font-medium">{c.name}</span>
                      {c.role && <Badge variant="outline">{c.role}</Badge>}
                      <span className="text-gray-500">{c.phone || "—"}</span>
                      <span className="text-gray-500">{c.email || "—"}</span>
                    </div>
                  ))}
                  {(!selectedLead.contacts || selectedLead.contacts.length === 0) && (
                    <p className="text-sm text-gray-500">No contacts provided.</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedLead.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Notes</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedLead.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
