import React from "react";

export default function InfoTile({ label, value }) {
  return (
    <div className="rounded-lg border p-2 bg-slate-50">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium truncate">{value}</div>
    </div>
  );
}