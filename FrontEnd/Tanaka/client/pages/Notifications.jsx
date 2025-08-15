import React, { useMemo, useState } from "react";
import { Bell, Search, Filter, Settings } from "lucide-react";
import NotificationRow from "../components/notifications/NotificationRow";
import DetailsCard from "../components/notifications/DetailsCard";
import DetailsDrawer from "../components/notifications/DetailsDrawer";
import { getInitialData } from "../lib/notifications/data";

export default function NotificationsPage({ getData = getInitialData }) {
  const [items, setItems] = useState(() => getData());
  const [selected, setSelected] = useState(() => (items[0] ? items[0] : null));
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");
  const [showFilters, setShowFilters] = useState(false); // mobile filters
  const [showDetailsMobile, setShowDetailsMobile] = useState(false); // mobile drawer

  const unreadCount = items.filter((n) => n.unread).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byTab = (n) => {
      if (tab === "All") return true;
      if (tab === "Unread") return n.unread;
      if (tab === "Mentions") return (n.body || "").includes("@");
      return n.domain === tab;
    };
    return items.filter((n) => byTab(n)).filter((n) => {
      if (!q) return true;
      const blob = `${n.title} ${n.body || ""} ${n.client || ""}`.toLowerCase();
      return blob.includes(q);
    });
  }, [items, query, tab]);

  const markAllRead = () => setItems((arr) => arr.map((n) => ({ ...n, unread: false })));
  const toggleRead = (id) =>
    setItems((arr) => arr.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n)));

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 bg-slate-50 text-slate-800">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 text-[10px] bg-rose-600 text-white rounded-full px-1.5 py-0.5 shadow">
              {unreadCount}
            </span>
          </div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
        </div>

        {/* Right: controls */}
        <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-4 h-4 absolute left-2 top-2.5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notifications..."
              aria-label="Search notifications"
              className="pl-8 pr-3 py-2 rounded-lg border bg-white w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          {/* Compact buttons for mobile */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-2 border rounded-lg py-2 px-3 bg-white text-sm sm:hidden"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>

          <button onClick={markAllRead} className="rounded-lg py-2 px-3 bg-emerald-600 text-white text-sm shadow">
            Mark all as read
          </button>

          <button className="rounded-lg py-2 px-3 border bg-white" title="Settings">
            <Settings className="w-4 h-4" />
          </button>

          {/* Expanded filter controls on sm+ */}
          <div className="hidden sm:flex items-center gap-2">
            <select className="border rounded-lg py-2 px-3 bg-white text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>All time</option>
            </select>
            <button className="inline-flex items-center gap-2 border rounded-lg py-2 px-3 bg-white text-sm">
              <Filter className="w-4 h-4" /> Advanced Filters
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible filter row on mobile */}
      {showFilters && (
        <div className="mt-2 sm:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <select className="border rounded-lg py-2 px-3 bg-white text-sm flex-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>All time</option>
            </select>
            <button className="inline-flex items-center gap-2 border rounded-lg py-2 px-3 bg-white text-sm">
              <Filter className="w-4 h-4" /> Advanced Filters
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-4 sm:mt-6 overflow-x-auto -mx-1 px-1">
        <div className="inline-flex items-center gap-2 text-sm whitespace-nowrap">
          {["All", "Unread", "Mentions", "Sales", "Support", "System"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-full border ${
                tab === t ? "bg-violet-600 text-white border-violet-600" : "bg-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* List */}
        <div className="lg:col-span-7 rounded-2xl border bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Activity Timeline</div>
            <button className="text-sm text-slate-500 inline-flex items-center gap-1">
              <Filter className="w-4 h-4" /> Sort/Filter
            </button>
          </div>
          <ul className="divide-y max-h-none md:max-h-[calc(100vh-260px)] overflow-auto">
            {filtered.map((n) => (
              <NotificationRow
                key={n.id}
                n={n}
                onToggleRead={() => toggleRead(n.id)}
                onSelect={() => {
                  setSelected(n);
                  setShowDetailsMobile(true);
                }}
              />
            ))}
            {!filtered.length && (
              <li className="py-10 text-center text-slate-500 text-sm">No notifications found.</li>
            )}
          </ul>
        </div>

        {/* Details (desktop) */}
        <aside className="lg:col-span-5 rounded-2xl border bg-white p-4 hidden lg:block">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Details</div>
            <button
              className="text-sm text-slate-500 hover:text-slate-700"
              onClick={() => setShowDetailsMobile(true)}
            >
              Open in drawer
            </button>
          </div>
          {selected ? (
            <DetailsCard n={selected} />
          ) : (
            <div className="text-sm text-slate-500">Select a notification to see details.</div>
          )}
        </aside>
      </div>

      {/* Mobile Details Drawer */}
      <DetailsDrawer open={showDetailsMobile} onClose={() => setShowDetailsMobile(false)}>
        {selected ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium">Details</div>
              <button
                className="text-sm text-slate-500 hover:text-slate-700"
                onClick={() => setShowDetailsMobile(false)}
              >
                Close
              </button>
            </div>
            <DetailsCard n={selected} />
          </div>
        ) : (
          <div className="p-4 text-sm text-slate-500">Select a notification to see details.</div>
        )}
      </DetailsDrawer>
    </div>
  );
}