// Coerce API shape into UI-friendly model
export const normalizeClient = (it) => ({
  ...it,
  id: it.id || it._id, // ensure an id exists
});


const isHex24 = (s) => /^[a-fA-F0-9]{24}$/.test(s || "");

export function toPayload(f) {
  return {
    name: f.name?.trim(),
    type: f.type || undefined,
    clientType: f.clientType || undefined,
    contractType: f.contractType || undefined,
    contractValue: Number(f.contractValue) || 0,
    vatAmount: Number(f.vatAmount) || 0,
    contractStart: f.contractStart || null,
    contractEnd: f.contractEnd || null,
    paymentMethod: f.paymentMethod || "",
    paymentDeadline: f.paymentDeadline || "",
    status: f.status || "Active",
    county: f.county || "",
    address: f.address
      ? { line1: f.address, city: f.county || undefined, country: "Croatia" }
      : undefined,
    ...(isHex24(f.kamId) ? { kam: f.kamId } : {}),
    contactPersons: [
      {
        name: f.contactName || "",
        role: f.contactRole || "",
        phone: f.contactPhone || "",
        email: f.contactEmail || "",
      },
    ],
    notes: f.notes || "",
    relatedContacts: f.relatedContacts
      ? f.relatedContacts.split(",").map(s => s.trim()).filter(Boolean)
      : [],
  };
}