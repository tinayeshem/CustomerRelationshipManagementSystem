import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CheckCircle2, AlertTriangle, Clock, XCircle, Mail, Phone, MessageSquare, BellRing } from "lucide-react";
import { brand } from "./notifications/them";

export const timeAgo = (iso) => {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

export const fmtDateTime = (iso) => new Date(iso).toLocaleString();

export const severityMap = {
  high: { chip: brand.chipHigh, Icon: XCircle },
  medium: { chip: brand.chipMed, Icon: AlertTriangle },
  low: { chip: brand.chipLow, Icon: Clock },
  info: { chip: brand.chipInfo, Icon: CheckCircle2 },
};

export const channelIcon = (channel) => {
  switch (channel) {
    case "email":
      return Mail;
    case "sms":
      return Phone;
    case "slack":
      return MessageSquare;
    default:
      return BellRing;
  }
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
