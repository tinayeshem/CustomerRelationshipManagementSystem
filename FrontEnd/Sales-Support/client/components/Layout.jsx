import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Users,
  Activity,
  Database,
  BarChart3,
  Bot,
  Settings,
  Heart,
  Home,
  Building,
  FileText,
  TrendingUp,
  Bell,
  LogOut,
  User,
  Shield,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Teams", href: "/teams", icon: Users },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Activities", href: "/activities", icon: Activity },
  { name: "Organization", href: "/organization", icon: Building },
  { name: "Projects", href: "/projects", icon: FileText },
  { name: "Sales", href: "/sales", icon: TrendingUp },
  { name: "Support", href: "/support", icon: Settings },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "AI Advisor", href: "/ai-advisor", icon: Bot },
];

export default function Layout({ children }) {
  const location = useLocation();
  const { user, logout, isManager } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Professional floating elements background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-light-blue rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-15 animate-pulse"></div>
        <div
          className="absolute bottom-20 left-32 w-24 h-24 bg-light-blue rounded-full opacity-10 animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 right-10 w-12 h-12 bg-blue-100 rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Hamburger Menu Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          onClick={toggleSidebar}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-blue-200 text-blue-600 hover:bg-blue-50 shadow-lg"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar backdrop-blur-sm border-r border-sidebar-border shadow-xl transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Professional Logo */}
          <div className="flex h-16 items-center justify-center border-b border-sidebar-border bg-gradient-to-r from-light-blue/20 to-blue-200/20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-dark-blue to-primary text-white shadow-lg">
                  <Heart className="h-5 w-5" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-light-blue rounded-full"></div>
              </div>
              <div>
                <span className="text-xl font-bold text-sidebar-foreground">
                  4S System
                </span>
                <p className="text-xs text-light-blue font-medium">
                  Sales & Support
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6 text-white">
            {navigation
              .filter((item) => {
                if (!user) return true;
                if (user.department === 'Support' && item.name === 'Sales') return false;
                if (user.department === 'Support' && item.name === 'Activities') return false;
                if (user.department === 'Sales' && item.name === 'Support') return false;
                return true;
              })
              .map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeSidebar}
                    className={cn(
                      "group flex items-center rounded-lg px-4 py-3 text-sm  font-medium transition-all duration-200 hover:shadow-lg",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary-foreground shadow-lg border border-light-blue text-white"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon
                      className={cn(
                        "mr-3 h-5 w-5 transition-colors",
                        isActive
                          ? "text-light-blue"
                          : "text-sidebar-foreground group-hover:text-light-blue",
                      )}
                    />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto">
                        <div className="h-2 w-2 rounded-full bg-light-blue text-white" />
                      </div>
                    )}
                  </Link>
                );
              })}
          </nav>

          {/* User Profile & Logout */}
          <div className="border-t border-sidebar-border p-4 bg-gradient-to-r from-light-blue/10 to-blue-200/10">
            {user && (
              <div className="mb-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-sidebar-accent/30 border border-light-blue/20">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.bgColor || "from-blue-500 to-blue-600"} flex items-center justify-center text-white font-bold shadow-lg`}
                  >
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-light-blue truncate">
                      {user.role}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          user.department === "Sales"
                            ? "bg-blue-100 text-blue-700"
                            : user.department === "Support"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.department}
                      </span>
                      {isManager() && (
                        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                          <Shield className="h-3 w-3 mr-1" />
                          Manager
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}

            {/* System Info */}
            <div className="text-center text-xs">
              <p className="flex items-center justify-center space-x-2 text-light-blue font-medium">
                <Heart className="h-4 w-4" />
                <span>4S System</span>
              </p>
              <p className="mt-1 text-sidebar-foreground opacity-75">
                Sales & Support Platform
              </p>
              <p className="mt-1 text-sidebar-foreground opacity-50">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen pt-16 lg:pt-0">{children}</main>
      </div>
    </div>
  );
}
