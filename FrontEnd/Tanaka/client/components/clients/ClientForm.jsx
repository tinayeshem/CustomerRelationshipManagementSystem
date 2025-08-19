import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const Field = ({ label, children }) => (
  <div className="grid gap-2">
    <Label className="text-sm text-gray-600">{label}</Label>
    {children}
  </div>
);

// Controlled form that never unmounts fields on change.
// value = entire form object; onChange(partial) merges it in parent.
export default function ClientForm({ value, onChange }) {
  const set = (k) => (e) => onChange({ [k]: e.target.value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Field label="Name"><Input value={value.name ?? ""} onChange={set("name")} /></Field>
      <Field label="Type"><Input value={value.type ?? ""} onChange={set("type")} /></Field>
      <Field label="Client Type"><Input value={value.clientType ?? ""} onChange={set("clientType")} /></Field>
      <Field label="Status"><Input value={value.status ?? ""} onChange={set("status")} /></Field>
      <Field label="County"><Input value={value.county ?? ""} onChange={set("county")} /></Field>
      <Field label="KAM"><Input value={value.kam ?? ""} onChange={set("kam")} /></Field>
      <Field label="Contract Type"><Input value={value.contractType ?? ""} onChange={set("contractType")} /></Field>
      <Field label="Contract Value (€)"><Input type="number" value={value.contractValue ?? ""} onChange={set("contractValue")} /></Field>
      <Field label="VAT Amount (€)"><Input type="number" value={value.vatAmount ?? ""} onChange={set("vatAmount")} /></Field>
      <Field label="Contract Start"><Input type="date" value={value.contractStart ?? ""} onChange={set("contractStart")} /></Field>
      <Field label="Contract End"><Input type="date" value={value.contractEnd ?? ""} onChange={set("contractEnd")} /></Field>
      <Field label="Payment Method"><Input value={value.paymentMethod ?? ""} onChange={set("paymentMethod")} /></Field>
      <Field label="Payment Deadline"><Input value={value.paymentDeadline ?? ""} onChange={set("paymentDeadline")} /></Field>
      <Field label="Address"><Input value={value.address ?? ""} onChange={set("address")} /></Field>
      <Field label="Contact (Name)"><Input value={value.contactName ?? ""} onChange={set("contactName")} /></Field>
      <Field label="Contact (Role)"><Input value={value.contactRole ?? ""} onChange={set("contactRole")} /></Field>
      <Field label="Contact (Phone)"><Input value={value.contactPhone ?? ""} onChange={set("contactPhone")} /></Field>
      <Field label="Contact (Email)"><Input type="email" value={value.contactEmail ?? ""} onChange={set("contactEmail")} /></Field>
      <div className="md:col-span-2">
        <Field label="Notes"><Textarea value={value.notes ?? ""} onChange={set("notes")} /></Field>
      </div>
      <Field label="Related Contacts (comma-separated)">
        <Input value={value.relatedContacts ?? ""} onChange={set("relatedContacts")} />
      </Field>
    </div>
  );
}
