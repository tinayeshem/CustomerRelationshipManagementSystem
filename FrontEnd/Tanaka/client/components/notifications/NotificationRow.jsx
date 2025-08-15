import React from "react";
import { Tag, User, Calendar, ChevronRight } from "lucide-react";
import Chip from "./atoms/Chip";
import { severityMap, channelIcon, timeAgo } from "../../lib/utils";

export default function NotificationRow({ n, onToggleRead, onSelect }) {
  const SevIcon = severityMap[n.severity]?.Icon;
  const ChannelIcon = channelIcon(n.channel);
  return (
    <li className="py-3 flex gap-3 items-start">
      <div className={`mt-1 shrink-0 rounded-full border p-1 ${n.unread ? "bg-violet-50" : "bg-slate-50"}`}>
        <SevIcon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <button className="text-left hover:underline" onClick={onSelect}>
            <span className="font-medium">{n.title}</span>
          </button>
          <Chip tone={severityMap[n.severity]?.chip}>{n.severity}</Chip>
          {n.unread && (
            <span className="ml-1 inline-flex items-center text-[10px] bg-rose-600 text-white rounded-full px-1.5 py-0.5">
              NEW
            </span>
          )}
          {n.tags?.slice(0, 2).map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full border"
            >
              <Tag className="w-3 h-3" /> {t}
            </span>
          ))}
        </div>
        <div className="text-sm text-slate-600 mt-0.5">{n.body}</div>
        <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <User className="w-3 h-3" /> {n.client || "—"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {timeAgo(n.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <ChannelIcon className="w-3 h-3" /> {n.channel}
          </span>
          <button onClick={onToggleRead} className="ml-auto text-xs text-violet-700 hover:underline">
            Mark as {n.unread ? "read" : "unread"}
          </button>
          <button onClick={onSelect} className="text-xs text-slate-600 hover:text-slate-800 inline-flex items-center">
            View <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
