import React from "react";
import { Image, FileText, Paperclip, CheckCircle2, Calendar, User, MapPin, Clock, AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react";
import InfoTile from "./atoms/InfoTile";
import QuickBtn from "./atoms/QuickBtn";
import Chip from "./atoms/Chip";
import { fmtDateTime, timeAgo, severityMap } from "../../lib/utils";

export default function DetailsCard({ n }) {
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return AlertTriangle;
      case 'medium': return AlertCircle;
      case 'low': return CheckCircle;
      default: return Info;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const SevIcon = getSeverityIcon(n.severity);

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4 border border-slate-200">
        <div className="flex items-start gap-3">
          <div className={`rounded-full border p-2 ${getSeverityColor(n.severity)}`}>
            <SevIcon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg leading-tight text-slate-900">{n.title}</h3>
              {n.unread && (
                <Chip tone="blue" size="xs">NEW</Chip>
              )}
            </div>
            <p className="text-slate-600 mt-2 leading-relaxed">{n.body}</p>
            <div className="flex items-center gap-4 mt-3">
              <Chip tone={n.severity === 'high' ? 'red' : n.severity === 'medium' ? 'yellow' : 'green'} size="sm">
                {n.severity.toUpperCase()}
              </Chip>
              <Chip tone="gray" size="sm">{n.domain}</Chip>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Key Information */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Client</div>
                <div className="font-medium text-slate-900">{n.client || "—"}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Created</div>
                <div className="font-medium text-slate-900">{timeAgo(n.createdAt)}</div>
                <div className="text-xs text-slate-500">{fmtDateTime(n.createdAt)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Channel</div>
                <div className="font-medium text-slate-900">{n.channel}</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Assignee</div>
                <div className="font-medium text-slate-900">{n.assignee || "Unassigned"}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-slate-400" />
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Status</div>
                <div className="font-medium text-slate-900">{n.status || "—"}</div>
              </div>
            </div>
            {n.dueAt && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Due Date</div>
                  <div className="font-medium text-slate-900">{fmtDateTime(n.dueAt)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {(n.ticketId || n.activityId || n.nextStep) && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 gap-2 text-sm">
              {n.ticketId && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Ticket ID:</span>
                  <span className="font-mono text-slate-900">{n.ticketId}</span>
                </div>
              )}
              {n.activityId && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Activity ID:</span>
                  <span className="font-mono text-slate-900">{n.activityId}</span>
                </div>
              )}
              {n.nextStep && (
                <div>
                  <span className="text-slate-500">Next Step:</span>
                  <div className="mt-1 p-2 bg-blue-50 rounded text-slate-900">{n.nextStep}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Attachments */}
      {n.attachments?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Paperclip className="w-4 h-4" />
            Attachments ({n.attachments.length})
          </h4>
          <div className="grid gap-2">
            {n.attachments.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                <div className={`flex items-center justify-center w-8 h-8 rounded ${f.type === 'image' ? 'bg-green-100 text-green-600' : f.type === 'text' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                  {f.type === "image" ? (
                    <Image className="w-4 h-4" />
                  ) : f.type === "text" ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 truncate">{f.name}</div>
                  <div className="text-xs text-slate-500 capitalize">{f.type} file</div>
                </div>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Timeline */}
      {n.timeline?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Timeline
          </h4>
          <div className="space-y-3">
            {n.timeline.map((t, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  {i < n.timeline.length - 1 && <div className="w-0.5 h-8 bg-slate-200 mt-1"></div>}
                </div>
                <div className="flex-1 pb-3">
                  <div className="font-medium text-slate-900">{t.text}</div>
                  <div className="text-sm text-slate-500 mt-1">
                    <span className="hidden sm:inline">{fmtDateTime(t.at)}</span>
                    <span className="sm:hidden">{timeAgo(t.at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Quick Actions */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h4 className="font-semibold text-slate-900 mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          {n.ticketId && (
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Open Ticket
            </button>
          )}
          {n.client && (
            <button className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-2">
              <User className="w-4 h-4" />
              View Client
            </button>
          )}
          {n.activityId && (
            <button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Open Activity
            </button>
          )}
          <button className="px-3 py-2 bg-slate-600 text-white rounded-lg text-sm hover:bg-slate-700 transition-colors flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Mark as Read
          </button>
        </div>
      </div>
    </div>
  );
}
