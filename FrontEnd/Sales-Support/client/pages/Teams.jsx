import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../contexts/AuthContext";
import {
  Users,
  UserPlus,
  Shield,
  Star,
  Award,
  Target,
  Zap,
  CheckCircle,
  Clock,
  Heart,
} from "lucide-react";
import { useState, useMemo } from "react";

// Generate performance metrics for team members
const generateMemberMetrics = (member, index) => {
  const performanceMap = { 1: 95, 2: 88, 3: 92, 4: 76, 5: 89 };
  const clientsMap = { 1: 18, 2: 12, 3: 15, 4: 6, 5: 12 };
  const tasksMap = { 1: 5, 2: 3, 3: 7, 4: 2, 5: 4 };
  const weeklyTargetMap = { 1: 12, 2: 8, 3: 20, 4: 5, 5: 15 };
  const completedTargetMap = { 1: 10, 2: 7, 3: 18, 4: 4, 5: 13 };
  const statusMap = { 1: "online", 2: "busy", 3: "online", 4: "away", 5: "online" };
  const lastActivityMap = { 1: "2 minutes ago", 2: "15 minutes ago", 3: "5 minutes ago", 4: "1 hour ago", 5: "30 minutes ago" };

  return {
    ...member,
    performance: performanceMap[member.id] || 85,
    clientsManaged: clientsMap[member.id] || 10,
    currentTasks: tasksMap[member.id] || 3,
    weeklyTarget: weeklyTargetMap[member.id] || 10,
    completedTarget: completedTargetMap[member.id] || 8,
    status: statusMap[member.id] || "online",
    lastActivity: lastActivityMap[member.id] || "Recently"
  };
};

export default function Teams() {
  const { user, isManager, getAllUsers } = useAuth();

  // Get department-scoped team members
  const teamMembers = useMemo(() => {
    const allUsers = getAllUsers();
    const scoped = user?.department === 'Support'
      ? allUsers.filter(m => m.department === 'Support')
      : user?.department === 'Sales'
        ? allUsers.filter(m => m.department === 'Sales')
        : allUsers;
    return scoped.map((member, index) => generateMemberMetrics(member, index));
  }, [getAllUsers, user?.department]);

  // Load created teams from localStorage
  const [createdTeams, setCreatedTeams] = useState(() => {
    const saved = localStorage.getItem('createdTeams');
    return saved ? JSON.parse(saved) : [];
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen relative overflow-hidden">
      {/* Professional floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-16 h-16 bg-light-blue/20 rounded-full animate-bounce opacity-30"></div>
        <div className="absolute top-40 left-20 w-12 h-12 bg-blue-200/30 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute bottom-40 right-32 w-20 h-20 bg-light-blue/15 rounded-full animate-bounce opacity-30" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-10 w-14 h-14 bg-blue-100/40 rounded-full animate-pulse opacity-30" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-dark-blue to-primary shadow-xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-light-blue">
              <Heart className="h-3 w-3 text-dark-blue" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-dark-blue mb-2">
          Team Management
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Comprehensive team overview and performance tracking
        </p>
      </div>

      {/* Team Overview */}
      <Card className="border-pastel-pink/30 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Team Overview</span>
            </CardTitle>
            {isManager() && (
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <UserPlus className="h-4 w-4 mr-1" />
                Add Member
              </Button>
            )}
          </div>
          <CardDescription>
            Current team performance and status overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="relative p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Status indicator */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      member.status === 'online'
                        ? 'bg-green-400 shadow-lg shadow-green-400/50'
                        : member.status === 'busy'
                        ? 'bg-red-400 shadow-lg shadow-red-400/50'
                        : 'bg-gray-400'
                    }`}
                  />
                </div>

                {/* Avatar and basic info */}
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.bgColor} flex items-center justify-center mx-auto mb-4 shadow-xl text-white font-bold text-xl`}>
                    {member.avatar}
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      member.department === 'Sales' 
                        ? 'border-blue-200 text-blue-700 bg-blue-50' 
                        : 'border-purple-200 text-purple-700 bg-purple-50'
                    }`}
                  >
                    {member.department}
                  </Badge>
                </div>

                {/* Performance metrics */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">Performance</span>
                      <span className="font-bold text-gray-800">{member.performance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          member.performance >= 90 
                            ? 'bg-gradient-to-r from-green-400 to-green-500' 
                            : member.performance >= 80 
                            ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                            : 'bg-gradient-to-r from-orange-400 to-orange-500'
                        }`}
                        style={{ width: `${member.performance}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="font-bold text-blue-800 text-lg">{member.clientsManaged}</p>
                      <p className="text-gray-600">Clients</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="font-bold text-green-800 text-lg">{member.currentTasks}</p>
                      <p className="text-gray-600">Tasks</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">Weekly Target</span>
                      <span className="font-bold">{member.completedTarget}/{member.weeklyTarget}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(member.completedTarget / member.weeklyTarget) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                    <span className="text-gray-500">Last active:</span>
                    <span className="text-gray-700 font-medium">{member.lastActivity}</span>
                  </div>

                  {/* Performance badges */}
                  <div className="flex flex-wrap gap-1 pt-3">
                    {member.performance >= 95 && (
                      <div className="flex items-center space-x-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                        <Award className="h-3 w-3" />
                        <span className="text-xs font-bold">Top Performer</span>
                      </div>
                    )}
                    {member.completedTarget >= member.weeklyTarget && (
                      <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <Target className="h-3 w-3" />
                        <span className="text-xs font-bold">Target Met</span>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Created Teams Section */}
          {createdTeams.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-dark-blue">Project Teams</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {createdTeams.map((team) => (
                  <div
                    key={team.id}
                    className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800 text-sm">{team.name}</h4>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                        {team.activityType}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-gray-600">
                        <strong>Client:</strong> {team.clientName}
                      </div>
                      <div className="text-xs text-gray-600">
                        <strong>Created:</strong> {team.createdDate}
                      </div>
                      <div className="text-xs text-gray-600">
                        <strong>Members ({team.members.length}):</strong>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {team.members.map((member, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-1 bg-white rounded-full text-xs border border-blue-100"
                            >
                              {member}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team summary stats */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-dark-blue">Team Performance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-center mb-3">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-800">{teamMembers.length}</p>
                <p className="text-sm text-gray-600 font-medium">Team Members</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center justify-center mb-3">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-800">
                  {Math.round(teamMembers.reduce((acc, member) => acc + member.performance, 0) / teamMembers.length)}%
                </p>
                <p className="text-sm text-gray-600 font-medium">Avg Performance</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-center justify-center mb-3">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-800">
                  {teamMembers.reduce((acc, member) => acc + member.clientsManaged, 0)}
                </p>
                <p className="text-sm text-gray-600 font-medium">Total Clients</p>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center justify-center mb-3">
                  <CheckCircle className="h-8 w-8 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-orange-800">
                  {teamMembers.reduce((acc, member) => acc + member.currentTasks, 0)}
                </p>
                <p className="text-sm text-gray-600 font-medium">Active Tasks</p>
              </div>
            </div>
          </div>

          {/* Current user highlight */}
          {user && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-dark-blue">Your Profile</h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${user.bgColor || 'from-blue-500 to-blue-600'} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800">{user.name}</h4>
                    <p className="text-blue-600 font-medium">{user.role}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={`${
                        user.department === 'Sales' 
                          ? 'bg-blue-100 text-blue-700 border-blue-200' 
                          : 'bg-purple-100 text-purple-700 border-purple-200'
                      }`}>
                        {user.department}
                      </Badge>
                      {isManager() && (
                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                          <Shield className="h-3 w-3 mr-1" />
                          Manager
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
