import React from "react";
import { Image, FileText, Paperclip, CheckCircle2 } from "lucide-react";
import InfoTile from "./atoms/InfoTile";
import QuickBtn from "./atoms/QuickBtn";
import { fmtDateTime, timeAgo, severityMap } from "../../lib/utils";

export default function DetailsCard({ n }) {
  const SevIcon = severityMap[n.severity]?.Icon || CheckCircle2;
  return (
    <div className="space-y-4">
      {/* Title & summary */}
      <div className="flex items-start gap-3">
        <div className={`rounded-full border p-1 mt-1 ${n.unread ? "bg-violet-50" : "bg-slate-50"}`}>
          <SevIcon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="font-semibold leading-tight">{n.title}</div>
          <div className="text-sm text-slate-600">{n.body}</div>
        </div>
      </div>

      {/* Key fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <InfoTile label="Client" value={n.client || "—"} />
        <InfoTile label="Created" value={`${fmtDateTime(n.createdAt)} (${timeAgo(n.createdAt)})`} />
        <InfoTile label="Domain" value={n.domain} />
        <InfoTile label="Channel" value={n.channel} />
        <InfoTile label="Status" value={n.status || "—"} />
        <InfoTile label="Severity" value={n.severity} />
        <InfoTile label="Assignee" value={n.assignee || "Unassigned"} />
        <InfoTile label="Next step" value={n.nextStep || "—"} />
        <InfoTile label="Due date" value={n.dueAt ? fmtDateTime(n.dueAt) : "—"} />
        <InfoTile label="Ticket" value={n.ticketId || "—"} />
        <InfoTile label="Activity" value={n.activityId || "—"} />
      </div>

      {/* Attachments */}
      {n.attachments?.length > 0 && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Attachments</div>
          <ul className="space-y-1">
            {n.attachments.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-100 border">
                  {f.type === "image" ? (
                    <Image className="w-4 h-4" />
                  ) : f.type === "text" ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                </span>
                <span className="truncate">{f.name}</span>
                <button className="ml-auto text-violet-700 text-xs hover:underline">Open</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeline */}
      {n.timeline?.length > 0 && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Timeline</div>
          <ul className="text-sm space-y-1">
            {n.timeline.map((t, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-slate-500 w-36 hidden sm:inline">{fmtDateTime(t.at)}</span>
                <span className="text-slate-500 sm:hidden">{timeAgo(t.at)}</span>
                <span className="flex-1">{t.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick links */}
      <div className="flex flex-wrap gap-2">
        <QuickBtn>Open Ticket</QuickBtn>
        <QuickBtn>Open Client</QuickBtn>
        <QuickBtn>Open Activity</QuickBtn>
      </div>
    </div>
  );
}
