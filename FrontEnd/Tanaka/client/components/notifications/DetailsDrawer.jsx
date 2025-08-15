import React from "react";

export default function DetailsDrawer({ open, onClose, children }) {
  return (
    <div className={`${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} lg:hidden fixed inset-0 z-50 transition-opacity`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "" : "opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        className={`absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border bg-white shadow-2xl transform transition-transform ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-1.5 w-12 bg-slate-200 rounded-full mx-auto my-2" />
        <div className="overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
}
