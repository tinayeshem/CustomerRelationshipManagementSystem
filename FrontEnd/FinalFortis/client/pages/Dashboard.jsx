import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTeamActivityFeed } from "@/hooks/useTeamActivityFeed";
import {
  Users,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  Settings,
  Building,
} from "lucide-react";

const quickStats = [
  {
    title: "Active Clients",
    value: "42",
    change: "+12%",
    changeType: "positive",
    icon: Users,
    color: "pastel-blue",
  },
  {
    title: "Today's Activities",
    value: "18",
    change: "+5",
    changeType: "positive",
    icon: Activity,
    color: "pastel-green",
  },
  {
    title: "Open Tickets",
    value: "7",
    change: "-3",
    changeType: "positive",
    icon: AlertCircle,
    color: "pastel-yellow",
  },
  {
    title: "Monthly Revenue",
    value: "€125K",
    change: "+8%",
    changeType: "positive",
    icon: TrendingUp,
    color: "pastel-purple",
  },
];

// Team activities are now loaded dynamically via useTeamActivityFeed hook

// All tasks that will be filtered based on assigned user
const allUpcomingTasks = [
  {
    id: 1,
    title: "Demo presentation for Split City",
    time: "Tomorrow 9:00 AM",
    priority: "High",
    client: "Split City Council",
    assignedTo: "Ana Marić",
    department: "Sales",
  },
  {
    id: 2,
    title: "Follow up on contract proposal",
    time: "Today 3:00 PM",
    priority: "Medium",
    client: "Sports Club Dinamo",
    assignedTo: "Marko Petrović",
    department: "Sales",
  },
  {
    id: 3,
    title: "System maintenance check",
    time: "Friday 10:00 AM",
    priority: "Low",
    client: "Zagreb Municipality",
    assignedTo: "Ana Marić",
    department: "Sales",
  },
  {
    id: 4,
    title: "Resolve customer support ticket",
    time: "Today 2:00 PM",
    priority: "High",
    client: "Tech Solutions Ltd",
    assignedTo: "Petra Babić",
    department: "Support",
  },
  {
    id: 5,
    title: "Prepare monthly sales report",
    time: "Friday 4:00 PM",
    priority: "Medium",
    client: "Internal",
    assignedTo: "Luka Novak",
    department: "Sales",
  },
  {
    id: 6,
    title: "Client onboarding call",
    time: "Monday 10:00 AM",
    priority: "Medium",
    client: "Pula Municipality",
    assignedTo: "Marko Petrović",
    department: "Sales",
  },
];

export default function Dashboard() {
  const { user, getAllUsers } = useAuth();
  const { teamActivityFeed, hasProjects, userProjects } =
    useTeamActivityFeed(3);

  // Load activities to derive user's tickets
  const [activitiesList, setActivitiesList] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("activitiesList");
      setActivitiesList(saved ? JSON.parse(saved) : []);
    } catch {
      setActivitiesList([]);
    }
    const handler = () => {
      try {
        const saved = localStorage.getItem("activitiesList");
        setActivitiesList(saved ? JSON.parse(saved) : []);
      } catch {}
    };
    window.addEventListener("activitiesListUpdated", handler);
    return () => window.removeEventListener("activitiesListUpdated", handler);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("supportTicketsList");
      setSupportTickets(saved ? JSON.parse(saved) : []);
    } catch {
      setSupportTickets([]);
    }
    const handler = () => {
      try {
        const saved = localStorage.getItem("supportTicketsList");
        setSupportTickets(saved ? JSON.parse(saved) : []);
      } catch {}
    };
    window.addEventListener("supportTicketsUpdated", handler);
    return () => window.removeEventListener("supportTicketsUpdated", handler);
  }, []);

  // Team recent activities: activities by teammates on your projects (excludes your own)
  // For Support users, show recent tickets assigned to other support users (excluding the current user)
  const recentTeamActivities = useMemo(() => {
    if (user?.department !== "Support") return teamActivityFeed;

    try {
      const allUsers = typeof getAllUsers === "function" ? getAllUsers() : [];
      const supportNames = new Set(
        Array.isArray(allUsers)
          ? allUsers.filter((u) => u?.department === "Support").map((u) => u.name)
          : [],
      );

      const isAssignedToCurrentUser = (resp) => {
        if (Array.isArray(resp)) return resp.includes(user?.name);
        if (typeof resp === "string") return resp === (user?.name || "");
        return false;
      };

      const parseTime = (x) => {
        if (x?.deadline) return new Date(`${x.deadline}T23:59:59`).getTime();
        const t = x?.time || "00:00";
        const d = x?.date || "";
        const dt = new Date(`${d}T${t}:00`).getTime();
        return isNaN(dt) ? 0 : dt;
      };

      const base = user?.department === "Support" ? supportTickets : activitiesList;
      const list = (Array.isArray(base) ? base : [])
        .filter((a) => a?.isTicket || a?.ticketType)
        // exclude tickets involving the current user
        .filter((a) => !isAssignedToCurrentUser(a?.responsible))
        // include only tickets assigned to support users
        .filter((a) => {
          const resp = a?.responsible;
          if (Array.isArray(resp)) return resp.some((n) => supportNames.has(n));
          if (typeof resp === "string") return supportNames.has(resp);
          return false;
        })
        .sort((a, b) => parseTime(b) - parseTime(a))
        .slice(0, 3)
        .map((a) => ({
          id: a.id,
          client: a.linkedClient || "",
          type: a.ticketType || "Ticket",
          time: a.deadline
            ? `Due: ${a.deadline}`
            : `${a.date || ""}${a.time ? " • " + a.time : ""}`,
          responsiblePerson: Array.isArray(a.responsible)
            ? (a.responsible.find((n) => n !== user?.name) || a.responsible[0] || "")
            : a.responsible || "",
          status: (a.status || "To Do").toString().toLowerCase(),
          icon: Settings,
        }));

      return list;
    } catch {
      return [];
    }
  }, [user?.department, user?.name, teamActivityFeed, activitiesList, supportTickets, getAllUsers]);

  // Upcoming tasks: current user's tickets
  const upcomingTasksBase = user?.department === "Support" ? supportTickets : activitiesList;
  const upcomingTasks = (Array.isArray(upcomingTasksBase) ? upcomingTasksBase : [])
    .filter((a) => a?.isTicket || a?.ticketType)
    .filter((a) => {
      const resp = a?.responsible;
      if (Array.isArray(resp)) return resp.includes(user?.name);
      if (typeof resp === "string") return resp === (user?.name || "");
      return false;
    })
    .sort((a, b) => {
      const parse = (x) => {
        if (x?.deadline) return new Date(`${x.deadline}T23:59:59`).getTime();
        const t = x?.time || "00:00";
        const d = x?.date || "";
        const dt = new Date(`${d}T${t}:00`).getTime();
        return isNaN(dt) ? 0 : dt;
      };
      return parse(a) - parse(b);
    })
    .slice(0, 3)
    .map((a) => ({
      id: a.id,
      title: a.notes || `${a.ticketType || "Ticket"} - ${a.linkedClient || ""}`,
      time: a.deadline
        ? `Due: ${a.deadline}`
        : `${a.date || ""}${a.time ? " • " + a.time : ""}`,
      client: a.linkedClient || "",
      priority: a.priority || "Medium",
    }));

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen relative overflow-hidden">
      {/* Professional floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-16 h-16 bg-light-blue/20 rounded-full animate-bounce opacity-30"></div>
        <div className="absolute top-40 left-20 w-12 h-12 bg-blue-200/30 rounded-full animate-pulse opacity-30"></div>
        <div
          className="absolute bottom-40 right-32 w-20 h-20 bg-light-blue/15 rounded-full animate-bounce opacity-30"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-10 w-14 h-14 bg-blue-100/40 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
      {/* Minimized Welcome Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-2">
          <div className="relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-dark-blue to-primary shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-light-blue">
              <TrendingUp className="h-3 w-3 text-dark-blue" />
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-dark-blue mb-1">
          Welcome to 4S System
        </h1>
        <p className="text-sm text-gray-600 mb-3">
          Your comprehensive sales and support management platform
        </p>
        <div className="inline-flex items-center space-x-2 bg-light-blue px-4 py-2 rounded-full border border-blue-200">
          <Calendar className="h-4 w-4 text-dark-blue" />
          <span className="text-dark-blue font-medium text-sm">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Super Cute Quick Stats */}
      {(() => {
        const statsForUser =
          user?.department === "Support"
            ? quickStats.filter((s) => s.title !== "Monthly Revenue")
            : user?.department === "Sales"
              ? quickStats.filter((s) => s.title !== "Open Tickets")
              : quickStats;
        const gridCols =
          statsForUser.length === 3
            ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-3"
            : statsForUser.length === 2
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
        return (
          <div className={`grid ${gridCols} gap-6`}>
            {statsForUser.map((stat, index) => {
              const Icon = stat.icon;
              const colors = [
                "from-purple-400 to-pink-400",
                "from-pink-400 to-rose-400",
                "from-blue-400 to-cyan-400",
                "from-green-400 to-emerald-400",
              ];
              const bgColors = [
                "from-purple-50 to-pink-50",
                "from-pink-50 to-rose-50",
                "from-blue-50 to-cyan-50",
                "from-green-50 to-emerald-50",
              ];
              return (
                <Card
                  key={index}
                  className={`border-2 border-purple-200 bg-gradient-to-br ${bgColors[index]} hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer transform hover:rotate-1`}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors[index]} flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-800 mb-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center justify-center space-x-1">
                      <span
                        className={`text-sm font-medium ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-lg">
                        {stat.changeType === "positive" ? "📈" : "📉"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      from last month 💕
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="border-pastel-pink/30 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>{user?.department === "Support" ? "Team Recent Tickets" : "Team Recent Activities"}</span>
              </CardTitle>
              {user?.department !== 'Support' && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/projects">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTeamActivities.length > 0 ? (
              recentTeamActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-background/50"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-cute-primary/20">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.client}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.type || "Activity"} • {activity.time}
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        by {activity.responsiblePerson}
                      </p>
                    </div>
                    <Badge
                      variant={
                        activity.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm mb-2">
                  No team activities yet
                </p>
                <p className="text-xs text-gray-400">
                  {!hasProjects
                    ? "You're not assigned to any projects yet"
                    : userProjects.length > 0
                      ? "Your teammates haven't added activities for shared projects yet"
                      : "Join a project to see team activities"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="border-pastel-pink/30 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Your Upcoming Tasks</span>
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to={user?.department === 'Support' ? '/support' : '/activities'}>
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-background/50"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-cute-accent/20">
                  <CheckCircle className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {task.client} • {task.time}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    task.priority === "High"
                      ? "border-red-300 text-red-700"
                      : task.priority === "Medium"
                        ? "border-yellow-300 text-yellow-700"
                        : "border-green-300 text-green-700"
                  }`}
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-pastel-pink/30 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Access frequently used features of the 4S System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              asChild
              className="h-20 flex-col space-y-2 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 border border-blue-200 shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <Link to={user?.department === "Support" ? "/support?register=1" : "/activities"}>
                <Activity className="h-6 w-6" />
                <span className="text-sm font-medium">
                  {user?.department === "Support" ? "New Ticket" : "New Activity"}
                </span>
              </Link>
            </Button>
            <Button
              asChild
              className="h-20 flex-col space-y-2 bg-gradient-to-br from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300 border border-green-200 shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <Link to="/organization">
                <Building className="h-6 w-6" />
                <span className="text-sm font-medium">Add Organization</span>
              </Link>
            </Button>
            <Button
              asChild
              className="h-20 flex-col space-y-2 bg-gradient-to-br from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300 border border-purple-200 shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <Link to="/reports">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm font-medium">View Reports</span>
              </Link>
            </Button>
            <Button
              asChild
              className="h-20 flex-col space-y-2 bg-gradient-to-br from-orange-100 to-orange-200 text-orange-800 hover:from-orange-200 hover:to-orange-300 border border-orange-200 shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <Link to="/ai-advisor">
                <Heart className="h-6 w-6" />
                <span className="text-sm font-medium">AI Insights</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
