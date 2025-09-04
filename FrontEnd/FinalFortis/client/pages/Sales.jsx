// Sales.jsx
import { useMemo, useState, useEffect } from "react";
import { TEAM_MEMBER_NAMES } from "@/constants/teamMembers";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  BarChart3,
  Award,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  MapPin,
  Clock,
  Eye,
  Plus,
  PieChart,
  Activity as ActivityIcon,
  X,
  UserPlus,
  ChevronDown,
  ChevronUp,
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
    lastActivity: "2024-01-15",
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
    lastActivity: "2024-01-14",
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
    lastActivity: "2024-01-13",
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
    lastActivity: "2024-01-15",
  },
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

// Unified pipeline stages for Sales
const STAGES = [
  "First contact",
  "interested",
  "Offer sent",
  "Accepted",
  "Contract signed",
  "implementation",
];

// ---------------- Helpers ----------------
const getStatusColor = (status) => {
  switch (status) {
    case "Hot":
      return "bg-red-100 text-red-800 border-red-200";
    case "Warm":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Cold":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
const getStatusFromStage = (stage) => {
  const s = String(stage || "").toLowerCase();
  if (s === "contract signed" || s === "implementation") return "Hot";
  if (s === "first contact" || s === "first contacted") return "Cold";
  if (s === "interested" || s === "offer sent" || s === "accepted")
    return "Warm";
  return "Cold";
};
const getStageColor = (stage) => {
  switch (String(stage)) {
    case "New":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "First contact":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "interested":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Offer sent":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Accepted":
      return "bg-green-100 text-green-800 border-green-200";
    case "Contract signed":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "implementation":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "Declined":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(amount);

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
              <div
                className="flex items-end space-x-1"
                style={{ height: height * 0.8 }}
              >
                <div
                  className="w-6 bg-blue-200 rounded-t"
                  style={{ height: t }}
                  title={`Target: ${formatCurrency(d.target)}`}
                />
                <div
                  className="w-6 bg-blue-600 rounded-t"
                  style={{ height: a }}
                  title={`Actual: ${formatCurrency(d.actual)}`}
                />
              </div>
              <span className="text-xs font-medium">{d.month}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-200 rounded" />
          <span>Target</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-600 rounded" />
          <span>Actual</span>
        </div>
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
          <div
            className="w-4 h-4 rounded"
            style={{ background: colors[i % colors.length] }}
          />
          <div className="flex-1">
            <div className="text-xs font-medium">{d.region}</div>
            <div className="text-xs text-gray-600">
              {formatCurrency(d.value)} ({((d.value / total) * 100).toFixed(1)}
              %)
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
    const next = contacts.map((c, i) =>
      i === idx ? { ...c, [field]: value } : c,
    );
    onChange(next);
  };
  const add = () =>
    onChange([...contacts, { name: "", role: "", phone: "", email: "" }]);
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
        <div
          key={idx}
          className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-gray-50 p-3 rounded"
        >
          <div>
            <Label>Name *</Label>
            <Input
              value={c.name}
              onChange={(e) => update(idx, "name", e.target.value)}
              placeholder="e.g. Marija Novak"
            />
          </div>
          <div>
            <Label>Role</Label>
            <Input
              value={c.role}
              onChange={(e) => update(idx, "role", e.target.value)}
              placeholder="e.g. CFO"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={c.phone}
              onChange={(e) => update(idx, "phone", e.target.value)}
              placeholder="+385 XX XXX XXXX"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={c.email}
                onChange={(e) => update(idx, "email", e.target.value)}
                placeholder="name@company.hr"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => remove(idx)}
              className="self-end"
            >
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
    onChange(
      team.includes(person)
        ? team.filter((p) => p !== person)
        : [...team, person],
    );

  return (
    <div className="space-y-2">
      <Label>Assigned Team</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {teamDirectory.map((p) => (
          <label
            key={p}
            className="flex items-center gap-2 rounded border p-2 cursor-pointer"
          >
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
        contacts:
          l.contacts ||
          (l.contact
            ? [
                {
                  name: l.contact,
                  role: "Primary",
                  phone: l.phone,
                  email: l.email,
                },
              ]
            : []),
        team: l.team || [],
      })),
    [],
  );

  const [leadsList, setLeadsList] = useState(() => {
    try {
      const saved = localStorage.getItem("sales_leads");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("sales_leads", JSON.stringify(leadsList));
    } catch {}
  }, [leadsList]);
  const [isNewOpen, setIsNewOpen] = useState(false);

  // Load organizations from Organization dashboard
  const [organizations, setOrganizations] = useState(() => {
    try {
      const saved = localStorage.getItem("organizationData");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const reloadOrgs = () => {
      try {
        const saved = localStorage.getItem("organizationData");
        setOrganizations(saved ? JSON.parse(saved) : []);
      } catch {
        setOrganizations([]);
      }
    };
    window.addEventListener("organizationDataUpdated", reloadOrgs);
    const onVis = () => {
      if (!document.hidden) reloadOrgs();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("organizationDataUpdated", reloadOrgs);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Helpers to map/sync with Organization phases
  const orgToStage = (phase) => {
    const p = String(phase || "").toLowerCase();
    const map = {
    "first contacted": "First contact",
    "first contact": "First contact",
    interested: "interested",
    proposal: "Offer sent",
    "offer sent": "Offer sent",
    accepted: "Accepted",
    contract: "Contract signed",
    "contract signed": "Contract signed",
    implementation: "implementation",
    active: "implementation",
  };
    return map[p] || "First contact";
  };
  const syncOrgFromLead = (lead) => {
    try {
      const saved = localStorage.getItem("organizationData");
      const orgs = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(orgs)) return;
      const idMatch =
        typeof lead.id === "string" && lead.id.startsWith("LEAD-ORG-")
          ? Number(lead.id.replace("LEAD-ORG-", ""))
          : null;
      const idx =
        idMatch != null && !Number.isNaN(idMatch)
          ? orgs.findIndex((o) => String(o.id) === String(idMatch))
          : orgs.findIndex(
              (o) =>
                (o.organizationName || "").toLowerCase() ===
                String(lead.name || "").toLowerCase(),
            );
      if (idx === -1) return;
      const primary =
        Array.isArray(lead.contacts) && lead.contacts[0]
          ? lead.contacts[0]
          : null;
      const [firstName, ...rest] = String(primary?.name || "")
        .trim()
        .split(" ");
      const updated = {
        ...orgs[idx],
        phase: orgToStage(lead.stage),
        responsibleMembers: Array.isArray(lead.team)
          ? lead.team
          : orgs[idx].responsibleMembers || [],
        email: primary?.email || orgs[idx].email || "",
        phone: primary?.phone || orgs[idx].phone || "",
        premiumSupport: typeof lead.isPremium === 'boolean' ? !!lead.isPremium : orgs[idx].premiumSupport,
        contactPerson: {
          firstName: firstName || orgs[idx]?.contactPerson?.firstName || "",
          surname: rest.join(" ") || orgs[idx]?.contactPerson?.surname || "",
          role: primary?.role || orgs[idx]?.contactPerson?.role || "",
          phone: primary?.phone || orgs[idx]?.contactPerson?.phone || "",
        },
      };
      orgs[idx] = updated;
      localStorage.setItem("organizationData", JSON.stringify(orgs));
      window.dispatchEvent(new Event("organizationDataUpdated"));
    } catch {}
  };

  // Initialize/Sync leads from organizations (preserve user changes like stage)
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const isActiveOrgPhase = (phase) => {
      const p = String(phase || "").toLowerCase();
      return [
        "first contact",
        "interested",
        "offer sent",
        "accepted",
        "contract signed",
        "implementation",
      ].includes(p);
    };
    const baseFromOrgs = (organizations || [])
      .filter((o) => isActiveOrgPhase(o?.phase))
      .map((o, idx) => {
      const contactName = [
        o?.contactPerson?.firstName,
        o?.contactPerson?.surname,
      ]
        .filter(Boolean)
        .join(" ");
      const contact = contactName || "";
      const contacts = contact
        ? [
            {
              name: contact,
              role: o?.contactPerson?.role || "Primary",
              phone: o?.contactPerson?.phone || o?.phone || "",
              email: o?.email || "",
            },
          ]
        : [];
      return {
        id: `LEAD-ORG-${o?.id ?? idx}`,
        name: o?.organizationName || o?.name || "Organization",
        contacts,
        contact,
        phone: o?.phone || contacts[0]?.phone || "",
        email: o?.email || contacts[0]?.email || "",
        value: 0,
        probability: 10,
        stage: orgToStage(o?.phase),
        source: "Organization",
        region: o?.region || "",
        product: "",
        assignee: "",
        team: Array.isArray(o?.responsibleMembers) ? o.responsibleMembers : [],
        created: today,
        nextAction: "",
        status: getStatusFromStage(orgToStage(o?.phase)),
        timeSpent: 0,
        lastActivity: today,
        isPremium: !!o?.premiumSupport,
      };
    });

    setLeadsList((prev) => {
      const prevMap = new Map(
        Array.isArray(prev) ? prev.map((l) => [l.id, l]) : [],
      );
      const mergedOrgLeads = baseFromOrgs.map((l) => {
        const old = prevMap.get(l.id);
        if (!old) return l;
        return {
          ...l,
          stage: old.stage ?? l.stage,
          probability: old.probability ?? l.probability,
          value: old.value ?? l.value,
          contacts: Array.isArray(old.contacts) ? old.contacts : l.contacts,
          contact: old.contact ?? l.contact,
          team: Array.isArray(old.team) ? old.team : l.team,
          assignee: old.assignee ?? l.assignee,
          nextAction: old.nextAction ?? l.nextAction,
          status: old.status ?? l.status,
          notes: old.notes ?? l.notes,
          created: old.created ?? l.created,
          lastActivity: old.lastActivity ?? l.lastActivity,
          product: old.product ?? l.product,
          region: old.region ?? l.region,
          source: old.source ?? l.source,
          isPremium: typeof old.isPremium === 'boolean' ? old.isPremium : l.isPremium,
        };
      });

      const nonOrg = Array.isArray(prev)
        ? prev.filter(
            (l) => typeof l?.id !== "string" || !l.id.startsWith("LEAD-ORG-"),
          )
        : [];
      return [...mergedOrgLeads, ...nonOrg];
    });
  }, [organizations]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);

  // ------- New lead form -------
  const [newLead, setNewLead] = useState({
    name: "",
    contacts: [{ name: "", role: "Primary", phone: "", email: "" }],
    value: "",
    stage: STAGES[0],
    status: "",
    source: "",
    region: "",
    unitType: "Government",
    county: "",
    municipality: "",
    city: "",
    address: "",
    phone: "",
    fax: "",
    email: "",
    websites: "",
    product: "",
    assignee: "",
    team: [],
    nextAction: "",
    nextActionNote: "",
    isPremium: false,
    notes: "",
  });
  const handleNewChange = (field, value) =>
    setNewLead((p) => ({ ...p, [field]: value }));

  const handleAddLead = () => {
    if (!newLead.name || !newLead.contacts[0]?.name || !newLead.value) {
      alert(
        "Please fill required fields: company, at least 1 contact, and deal value.",
      );
      return;
    }
    const id = `LEAD-${String(leadsList.length + 1).padStart(3, "0")}`;
    const today = new Date().toISOString().split("T")[0];
    const status = newLead.status || getStatusFromStage(newLead.stage);

    const lead = {
      id,
      name: newLead.name,
      contacts: newLead.contacts,
      contact: newLead.contacts[0]?.name || "",
      phone: newLead.phone || newLead.contacts[0]?.phone || "",
      email: newLead.email || newLead.contacts[0]?.email || "",
      value: parseFloat(newLead.value) || 0,
      stage: newLead.stage,
      source: newLead.source,
      region: newLead.region,
      unitType: newLead.unitType,
      county: newLead.county,
      municipality: newLead.municipality,
      city: newLead.city,
      address: newLead.address,
      fax: newLead.fax,
      websites: newLead.websites
        ? newLead.websites
            .split(",")
            .map((w) => w.trim())
            .filter(Boolean)
        : [],
      product: newLead.product,
      assignee: newLead.assignee,
      team: newLead.team,
      created: today,
      nextAction: newLead.nextAction,
      nextActionNote: newLead.nextActionNote,
      status,
      timeSpent: 0,
      lastActivity: today,
      isPremium: !!newLead.isPremium,
      notes: newLead.notes,
    };

    setLeadsList((prev) => [lead, ...prev]);
    syncOrgFromLead(lead);
    setNewLead({
      name: "",
      contacts: [{ name: "", role: "Primary", phone: "", email: "" }],
      value: "",
      stage: STAGES[0],
      status: "",
      source: "",
      region: "",
      unitType: "Government",
      county: "",
      municipality: "",
      city: "",
      address: "",
      phone: "",
      fax: "",
      email: "",
      websites: "",
      product: "",
      assignee: "",
      team: [],
      nextAction: "",
      nextActionNote: "",
      isPremium: false,
      notes: "",
    });
    setIsNewOpen(false);
  };

  const updateLeadStage = (leadId, toStage) => {
    const newStatus = getStatusFromStage(toStage);
    setLeadsList((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, stage: toStage, status: newStatus } : l,
      ),
    );
    setEditLead((prev) =>
      prev && prev.id === leadId
        ? { ...prev, stage: toStage, status: newStatus }
        : prev,
    );
    setSelectedLead((prev) =>
      prev && prev.id === leadId
        ? { ...prev, stage: toStage, status: newStatus }
        : prev,
    );
    const current = leadsList.find((l) => l.id === leadId);
    if (current) {
      syncOrgFromLead({ ...current, stage: toStage });
    }
  };

  // ------- Filters -------
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    stage: "All Stages",
    status: "All Statuses",
    region: "All Regions",
    product: "All Products",
    assignee: "All Owners",
    minVal: "",
    maxVal: "",
    dateFrom: "",
    dateTo: "",
  });
  const resetFilters = () =>
    setFilters({
      search: "",
      stage: "All Stages",
      status: "All Statuses",
      region: "All Regions",
      product: "All Products",
      assignee: "All Owners",
      minVal: "",
      maxVal: "",
      dateFrom: "",
      dateTo: "",
    });

  const filteredLeads = useMemo(() => {
    return leadsList.filter((l) => {
      const text =
        `${l.name} ${l.region} ${l.product} ${l.assignee} ${l.contacts?.map((c) => c.name).join(" ")}`.toLowerCase();
      if (filters.search && !text.includes(filters.search.toLowerCase()))
        return false;
      if (filters.stage !== "All Stages" && l.stage !== filters.stage)
        return false;
      if (
        filters.status !== "All Statuses" &&
        getStatusFromStage(l.stage) !== filters.status
      )
        return false;
      if (filters.region !== "All Regions" && l.region !== filters.region)
        return false;
      if (filters.product !== "All Products" && l.product !== filters.product)
        return false;
      if (filters.assignee !== "All Owners" && l.assignee !== filters.assignee)
        return false;
      if (filters.minVal && Number(l.value) < Number(filters.minVal))
        return false;
      if (filters.maxVal && Number(l.value) > Number(filters.maxVal))
        return false;
      // Date range checks (Next Action)
      if (
        filters.dateFrom &&
        (!l.nextAction || l.nextAction < filters.dateFrom)
      )
        return false;
      if (filters.dateTo && (!l.nextAction || l.nextAction > filters.dateTo))
        return false;
      return true;
    });
  }, [leadsList, filters]);

  // Listen for external sales lead updates (e.g., from Organization page)
  useEffect(() => {
    const reloadLeads = () => {
      try {
        const saved = localStorage.getItem("sales_leads");
        setLeadsList(saved ? JSON.parse(saved) : []);
      } catch {}
    };
    window.addEventListener("salesLeadsUpdated", reloadLeads);
    return () => window.removeEventListener("salesLeadsUpdated", reloadLeads);
  }, []);

  // Drag & Drop state and helpers
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);
  const [isMoveConfirmOpen, setIsMoveConfirmOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState(null);
  const navigate = useNavigate();
  const leadsByStage = useMemo(() => {
    const out = {};
    STAGES.forEach((s) => {
      out[s] = filteredLeads.filter((l) => l.stage === s);
    });
    return out;
  }, [filteredLeads]);
  const onDragStart = (e, id) => {
    try {
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.effectAllowed = "move";
    } catch {}
    setDraggingId(id);
  };
  const onDragEnd = () => {
    setDraggingId(null);
    setDragOverStage(null);
  };
  const onDragOverColumn = (e, stage) => {
    e.preventDefault();
    setDragOverStage(stage);
    try {
      e.dataTransfer.dropEffect = "move";
    } catch {}
  };
  const onDropOnColumn = (e, stage) => {
    e.preventDefault();
    const id =
      (e.dataTransfer && e.dataTransfer.getData("text/plain")) || draggingId;
    if (!id) return;
    updateLeadStage(id, stage);
    const lead = leadsList.find((l) => l.id === id);
    setPendingMove({ id, toStage: stage, lead });
    setIsMoveConfirmOpen(true);
    setDraggingId(null);
    setDragOverStage(null);
  };

  // Manual sync: add all organizations into their respective phases (creates/updates LEAD-ORG-{org.id})
  const syncAllOrganizationsToPhases = () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const fromOrgs = (organizations || []).map((o, idx) => {
        const contactName = [
          o?.contactPerson?.firstName,
          o?.contactPerson?.surname,
        ]
          .filter(Boolean)
          .join(" ");
        const contact = contactName || "";
        const contacts = contact
          ? [
              {
                name: contact,
                role: o?.contactPerson?.role || "Primary",
                phone: o?.contactPerson?.phone || o?.phone || "",
                email: o?.email || "",
              },
            ]
          : [];
        return {
          id: `LEAD-ORG-${o?.id ?? idx}`,
          name: o?.organizationName || o?.name || "Organization",
          contacts,
          contact,
          phone: o?.phone || contacts[0]?.phone || "",
          email: o?.email || contacts[0]?.email || "",
          value: 0,
          probability: 10,
          stage: orgToStage(o?.phase),
          source: "Organization",
          region: o?.region || "",
          product: "",
          assignee: "",
          team: Array.isArray(o?.responsibleMembers)
            ? o.responsibleMembers
            : [],
          created: today,
          nextAction: "",
          status: getStatusFromStage(orgToStage(o?.phase)),
          timeSpent: 0,
          lastActivity: today,
          isPremium: !!o?.premiumSupport,
        };
      });
      setLeadsList((prev) => {
        const map = new Map(
          Array.isArray(prev) ? prev.map((l) => [l.id, l]) : [],
        );
        fromOrgs.forEach((l) => {
          const old = map.get(l.id);
          map.set(
            l.id,
            old
              ? {
                  ...l,
                  ...old,
                  stage: l.stage,
                  team: l.team,
                  contacts: l.contacts,
                  contact: l.contact,
                  phone: l.phone,
                  email: l.email,
                }
              : l,
          );
        });
        const merged = Array.from(map.values());
        try {
          localStorage.setItem("sales_leads", JSON.stringify(merged));
        } catch {}
        return merged;
      });
    } catch {}
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Sales Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive sales performance and pipeline management
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Client</DialogTitle>
                <DialogDescription>
                  Create a new client in your pipeline.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {/* Company name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Company/Organization *</Label>
                  <Input
                    id="name"
                    placeholder="Enter company name"
                    value={newLead.name}
                    onChange={(e) => handleNewChange("name", e.target.value)}
                  />
                </div>

                {/* Region and Lead Source */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Select
                      value={newLead.region}
                      onValueChange={(v) => handleNewChange("region", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Zagreb">Zagreb</SelectItem>
                        <SelectItem value="Split-Dalmatia">
                          Split-Dalmatia
                        </SelectItem>
                        <SelectItem value="Istria">Istria</SelectItem>
                        <SelectItem value="Zadar">Zadar</SelectItem>
                        <SelectItem value="Karlovac">Karlovac</SelectItem>
                        <SelectItem value="Dubrovnik-Neretva">
                          Dubrovnik-Neretva
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Lead Source</Label>
                    <Select
                      value={newLead.source}
                      onValueChange={(v) => handleNewChange("source", v)}
                    >
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
                </div>

                {/* Unit type */}
                <div className="space-y-2">
                  <Label>Unit Type</Label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="unitType"
                        value="Government"
                        className="h-4 w-4"
                        checked={newLead.unitType === "Government"}
                        onChange={(e) =>
                          handleNewChange("unitType", e.target.value)
                        }
                      />
                      <span>Government</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="unitType"
                        value="Independent"
                        className="h-4 w-4"
                        checked={newLead.unitType === "Independent"}
                        onChange={(e) =>
                          handleNewChange("unitType", e.target.value)
                        }
                      />
                      <span>Independent</span>
                    </label>
                  </div>
                </div>

                {/* Deal value */}
                <div className="space-y-2">
                  <Label>Deal Value (€) *</Label>
                  <Input
                    type="number"
                    placeholder="50000"
                    value={newLead.value}
                    onChange={(e) => handleNewChange("value", e.target.value)}
                  />
                </div>

                {/* County / Municipality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>County</Label>
                    <Input
                      value={newLead.county}
                      onChange={(e) =>
                        handleNewChange("county", e.target.value)
                      }
                      placeholder="County"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Municipality</Label>
                    <Input
                      value={newLead.municipality}
                      onChange={(e) =>
                        handleNewChange("municipality", e.target.value)
                      }
                      placeholder="Municipality"
                    />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={newLead.city}
                    onChange={(e) => handleNewChange("city", e.target.value)}
                    placeholder="City"
                  />
                </div>

                {/* Premium */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="new-isPremium"
                    className="h-4 w-4"
                    checked={!!newLead.isPremium}
                    onChange={(e) => handleNewChange("isPremium", e.target.checked)}
                  />
                  <Label htmlFor="new-isPremium">Premium Client</Label>
                </div>

                {/* Status and Phase */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={newLead.status}
                      onValueChange={(v) => handleNewChange("status", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hot">Hot</SelectItem>
                        <SelectItem value="Warm">Warm</SelectItem>
                        <SelectItem value="Cold">Cold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Phase</Label>
                    <Select
                      value={newLead.stage}
                      onValueChange={(v) => handleNewChange("stage", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select phase" />
                      </SelectTrigger>
                      <SelectContent>
                        {STAGES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Next action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Next Action</Label>
                    <Input
                      placeholder="e.g. Follow-up call"
                      value={newLead.nextActionNote}
                      onChange={(e) =>
                        handleNewChange("nextActionNote", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Next Action Date</Label>
                    <Input
                      type="date"
                      value={newLead.nextAction}
                      onChange={(e) =>
                        handleNewChange("nextAction", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    placeholder="Full address"
                    value={newLead.address}
                    onChange={(e) => handleNewChange("address", e.target.value)}
                  />
                </div>

                {/* Phone / Fax */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={newLead.phone}
                      onChange={(e) => handleNewChange("phone", e.target.value)}
                      placeholder="+385 XX XXX XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fax</Label>
                    <Input
                      value={newLead.fax}
                      onChange={(e) => handleNewChange("fax", e.target.value)}
                      placeholder="Fax"
                    />
                  </div>
                </div>

                {/* Email / Websites */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newLead.email}
                      onChange={(e) => handleNewChange("email", e.target.value)}
                      placeholder="name@company.hr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Website(s)</Label>
                    <Input
                      value={newLead.websites}
                      onChange={(e) =>
                        handleNewChange("websites", e.target.value)
                      }
                      placeholder="comma separated"
                    />
                  </div>
                </div>

                {/* Contacts */}
                <ContactsEditor
                  contacts={newLead.contacts}
                  onChange={(c) => handleNewChange("contacts", c)}
                />

                {/* Assigned To */}
                <TeamSelector
                  team={newLead.team}
                  onChange={(t) => handleNewChange("team", t)}
                />

                {/* Notes */}
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    rows={3}
                    placeholder="Additional notes about this client..."
                    value={newLead.notes}
                    onChange={(e) => handleNewChange("notes", e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddLead}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Client
                </Button>
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
                <p className="text-sm font-medium text-blue-700">
                  Total Pipeline
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {formatCurrency(salesMetrics.totalPipeline)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  +12% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Monthly Achievement
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {formatCurrency(salesMetrics.monthlyActual)}
                </p>
                <div className="mt-2">
                  <Progress
                    value={Math.min(
                      100,
                      (salesMetrics.monthlyActual /
                        salesMetrics.monthlyTarget) *
                        100,
                    )}
                    className="h-2"
                  />
                  <p className="text-xs text-green-600 mt-1">
                    {Math.round(
                      (salesMetrics.monthlyActual /
                        salesMetrics.monthlyTarget) *
                        100,
                    )}
                    % of target
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">
                  Conversion Rate
                </p>
                <p className="text-3xl font-bold text-orange-900">
                  {salesMetrics.conversionRate}%
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  +5% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Avg Deal Size
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {formatCurrency(salesMetrics.avgDealSize)}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  +8% from last month
                </p>
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
            <CardDescription>
              Target vs Actual Revenue (Last 6 Months)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={monthlyData} height={250} />
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-green-600" />
              <span>Regional Distribution</span>
            </CardTitle>
            <CardDescription>Sales Pipeline by Region</CardDescription>
          </CardHeader>
          <CardContent>
            <SimplePieLegend data={regionData} />
          </CardContent>
        </Card>
      </div>

      {/* -------- FILTERS BAR -------- */}
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ActivityIcon className="h-5 w-5 text-blue-600" />
              <span>Active Sales Pipeline</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFiltersOpen((o) => !o)}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
              aria-expanded={isFiltersOpen}
              aria-controls="sales-filters-content"
            >
              {isFiltersOpen ? (
                <ChevronUp className="h-4 w-4 mr-1" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-1" />
              )}
              {isFiltersOpen ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
          <CardDescription>Current leads and opportunities</CardDescription>
        </CardHeader>
        <CardContent id="sales-filters-content" className={isFiltersOpen ? "space-y-4" : "hidden"}>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <Input
              placeholder="Search company/contact…"
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
            />
            <Select
              value={filters.stage}
              onValueChange={(v) => setFilters((f) => ({ ...f, stage: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Stages">All stages</SelectItem>
                {STAGES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Statuses">All statuses</SelectItem>
                <SelectItem value="Hot">Hot</SelectItem>
                <SelectItem value="Warm">Warm</SelectItem>
                <SelectItem value="Cold">Cold</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.region}
              onValueChange={(v) => setFilters((f) => ({ ...f, region: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Regions">All regions</SelectItem>
                <SelectItem value="Zagreb">Zagreb</SelectItem>
                <SelectItem value="Split-Dalmatia">Split-Dalmatia</SelectItem>
                <SelectItem value="Istria">Istria</SelectItem>
                <SelectItem value="Zadar">Zadar</SelectItem>
                <SelectItem value="Karlovac">Karlovac</SelectItem>
                <SelectItem value="Dubrovnik-Neretva">
                  Dubrovnik-Neretva
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.product}
              onValueChange={(v) => setFilters((f) => ({ ...f, product: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Products">All products</SelectItem>
                <SelectItem value="LRSU Management">LRSU Management</SelectItem>
                <SelectItem value="Tourism Management">
                  Tourism Management
                </SelectItem>
                <SelectItem value="Port Management">Port Management</SelectItem>
                <SelectItem value="Full Suite">Full Suite</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.assignee}
              onValueChange={(v) => setFilters((f) => ({ ...f, assignee: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Owners">All owners</SelectItem>
                {teamDirectory.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Input
              type="number"
              placeholder="Minimum Value €"
              value={filters.minVal}
              onChange={(e) =>
                setFilters((f) => ({ ...f, minVal: e.target.value }))
              }
            />
            <Input
              type="number"
              placeholder="Maximum Value €"
              value={filters.maxVal}
              onChange={(e) =>
                setFilters((f) => ({ ...f, maxVal: e.target.value }))
              }
            />
            <Input
              type="date"
              placeholder="Start Date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters((f) => ({ ...f, dateFrom: e.target.value }))
              }
            />
            <Input
              type="date"
              placeholder="End Date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters((f) => ({ ...f, dateTo: e.target.value }))
              }
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full"
              >
                Reset Filters
              </Button>
              <Button
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={syncAllOrganizationsToPhases}
              >
                Add all organizations
              </Button>
            </div>
          </div>

          {/* Kanban board */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              Drag clients between phases to update their status
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {STAGES.map((stage) => (
                <div
                  key={stage}
                  onDragOver={(e) => onDragOverColumn(e, stage)}
                  onDrop={(e) => onDropOnColumn(e, stage)}
                  className={`rounded-lg border bg-white/70 p-3 min-h-[260px] flex flex-col transition-all ${dragOverStage === stage ? "ring-2 ring-blue-300 bg-blue-50/60" : "border-gray-200"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-gray-800">
                      {stage}
                    </div>
                    <Badge variant="outline" className={getStageColor(stage)}>
                      {(leadsByStage[stage] || []).length}
                    </Badge>
                  </div>
                  <div className="space-y-2 flex-1">
                    {(leadsByStage[stage] || []).map((lead) => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, lead.id)}
                        onDragEnd={onDragEnd}
                        className={`p-3 rounded-md border bg-white shadow-sm cursor-grab active:cursor-grabbing transition-all ${draggingId === lead.id ? "opacity-70 ring-2 ring-blue-300" : "border-gray-200"}`}
                        title="Drag to another column to change stage"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-gray-800 line-clamp-1">
                            {lead.name}
                          </h4>
                          <Badge
                            className={getStatusColor(
                              getStatusFromStage(lead.stage),
                            )}
                          >
                            {getStatusFromStage(lead.stage)}
                          </Badge>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 flex items-center gap-3 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {lead.contacts?.[0]?.name || lead.contact || "—"}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {formatCurrency(lead.value)}
                          </span>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            onClick={() => {
                              setSelectedLead(lead);
                              setIsViewOpen(true);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-200 text-purple-700 hover:bg-purple-50"
                            onClick={() => {
                              setEditLead(lead);
                              setIsEditOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                    {(leadsByStage[stage] || []).length === 0 && (
                      <div className="text-xs text-gray-400 border border-dashed rounded p-3 text-center">
                        Drop here
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredLeads.length === 0 && (
              <p className="text-sm text-gray-500">
                No deals match your filters.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirm create activity after stage move */}
      <Dialog open={isMoveConfirmOpen} onOpenChange={setIsMoveConfirmOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Sales Activity?</DialogTitle>
            <DialogDescription>
              {pendingMove?.lead?.name ? `${pendingMove.lead.name} was moved to "${pendingMove.toStage}".` : "Client moved to new stage."} Would you like to create a sales activity for this client now?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMoveConfirmOpen(false)}>Cancel</Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                try {
                  const lead = pendingMove?.lead;
                  if (lead) {
                    const unitType = lead.unitType || "Government";
                    const payload = { linkedClient: lead.name || "", unitType, isPremium: !!lead.isPremium };
                    localStorage.setItem(
                      "prefillNewActivityFromSales",
                      JSON.stringify(payload)
                    );
                  }
                } catch {}
                setIsMoveConfirmOpen(false);
                navigate("/activities");
              }}
            >
              Yes, create activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* -------- EDIT DIALOG -------- */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>
              Update lead details for your pipeline.
            </DialogDescription>
          </DialogHeader>
          {editLead && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Company/Organization *</Label>
                  <Input
                    value={editLead.name}
                    onChange={(e) =>
                      setEditLead((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stage</Label>
                  <Select
                    value={editLead.stage}
                    onValueChange={(v) => {
                      setEditLead((p) => ({ ...p, stage: v }));
                      updateLeadStage(editLead.id, v);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editLead.status || getStatusFromStage(editLead.stage) || ""}
                    onValueChange={(v) => setEditLead((p) => ({ ...p, status: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hot">Hot</SelectItem>
                      <SelectItem value="Warm">Warm</SelectItem>
                      <SelectItem value="Cold">Cold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <ContactsEditor
                contacts={editLead.contacts || []}
                onChange={(c) =>
                  setEditLead((p) => ({
                    ...p,
                    contacts: c,
                    contact: c?.[0]?.name || p.contact,
                  }))
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Deal Value (€)</Label>
                  <Input
                    type="number"
                    value={editLead.value}
                    onChange={(e) =>
                      setEditLead((p) => ({
                        ...p,
                        value: parseFloat(e.target.value || "0"),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Next Action</Label>
                  <Input
                    placeholder="e.g. Follow-up call"
                    value={editLead.nextActionNote || ""}
                    onChange={(e) =>
                      setEditLead((p) => ({ ...p, nextActionNote: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Next Action Date</Label>
                  <Input
                    type="date"
                    value={editLead.nextAction || ""}
                    onChange={(e) =>
                      setEditLead((p) => ({ ...p, nextAction: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>County</Label>
                  <Input
                    value={editLead.county || ""}
                    onChange={(e) =>
                      setEditLead((p) => ({ ...p, county: e.target.value }))
                    }
                    placeholder="County"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Municipality</Label>
                  <Input
                    value={editLead.municipality || ""}
                    onChange={(e) =>
                      setEditLead((p) => ({ ...p, municipality: e.target.value }))
                    }
                    placeholder="Municipality"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={editLead.city || ""}
                  onChange={(e) => setEditLead((p) => ({ ...p, city: e.target.value }))}
                  placeholder="City"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-isPremium"
                  className="h-4 w-4"
                  checked={!!editLead.isPremium}
                  onChange={(e) => setEditLead((p) => ({ ...p, isPremium: e.target.checked }))}
                />
                <Label htmlFor="edit-isPremium">Premium Client</Label>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  placeholder="Full address"
                  value={editLead.address || ""}
                  onChange={(e) => setEditLead((p) => ({ ...p, address: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={editLead.phone || ""}
                    onChange={(e) => setEditLead((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+385 XX XXX XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fax</Label>
                  <Input
                    value={editLead.fax || ""}
                    onChange={(e) => setEditLead((p) => ({ ...p, fax: e.target.value }))}
                    placeholder="Fax"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editLead.email || ""}
                    onChange={(e) => setEditLead((p) => ({ ...p, email: e.target.value }))}
                    placeholder="name@company.hr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website(s)</Label>
                  <Input
                    value={Array.isArray(editLead.websites) ? editLead.websites.join(", ") : editLead.websites || ""}
                    onChange={(e) => setEditLead((p) => ({ ...p, websites: e.target.value }))}
                    placeholder="comma separated"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Unit Type</Label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="editUnitType"
                      value="Government"
                      className="h-4 w-4"
                      checked={(editLead.unitType || "Government") === "Government"}
                      onChange={(e) => setEditLead((p) => ({ ...p, unitType: e.target.value }))}
                    />
                    <span>Government</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="editUnitType"
                      value="Independent"
                      className="h-4 w-4"
                      checked={editLead.unitType === "Independent"}
                      onChange={(e) => setEditLead((p) => ({ ...p, unitType: e.target.value }))}
                    />
                    <span>Independent</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Lead Source</Label>
                  <Select
                    value={editLead.source || ""}
                    onValueChange={(v) =>
                      setEditLead((p) => ({ ...p, source: v }))
                    }
                  >
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
                  <Label>Region</Label>
                  <Select
                    value={editLead.region || ""}
                    onValueChange={(v) =>
                      setEditLead((p) => ({ ...p, region: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zagreb">Zagreb</SelectItem>
                      <SelectItem value="Split-Dalmatia">
                        Split-Dalmatia
                      </SelectItem>
                      <SelectItem value="Istria">Istria</SelectItem>
                      <SelectItem value="Zadar">Zadar</SelectItem>
                      <SelectItem value="Karlovac">Karlovac</SelectItem>
                      <SelectItem value="Dubrovnik-Neretva">
                        Dubrovnik-Neretva
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select
                    value={editLead.product || ""}
                    onValueChange={(v) =>
                      setEditLead((p) => ({ ...p, product: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LRSU Management">
                        LRSU Management
                      </SelectItem>
                      <SelectItem value="Tourism Management">
                        Tourism Management
                      </SelectItem>
                      <SelectItem value="Port Management">
                        Port Management
                      </SelectItem>
                      <SelectItem value="Full Suite">Full Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Owner (Assignee)</Label>
                  <Select
                    value={editLead.assignee || ""}
                    onValueChange={(v) =>
                      setEditLead((p) => ({ ...p, assignee: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assign owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamDirectory.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <TeamSelector
                  team={editLead.team || []}
                  onChange={(t) => setEditLead((p) => ({ ...p, team: t }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  rows={3}
                  value={editLead.notes || ""}
                  onChange={(e) =>
                    setEditLead((p) => ({ ...p, notes: e.target.value }))
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                if (!editLead?.name) {
                  alert("Name is required");
                  return;
                }
                const coercedStatus = editLead.status || getStatusFromStage(editLead.stage);
                const normalizedWebsites =
                  typeof editLead.websites === "string"
                    ? editLead.websites
                        .split(",")
                        .map((w) => w.trim())
                        .filter(Boolean)
                    : Array.isArray(editLead.websites)
                    ? editLead.websites
                    : [];
                const toSave = { ...editLead, websites: normalizedWebsites, status: coercedStatus };
                setLeadsList((prev) =>
                  prev.map((l) => (l.id === editLead.id ? { ...l, ...toSave } : l)),
                );
                syncOrgFromLead(toSave);
                setIsEditOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* -------- VIEW DIALOG -------- */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedLead?.name} —{" "}
              <span className="text-sm font-normal">Complete Profile</span>
            </DialogTitle>
            <DialogDescription>
              Comprehensive client information and deal details.
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-6">
              {/* Top badges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-gray-500">Status</p>
                  <div className="mt-1">
                    <Badge
                      className={getStatusColor(
                        getStatusFromStage(selectedLead.stage),
                      )}
                    >
                      {getStatusFromStage(selectedLead.stage)}
                    </Badge>
                  </div>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-gray-500">Contract Value</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(selectedLead.value)}
                  </p>
                </div>
              </div>

              {/* Client & Deal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Client Information</h4>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-gray-500">Region:</span>{" "}
                      {selectedLead.region || "—"}
                    </div>
                    <div>
                      <span className="text-gray-500">Product:</span>{" "}
                      {selectedLead.product || "—"}
                    </div>
                    <div>
                      <span className="text-gray-500">Source:</span>{" "}
                      {selectedLead.source || "—"}
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>{" "}
                      {selectedLead.created || "—"}
                    </div>
                    <div>
                      <span className="text-gray-500">Last Activity:</span>{" "}
                      {selectedLead.lastActivity || "—"}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Deal Details</h4>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-gray-500">Stage:</span>{" "}
                      {selectedLead.stage}
                    </div>
                    <div>
                      <span className="text-gray-500">Owner:</span>{" "}
                      {selectedLead.assignee || "—"}
                    </div>
                    <div>
                      <span className="text-gray-500">Team:</span>{" "}
                      {selectedLead.team?.length
                        ? selectedLead.team.join(", ")
                        : "—"}
                    </div>
                    <div>
                      <span className="text-gray-500">Next Action:</span>{" "}
                      {selectedLead.nextAction || "—"}
                    </div>
                    <div>
                      <span className="text-gray-500">Time Spent:</span>{" "}
                      {selectedLead.timeSpent}h
                    </div>
                  </div>
                </div>
              </div>

              {/* Contacts */}
              <div>
                <h4 className="font-semibold mb-2">Contacts</h4>
                <div className="space-y-2">
                  {(selectedLead.contacts || []).map((c, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm p-2 rounded border"
                    >
                      <span className="font-medium">{c.name}</span>
                      {c.role && <Badge variant="outline">{c.role}</Badge>}
                      <span className="text-gray-500">{c.phone || "—"}</span>
                      <span className="text-gray-500">{c.email || "—"}</span>
                    </div>
                  ))}
                  {(!selectedLead.contacts ||
                    selectedLead.contacts.length === 0) && (
                    <p className="text-sm text-gray-500">
                      No contacts provided.
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedLead.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Notes</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedLead.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
