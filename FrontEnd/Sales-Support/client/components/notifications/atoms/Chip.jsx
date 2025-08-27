import React from "react";

const toneMap = {
  red: "bg-red-100 text-red-800 border-red-200",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  green: "bg-green-100 text-green-800 border-green-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  gray: "bg-slate-100 text-slate-800 border-slate-200",
  indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
  pink: "bg-pink-100 text-pink-800 border-pink-200",
};

export default function Chip({ children, tone = "gray", size = "sm", className = "" }) {
  const baseClasses = "inline-flex items-center font-medium border rounded-full";
  const sizeClasses = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-sm"
  };
  
  const toneClasses = toneMap[tone] || toneMap.gray;
  
  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${toneClasses} ${className}`}>
      {children}
    </span>
  );
}
