import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building, Plus } from "lucide-react";
import { toPayload } from "@/features/clients/mappers";
import ClientFilters from "../components/clients/ClientFilters";
import ClientCard from "../components/clients/ClientCard";
import ClientForm from "../components/clients/ClientForm";

import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from "../features/clients/api";

// static select lists
const lists = {
  clientTypes: ["All Types", "LRSU", "Company", "Association", "NGO", "Club"],
  statuses: ["All Statuses", "Active", "Potential", "Expired"],
  counties: ["All Counties", "Zagreb", "Split", "Rijeka", "Osijek"],
  kamList: ["All KAMs", "Ana Marić", "Petra Babić", "Marko Petrović"],
};

export default function ClientsPage() {
  // ---- filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedCounty, setSelectedCounty] = useState("All Counties");
  const [selectedKAM, setSelectedKAM] = useState("All KAMs");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState("name");

  // ---- dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // ---- forms
  const [formData, setFormData] = useState({
    name: "", type: "", clientType: "", contractType: "",
    contractValue: "", vatAmount: "", contractStart: "", contractEnd: "",
    paymentMethod: "", paymentDeadline: "", kam: "", status: "",
    county: "", address: "", contactName: "", contactRole: "",
    contactPhone: "", contactEmail: "", notes: "", relatedContacts: "",
  });
  const [editFormData, setEditFormData] = useState({});

  // ---- favorites (local only)
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("crm_fav_clients") || "[]")); }
    catch { return new Set(); }
  });
  useEffect(() => {
    localStorage.setItem("crm_fav_clients", JSON.stringify(Array.from(favoriteIds)));
  }, [favoriteIds]);

  // ---- server params
  const params = useMemo(() => ({
    q: searchTerm || undefined,
    type: selectedType !== "All Types" ? selectedType : undefined,
    status: selectedStatus !== "All Statuses" ? selectedStatus : undefined,
    county: selectedCounty !== "All Counties" ? selectedCounty : undefined,
    kam: selectedKAM !== "All KAMs" ? selectedKAM : undefined,
    page: 1, limit: 1000, sort: sortBy || "name",
  }), [searchTerm, selectedType, selectedStatus, selectedCounty, selectedKAM, sortBy]);

  // ---- data hooks
  const { data, isLoading, error } = useClients(params);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const clientList = (data?.items || []).map(c => ({
    ...c, id: c.id || c._id, isFavorite: favoriteIds.has(c.id || c._id),
  }));

  if (isLoading) return <div className="p-6">Loading clients…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error.message}</div>;

  // ---- handlers
  const onAddChange = (patch) => setFormData(prev => ({ ...prev, ...patch }));
  const onEditChange = (patch) => setEditFormData(prev => ({ ...prev, ...patch }));

  const handleAddClient = async () => {
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
        email: formData.contactEmail || "",
      }],
      notes: formData.notes || "",
      relatedContacts: formData.relatedContacts ? formData.relatedContacts.split(",").map(c => c.trim()).filter(Boolean) : [],
    };

    try {
    await createClient.mutateAsync(toPayload(formData));   // ⬅️ HERE
    setIsAddDialogOpen(false);
    // (optional) reset formData here…
  } catch (e) {
    console.error(e);
    alert(e?.response?.data?.message || e.message || "Failed to create client");
  }
    setIsAddDialogOpen(false);
    setFormData({
      name: "", type: "", clientType: "", contractType: "",
      contractValue: "", vatAmount: "", contractStart: "", contractEnd: "",
      paymentMethod: "", paymentDeadline: "", kam: "", status: "",
      county: "", address: "", contactName: "", contactRole: "",
      contactPhone: "", contactEmail: "", notes: "", relatedContacts: "",
    });
  };

  const openEditDialog = (client) => {
    setEditFormData({
      id: client.id,
      name: client.name ?? "", type: client.type ?? "", clientType: client.clientType ?? "",
      contractType: client.contractType ?? "",
      contractValue: client.contractValue ?? "", vatAmount: client.vatAmount ?? "",
      contractStart: client.contractStart ? client.contractStart.substring(0,10) : "",
      contractEnd: client.contractEnd ? client.contractEnd.substring(0,10) : "",
      paymentMethod: client.paymentMethod ?? "", paymentDeadline: client.paymentDeadline ?? "",
      kam: client.kam ?? "", status: client.status ?? "", county: client.county ?? "",
      address: typeof client.address === "string" ? client.address : "",
      contactName: client.contactPersons?.[0]?.name ?? "",
      contactRole: client.contactPersons?.[0]?.role ?? "",
      contactPhone: client.contactPersons?.[0]?.phone ?? "",
      contactEmail: client.contactPersons?.[0]?.email ?? "",
      notes: client.notes ?? "",
      relatedContacts: Array.isArray(client.relatedContacts) ? client.relatedContacts.join(", ") : "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateClient = async () => {
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
        email: editFormData.contactEmail || "",
      }],
      notes: editFormData.notes || "",
      relatedContacts: editFormData.relatedContacts ? editFormData.relatedContacts.split(",").map(c => c.trim()).filter(Boolean) : [],
    };

    try {
    await updateClient.mutateAsync({
      id: editFormData.id,
      payload: toPayload(editFormData),                   // ⬅️ AND HERE
    });
    setIsEditDialogOpen(false);
  } catch (e) {
    console.error(e);
    alert(e?.response?.data?.message || e.message || "Failed to update client");
  }
    setIsEditDialogOpen(false);
  };

  const handleDeleteClient = async (id) => { await deleteClient.mutateAsync(id); };
  const handleToggleFavorite = (id) => {
    setFavoriteIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  // ---- render
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Clients</h1>
        </div>

        {/* Add Client */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Client</Button></DialogTrigger>
          <DialogContent className="sm:max-w-[900px] p-0">
            <DialogHeader className="sticky top-0 z-10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b p-4">
              <DialogTitle>Add Client</DialogTitle>
              <DialogDescription>Fill details and click save.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto p-4">
              <ClientForm value={formData} onChange={(patch) => onAddChange(patch)} />
            </div>
            <DialogFooter className="sticky bottom-0 z-10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t p-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddClient}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Advanced Client Filters</CardTitle>
          <div className="text-sm text-gray-500">Filter and analyze your client portfolio</div>
        </CardHeader>
        <CardContent className="pt-0">
          <ClientFilters
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            selectedType={selectedType} setSelectedType={setSelectedType}
            selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
            selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty}
            selectedKAM={selectedKAM} setSelectedKAM={setSelectedKAM}
            sortBy={sortBy} setSortBy={setSortBy}
            lists={lists}
          />
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-gray-500">Found {clientList.length} clients</div>
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clientList.map((c) => (
          <ClientCard
            key={c.id}
            client={c}
            onEdit={openEditDialog}
            onDelete={handleDeleteClient}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>

      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[900px] p-0">
          <DialogHeader className="sticky top-0 z-10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b p-4">
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update details and save.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto p-4">
            <ClientForm value={editFormData} onChange={(patch) => onEditChange(patch)} />
          </div>
          <DialogFooter className="sticky bottom-0 z-10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t p-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateClient}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}