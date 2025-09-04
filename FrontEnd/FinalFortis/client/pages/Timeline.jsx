import React from "react";
import Timeline from "@/components/activities/Timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, Filter as FilterIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function TimelinePage() {
  const [activities, setActivities] = React.useState(() => {
    try {
      const raw = localStorage.getItem("activitiesList");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const organizations = React.useMemo(() => {
    try {
      const raw = localStorage.getItem("organizationData");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  // Leads for premium resolution
  const leads = React.useMemo(() => {
    try {
      const raw = localStorage.getItem("sales_leads");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const [isFiltersOpen, setIsFiltersOpen] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedClient, setSelectedClient] = React.useState("All Clients");
  const [selectedType, setSelectedType] = React.useState("All Types");
  const [selectedStatus, setSelectedStatus] = React.useState("All Statuses");
  const [selectedPriority, setSelectedPriority] = React.useState("All Priorities");
  const [selectedMember, setSelectedMember] = React.useState("All Members");
  const [selectedPremium, setSelectedPremium] = React.useState("All");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");

  const allClients = React.useMemo(() => {
    const norm = (s) => (s || "").trim();
    const orgNames = Array.isArray(organizations) ? organizations.map(o => norm(o?.organizationName)).filter(Boolean) : [];
    const actNames = (activities || []).map(a => norm(a.linkedClient)).filter(Boolean);
    const leadNames = Array.isArray(leads) ? leads.map(l => norm(l?.name)).filter(Boolean) : [];
    const set = new Set([...orgNames, ...actNames, ...leadNames]);
    return ["All Clients", ...Array.from(set).sort()];
  }, [organizations, activities, leads]);
  const allTypes = React.useMemo(() => {
    const set = new Set((activities || []).map(a => a.activityType).filter(Boolean));
    return ["All Types", ...Array.from(set).sort()];
  }, [activities]);
  const allStatuses = React.useMemo(() => {
    const set = new Set((activities || []).map(a => a.status).filter(Boolean));
    return ["All Statuses", ...Array.from(set).sort()];
  }, [activities]);
  const allPriorities = React.useMemo(() => ["All Priorities", "Low", "Medium", "High", "Urgent"], []);
  const allMembers = React.useMemo(() => {
    const names = (activities || []).flatMap(a => Array.isArray(a.responsible) ? a.responsible : (a.responsible ? [a.responsible] : []));
    return ["All Members", ...Array.from(new Set(names)).sort()];
  }, [activities]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Urgent":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "";
    }
  };

  const isPremiumClient = React.useCallback((name) => {
    try {
      const actPremium = (activities || []).some(a => a.linkedClient === name && !!a.premiumSupport);
      if (actPremium) return true;
      const org = Array.isArray(organizations) ? organizations.find(o => o?.organizationName === name) : null;
      if (org && typeof org.premiumSupport === 'boolean') return !!org.premiumSupport;
      const lead = Array.isArray(leads) ? leads.find(l => l?.name === name) : null;
      if (lead && typeof lead.isPremium === 'boolean') return !!lead.isPremium;
    } catch {}
    return false;
  }, [activities, organizations, leads]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedClient("All Clients");
    setSelectedType("All Types");
    setSelectedStatus("All Statuses");
    setSelectedPriority("All Priorities");
    setSelectedMember("All Members");
    setSelectedPremium("All");
    setFromDate("");
    setToDate("");
  };

  const { user } = useAuth();
  const filteredActivities = React.useMemo(() => {
    const isSupport = user?.department === "Support";
    return (activities || []).filter(a => {
      const responsibleString = Array.isArray(a.responsible) ? a.responsible.join(", ") : (a.responsible || "");
      const matchesSearch = [a.linkedClient, responsibleString, a.notes].join(" ").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClient = selectedClient === "All Clients" || (a.linkedClient || "").trim().toLowerCase() === selectedClient.trim().toLowerCase();
      const matchesType = selectedType === "All Types" || a.activityType === selectedType;
      const matchesStatus = selectedStatus === "All Statuses" || a.status === selectedStatus;
      const matchesPriority = selectedPriority === "All Priorities" || a.priority === selectedPriority;
      const matchesMember = selectedMember === "All Members" || responsibleString.includes(selectedMember);
      const matchesFrom = !fromDate || (a.date && a.date >= fromDate);
      const matchesTo = !toDate || (a.date && a.date <= toDate);
      const premium = isPremiumClient(a.linkedClient);
      const matchesPremium = selectedPremium === "All" || (selectedPremium === "Premium" ? premium : !premium);
      const matchesTicketVisibility = isSupport ? true : !a?.isTicket;
      return matchesSearch && matchesClient && matchesType && matchesStatus && matchesPriority && matchesMember && matchesFrom && matchesTo && matchesPremium && matchesTicketVisibility;
    });
  }, [activities, searchTerm, selectedClient, selectedType, selectedStatus, selectedPriority, selectedMember, fromDate, toDate, selectedPremium, isPremiumClient, user?.department]);

  React.useEffect(() => {
    const reload = () => {
      try {
        const raw = localStorage.getItem("activitiesList");
        setActivities(raw ? JSON.parse(raw) : []);
      } catch {}
    };
    window.addEventListener("activitiesListUpdated", reload);
    return () => window.removeEventListener("activitiesListUpdated", reload);
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Timeline</h1>
          <p className="text-muted-foreground mt-1">Visual client activity timeline across your workspace</p>
        </div>
      </div>

      <Card className="border border-blue-200 bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Timeline Filters</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFiltersOpen(o => !o)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                aria-expanded={isFiltersOpen}
                aria-controls="timeline-filters-content"
              >
                {isFiltersOpen ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                {isFiltersOpen ? "Hide Filters" : "Show Filters"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
              >
                <FilterIcon className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent id="timeline-filters-content" className={isFiltersOpen ? "space-y-4" : "hidden"}>
          <div className="relative">
            <Input
              placeholder="Search clients, notes, or responsible..."
              className="pl-3 bg-background/80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="bg-background/80">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                {allClients.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-background/80">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                {allTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-background/80">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {allStatuses.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className={`bg-background/80 ${selectedPriority !== "All Priorities" ? getPriorityColor(selectedPriority) : ""}`}>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {allPriorities.map((p) => (
                  <SelectItem key={p} value={p} className={p !== "All Priorities" ? getPriorityColor(p) + " hover:opacity-90" : "hover:bg-gray-50"}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger className="bg-background/80">
                <SelectValue placeholder="Team Member" />
              </SelectTrigger>
              <SelectContent>
                {allMembers.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPremium} onValueChange={setSelectedPremium}>
              <SelectTrigger className="bg-background/80">
                <SelectValue placeholder="Premium" />
              </SelectTrigger>
              <SelectContent>
                {["All", "Premium", "Not Premium"].map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromDate">From Date</Label>
              <Input id="fromDate" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="bg-background/80" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toDate">To Date</Label>
              <Input id="toDate" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="bg-background/80" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Timeline activities={filteredActivities} organizations={organizations} />
    </div>
  );
}
