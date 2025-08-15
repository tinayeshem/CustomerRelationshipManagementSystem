import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
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
  Bell 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Notifications", href: "/notifications", icon:Bell  },
  { name: "Activities", href: "/activities", icon: Activity },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "LRSU Database", href: "/lrsu", icon: Building },
  { name: "Sales", href: "/sales", icon: TrendingUp },
  { name: "Support", href: "/support", icon: Settings },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "AI Advisor", href: "/ai-advisor", icon: Bot },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Professional floating elements background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-light-blue rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-light-blue rounded-full opacity-10 animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-blue-100 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar backdrop-blur-sm border-r border-sidebar-border shadow-xl">
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
                <p className="text-xs text-light-blue font-medium">Sales & Support</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6 text-white">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center rounded-lg px-4 py-3 text-sm  font-medium transition-all duration-200 hover:shadow-lg",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary-foreground shadow-lg border border-light-blue text-white"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive ? "text-light-blue" : "text-sidebar-foreground group-hover:text-light-blue"
                  )} />
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

          {/* Professional Footer */}
          <div className="border-t border-sidebar-border p-4 bg-gradient-to-r from-light-blue/10 to-blue-200/10">
            <div className="text-center text-xs">
              <p className="flex items-center justify-center space-x-2 text-light-blue font-medium">
                <Heart className="h-4 w-4" />
                <span>SOM Support & Sales</span>
              </p>
              <p className="mt-2 text-sidebar-foreground opacity-75">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
