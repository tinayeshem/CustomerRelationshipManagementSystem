import React from "react";

export default function Chip({ children, tone }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-medium ${tone}`}>
      {children}
    </span>
  );
}