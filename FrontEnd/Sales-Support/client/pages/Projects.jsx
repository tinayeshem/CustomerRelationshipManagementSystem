import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, CheckCircle, ClipboardCheck, Layers, ListChecks, Plus, Settings, Users } from "lucide-react";

const defaultStages = ["Meeting", "Call", "Negotiation", "Contract"]; // ordered

const getStageBadge = (stage) => {
  switch (stage) {
    case "Meeting": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Call": return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case "Negotiation": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Contract": return "bg-green-100 text-green-800 border-green-200";
    case "Implementation": return "bg-purple-100 text-purple-800 border-purple-200";
    case "Review": return "bg-slate-100 text-slate-800 border-slate-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function Projects() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("projectsData");
    return saved ? JSON.parse(saved) : [];
  });
  const [organizations, setOrganizations] = useState(() => {
    const saved = localStorage.getItem("organizationData");
    return saved ? JSON.parse(saved) : [];
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem("activitiesList");
    return saved ? JSON.parse(saved) : [];
  });

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
    stages: defaultStages.map((s, i) => ({ name: s, completed: i < 0 })),
    assignedMembers: [],
    selectedActivityIds: []
  });

  const selectedOrg = useMemo(() => organizations.find(o => String(o.id) === String(createForm.organizationId)), [organizations, createForm.organizationId]);

  const availableMembers = useMemo(() => {
    return selectedOrg?.responsibleMembers?.length ? selectedOrg.responsibleMembers : ["Ana Marić", "Marko Petrović", "Petra Babić", "Luka Novak", "Sofia Antić"];
  }, [selectedOrg]);

  const orgActivities = useMemo(() => {
    if (!selectedOrg) return [];
    return activities.filter(a => a.linkedClient === selectedOrg.organizationName);
  }, [activities, selectedOrg]);

  // Persist helpers
  const saveProjects = (list) => {
    setProjects(list);
    localStorage.setItem("projectsData", JSON.stringify(list));
  };
  const saveActivities = (list) => {
    setActivities(list);
    localStorage.setItem("activitiesList", JSON.stringify(list));
  };

  const resetCreateForm = () => setCreateForm({
    name: "",
    organizationId: "",
    goal: "",
    notes: "",
    stages: defaultStages.map((s) => ({ name: s, completed: false })),
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
    const project = {
      id,
      name: createForm.name,
      organizationId: org?.id,
      organizationName: org?.organizationName,
      goal: createForm.goal,
      notes: createForm.notes,
      stages: createForm.stages.map((s, idx) => ({ ...s, order: idx + 1 })),
      currentStage: createForm.stages[0]?.name || "Meeting",
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

  const advanceStage = (project) => {
    const stageOrder = project.stages.map(s => s.name);
    const idx = stageOrder.indexOf(project.currentStage);
    if (idx === -1) return;
    const nextIdx = Math.min(idx + 1, stageOrder.length - 1);

    const updated = projects.map(p => {
      if (p.id !== project.id) return p;
      const newStages = p.stages.map((s, i) => i <= idx ? { ...s, completed: true } : s);
      return { ...p, stages: newStages, currentStage: stageOrder[nextIdx] };
    });
    saveProjects(updated);
  };

  // Add Next Activity Dialog per project
  const [addActivityFor, setAddActivityFor] = useState(null); // project or null
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
    return org?.responsibleMembers?.length ? org.responsibleMembers : ["Ana Marić", "Marko Petrović", "Petra Babić", "Luka Novak", "Sofia Antić"];
  }, [addActivityFor, organizations]);

  const handleAddActivityToProject = () => {
    if (!addActivityFor) return;
    if (!activityForm.activityType || !activityForm.date || !activityForm.time) {
      alert("Please fill in required activity fields");
      return;
    }

    const id = (activities?.[0]?.id || 0) + activities.length + 1;
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
      projectId: addActivityFor.id,
      activityLog: [
        { user: activityForm.responsible, action: "Created", timestamp: new Date().toLocaleString() }
      ]
    };

    const updatedActivities = [newActivity, ...activities];
    saveActivities(updatedActivities);
    setAddActivityFor(null);
    setActivityForm({ activityType: "Call", date: new Date().toISOString().split('T')[0], time: new Date().toTimeString().slice(0,5), responsible: [], notes: "", status: "To Do", priority: "Medium" });
  };

  const projectsForUI = useMemo(() => projects, [projects]);

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
                  <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2"><Layers className="h-4 w-4" /> Stages</h3>
                  <div className="space-y-2">
                    {createForm.stages.map((s, idx) => (
                      <div key={s.name} className="flex items-center justify-between p-2 rounded bg-blue-50">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStageBadge(s.name)}>{idx + 1}</Badge>
                          <span className="text-sm">{s.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getStageBadge(p.currentStage)}>{p.currentStage}</Badge>
                <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => advanceStage(p)}>
                  Advance Stage
                </Button>
                <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50" onClick={() => setAddActivityFor(p)}>
                  Add Activity
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Stages</p>
                <div className="flex flex-wrap gap-2">
                  {p.stages.map((s, idx) => (
                    <Badge key={idx} variant="outline" className={s.completed ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}>
                      {idx + 1}. {s.name}
                    </Badge>
                  ))}
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
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Linked Activities</p>
                <div className="space-y-1">
                  {activities.filter(a => a.projectId === p.id).map((a) => (
                    <div key={a.id} className="text-sm flex items-center justify-between p-2 rounded bg-background/50">
                      <div>
                        <span className="font-medium">{a.activityType}</span> • {a.date} {a.time}
                      </div>
                      <div className="text-xs text-muted-foreground">{Array.isArray(a.responsible) ? a.responsible.join(", ") : a.responsible}</div>
                    </div>
                  ))}
                  {activities.filter(a => a.projectId === p.id).length === 0 && (
                    <p className="text-xs text-gray-600">No activities linked yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
    </div>
  );
}
