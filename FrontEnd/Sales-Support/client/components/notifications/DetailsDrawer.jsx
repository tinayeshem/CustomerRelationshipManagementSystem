import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function DetailsDrawer({ open, onClose, children }) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <div className={`${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} lg:hidden fixed inset-0 z-50 transition-all duration-300`}>
      {/* Enhanced Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "" : "opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Enhanced Panel */}
      <div
        className={`absolute inset-x-0 bottom-0 max-h-[90vh] rounded-t-2xl border border-slate-200 bg-white shadow-2xl transform transition-all duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Improved Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1.5 w-12 bg-slate-300 rounded-full" />
        </div>

        {/* Close Button */}
        <div className="flex justify-end px-4 pb-2">
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with enhanced scrolling */}
        <div className="overflow-y-auto notifications-scroll max-h-[80vh] pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}
