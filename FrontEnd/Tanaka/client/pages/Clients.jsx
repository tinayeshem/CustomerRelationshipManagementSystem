


import React, { useEffect, useMemo, useState } from "react";              // React primitives for state, memos, and effects
import { Button } from "@/components/ui/button";                           // UI button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // UI card primitives
import { Badge } from "@/components/ui/badge";                             // Small status/label chip
import { Input } from "@/components/ui/input";                             // Text input
import { Label } from "@/components/ui/label";                             // Form label
import { Textarea } from "@/components/ui/textarea";                       // Multiline input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Dropdowns
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Modal dialogs


// Icons used in the UI
import { Plus, Search, Building, MapPin, Euro, Calendar, Star, StarOff, Pencil, Trash2 } from "lucide-react";

// React Query hooks — abstraction over data fetching/mutations
// These align with SOLID by separating concerns: components call hooks,
// hooks call the API, and the backend owns business rules.
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from "../features/clients/api";

// Small helper: readable color classes for status badge
const statusColor = (status) => {
  switch (status) {
    case "Active": return "bg-green-100 text-green-700 border-green-200";
    case "Potential": return "bg-blue-100 text-blue-700 border-blue-200";
    case "Expired": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

// Component export — the page the router renders
export default function ClientsPage() {
  // ---------------------- Filters & sorting (UI state only) ----------------------
  const [searchTerm, setSearchTerm] = useState("");                        // free-text search
  const [selectedType, setSelectedType] = useState("All Types");           // e.g., Company, NGO...
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");    // Active, Potential, Expired
  const [selectedCounty, setSelectedCounty] = useState("All Counties");    // County filter
  const [selectedKAM, setSelectedKAM] = useState("All KAMs");              // Key account manager
  const [sortBy, setSortBy] = useState("name");                            // sorting field

  // ---------------------- Dialog state ----------------------
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);           // show/hide "Add client" dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);         // show/hide "Edit client" dialog

  // ---------------------- Form state (Add) ----------------------
  // These match your Client schema fields. Keep them minimal; you can expand as needed.
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

  // ---------------------- Form state (Edit) ----------------------
  const [editFormData, setEditFormData] = useState({});                    // will be filled when opening edit

  // ---------------------- Favorites (local only) ----------------------
  // We store favorite IDs in localStorage so it works without a server field.
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("crm_fav_clients") || "[]")); }
    catch { return new Set(); }
  });
  useEffect(() => {
    localStorage.setItem("crm_fav_clients", JSON.stringify(Array.from(favoriteIds)));
  }, [favoriteIds]);

  // ---------------------- Server query params (memoized) ----------------------
  // These are passed to the API. If you prefer client-side filtering only, remove them.
  const listParams = useMemo(() => ({
    q: searchTerm || undefined,                                           // backend text search
    type: selectedType !== "All Types" ? selectedType : undefined,
    status: selectedStatus !== "All Statuses" ? selectedStatus : undefined,
    county: selectedCounty !== "All Counties" ? selectedCounty : undefined,
    kam: selectedKAM !== "All KAMs" ? selectedKAM : undefined,
    page: 1,
    limit: 1000,
    sort: sortBy || "name",
  }), [searchTerm, selectedType, selectedStatus, selectedCounty, selectedKAM, sortBy]);

  // ---------------------- React Query data hooks ----------------------
  const { data, isLoading } = useClients(listParams);                      // fetch list { items, total, ... }
  const createClient = useCreateClient();                                  // POST /clients
  const updateClient = useUpdateClient();                                  // PUT /clients/:id
  const deleteClient = useDeleteClient();                                  // DELETE /clients/:id

  // Decorate items with local favorite flag
  const clientList = (data?.items ?? []).map(c => ({ ...c, isFavorite: favoriteIds.has(c.id) }));

  // Simple guard while loading
  if (isLoading) {
    return <div className="p-6">Loading clients…</div>;
  }

  // ---------------------- Handlers: Add / Edit / Delete / Favorite ----------------------
  const handleAddClient = async () => {
    // Prepare API payload. Convert numbers that came as strings.
    const payload = {
      name: formData.name,
      type: formData.type,
      clientType: formData.clientType,
      contractType: formData.contractType,
      contractValue: parseInt(formData.contractValue) || 0,
      vatAmount: parseInt(formData.vatAmount) || 0,
      contractStart: formData.contractStart || null,
      contractEnd: formData.contractEnd || null,
      paymentMethod: formData.paymentMethod || "",
      paymentDeadline: formData.paymentDeadline || "",
      kam: formData.kam || "",
      status: formData.status || "Active",
      county: formData.county || "",
      address: formData.address || "",
      contactPersons: [{
        name: formData.contactName || "",
        role: formData.contactRole || "",
        phone: formData.contactPhone || "",
        email: formData.contactEmail || ""
      }],
      notes: formData.notes || "",
      relatedContacts: formData.relatedContacts
        ? formData.relatedContacts.split(",").map(c => c.trim()).filter(Boolean)
        : []
    };

    // Call the mutation (React Query will refresh the list)
    await createClient.mutateAsync(payload);

    // Close dialog and reset form
    setIsAddDialogOpen(false);
    setFormData({
      name:"", type:"", clientType:"", contractType:"", contractValue:"", vatAmount:"",
      contractStart:"", contractEnd:"", paymentMethod:"", paymentDeadline:"", kam:"", status:"",
      county:"", address:"", contactName:"", contactRole:"", contactPhone:"", contactEmail:"",
      notes:"", relatedContacts:""
    });
  };

  const openEditDialog = (client) => {
    // Prefill edit form from the selected client
    setEditFormData({
      id: client.id,
      name: client.name || "",
      type: client.type || "",
      clientType: client.clientType || "",
      contractType: client.contractType || "",
      contractValue: client.contractValue ?? "",
      vatAmount: client.vatAmount ?? "",
      contractStart: client.contractStart ? client.contractStart.substring(0,10) : "",
      contractEnd: client.contractEnd ? client.contractEnd.substring(0,10) : "",
      paymentMethod: client.paymentMethod || "",
      paymentDeadline: client.paymentDeadline || "",
      kam: client.kam || "",
      status: client.status || "",
      county: client.county || "",
      address: typeof client.address === "string" ? client.address : "",
      contactName: client.contactPersons?.[0]?.name || "",
      contactRole: client.contactPersons?.[0]?.role || "",
      contactPhone: client.contactPersons?.[0]?.phone || "",
      contactEmail: client.contactPersons?.[0]?.email || "",
      notes: client.notes || "",
      relatedContacts: Array.isArray(client.relatedContacts) ? client.relatedContacts.join(", ") : ""
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateClient = async () => {
    // Extract id and build payload just like add
    const id = editFormData.id;
    const payload = {
      name: editFormData.name,
      type: editFormData.type,
      clientType: editFormData.clientType,
      contractType: editFormData.contractType,
      contractValue: parseInt(editFormData.contractValue) || 0,
      vatAmount: parseInt(editFormData.vatAmount) || 0,
      contractStart: editFormData.contractStart || null,
      contractEnd: editFormData.contractEnd || null,
      paymentMethod: editFormData.paymentMethod || "",
      paymentDeadline: editFormData.paymentDeadline || "",
      kam: editFormData.kam || "",
      status: editFormData.status,
      county: editFormData.county || "",
      address: editFormData.address || "",
      contactPersons: [{
        name: editFormData.contactName || "",
        role: editFormData.contactRole || "",
        phone: editFormData.contactPhone || "",
        email: editFormData.contactEmail || ""
      }],
      notes: editFormData.notes || "",
      relatedContacts: editFormData.relatedContacts
        ? editFormData.relatedContacts.split(",").map(c => c.trim()).filter(Boolean)
        : []
    };

    await updateClient.mutateAsync({ id, payload });
    setIsEditDialogOpen(false);
  };

  const handleDeleteClient = async (id) => {
    // Delete and let React Query refetch
    await deleteClient.mutateAsync(id);
  };

  const handleToggleFavorite = (id) => {
    // Toggle favorite in local state + localStorage
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // ---------------------- Small presentational helpers ----------------------
  const Field = ({ label, children }) => (
    <div className="grid gap-2">
      <Label className="text-sm text-gray-600">{label}</Label>
      {children}
    </div>
  );

  // ---------------------- Render ----------------------
  return (
    <div className="p-6 space-y-6">
      {/* Page header with title, search, add button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Clients</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            {/* Search box binds to searchTerm and updates server params */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-64"
              placeholder="Search name, notes, KAM…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Add Client dialog trigger */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[720px]">
              <DialogHeader>
                <DialogTitle>Add Client</DialogTitle>
                <DialogDescription>Fill details and click save.</DialogDescription>
              </DialogHeader>

              {/* Add form grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Name">
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </Field>
                <Field label="Type">
                  <Input value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
                </Field>
                <Field label="Client Type">
                  <Input value={formData.clientType} onChange={(e) => setFormData({ ...formData, clientType: e.target.value })} />
                </Field>
                <Field label="Status">
                  <Input value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
                </Field>
                <Field label="County">
                  <Input value={formData.county} onChange={(e) => setFormData({ ...formData, county: e.target.value })} />
                </Field>
                <Field label="KAM">
                  <Input value={formData.kam} onChange={(e) => setFormData({ ...formData, kam: e.target.value })} />
                </Field>
                <Field label="Contract Type">
                  <Input value={formData.contractType} onChange={(e) => setFormData({ ...formData, contractType: e.target.value })} />
                </Field>
                <Field label="Contract Value (€)">
                  <Input type="number" value={formData.contractValue} onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })} />
                </Field>
                <Field label="VAT Amount (€)">
                  <Input type="number" value={formData.vatAmount} onChange={(e) => setFormData({ ...formData, vatAmount: e.target.value })} />
                </Field>
                <Field label="Contract Start">
                  <Input type="date" value={formData.contractStart} onChange={(e) => setFormData({ ...formData, contractStart: e.target.value })} />
                </Field>
                <Field label="Contract End">
                  <Input type="date" value={formData.contractEnd} onChange={(e) => setFormData({ ...formData, contractEnd: e.target.value })} />
                </Field>
                <Field label="Payment Method">
                  <Input value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} />
                </Field>
                <Field label="Payment Deadline">
                  <Input value={formData.paymentDeadline} onChange={(e) => setFormData({ ...formData, paymentDeadline: e.target.value })} />
                </Field>
                <Field label="Address">
                  <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </Field>
                <Field label="Contact (Name)">
                  <Input value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} />
                </Field>
                <Field label="Contact (Role)">
                  <Input value={formData.contactRole} onChange={(e) => setFormData({ ...formData, contactRole: e.target.value })} />
                </Field>
                <Field label="Contact (Phone)">
                  <Input value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} />
                </Field>
                <Field label="Contact (Email)">
                  <Input type="email" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Notes">
                    <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                  </Field>
                </div>
                <Field label="Related Contacts (comma-separated)">
                  <Input value={formData.relatedContacts} onChange={(e) => setFormData({ ...formData, relatedContacts: e.target.value })} />
                </Field>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddClient}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters row (you can replace Inputs with Selects if you have predefined lists) */}
      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <Label>Type</Label>
              <Input value={selectedType} onChange={(e) => setSelectedType(e.target.value)} placeholder="All Types" />
            </div>
            <div>
              <Label>Status</Label>
              <Input value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} placeholder="All Statuses" />
            </div>
            <div>
              <Label>County</Label>
              <Input value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)} placeholder="All Counties" />
            </div>
            <div>
              <Label>KAM</Label>
              <Input value={selectedKAM} onChange={(e) => setSelectedKAM(e.target.value)} placeholder="All KAMs" />
            </div>
            <div>
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="-createdAt">Newest</SelectItem>
                  <SelectItem value="createdAt">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List of clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clientList.map(client => (
          <Card key={client.id} className="relative">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{client.name || "Untitled client"}</CardTitle>
                {/* Favorite toggle — local only */}
                <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(client.id)} title={client.isFavorite ? "Remove favorite" : "Add favorite"}>
                  {client.isFavorite ? <Star className="h-5 w-5 text-yellow-500" /> : <StarOff className="h-5 w-5 text-gray-400" />}
                </Button>
              </div>
              {/* Status badge */}
              <div className="flex gap-2">
                <Badge className={`border ${statusColor(client.status)}`}>{client.status || "Unknown"}</Badge>
                {client.type ? <Badge variant="outline">{client.type}</Badge> : null}
                {client.clientType ? <Badge variant="outline">{client.clientType}</Badge> : null}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Simple info line */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{client.county || "No county"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building className="h-4 w-4" />
                <span>{client.kam || "No KAM"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Euro className="h-4 w-4" />
                <span>Contract: €{Number(client.contractValue || 0).toLocaleString()}</span>
              </div>
              {client.contractStart || client.contractEnd ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {client.contractStart ? `Start: ${new Date(client.contractStart).toLocaleDateString()}` : "Start: -"}
                    {"  ·  "}
                    {client.contractEnd ? `End: ${new Date(client.contractEnd).toLocaleDateString()}` : "End: -"}
                  </span>
                </div>
              ) : null}

              <Separator />

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">{client.address || "No address"}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(client)} className="gap-1">
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClient(client.id)} className="gap-1">
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update details and save.</DialogDescription>
          </DialogHeader>

          {/* Edit form grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name">
              <Input value={editFormData.name || ""} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} />
            </Field>
            <Field label="Type">
              <Input value={editFormData.type || ""} onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })} />
            </Field>
            <Field label="Client Type">
              <Input value={editFormData.clientType || ""} onChange={(e) => setEditFormData({ ...editFormData, clientType: e.target.value })} />
            </Field>
            <Field label="Status">
              <Input value={editFormData.status || ""} onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })} />
            </Field>
            <Field label="County">
              <Input value={editFormData.county || ""} onChange={(e) => setEditFormData({ ...editFormData, county: e.target.value })} />
            </Field>
            <Field label="KAM">
              <Input value={editFormData.kam || ""} onChange={(e) => setEditFormData({ ...editFormData, kam: e.target.value })} />
            </Field>
            <Field label="Contract Type">
              <Input value={editFormData.contractType || ""} onChange={(e) => setEditFormData({ ...editFormData, contractType: e.target.value })} />
            </Field>
            <Field label="Contract Value (€)">
              <Input type="number" value={editFormData.contractValue ?? ""} onChange={(e) => setEditFormData({ ...editFormData, contractValue: e.target.value })} />
            </Field>
            <Field label="VAT Amount (€)">
              <Input type="number" value={editFormData.vatAmount ?? ""} onChange={(e) => setEditFormData({ ...editFormData, vatAmount: e.target.value })} />
            </Field>
            <Field label="Contract Start">
              <Input type="date" value={editFormData.contractStart || ""} onChange={(e) => setEditFormData({ ...editFormData, contractStart: e.target.value })} />
            </Field>
            <Field label="Contract End">
              <Input type="date" value={editFormData.contractEnd || ""} onChange={(e) => setEditFormData({ ...editFormData, contractEnd: e.target.value })} />
            </Field>
            <Field label="Payment Method">
              <Input value={editFormData.paymentMethod || ""} onChange={(e) => setEditFormData({ ...editFormData, paymentMethod: e.target.value })} />
            </Field>
            <Field label="Payment Deadline">
              <Input value={editFormData.paymentDeadline || ""} onChange={(e) => setEditFormData({ ...editFormData, paymentDeadline: e.target.value })} />
            </Field>
            <Field label="Address">
              <Input value={editFormData.address || ""} onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })} />
            </Field>
            <Field label="Contact (Name)">
              <Input value={editFormData.contactName || ""} onChange={(e) => setEditFormData({ ...editFormData, contactName: e.target.value })} />
            </Field>
            <Field label="Contact (Role)">
              <Input value={editFormData.contactRole || ""} onChange={(e) => setEditFormData({ ...editFormData, contactRole: e.target.value })} />
            </Field>
            <Field label="Contact (Phone)">
              <Input value={editFormData.contactPhone || ""} onChange={(e) => setEditFormData({ ...editFormData, contactPhone: e.target.value })} />
            </Field>
            <Field label="Contact (Email)">
              <Input type="email" value={editFormData.contactEmail || ""} onChange={(e) => setEditFormData({ ...editFormData, contactEmail: e.target.value })} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Notes">
                <Textarea value={editFormData.notes || ""} onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })} />
              </Field>
            </div>
            <Field label="Related Contacts (comma-separated)">
              <Input value={editFormData.relatedContacts || ""} onChange={(e) => setEditFormData({ ...editFormData, relatedContacts: e.target.value })} />
            </Field>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateClient}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
