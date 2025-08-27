import React from "react";

export default function QuickBtn({ children, onClick }) {
  return (
    <button onClick={onClick} className="rounded-lg border px-3 py-2 hover:bg-slate-50 text-sm">
      {children}
    </button>
  );
}