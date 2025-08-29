import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, CheckCircle, ClipboardCheck, Layers, ListChecks, Plus, Settings, Users, History, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const PHASES = ["Initial Contact", "Proposal", "Negotiation", "Contract", "Active", "Renewal", "Terminated"]; // ordered
const DEFAULT_TEAM_MEMBERS = ["Ana Marić", "Marko Petrović", "Petra Babić", "Luka Novak", "Sofia Antić"];

const getStageBadge = (stage) => {
  switch (stage) {
    case "Initial Contact": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Proposal": return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case "Negotiation": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Contract": return "bg-green-100 text-green-800 border-green-200";
    case "Active": return "bg-purple-100 text-purple-800 border-purple-200";
    case "Renewal": return "bg-teal-100 text-teal-800 border-teal-200";
    case "Terminated": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("projectsData");
    return saved ? JSON.parse(saved) : [];
  });
  const [auditTrail, setAuditTrail] = useState({});
  const [selectedProjectAudit, setSelectedProjectAudit] = useState(null);
  const [showAuditDialog, setShowAuditDialog] = useState(false);

  // One-time migration: convert old 4-stage projects and org phases to new 7-phase pipeline
  useEffect(() => {
    const mapOldToNew = { Meeting: "Initial Contact", Call: "Proposal", Negotiation: "Negotiation", Contract: "Contract" };

    // Migrate projects
    const savedProjects = localStorage.getItem("projectsData");
    const projList = savedProjects ? JSON.parse(savedProjects) : [];
    let projChanged = false;
    const migratedProjects = projList.map(p => {
      const needs = !Array.isArray(p.stages) || p.stages.length !== PHASES.length || (p.stages[0]?.name === "Meeting" || p.stages[0]?.name === "Call");
      if (!needs) return p;
      projChanged = true;
      const mappedCurrent = mapOldToNew[p.currentStage] || (PHASES.includes(p.currentStage) ? p.currentStage : PHASES[0]);
      const newStages = PHASES.map((name, idx) => ({ name, completed: PHASES.indexOf(mappedCurrent) >= idx, order: idx + 1 }));
      return { ...p, stages: newStages, currentStage: mappedCurrent };
    });
    if (projChanged) {
      setProjects(migratedProjects);
      localStorage.setItem("projectsData", JSON.stringify(migratedProjects));
    }

    // Migrate organizations
    const savedOrgs = localStorage.getItem("organizationData");
    const orgList = savedOrgs ? JSON.parse(savedOrgs) : [];
    let orgChanged = false;
    const migratedOrgs = orgList.map(o => {
      if (o?.phase === "Meeting") { orgChanged = true; return { ...o, phase: "Initial Contact" }; }
      if (o?.phase === "Call") { orgChanged = true; return { ...o, phase: "Proposal" }; }
      return o;
    });
    if (orgChanged) {
      localStorage.setItem("organizationData", JSON.stringify(migratedOrgs));
      setOrganizations(migratedOrgs);
    }
  }, []);
  const [organizations, setOrganizations] = useState(() => {
    const saved = localStorage.getItem("organizationData");
    return saved ? JSON.parse(saved) : [];
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem("activitiesList");
    return saved ? JSON.parse(saved) : [];
  });

  // Cross-page sync listeners: reload local storage updates made elsewhere
  useEffect(() => {
    const reloadProjects = () => {
      const saved = localStorage.getItem("projectsData");
      setProjects(saved ? JSON.parse(saved) : []);
    };
    const reloadOrgs = () => {
      const saved = localStorage.getItem("organizationData");
      setOrganizations(saved ? JSON.parse(saved) : []);
    };
    const reloadActivities = () => {
      const saved = localStorage.getItem("activitiesList");
      setActivities(saved ? JSON.parse(saved) : []);
    };
    const onVisibility = () => {
      if (!document.hidden) {
        reloadProjects();
        reloadOrgs();
        reloadActivities();
      }
    };
    window.addEventListener("projectsDataUpdated", reloadProjects);
    window.addEventListener("organizationDataUpdated", reloadOrgs);
    window.addEventListener("activitiesListUpdated", reloadActivities);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("projectsDataUpdated", reloadProjects);
      window.removeEventListener("organizationDataUpdated", reloadOrgs);
      window.removeEventListener("activitiesListUpdated", reloadActivities);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Create Project dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  useEffect(() => {
    if (isCreateOpen) {
      const saved = localStorage.getItem("organizationData");
      setOrganizations(saved ? JSON.parse(saved) : []);
    }
  }, [isCreateOpen]);
  const [createForm, setCreateForm] = useState({
    name: "",
    organizationId: "",
    goal: "",
    notes: "",
    assignedMembers: [],
    selectedActivityIds: []
  });

  const selectedOrg = useMemo(() => organizations.find(o => String(o.id) === String(createForm.organizationId)), [organizations, createForm.organizationId]);

  const availableMembers = useMemo(() => {
    const fromOrg = Array.isArray(selectedOrg?.responsibleMembers) ? selectedOrg.responsibleMembers : [];
    return Array.from(new Set([...fromOrg, ...DEFAULT_TEAM_MEMBERS]));
  }, [selectedOrg]);

  const orgActivities = useMemo(() => {
    if (!selectedOrg) return [];
    return activities.filter(a => a.linkedClient === selectedOrg.organizationName);
  }, [activities, selectedOrg]);

  // Persist helpers
  const saveProjects = (list) => {
    setProjects(list);
    localStorage.setItem("projectsData", JSON.stringify(list));
    window.dispatchEvent(new Event("projectsDataUpdated"));
  };
  const saveActivities = (list) => {
    setActivities(list);
    localStorage.setItem("activitiesList", JSON.stringify(list));
    window.dispatchEvent(new Event("activitiesListUpdated"));
  };

  const resetCreateForm = () => setCreateForm({
    name: "",
    organizationId: "",
    goal: "",
    notes: "",
    assignedMembers: [],
    selectedActivityIds: []
  });

  const handleCreateProject = () => {
    if (!createForm.name || !createForm.organizationId) {
      alert("Please provide a project name and select an organization");
      return;
    }
    const org = organizations.find(o => String(o.id) === String(createForm.organizationId));
    const id = Date.now();
    const currentFromOrg = org?.phase && PHASES.includes(org.phase) ? org.phase : PHASES[0];
    const project = {
      id,
      name: createForm.name,
      organizationId: org?.id,
      organizationName: org?.organizationName,
      goal: createForm.goal,
      notes: createForm.notes,
      assignedMembers: createForm.assignedMembers,
      activityIds: [...createForm.selectedActivityIds],
      createdAt: new Date().toISOString()
    };

    // Save project
    const updatedProjects = [project, ...projects];
    saveProjects(updatedProjects);

    // Link selected activities to this project
    if (createForm.selectedActivityIds.length) {
      const updatedActivities = activities.map(a =>
        createForm.selectedActivityIds.includes(a.id)
          ? { ...a, projectId: id }
          : a
      );
      saveActivities(updatedActivities);
    }

    setIsCreateOpen(false);
    resetCreateForm();
  };

  const setProjectStage = async (project, toStage) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      // For now, keep the local implementation until backend is connected
      const stageOrder = project.stages.map(s => s.name);
      const toIdx = stageOrder.indexOf(toStage);
      if (toIdx === -1) return;

      const updated = projects.map(p => {
        if (p.id !== project.id) return p;
        const newStages = p.stages.map((s, i) => ({ ...s, completed: i <= toIdx }));
        return { ...p, stages: newStages, currentStage: stageOrder[toIdx] };
      });
      saveProjects(updated);

      // Add local audit trail entry
      const auditEntry = {
        id: Date.now(),
        action: 'stage_changed',
        changedBy: user.name,
        timestamp: new Date().toLocaleString(),
        before: { currentStage: project.currentStage },
        after: { currentStage: toStage },
        message: `Stage changed from "${project.currentStage}" to "${toStage}"`
      };

      setAuditTrail(prev => ({
        ...prev,
        [project.id]: [...(prev[project.id] || []), auditEntry]
      }));

      const orgs = [...organizations];
      const orgIdx = orgs.findIndex(o => String(o.id) === String(project.organizationId));
      if (orgIdx !== -1) {
        orgs[orgIdx] = { ...orgs[orgIdx], phase: stageOrder[toIdx] };
        setOrganizations(orgs);
        localStorage.setItem("organizationData", JSON.stringify(orgs));
        window.dispatchEvent(new Event("organizationDataUpdated"));
      }

      // TODO: When backend is connected, uncomment this:
      // const response = await fetch(`/api/projects/${project.id}/change-stage`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ newStage: toStage })
      // });
      // if (!response.ok) throw new Error('Failed to update stage');
    } catch (error) {
      console.error('Error updating stage:', error);
    }
  };

  const advanceStage = async (project) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const stageOrder = project.stages.map(s => s.name);
      const idx = stageOrder.indexOf(project.currentStage);
      if (idx === -1) return;
      const nextIdx = Math.min(idx + 1, stageOrder.length - 1);

      await setProjectStage(project, stageOrder[nextIdx]);

      // TODO: When backend is connected, use this instead:
      // const response = await fetch(`/api/projects/${project.id}/advance-stage`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // if (!response.ok) throw new Error('Failed to advance stage');
    } catch (error) {
      console.error('Error advancing stage:', error);
    }
  };

  const goBackStage = async (project) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const stageOrder = project.stages.map(s => s.name);
      const idx = stageOrder.indexOf(project.currentStage);
      if (idx <= 0) return;

      await setProjectStage(project, stageOrder[idx - 1]);

      // TODO: When backend is connected, use this instead:
      // const response = await fetch(`/api/projects/${project.id}/go-back-stage`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // if (!response.ok) throw new Error('Failed to go back stage');
    } catch (error) {
      console.error('Error going back stage:', error);
    }
  };


  // Add Next Activity Dialog per project
  const [addActivityFor, setAddActivityFor] = useState(null); // project or null

  // Edit Project dialog state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    goal: "",
    notes: "",
    assignedMembers: [],
    currentStage: PHASES[0]
  });
  const [activityForm, setActivityForm] = useState({
    activityType: "Call",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    responsible: [],
    notes: "",
    status: "To Do",
    priority: "Medium"
  });

  const availableMembersForProject = useMemo(() => {
    if (!addActivityFor) return [];
    const org = organizations.find(o => String(o.id) === String(addActivityFor.organizationId));
    const fromOrg = Array.isArray(org?.responsibleMembers) ? org.responsibleMembers : [];
    return Array.from(new Set([...fromOrg, ...DEFAULT_TEAM_MEMBERS]));
  }, [addActivityFor, organizations]);

  const editAvailableMembers = useMemo(() => {
    if (!editingProject) return [];
    const org = organizations.find(o => String(o.id) === String(editingProject.organizationId));
    const fromOrg = Array.isArray(org?.responsibleMembers) ? org.responsibleMembers : [];
    return Array.from(new Set([...fromOrg, ...DEFAULT_TEAM_MEMBERS]));
  }, [editingProject, organizations]);

  const handleAddActivityToProject = () => {
    if (!addActivityFor) return;
    if (!activityForm.activityType || !activityForm.date || !activityForm.time) {
      alert("Please fill in required activity fields");
      return;
    }

    const id = Date.now();
    const newActivity = {
      id,
      activityType: activityForm.activityType,
      category: "Sales",
      linkedClient: addActivityFor.organizationName,
      unitType: "Government",
      date: activityForm.date,
      time: activityForm.time,
      responsible: activityForm.responsible,
      status: activityForm.status,
      deadline: "",
      reminderDate: "",
      nextStep: "",
      nextStepDate: "",
      notes: activityForm.notes,
      attachments: [],
      costPerActivity: 0,
      ticketType: "Question",
      premiumSupport: false,
      priority: activityForm.priority,
      activityLog: [
        { user: activityForm.responsible, action: "Created", timestamp: new Date().toLocaleString() }
      ]
    };

    const updatedProjects = projects.map(p => p.id === addActivityFor.id
      ? { ...p, cardActivities: [ ...(p.cardActivities || []), newActivity ] }
      : p
    );
    saveProjects(updatedProjects);
    setAddActivityFor(null);
    setActivityForm({ activityType: "Call", date: new Date().toISOString().split('T')[0], time: new Date().toTimeString().slice(0,5), responsible: [], notes: "", status: "To Do", priority: "Medium" });
  };

  const projectsForUI = useMemo(() => projects, [projects]);

  // Load audit trail for a specific project
  const loadAuditTrail = async (projectId) => {
    try {
      // For now, use local audit trail
      setSelectedProjectAudit(auditTrail[projectId] || []);
      setShowAuditDialog(true);

      // TODO: When backend is connected, use this instead:
      // const response = await fetch(`/api/projects/${projectId}/audit-trail`);
      // if (!response.ok) throw new Error('Failed to load audit trail');
      // const data = await response.json();
      // setSelectedProjectAudit(data.data || []);
      // setShowAuditDialog(true);
    } catch (error) {
      console.error('Error loading audit trail:', error);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-blue mb-1">Projects</h1>
          <p className="text-sm text-gray-600">Group activities per organization with goals and stages</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-dark-blue hover:bg-dark-blue-hover text-white">
              <Plus className="h-4 w-4 mr-2" /> Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>Define goal, select organization, stages, members and activities</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-2">
              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="e.g. Zagreb Onboarding" />
              </div>
              <div className="space-y-2">
                <Label>Organization *</Label>
                <Select value={String(createForm.organizationId)} onValueChange={(v) => setCreateForm({ ...createForm, organizationId: v, assignedMembers: [], selectedActivityIds: [] })}>
                  <SelectTrigger>
                    <span>{selectedOrg ? selectedOrg.organizationName : "Select organization"}</span>
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.length === 0 ? (
                      <div className="px-2 py-2 text-sm text-muted-foreground">No organizations found</div>
                    ) : (
                      organizations.map((o) => (
                        <SelectItem key={o.id} value={String(o.id)}>{o.organizationName}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Goal</Label>
                <Textarea rows={2} value={createForm.goal} onChange={(e) => setCreateForm({ ...createForm, goal: e.target.value })} placeholder="Describe project goal" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2"><Users className="h-4 w-4" /> Assign Members</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {availableMembers.map((m) => (
                      <label key={m} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={createForm.assignedMembers.includes(m)}
                          onChange={(e) => {
                            const cur = createForm.assignedMembers;
                            const next = e.target.checked ? [...cur, m] : cur.filter(x => x !== m);
                            setCreateForm({ ...createForm, assignedMembers: next });
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                        />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2"><ListChecks className="h-4 w-4" /> Include Existing Activities</h3>
                <div className="space-y-2">
                  {orgActivities.length === 0 && (
                    <p className="text-xs text-gray-600">No activities for this organization yet.</p>
                  )}
                  {orgActivities.map((a) => (
                    <label key={a.id} className="flex items-center gap-2 text-sm p-2 rounded bg-background/50">
                      <input
                        type="checkbox"
                        checked={createForm.selectedActivityIds.includes(a.id)}
                        onChange={(e) => {
                          const cur = createForm.selectedActivityIds;
                          const next = e.target.checked ? [...cur, a.id] : cur.filter(id => id !== a.id);
                          setCreateForm({ ...createForm, selectedActivityIds: next });
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                      />
                      <span className="flex-1">
                        {a.activityType} • {a.date} {a.time} • {Array.isArray(a.responsible) ? a.responsible.join(", ") : a.responsible}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea rows={2} value={createForm.notes} onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })} placeholder="Any additional notes" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetCreateForm(); }}>Cancel</Button>
              <Button className="bg-dark-blue hover:bg-dark-blue-hover text-white" onClick={handleCreateProject}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projectsForUI.map((p) => (
          <Card key={p.id} className="border-blue-200/50 bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-dark-blue" />
                  <span>{p.name}</span>
                </CardTitle>
                <Badge variant="outline" className="bg-light-blue text-dark-blue border-blue-200">{p.organizationName}</Badge>
              </div>
              <CardDescription>{p.goal}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* Project Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50" onClick={() => setAddActivityFor(p)}>
                    Add Activity
                  </Button>
                  <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => {
                    setEditingProject(p);
                    setEditForm({
                      name: p.name || "",
                      goal: p.goal || "",
                      notes: p.notes || "",
                      assignedMembers: Array.isArray(p.assignedMembers) ? p.assignedMembers : [],
                      currentStage: PHASES.includes(p.currentStage) ? p.currentStage : PHASES[0]
                    });
                    setIsEditOpen(true);
                  }}>
                    Edit
                  </Button>
                </div>
              </div>
              {!!p.assignedMembers?.length && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Assigned Members</p>
                  <div className="flex flex-wrap gap-2">
                    {p.assignedMembers.map((m) => (
                      <Badge key={m} variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">{m}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { if (!open) { setIsEditOpen(false); setEditingProject(null); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project details and assigned members</DialogDescription>
          </DialogHeader>
          {editingProject && (
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Organization</Label>
                <Input value={editingProject.organizationName || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Goal</Label>
                <Textarea rows={2} value={editForm.goal} onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea rows={3} value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Assigned Members</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {editAvailableMembers.map((m) => (
                      <label key={m} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                          checked={editForm.assignedMembers.includes(m)}
                          onChange={(e) => {
                            const cur = editForm.assignedMembers;
                            const next = e.target.checked ? [...cur, m] : cur.filter(x => x !== m);
                            setEditForm({ ...editForm, assignedMembers: next });
                          }}
                        />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditOpen(false); setEditingProject(null); }}>Cancel</Button>
            <Button className="bg-dark-blue hover:bg-dark-blue-hover text-white" onClick={() => {
              if (!editingProject || !editForm.name) { alert('Project name is required'); return; }
              try {
                const updated = projects.map(p => {
                  if (p.id !== editingProject.id) return p;
                  return { ...p, name: editForm.name, goal: editForm.goal, notes: editForm.notes, assignedMembers: editForm.assignedMembers };
                });
                saveProjects(updated);
                setIsEditOpen(false);
                setEditingProject(null);
              } catch (e) {
                console.error('Failed to update project', e);
                alert('Failed to update project');
              }
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Activity to Project Dialog */}
      <Dialog open={!!addActivityFor} onOpenChange={(open) => { if (!open) setAddActivityFor(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Activity to Project</DialogTitle>
            <DialogDescription>Create a follow-up activity under this project</DialogDescription>
          </DialogHeader>
          {addActivityFor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select value={activityForm.activityType} onValueChange={(v) => setActivityForm({ ...activityForm, activityType: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Call','Email','Online Meeting','In-person Meeting'].map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input type="date" value={activityForm.date} onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Time *</Label>
                  <Input type="time" value={activityForm.time} onChange={(e) => setActivityForm({ ...activityForm, time: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={activityForm.priority} onValueChange={(v) => setActivityForm({ ...activityForm, priority: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Low','Medium','High','Urgent'].map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Responsible Members</Label>
                <div className="grid grid-cols-2 gap-3">
                  {availableMembersForProject.map((m) => (
                    <label key={m} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={activityForm.responsible.includes(m)}
                        onChange={(e) => {
                          const cur = activityForm.responsible;
                          const next = e.target.checked ? [...cur, m] : cur.filter(x => x !== m);
                          setActivityForm({ ...activityForm, responsible: next });
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea rows={3} value={activityForm.notes} onChange={(e) => setActivityForm({ ...activityForm, notes: e.target.value })} placeholder="Add context" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddActivityFor(null)}>Cancel</Button>
            <Button className="bg-dark-blue hover:bg-dark-blue-hover text-white" onClick={handleAddActivityToProject}>Add Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit Trail Dialog */}
      <Dialog open={showAuditDialog} onOpenChange={setShowAuditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-dark-blue" />
              Project History & Audit Trail
            </DialogTitle>
            <DialogDescription>Track all changes made to this project</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedProjectAudit && selectedProjectAudit.length > 0 ? (
              <div className="space-y-3">
                {selectedProjectAudit.map((entry, index) => (
                  <Card key={entry.id || index} className="border-l-4 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                              {entry.action?.replace('_', ' ').toUpperCase() || 'STAGE CHANGED'}
                            </Badge>
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="text-sm text-gray-600">{entry.timestamp}</span>
                          </div>

                          <p className="text-sm font-medium text-gray-900">
                            {entry.message}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span>Changed by: <strong>{entry.changedBy}</strong></span>
                            {entry.before && entry.after && (
                              <span>
                                {entry.before.currentStage} → {entry.after.currentStage}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No history available for this project yet.</p>
                <p className="text-sm text-gray-400 mt-2">Changes will appear here once you start modifying the project stages.</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAuditDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
