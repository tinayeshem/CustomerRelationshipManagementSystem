import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  TrendingUp,
  Settings,
  Users,
  Activity,
  BarChart3,
  Heart,
  Building,
  LogOut,
} from "lucide-react";

export default function CEODashboard() {
  const { user, simulateSalesRole, simulateSupportRole, logout } = useAuth();
  const navigate = useNavigate();

  if (!user?.isCEO) {
    return (
      <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">This dashboard is only available for CEO users.</p>
        </div>
      </div>
    );
  }

  const handleExit = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen relative overflow-hidden">
      {/* Exit to Login button (CEO only) */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          onClick={handleExit}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 shadow-lg"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Exit to Login
        </Button>
      </div>

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

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-light-blue">
              <Heart className="h-3 w-3 text-dark-blue" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-dark-blue mb-2">
          CEO Demo Dashboard
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Welcome, {user.name}! Select a department to explore:
        </p>
        <div className="inline-flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-full border border-yellow-200">
          <Crown className="h-4 w-4 text-yellow-700" />
          <span className="text-yellow-700 font-medium text-sm">
            Demo Mode Active
          </span>
        </div>
      </div>

      {/* Department Selection Cards */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sales Department Card */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-700">
                Sales Department
              </CardTitle>
              <CardDescription className="text-blue-600">
                Explore sales dashboards, client management, and revenue tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-600">Client Management</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <Activity className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-600">Activities</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <BarChart3 className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-600">Reports</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <Building className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-600">Projects</p>
                </div>
              </div>
              <Button
                onClick={simulateSalesRole}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Enter Sales Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Support Department Card */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Settings className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-purple-700">
                Support Department
              </CardTitle>
              <CardDescription className="text-purple-600">
                Explore support tickets, customer service tools, and team collaboration
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <Settings className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-600">Ticket Management</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <Activity className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-600">Activities</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <BarChart3 className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-600">Reports</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <Users className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-600">Customer Care</p>
                </div>
              </div>
              <Button
                onClick={simulateSupportRole}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Enter Support Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Overview */}
      <Card className="max-w-4xl mx-auto border-light-blue/30 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Heart className="h-5 w-5 text-light-blue" />
            <span>4S System Overview</span>
          </CardTitle>
          <CardDescription>
            Comprehensive sales and support management platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">42</div>
              <p className="text-sm text-gray-600">Active Clients</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-600">18</div>
              <p className="text-sm text-gray-600">Open Tickets</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">€125K</div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
