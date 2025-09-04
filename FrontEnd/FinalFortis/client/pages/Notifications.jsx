import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { Bell, Search, Filter, Settings, CheckSquare, Square, Archive, Trash2, MoreVertical, RefreshCw, Zap, Users, Clock, AlertTriangle } from "lucide-react";
import NotificationRow from "../components/notifications/NotificationRow";
import DetailsCard from "../components/notifications/DetailsCard";
import DetailsDrawer from "../components/notifications/DetailsDrawer";
import { getInitialData } from "../lib/notifications/data";

// Enhanced notification generator for demo purposes
const generateMoreNotifications = (count = 50) => {
  const templates = [
    { title: "New client inquiry", domain: "Sales", severity: "medium" },
    { title: "System maintenance scheduled", domain: "System", severity: "info" },
    { title: "Payment overdue", domain: "Support", severity: "high" },
    { title: "Meeting reminder", domain: "Sales", severity: "low" },
    { title: "Server performance alert", domain: "System", severity: "high" },
    { title: "Contract renewal due", domain: "Sales", severity: "medium" },
    { title: "User feedback received", domain: "Support", severity: "info" },
    { title: "Backup completed", domain: "System", severity: "info" },
  ];
  
  const clients = ["Zagreb Municipality", "Sports Club Dinamo", "Split City Council", "Tech Solutions Ltd", "Vodacom", "Microsoft Croatia", "IBM Adriatic"];
  const channels = ["email", "slack", "in-app", "sms"];
  
  return Array.from({ length: count }, (_, i) => {
    const template = templates[i % templates.length];
    const now = Date.now();
    return {
      id: `n${100 + i}`,
      title: template.title,
      body: `Automated notification for ${clients[i % clients.length]}. This requires your attention.`,
      client: clients[i % clients.length],
      domain: template.domain,
      severity: template.severity,
      status: Math.random() > 0.5 ? "Open" : "Closed",
      assignee: ["Ana Marić", "Marko Petrović", "Petra Babić"][i % 3],
      nextStep: "Review and respond",
      createdAt: new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      unread: Math.random() > 0.6,
      tags: ["automated", template.domain.toLowerCase()],
      channel: channels[i % channels.length],
      priority: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
    };
  });
};

export default function NotificationsPage({ getData = getInitialData }) {
  // Enhanced state management
  const [items, setItems] = useState(() => [...getData(), ...generateMoreNotifications(100)]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailsMobile, setShowDetailsMobile] = useState(false);
  
  // New efficiency states
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // list, compact, cards
  const [filterOptions, setFilterOptions] = useState({
    dateRange: "all", // all, today, week, month
    severity: "all",
    status: "all",
    assignee: "all",
    client: "all"
  });

  // Performance optimizations
  const searchTimeoutRef = useRef(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  // Auto-refresh simulation
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate new notifications
        const newNotification = {
          id: `n${Date.now()}`,
          title: "New real-time notification",
          body: "This notification was added automatically",
          client: "Real-time Client",
          domain: "System",
          severity: "info",
          status: "Open",
          createdAt: new Date().toISOString(),
          unread: true,
          tags: ["real-time"],
          channel: "in-app",
        };
        setItems(prev => [newNotification, ...prev]);
      }, 10000); // Every 10 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Enhanced filtering and sorting
  const processedItems = useMemo(() => {
    let filtered = items;

    // Text search
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.trim().toLowerCase();
      filtered = filtered.filter((n) => {
        const searchText = `${n.title} ${n.body || ""} ${n.client || ""} ${n.assignee || ""}`.toLowerCase();
        return searchText.includes(q);
      });
    }

    // Tab filtering
    filtered = filtered.filter((n) => {
      if (tab === "All") return true;
      if (tab === "Unread") return n.unread;
      if (tab === "Mentions") return (n.body || "").includes("@");
      if (tab === "High Priority") return n.severity === "high" || n.priority === "high";
      return n.domain === tab;
    });

    // Advanced filtering
    filtered = filtered.filter((n) => {
      if (filterOptions.severity !== "all" && n.severity !== filterOptions.severity) return false;
      if (filterOptions.status !== "all" && n.status !== filterOptions.status) return false;
      if (filterOptions.assignee !== "all" && n.assignee !== filterOptions.assignee) return false;
      if (filterOptions.client !== "all" && n.client !== filterOptions.client) return false;
      
      // Date range filtering
      if (filterOptions.dateRange !== "all") {
        const createdAt = new Date(n.createdAt);
        const now = new Date();
        const daysDiff = (now - createdAt) / (1000 * 60 * 60 * 24);
        
        if (filterOptions.dateRange === "today" && daysDiff > 1) return false;
        if (filterOptions.dateRange === "week" && daysDiff > 7) return false;
        if (filterOptions.dateRange === "month" && daysDiff > 30) return false;
      }
      
      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === "createdAt") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [items, debouncedQuery, tab, filterOptions, sortBy, sortOrder]);

  // Pagination
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedItems.slice(startIndex, startIndex + pageSize);
  }, [processedItems, currentPage, pageSize]);

  const totalPages = Math.ceil(processedItems.length / pageSize);

  // Statistics
  const stats = useMemo(() => {
    const unreadCount = items.filter(n => n.unread).length;
    const highPriorityCount = items.filter(n => n.severity === "high" || n.priority === "high").length;
    const todayCount = items.filter(n => {
      const daysDiff = (new Date() - new Date(n.createdAt)) / (1000 * 60 * 60 * 24);
      return daysDiff <= 1;
    }).length;
    
    return { unreadCount, highPriorityCount, todayCount, totalCount: items.length };
  }, [items]);

  // Enhanced actions
  const markAllRead = useCallback(() => {
    setItems(arr => arr.map(n => ({ ...n, unread: false })));
    setSelectedItems(new Set());
  }, []);

  const markSelectedRead = useCallback(() => {
    setItems(arr => arr.map(n => 
      selectedItems.has(n.id) ? { ...n, unread: false } : n
    ));
    setSelectedItems(new Set());
  }, [selectedItems]);

  const deleteSelected = useCallback(() => {
    setItems(arr => arr.filter(n => !selectedItems.has(n.id)));
    setSelectedItems(new Set());
  }, [selectedItems]);

  const archiveSelected = useCallback(() => {
    setItems(arr => arr.map(n => 
      selectedItems.has(n.id) ? { ...n, archived: true, unread: false } : n
    ));
    setSelectedItems(new Set());
  }, [selectedItems]);

  const toggleItemSelection = useCallback((id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleAllSelection = useCallback(() => {
    if (selectedItems.size === paginatedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedItems.map(n => n.id)));
    }
  }, [selectedItems.size, paginatedItems]);

  const toggleRead = useCallback((id) => {
    setItems(arr => arr.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  }, []);

  // Get unique values for filters
  const uniqueValues = useMemo(() => {
    return {
      severities: [...new Set(items.map(n => n.severity))],
      statuses: [...new Set(items.map(n => n.status))],
      assignees: [...new Set(items.map(n => n.assignee).filter(Boolean))],
      clients: [...new Set(items.map(n => n.client).filter(Boolean))]
    };
  }, [items]);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800">
      {/* Enhanced Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: Title and Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-8 h-8 text-blue-600" />
                {stats.unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-2 py-1 shadow-lg">
                    {stats.unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
                <p className="text-sm text-slate-600">Stay updated with your activities</p>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="flex gap-3">
              <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <Bell className="w-4 h-4" />
                {stats.unreadCount} Unread
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {stats.todayCount} Today
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                autoRefresh 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              Live Updates
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Search Bar - Fixed Alignment */}
        <div className="mt-6 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notifications, clients, assignees..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
          
          {/* Bulk Actions */}
          {selectedItems.size > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
              <span className="text-sm font-medium text-blue-800">
                {selectedItems.size} selected
              </span>
              <button
                onClick={markSelectedRead}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                <CheckSquare className="w-4 h-4" />
                Mark Read
              </button>
              <button
                onClick={archiveSelected}
                className="flex items-center gap-1 px-3 py-1 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition-colors"
              >
                <Archive className="w-4 h-4" />
                Archive
              </button>
              <button
                onClick={deleteSelected}
                className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Filters Panel */}
      {showFilters && (
        <div className="mb-6 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 flex-1">
              <select
                value={filterOptions.dateRange}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, dateRange: e.target.value }))}
                className="border border-slate-300 rounded-lg py-2 px-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>

              <select
                value={filterOptions.severity}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, severity: e.target.value }))}
                className="border border-slate-300 rounded-lg py-2 px-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Severities</option>
                {uniqueValues.severities.map(severity => (
                  <option key={severity} value={severity}>{severity}</option>
                ))}
              </select>

              <select
                value={filterOptions.status}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, status: e.target.value }))}
                className="border border-slate-300 rounded-lg py-2 px-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                {uniqueValues.statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={filterOptions.assignee}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, assignee: e.target.value }))}
                className="border border-slate-300 rounded-lg py-2 px-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Assignees</option>
                {uniqueValues.assignees.map(assignee => (
                  <option key={assignee} value={assignee}>{assignee}</option>
                ))}
              </select>

              <select
                value={filterOptions.client}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, client: e.target.value }))}
                className="border border-slate-300 rounded-lg py-2 px-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Clients</option>
                {uniqueValues.clients.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="border border-slate-300 rounded-lg py-2 px-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="severity-desc">High Priority First</option>
              </select>
            </div>
            
            <button
              onClick={() => setFilterOptions({
                dateRange: "all",
                severity: "all", 
                status: "all",
                assignee: "all",
                client: "all"
              })}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors whitespace-nowrap"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex items-center gap-2 text-sm whitespace-nowrap">
          {["All", "Unread"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tab === t 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {t}
              {t === "Unread" && stats.unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Enhanced List */}
        <div className="xl:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="font-semibold text-lg">Activity Timeline</h2>
                <span className="text-sm text-slate-500">
                  {processedItems.length} notifications
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleAllSelection}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                  {selectedItems.size === paginatedItems.length ? 
                    <CheckSquare className="w-4 h-4" /> : 
                    <Square className="w-4 h-4" />
                  }
                  Select All
                </button>
                
                <button
                  onClick={markAllRead}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Mark All Read
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-[calc(100vh-300px)] overflow-auto">
            {paginatedItems.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {paginatedItems.map((n) => (
                  <NotificationRowEnhanced
                    key={n.id}
                    n={n}
                    isSelected={selectedItems.has(n.id)}
                    onToggleRead={() => toggleRead(n.id)}
                    onToggleSelect={() => toggleItemSelection(n.id)}
                    onSelect={() => {
                      setSelected(n);
                      setShowDetailsMobile(true);
                    }}
                  />
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium mb-2">No notifications found</p>
                <p className="text-sm">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-slate-300 rounded px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-slate-600">per page</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-slate-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Previous
                </button>
                
                <span className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-slate-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Details Sidebar */}
        <aside className="xl:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm hidden xl:block">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-lg">Details</h2>
          </div>
          <div className="p-4">
            {selected ? (
              <DetailsCard n={selected} />
            ) : (
              <div className="text-center text-slate-500 py-12">
                <Bell className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium mb-2">Select a notification</p>
                <p className="text-sm">Choose a notification from the list to see details</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile Details Drawer */}
      <DetailsDrawer open={showDetailsMobile} onClose={() => setShowDetailsMobile(false)}>
        {selected ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-lg">Details</h2>
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
          <div className="p-4 text-sm text-slate-500">
            Select a notification to see details.
          </div>
        )}
      </DetailsDrawer>
    </div>
  );
}

// Enhanced Notification Row Component
const NotificationRowEnhanced = React.memo(({ n, isSelected, onToggleRead, onToggleSelect, onSelect }) => {
  const severityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    low: "bg-green-100 text-green-800 border-green-200",
    info: "bg-blue-100 text-blue-800 border-blue-200"
  };

  const timeAgo = (dateString) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <li className={`p-4 hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={onToggleSelect}
          className="mt-1 text-slate-400 hover:text-slate-600"
        >
          {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
        </button>
        
        <div className={`mt-1 shrink-0 rounded-full border p-1 ${n.unread ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"}`}>
          <Bell className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <button 
              className="text-left hover:underline flex-1 min-w-0"
              onClick={onSelect}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-medium ${n.unread ? 'text-slate-900' : 'text-slate-600'} truncate`}>
                  {n.title}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${severityColors[n.severity] || severityColors.info}`}>
                  {n.severity}
                </span>
                {n.unread && (
                  <span className="inline-flex items-center text-xs bg-blue-600 text-white rounded-full px-2 py-0.5">
                    NEW
                  </span>
                )}
              </div>
            </button>
            
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500">{timeAgo(n.createdAt)}</span>
              <button
                onClick={onToggleRead}
                className="text-xs text-blue-600 hover:underline p-1"
              >
                {n.unread ? "Mark read" : "Mark unread"}
              </button>
            </div>
          </div>
          
          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{n.body}</p>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
            {n.client && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {n.client}
              </span>
            )}
            {n.assignee && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {n.assignee}
              </span>
            )}
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              {n.domain}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
});

NotificationRowEnhanced.displayName = "NotificationRowEnhanced";
