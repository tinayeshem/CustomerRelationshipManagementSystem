import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { performDataMigration, isMigrationNeeded, getMigrationSummary } from "@/lib/organizationMigration";
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
  Crown,
  Building2,
  Landmark,
  Globe,
  Database,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { TEAM_MEMBERS } from "@/constants/teamMembers";
import { useAuth } from "@/contexts/AuthContext";

const unitTypes = ["All Types", "Government", "Independent"];
const organizationCategories = ["All Categories", "County", "Municipality", "City", "Sports Club", "SME", "Craftsmen", "Association"];
const statuses = ["All Statuses", "Active", "Expired", "Potential", "Client", "Former Client", "Negotiation in Progress", "Not Contacted", "Rejected"];
const phases = ["All Phases", "New", "First contact", "interested", "Offer sent", "Accepted", "Contract signed", "implementation", "Declined"];
const nextPhases = ["All Next Phases", "Reach Out", "Follow-up Call", "Proposal Submission", "Contract Signing", "Implementation", "Review Meeting", "Renewal Discussion"];
const orgTeamMembers = ["Ana Marić", "Marko Petrović", "Petra Babić", "Luka Novak", "Sofia Antić"];

const getStatusColor = (status) => {
  switch (status) {
    case "Active": 
    case "Client": return "bg-green-100 text-green-800 border-green-200";
    case "Expired": 
    case "Former Client": return "bg-red-100 text-red-800 border-red-200";
    case "Potential": 
    case "Potential Client": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Negotiation in Progress": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Not Contacted": return "bg-gray-100 text-gray-800 border-gray-200";
    case "Rejected": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPhaseColor = (phase) => {
  switch (phase) {
    case "New": return "bg-gray-100 text-gray-800 border-gray-200";
    case "First contact": return "bg-blue-100 text-blue-800 border-blue-200";
    case "interested": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Offer sent": return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case "Accepted": return "bg-green-100 text-green-800 border-green-200";
    case "Contract signed": return "bg-purple-100 text-purple-800 border-purple-200";
    case "implementation": return "bg-teal-100 text-teal-800 border-teal-200";
    case "Declined": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getUnitTypeIcon = (unitType, category) => {
  if (unitType === "Government") {
    switch (category) {
      case "Municipality": return <Building className="h-4 w-4" />;
      case "City": return <Building2 className="h-4 w-4" />;
      case "County": return <Landmark className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  } else {
    switch (category) {
      case "Sports Club": return <Users className="h-4 w-4" />;
      case "SME": return <Building2 className="h-4 w-4" />;
      case "Craftsmen": return <Building className="h-4 w-4" />;
      case "Association": return <Users className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  }
};

const getUnitTypeColor = (unitType, category) => {
  if (unitType === "Government") {
    switch (category) {
      case "Municipality": return "from-blue-500 to-blue-600";
      case "City": return "from-blue-600 to-blue-700";
      case "County": return "from-blue-400 to-blue-500";
      default: return "from-blue-500 to-blue-600";
    }
  } else {
    switch (category) {
      case "Sports Club": return "from-green-500 to-green-600";
      case "SME": return "from-purple-500 to-purple-600";
      case "Craftsmen": return "from-orange-500 to-orange-600";
      case "Association": return "from-teal-500 to-teal-600";
      default: return "from-gray-500 to-gray-600";
    }
  }
};

const formatCurrency = (amount) => {
  return `€${amount?.toLocaleString() || '0'}`;
};

const handleOpenMaps = (address) => {
  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  window.open(googleMapsUrl, '_blank');
};

export default function Organization() {
  const { user, getAllUsers } = useAuth();
  const teamDirectory = useMemo(() => {
    const dept = user?.department;
    try {
      const list = (getAllUsers?.() || [])
        .filter((u) => u?.department === dept && !u?.isCEO)
        .map((u) => u.name);
      if (list.length) return list;
    } catch {}
    return TEAM_MEMBERS.filter((m) => m.department === dept).map((m) => m.name);
  }, [user?.department, getAllUsers]);
  const [organizations, setOrganizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnitType, setSelectedUnitType] = useState("All Types");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedPhase, setSelectedPhase] = useState("All Phases");
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMigrationInProgress, setIsMigrationInProgress] = useState(false);
  const [migrationSummary, setMigrationSummary] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // Form state for new organization
  const [formData, setFormData] = useState({
    organizationName: "",
    unitType: "Government",
    county: "",
    municipality: "",
    city: "",
    status: "",
    phase: "",
    nextPhase: "",
    address: "",
    phone: "",
    fax: "",
    email: "",
    websites: "",
    contactPersons: [
      { firstName: "", surname: "", role: "", phone: "", email: "" }
    ],
    contactFirstName: "",
    contactSurname: "",
    contactRole: "",
    contactPhone: "",
    responsibleMembers: [],
    premiumSupport: false,
    // Legacy fields for migration compatibility
    category: "",
    notes: ""
  });

  // Form state for editing organization
  const [editFormData, setEditFormData] = useState({
    id: "",
    organizationName: "",
    unitType: "Government",
    county: "",
    municipality: "",
    city: "",
    status: "",
    phase: "",
    nextPhase: "",
    address: "",
    phone: "",
    fax: "",
    email: "",
    websites: "",
    contactPersons: [
      { firstName: "", surname: "", role: "", phone: "", email: "" }
    ],
    contactFirstName: "",
    contactSurname: "",
    contactRole: "",
    contactPhone: "",
    responsibleMembers: [],
    premiumSupport: false,
    category: "",
    notes: ""
  });

  // Load data from API on component mount
  useEffect(() => {
    loadMigratedData();
  }, []);

  const loadMigratedData = () => {
    const migratedData = localStorage.getItem('organizationData');
    if (migratedData) {
      const parsedData = JSON.parse(migratedData);
      setOrganizations(parsedData);
      console.log(`Loaded ${parsedData.length} organizations from storage`);
    } else if (isMigrationNeeded()) {
      const summary = getMigrationSummary();
      setMigrationSummary(summary);
      performMigration();
    }
  };

  const performMigration = async () => {
    setIsMigrationInProgress(true);
    console.log("Performing data migration from Client and LRSU databases...");

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const migratedOrganizations = performDataMigration();
      setOrganizations(migratedOrganizations);
      localStorage.setItem('organizationData', JSON.stringify(migratedOrganizations));
      console.log(`Migration completed: ${migratedOrganizations.length} organizations created`);
    } catch (error) {
      console.error("Migration failed:", error);
      alert("Migration failed. Please try again or contact support.");
    } finally {
      setIsMigrationInProgress(false);
    }
  };

  // Helper functions to map frontend data to backend format
  const mapUnitType = (unitType, category) => {
    if (unitType === "Government") {
      if (category === "County") return "County";
      if (category === "City") return "City";
      if (category === "Municipality") return "Municipality";
    }
    if (category === "Sports Club") return "Club";
    if (category === "Association") return "Association";
    if (category === "SME") return "Company";
    if (category === "Craftsmen") return "Craftsman";
    return "Other";
  };

  const mapStatus = (status) => {
    switch (status) {
      case "Active": return "Client";
      case "Expired": return "Former Client";
      case "Potential": return "Potential Client";
      default: return status || "Not Contacted";
    }
  };

  const handleForceMigration = () => {
    // Clear existing data and perform fresh migration
    localStorage.removeItem('organizationData');
    performMigration();
  };

  const filteredData = organizations.filter((org) => {
    const matchesSearch = org.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.contactFirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.contactSurname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnitType = selectedUnitType === "All Types" || org.unitType === selectedUnitType;
    const matchesCategory = selectedCategory === "All Categories" || org.category === selectedCategory;
    const matchesStatus = selectedStatus === "All Statuses" || org.status === selectedStatus;
    const matchesPhase = selectedPhase === "All Phases" || org.phase === selectedPhase;

    return matchesSearch && matchesUnitType && matchesCategory && matchesStatus && matchesPhase;
  });

  const handleAddOrganization = () => {
    if (!formData.organizationName || !formData.unitType) {
      alert("Please fill in all required fields");
      return;
    }

    // Determine category based on unit type selection
    let category = formData.category;
    if (formData.unitType === "Government") {
      if (formData.county) category = "County";
      else if (formData.municipality) category = "Municipality";
      else if (formData.city) category = "City";
    }

    const contactsArr = Array.isArray(formData.contactPersons)
      ? formData.contactPersons
          .map(c => ({
            firstName: c.firstName?.trim() || "",
            surname: c.surname?.trim() || "",
            role: c.role?.trim() || "",
            phone: c.phone?.trim() || "",
            email: c.email?.trim() || "",
          }))
          .filter(c => c.firstName || c.surname || c.phone || c.email)
      : [];
    const legacyPrimary = {
      firstName: formData.contactFirstName?.trim() || "",
      surname: formData.contactSurname?.trim() || "",
      role: formData.contactRole?.trim() || "",
      phone: formData.contactPhone?.trim() || "",
      email: "",
    };
    const primaryContact = contactsArr[0] || legacyPrimary;

    const newOrganization = {
      id: organizations.length + 1,
      organizationName: formData.organizationName,
      unitType: formData.unitType,
      category: category,
      county: formData.county,
      municipality: formData.municipality,
      city: formData.city,
      status: formData.status,
      phase: formData.phase || "First contact",
      nextPhase: formData.nextPhase,
      address: formData.address,
      phone: formData.phone,
      fax: formData.fax,
      email: formData.email,
      websites: formData.websites.split(',').map(w => w.trim()).filter(w => w),
      contactPerson: {
        firstName: primaryContact.firstName,
        surname: primaryContact.surname,
        role: primaryContact.role,
        phone: primaryContact.phone
      },
      contactPersons: contactsArr,
      responsibleMembers: formData.responsibleMembers,
      notes: formData.notes,
      premiumSupport: !!formData.premiumSupport,
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    const updatedOrganizations = [...organizations, newOrganization];
    setOrganizations(updatedOrganizations);
    localStorage.setItem('organizationData', JSON.stringify(updatedOrganizations));
    window.dispatchEvent(new Event('organizationDataUpdated'));

    // Upsert matching sales lead ONLY for active phases
    try {
      const active = ["first contact","interested","offer sent","accepted","contract signed","implementation"];
      const phaseKey = String(newOrganization.phase || "").toLowerCase();
      if (active.includes(phaseKey)) {
        const leadId = `LEAD-ORG-${newOrganization.id}`;
        const savedLeads = localStorage.getItem('sales_leads');
        const leads = savedLeads ? JSON.parse(savedLeads) : [];
        const idx = Array.isArray(leads) ? leads.findIndex(l => l.id === leadId) : -1;
        const contactName = [newOrganization.contactPerson.firstName, newOrganization.contactPerson.surname].filter(Boolean).join(' ');
        const contact = contactName || '';
        const contacts = contact ? [{ name: contact, role: newOrganization.contactPerson.role || 'Primary', phone: newOrganization.contactPerson.phone || newOrganization.phone || '', email: newOrganization.email || '' }] : [];
        const stage = newOrganization.phase;
        const baseLead = {
          id: leadId,
          name: newOrganization.organizationName,
          contacts,
          contact,
          phone: newOrganization.phone || contacts[0]?.phone || '',
          email: newOrganization.email || contacts[0]?.email || '',
          value: 0,
          probability: 10,
          stage,
          source: 'Organization',
          region: newOrganization.region || '',
          product: '',
          assignee: '',
          team: Array.isArray(newOrganization.responsibleMembers) ? newOrganization.responsibleMembers : [],
          created: new Date().toISOString().split('T')[0],
          nextAction: '',
          status: 'Cold',
          timeSpent: 0,
          lastActivity: new Date().toISOString().split('T')[0]
        };
        if (idx === -1) {
          localStorage.setItem('sales_leads', JSON.stringify([baseLead, ...leads]));
        } else {
          leads[idx] = { ...baseLead, ...leads[idx], name: baseLead.name, stage: baseLead.stage, team: baseLead.team, contacts: baseLead.contacts, contact: baseLead.contact, phone: baseLead.phone, email: baseLead.email };
          localStorage.setItem('sales_leads', JSON.stringify(leads));
        }
        window.dispatchEvent(new Event('salesLeadsUpdated'));
      }
    } catch {}

    setIsAddDialogOpen(false);

    // Reset form
    setFormData({
      organizationName: "",
      unitType: "Government",
      county: "",
      municipality: "",
      city: "",
      status: "",
      phase: "",
      nextPhase: "",
      address: "",
      phone: "",
      fax: "",
      email: "",
      websites: "",
      contactPersons: [{ firstName: "", surname: "", role: "", phone: "", email: "" }],
      contactFirstName: "",
      contactSurname: "",
      contactRole: "",
      contactPhone: "",
      category: "",
      premiumSupport: false,
      notes: ""
    });
  };

  const handleViewDetails = (org) => {
    setSelectedOrganization(org);
    setIsViewDialogOpen(true);
  };

  const handleEditOrganization = (org) => {
    const contacts = Array.isArray(org.contactPersons)
      ? org.contactPersons.map(c => ({
          firstName: c.firstName || "",
          surname: c.surname || "",
          role: c.role || "",
          phone: c.phone || "",
          email: c.email || "",
        }))
      : org.contactPerson
        ? [{
            firstName: org.contactPerson.firstName || "",
            surname: org.contactPerson.surname || "",
            role: org.contactPerson.role || "",
            phone: org.contactPerson.phone || "",
            email: org.email || "",
          }]
        : [{ firstName: "", surname: "", role: "", phone: "", email: "" }];
    const primary = contacts[0] || { firstName: "", surname: "", role: "", phone: "" };
    setEditFormData({
      id: org.id,
      organizationName: org.organizationName,
      unitType: org.unitType,
      county: org.county || "",
      municipality: org.municipality || "",
      city: org.city || "",
      status: org.status,
      phase: org.phase,
      nextPhase: org.nextPhase,
      address: org.address,
      phone: org.phone || "",
      fax: org.fax || "",
      email: org.email || "",
      websites: org.websites?.join(", ") || "",
      contactPersons: contacts,
      contactFirstName: primary.firstName || "",
      contactSurname: primary.surname || "",
      contactRole: primary.role || "",
      contactPhone: primary.phone || "",
      category: org.category,
      responsibleMembers: org.responsibleMembers || [],
      premiumSupport: !!org.premiumSupport,
      notes: org.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateOrganization = () => {
    if (!editFormData.organizationName || !editFormData.unitType) {
      alert("Please fill in all required fields");
      return;
    }

    // Determine category based on unit type selection
    let category = editFormData.category;
    if (editFormData.unitType === "Government") {
      if (editFormData.county) category = "County";
      else if (editFormData.municipality) category = "Municipality";
      else if (editFormData.city) category = "City";
    }

    const contactsArr = Array.isArray(editFormData.contactPersons)
      ? editFormData.contactPersons
          .map(c => ({
            firstName: c.firstName?.trim() || "",
            surname: c.surname?.trim() || "",
            role: c.role?.trim() || "",
            phone: c.phone?.trim() || "",
            email: c.email?.trim() || "",
          }))
          .filter(c => c.firstName || c.surname || c.phone || c.email)
      : [];
    const legacyPrimary = {
      firstName: editFormData.contactFirstName?.trim() || "",
      surname: editFormData.contactSurname?.trim() || "",
      role: editFormData.contactRole?.trim() || "",
      phone: editFormData.contactPhone?.trim() || "",
      email: "",
    };
    const primaryContact = contactsArr[0] || legacyPrimary;

    const updatedOrganization = {
      ...organizations.find(o => o.id === editFormData.id),
      organizationName: editFormData.organizationName,
      unitType: editFormData.unitType,
      category: category,
      county: editFormData.county,
      municipality: editFormData.municipality,
      city: editFormData.city,
      status: editFormData.status,
      phase: editFormData.phase,
      nextPhase: editFormData.nextPhase,
      address: editFormData.address,
      phone: editFormData.phone,
      fax: editFormData.fax,
      email: editFormData.email,
      websites: editFormData.websites.split(',').map(w => w.trim()).filter(w => w),
      contactPerson: {
        firstName: primaryContact.firstName,
        surname: primaryContact.surname,
        role: primaryContact.role,
        phone: primaryContact.phone
      },
      contactPersons: contactsArr,
      responsibleMembers: editFormData.responsibleMembers,
      premiumSupport: !!editFormData.premiumSupport,
      notes: editFormData.notes,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    const updatedOrganizations = organizations.map(org =>
      org.id === editFormData.id ? updatedOrganization : org
    );
    setOrganizations(updatedOrganizations);
    localStorage.setItem('organizationData', JSON.stringify(updatedOrganizations));
    window.dispatchEvent(new Event('organizationDataUpdated'));

    // Sync corresponding sales lead: add/update for active phases, remove otherwise
    try {
      const active = ["first contact","interested","offer sent","accepted","contract signed","implementation"];
      const phaseKey = String(updatedOrganization.phase || "").toLowerCase();
      const leadId = `LEAD-ORG-${updatedOrganization.id}`;
      const savedLeads = localStorage.getItem('sales_leads');
      const leads = savedLeads ? JSON.parse(savedLeads) : [];
      const idx = Array.isArray(leads) ? leads.findIndex(l => l.id === leadId) : -1;
      if (active.includes(phaseKey)) {
        const contactName = [updatedOrganization.contactPerson.firstName, updatedOrganization.contactPerson.surname].filter(Boolean).join(' ');
        const contact = contactName || '';
        const contacts = contact ? [{ name: contact, role: updatedOrganization.contactPerson.role || 'Primary', phone: updatedOrganization.contactPerson.phone || updatedOrganization.phone || '', email: updatedOrganization.email || '' }] : [];
        const patch = {
          id: leadId,
          name: updatedOrganization.organizationName,
          stage: updatedOrganization.phase,
          team: Array.isArray(updatedOrganization.responsibleMembers) ? updatedOrganization.responsibleMembers : [],
          contacts,
          contact,
          phone: updatedOrganization.phone || contacts[0]?.phone || '',
          email: updatedOrganization.email || contacts[0]?.email || '',
        };
        if (idx === -1) {
          localStorage.setItem('sales_leads', JSON.stringify([patch, ...leads]));
        } else {
          leads[idx] = { ...leads[idx], ...patch };
          localStorage.setItem('sales_leads', JSON.stringify(leads));
        }
      } else {
        if (idx !== -1) {
          const next = leads.filter(l => l.id !== leadId);
          localStorage.setItem('sales_leads', JSON.stringify(next));
        }
      }
      window.dispatchEvent(new Event('salesLeadsUpdated'));
    } catch {}

    // Strict sync: update linked projects to match new phase
    const savedProjects = localStorage.getItem('projectsData');
    const projectList = savedProjects ? JSON.parse(savedProjects) : [];
    if (Array.isArray(projectList) && projectList.length) {
      const pipeline = phases.slice(1);
      const phaseIndex = pipeline.indexOf(updatedOrganization.phase);
      const syncedProjects = projectList.map(p => {
        if (String(p.organizationId) !== String(updatedOrganization.id)) return p;
        const newStages = pipeline.map((name, idx) => ({ name, completed: phaseIndex >= 0 ? idx <= phaseIndex : false, order: idx + 1 }));
        return { ...p, currentStage: updatedOrganization.phase || pipeline[0], stages: newStages };
      });
      localStorage.setItem('projectsData', JSON.stringify(syncedProjects));
      window.dispatchEvent(new Event('projectsDataUpdated'));
    }

    setIsEditDialogOpen(false);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedUnitType("All Types");
    setSelectedCategory("All Categories");
    setSelectedStatus("All Statuses");
    setSelectedPhase("All Phases");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Header */}
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
          Organization Database
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Unified management of all client organizations and prospects
        </p>

        {/* Migration Status */}
        {isMigrationInProgress && (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
              <span className="text-blue-800 font-medium">Migrating data from Client and LRSU databases...</span>
            </div>
            {migrationSummary && (
              <p className="text-sm text-blue-600 text-center mt-2">
                Processing {migrationSummary.clientRecords} Client records and {migrationSummary.lrsuRecords} LRSU records
              </p>
            )}
          </div>
        )}

        {/* Migration Summary */}
        {migrationSummary && !isMigrationInProgress && organizations.length > 0 && (
          <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Database className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Migration Completed Successfully</span>
            </div>
            <p className="text-sm text-green-600 text-center">
              Created {organizations.length} organizations from {migrationSummary.clientRecords} Client and {migrationSummary.lrsuRecords} LRSU records
              {migrationSummary.duplicatesFound > 0 && ` (${migrationSummary.duplicatesFound} duplicates merged)`}
            </p>
          </div>
        )}
      </div>

      {/* Filters Section */}
      <Card className="border border-blue-200 bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Filter className="h-5 w-5" />
              <span>Advanced Organization Filters</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFiltersOpen((o) => !o)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                aria-expanded={isFiltersOpen}
                aria-controls="org-filters-content"
              >
                {isFiltersOpen ? (
                  <ChevronUp className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-1" />
                )}
                {isFiltersOpen ? "Hide Filters" : "Show Filters"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
              >
                <Filter className="h-4 w-4 mr-1" />
                Reset Filters
              </Button>
            </div>
          </div>
          <CardDescription>Filter and analyze your organization portfolio</CardDescription>
        </CardHeader>
        <CardContent id="org-filters-content" className={isFiltersOpen ? "space-y-4" : "hidden"}>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
            <Input 
              placeholder="Search organizations, contacts, or notes..." 
              className="pl-10 bg-white border-blue-200 focus:border-blue-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Rows */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Select value={selectedUnitType} onValueChange={setSelectedUnitType}>
              <SelectTrigger className="bg-white border-blue-200">
                <SelectValue placeholder="Unit Type" />
              </SelectTrigger>
              <SelectContent>
                {unitTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white border-blue-200">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {organizationCategories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
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

            <Select value={selectedPhase} onValueChange={setSelectedPhase}>
              <SelectTrigger className="bg-white border-blue-200">
                <SelectValue placeholder="Phase" />
              </SelectTrigger>
              <SelectContent>
                {phases.map((phase) => (
                  <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex space-x-2">
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {organizations.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleForceMigration}
                  disabled={isMigrationInProgress}
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 flex-1"
                  title="Re-migrate data from Client and LRSU databases"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isMigrationInProgress ? 'animate-spin' : ''}`} />
                  Re-migrate
                </Button>
              )}
            </div>
          </div>

          {/* Results and Actions */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-600">
              Found {filteredData.length} organization{filteredData.length !== 1 ? 's' : ''}
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => open && setIsAddDialogOpen(open)}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Organization
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Organization</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new organization
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  {/* Organization Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-800">Organization Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="organizationName">Organization Name *</Label>
                        <Input
                          id="organizationName"
                          value={formData.organizationName}
                          onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                          placeholder="Enter organization name"
                        />
                      </div>
                      
                      {/* Unit Type Radio Buttons */}
                      <div className="space-y-3 col-span-2">
                        <Label>Unit Type *</Label>
                        <div className="flex space-x-6">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="unitType-government"
                              name="unitType"
                              value="Government"
                              checked={formData.unitType === "Government"}
                              onChange={(e) => setFormData({...formData, unitType: e.target.value})}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <Label htmlFor="unitType-government" className="text-sm font-medium">Government</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="unitType-independent"
                              name="unitType"
                              value="Independent"
                              checked={formData.unitType === "Independent"}
                              onChange={(e) => setFormData({...formData, unitType: e.target.value})}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <Label htmlFor="unitType-independent" className="text-sm font-medium">Independent</Label>
                          </div>
                        </div>
                      </div>

                      {/* Conditional Fields for Government */}
                      {formData.unitType === "Government" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="county">County</Label>
                            <Input
                              id="county"
                              value={formData.county}
                              onChange={(e) => setFormData({...formData, county: e.target.value})}
                              placeholder="Enter county name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="municipality">Municipality</Label>
                            <Input
                              id="municipality"
                              value={formData.municipality}
                              onChange={(e) => setFormData({...formData, municipality: e.target.value})}
                              placeholder="Enter municipality name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={formData.city}
                              onChange={(e) => setFormData({...formData, city: e.target.value})}
                              placeholder="Enter city name"
                            />
                          </div>
                        </>
                      )}

                      {/* Independent Organization Category */}
                      {formData.unitType === "Independent" && (
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Sports Club">Sports Club</SelectItem>
                              <SelectItem value="SME">SME</SelectItem>
                              <SelectItem value="Craftsmen">Craftsmen</SelectItem>
                              <SelectItem value="Association">Association</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
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

                      <div className="flex items-center gap-2 col-span-2">
                        <input
                          id="premiumSupport"
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          checked={!!formData.premiumSupport}
                          onChange={(e) => setFormData({ ...formData, premiumSupport: e.target.checked })}
                        />
                        <Label htmlFor="premiumSupport">Premium</Label>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phase">Phase</Label>
                        <Select value={formData.phase} onValueChange={(value) => setFormData({...formData, phase: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select phase" />
                          </SelectTrigger>
                          <SelectContent>
                            {phases.slice(1).map((phase) => (
                              <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nextPhase">Next Phase</Label>
                        <Select value={formData.nextPhase} onValueChange={(value) => setFormData({...formData, nextPhase: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select next phase" />
                          </SelectTrigger>
                          <SelectContent>
                            {nextPhases.slice(1).map((phase) => (
                              <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3 col-span-2">
                        <Label>Responsible Members</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {teamDirectory.map((member) => (
                            <div key={member} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`org-resp-${member.replace(' ', '-').toLowerCase()}`}
                                checked={Array.isArray(formData.responsibleMembers) ? formData.responsibleMembers.includes(member) : false}
                                onChange={(e) => {
                                  const current = Array.isArray(formData.responsibleMembers) ? formData.responsibleMembers : [];
                                  const updated = e.target.checked ? Array.from(new Set([...current, member])) : current.filter(m => m !== member);
                                  setFormData({ ...formData, responsibleMembers: updated });
                                }}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <Label htmlFor={`org-resp-${member.replace(' ', '-').toLowerCase()}`} className="text-sm font-medium">
                                {member}
                              </Label>
                            </div>
                          ))}
                        </div>
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

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fax">Fax</Label>
                        <Input
                          id="fax"
                          value={formData.fax}
                          onChange={(e) => setFormData({...formData, fax: e.target.value})}
                          placeholder="Enter fax number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="Enter email address"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="websites">Website(s)</Label>
                        <Input
                          id="websites"
                          value={formData.websites}
                          onChange={(e) => setFormData({...formData, websites: e.target.value})}
                          placeholder="Enter websites (comma separated)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Persons */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-blue-800">Contact Persons</h3>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        onClick={() => setFormData({
                          ...formData,
                          contactPersons: [...(formData.contactPersons || []), { firstName: "", surname: "", role: "", phone: "", email: "" }]
                        })}
                      >
                        Add Contact
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {(formData.contactPersons || []).map((c, idx) => (
                        <Card key={idx} className="p-4 border-blue-100">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-blue-800">Contact #{idx + 1}</span>
                            {idx > 0 && (
                              <Button
                                type="button"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                  const next = [...(formData.contactPersons || [])];
                                  next.splice(idx, 1);
                                  setFormData({ ...formData, contactPersons: next });
                                }}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>First Name</Label>
                              <Input
                                value={c.firstName}
                                onChange={(e) => {
                                  const next = [...(formData.contactPersons || [])];
                                  next[idx] = { ...next[idx], firstName: e.target.value };
                                  setFormData({ ...formData, contactPersons: next });
                                }}
                                placeholder="First name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Surname</Label>
                              <Input
                                value={c.surname}
                                onChange={(e) => {
                                  const next = [...(formData.contactPersons || [])];
                                  next[idx] = { ...next[idx], surname: e.target.value };
                                  setFormData({ ...formData, contactPersons: next });
                                }}
                                placeholder="Surname"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Role</Label>
                              <Input
                                value={c.role}
                                onChange={(e) => {
                                  const next = [...(formData.contactPersons || [])];
                                  next[idx] = { ...next[idx], role: e.target.value };
                                  setFormData({ ...formData, contactPersons: next });
                                }}
                                placeholder="Role/position"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Phone</Label>
                              <Input
                                value={c.phone}
                                onChange={(e) => {
                                  const next = [...(formData.contactPersons || [])];
                                  next[idx] = { ...next[idx], phone: e.target.value };
                                  setFormData({ ...formData, contactPersons: next });
                                }}
                                placeholder="Phone number"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label>Email</Label>
                              <Input
                                type="email"
                                value={c.email}
                                onChange={(e) => {
                                  const next = [...(formData.contactPersons || [])];
                                  next[idx] = { ...next[idx], email: e.target.value };
                                  setFormData({ ...formData, contactPersons: next });
                                }}
                                placeholder="Email address"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
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
                  <Button onClick={handleAddOrganization} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Add Organization
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Organizations Grid */}
      <div className="space-y-4">
        {filteredData.map((org) => (
          <Card key={org.id} className="border-blue-200/50 bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${getUnitTypeColor(org.unitType, org.category)} text-white mt-1`}>
                    {getUnitTypeIcon(org.unitType, org.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3 mt-1">
                      <h3 className="font-semibold text-foreground">{org.organizationName}</h3>
                      <Badge variant="outline" className={getStatusColor(org.status)}>
                        {org.status}
                      </Badge>
                      {org.phase && (
                        <Badge variant="outline" className={getPhaseColor(org.phase)}>
                          {org.phase}
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        {org.unitType}
                      </Badge>
                      {org.premiumSupport && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Premium</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{org.notes}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{org.category}</span>
                      </div>
                      {org.contactPerson?.firstName && (
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{org.contactPerson.firstName} {org.contactPerson.surname}</span>
                        </div>
                      )}
                      {org.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{org.phone}</span>
                        </div>
                      )}
                      {org.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{org.email}</span>
                        </div>
                      )}
                      {org.address && (
                        <div
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors col-span-2"
                          onClick={() => handleOpenMaps(org.address)}
                          title="View location on Google Maps"
                        >
                          <MapPin className="h-3 w-3" />
                          <span className="hover:underline">{org.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Responsible Team Members */}
                    {org.responsibleMembers && org.responsibleMembers.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Responsible Team</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {org.responsibleMembers.map((member, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-white text-blue-700 border-blue-200 hover:bg-blue-50 transition-colors"
                            >
                              {member}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {org.nextPhase && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                        <strong>Next Phase:</strong> {org.nextPhase}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2 mt-1">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(org)}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditOrganization(org)}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <Card className="border border-blue-200 bg-blue-50">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-bold text-blue-800 mb-2">No organizations found</h3>
            <p className="text-blue-600 mb-4">
              {organizations.length === 0 
                ? "Start by adding your first organization or performing data migration."
                : "Try adjusting your filters or search terms."
              }
            </p>
            <Button 
              onClick={resetFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* View Organization Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <span>{selectedOrganization?.organizationName} - Organization Details</span>
            </DialogTitle>
            <DialogDescription>
              Complete organization information and contact details
            </DialogDescription>
          </DialogHeader>

          {selectedOrganization && (
            <div className="space-y-6">
              {/* Status Overview */}
              <div className="flex justify-start">
                <div className="p-4 bg-blue-50 rounded-lg text-left w-fit">
                  <Badge variant="outline" className={getStatusColor(selectedOrganization.status)}>
                    {selectedOrganization.status}
                  </Badge>
                  <p className="text-xs text-gray-600 mt-1">Status</p>
                </div>
              </div>

              {/* Organization Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-800">Organization Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Organization Name</Label>
                      <p className="text-sm text-gray-600">{selectedOrganization.organizationName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Unit Type</Label>
                      <p className="text-sm text-gray-600">{selectedOrganization.unitType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Category</Label>
                      <p className="text-sm text-gray-600">{selectedOrganization.category || 'Not specified'}</p>
                    </div>
                    {selectedOrganization.unitType === "Government" && (
                      <>
                        {selectedOrganization.county && (
                          <div>
                            <Label className="text-sm font-medium">County</Label>
                            <p className="text-sm text-gray-600">{selectedOrganization.county}</p>
                          </div>
                        )}
                        {selectedOrganization.municipality && (
                          <div>
                            <Label className="text-sm font-medium">Municipality</Label>
                            <p className="text-sm text-gray-600">{selectedOrganization.municipality}</p>
                          </div>
                        )}
                        {selectedOrganization.city && (
                          <div>
                            <Label className="text-sm font-medium">City</Label>
                            <p className="text-sm text-gray-600">{selectedOrganization.city}</p>
                          </div>
                        )}
                      </>
                    )}
                    <div>
                      <Label className="text-sm font-medium">Address</Label>
                      <div
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                        onClick={() => handleOpenMaps(selectedOrganization.address)}
                        title="Click to view on Google Maps"
                      >
                        <MapPin className="h-4 w-4" />
                        <p className="text-sm hover:underline">{selectedOrganization.address || 'Address not available'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-800">Contact Information</h3>
                  <div className="space-y-3">
                    {selectedOrganization.phone && (
                      <div>
                        <Label className="text-sm font-medium">Phone</Label>
                        <p className="text-sm text-gray-600">{selectedOrganization.phone}</p>
                      </div>
                    )}
                    {selectedOrganization.fax && (
                      <div>
                        <Label className="text-sm font-medium">Fax</Label>
                        <p className="text-sm text-gray-600">{selectedOrganization.fax}</p>
                      </div>
                    )}
                    {selectedOrganization.email && (
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-sm text-gray-600">{selectedOrganization.email}</p>
                      </div>
                    )}
                    {selectedOrganization.websites && selectedOrganization.websites.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Website(s)</Label>
                        <div className="space-y-1">
                          {selectedOrganization.websites.map((website, idx) => (
                            <a
                              key={idx}
                              href={website.startsWith('http') ? website : `https://${website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-sm text-blue-600 hover:underline"
                            >
                              <Globe className="h-3 w-3" />
                              <span>{website}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              {selectedOrganization.contactPerson && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-800">Contact Person</h3>
                  <Card className="p-4">
                    <div className="space-y-2">
                      <p className="font-medium text-gray-800">
                        {selectedOrganization.contactPerson.firstName} {selectedOrganization.contactPerson.surname}
                      </p>
                      {selectedOrganization.contactPerson.role && (
                        <p className="text-sm text-gray-600">{selectedOrganization.contactPerson.role}</p>
                      )}
                      {selectedOrganization.contactPerson.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{selectedOrganization.contactPerson.phone}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {/* Phase Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-800">Phase Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Current Phase</Label>
                    <p className="text-sm text-gray-600">{selectedOrganization.phase || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Next Phase</Label>
                    <p className="text-sm text-gray-600">{selectedOrganization.nextPhase || 'Not set'}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrganization.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-800">Notes</h3>
                  <Card className="p-4 bg-gray-50">
                    <p className="text-sm text-gray-700">{selectedOrganization.notes}</p>
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
                handleEditOrganization(selectedOrganization);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Organization Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
            <DialogDescription>
              Update organization information and contact details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Organization Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-800">Organization Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-organizationName">Organization Name *</Label>
                  <Input
                    id="edit-organizationName"
                    value={editFormData.organizationName}
                    onChange={(e) => setEditFormData({...editFormData, organizationName: e.target.value})}
                    placeholder="Enter organization name"
                  />
                </div>

                {/* Unit Type Radio Buttons */}
                <div className="space-y-3 col-span-2">
                  <Label>Unit Type *</Label>
                  <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="edit-unitType-government"
                        name="editUnitType"
                        value="Government"
                        checked={editFormData.unitType === "Government"}
                        onChange={(e) => setEditFormData({...editFormData, unitType: e.target.value})}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <Label htmlFor="edit-unitType-government" className="text-sm font-medium">Government</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="edit-unitType-independent"
                        name="editUnitType"
                        value="Independent"
                        checked={editFormData.unitType === "Independent"}
                        onChange={(e) => setEditFormData({...editFormData, unitType: e.target.value})}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <Label htmlFor="edit-unitType-independent" className="text-sm font-medium">Independent</Label>
                    </div>
                  </div>
                </div>

                {/* Conditional Fields for Government */}
                {editFormData.unitType === "Government" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="edit-county">County</Label>
                      <Input
                        id="edit-county"
                        value={editFormData.county}
                        onChange={(e) => setEditFormData({...editFormData, county: e.target.value})}
                        placeholder="Enter county name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-municipality">Municipality</Label>
                      <Input
                        id="edit-municipality"
                        value={editFormData.municipality}
                        onChange={(e) => setEditFormData({...editFormData, municipality: e.target.value})}
                        placeholder="Enter municipality name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-city">City</Label>
                      <Input
                        id="edit-city"
                        value={editFormData.city}
                        onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
                        placeholder="Enter city name"
                      />
                    </div>
                  </>
                )}

                {/* Independent Organization Category */}
                {editFormData.unitType === "Independent" && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select value={editFormData.category} onValueChange={(value) => setEditFormData({...editFormData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sports Club">Sports Club</SelectItem>
                        <SelectItem value="SME">SME</SelectItem>
                        <SelectItem value="Craftsmen">Craftsmen</SelectItem>
                        <SelectItem value="Association">Association</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    id="edit-premiumSupport"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    checked={!!editFormData.premiumSupport}
                    onChange={(e) => setEditFormData({ ...editFormData, premiumSupport: e.target.checked })}
                  />
                  <Label htmlFor="edit-premiumSupport">Premium</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editFormData.status} onValueChange={(value) => setEditFormData({...editFormData, status: value})}>
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
                  <Label htmlFor="edit-phase">Phase</Label>
                  <Select value={editFormData.phase} onValueChange={(value) => setEditFormData({...editFormData, phase: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select phase" />
                    </SelectTrigger>
                    <SelectContent>
                      {phases.slice(1).map((phase) => (
                        <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-nextPhase">Next Phase</Label>
                  <Select value={editFormData.nextPhase} onValueChange={(value) => setEditFormData({...editFormData, nextPhase: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select next phase" />
                    </SelectTrigger>
                    <SelectContent>
                      {nextPhases.slice(1).map((phase) => (
                        <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 col-span-2">
                  <Label>Responsible Members</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {orgTeamMembers.map((member) => (
                      <div key={member} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`edit-org-resp-${member.replace(' ', '-').toLowerCase()}`}
                          checked={Array.isArray(editFormData.responsibleMembers) ? editFormData.responsibleMembers.includes(member) : false}
                          onChange={(e) => {
                            const current = Array.isArray(editFormData.responsibleMembers) ? editFormData.responsibleMembers : [];
                            const updated = e.target.checked ? Array.from(new Set([...current, member])) : current.filter(m => m !== member);
                            setEditFormData({ ...editFormData, responsibleMembers: updated });
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <Label htmlFor={`edit-org-resp-${member.replace(' ', '-').toLowerCase()}`} className="text-sm font-medium">
                          {member}
                        </Label>
                      </div>
                    ))}
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

                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-fax">Fax</Label>
                  <Input
                    id="edit-fax"
                    value={editFormData.fax}
                    onChange={(e) => setEditFormData({...editFormData, fax: e.target.value})}
                    placeholder="Enter fax number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-websites">Website(s)</Label>
                  <Input
                    id="edit-websites"
                    value={editFormData.websites}
                    onChange={(e) => setEditFormData({...editFormData, websites: e.target.value})}
                    placeholder="Enter websites (comma separated)"
                  />
                </div>
              </div>
            </div>

            {/* Contact Persons */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-blue-800">Contact Persons</h3>
                <Button
                  type="button"
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => setEditFormData({
                    ...editFormData,
                    contactPersons: [...(editFormData.contactPersons || []), { firstName: "", surname: "", role: "", phone: "", email: "" }]
                  })}
                >
                  Add Contact
                </Button>
              </div>
              <div className="space-y-4">
                {(editFormData.contactPersons || []).map((c, idx) => (
                  <Card key={idx} className="p-4 border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-blue-800">Contact #{idx + 1}</span>
                      {idx > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            const next = [...(editFormData.contactPersons || [])];
                            next.splice(idx, 1);
                            setEditFormData({ ...editFormData, contactPersons: next });
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input
                          value={c.firstName}
                          onChange={(e) => {
                            const next = [...(editFormData.contactPersons || [])];
                            next[idx] = { ...next[idx], firstName: e.target.value };
                            setEditFormData({ ...editFormData, contactPersons: next });
                          }}
                          placeholder="First name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Surname</Label>
                        <Input
                          value={c.surname}
                          onChange={(e) => {
                            const next = [...(editFormData.contactPersons || [])];
                            next[idx] = { ...next[idx], surname: e.target.value };
                            setEditFormData({ ...editFormData, contactPersons: next });
                          }}
                          placeholder="Surname"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input
                          value={c.role}
                          onChange={(e) => {
                            const next = [...(editFormData.contactPersons || [])];
                            next[idx] = { ...next[idx], role: e.target.value };
                            setEditFormData({ ...editFormData, contactPersons: next });
                          }}
                          placeholder="Role/position"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={c.phone}
                          onChange={(e) => {
                            const next = [...(editFormData.contactPersons || [])];
                            next[idx] = { ...next[idx], phone: e.target.value };
                            setEditFormData({ ...editFormData, contactPersons: next });
                          }}
                          placeholder="Phone number"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={c.email}
                          onChange={(e) => {
                            const next = [...(editFormData.contactPersons || [])];
                            next[idx] = { ...next[idx], email: e.target.value };
                            setEditFormData({ ...editFormData, contactPersons: next });
                          }}
                          placeholder="Email address"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={editFormData.notes}
                onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                placeholder="Enter any notes or comments"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOrganization} className="bg-blue-600 hover:bg-blue-700 text-white">
              Update Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
