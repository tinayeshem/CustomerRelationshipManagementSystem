// Centralized team member data for consistency across the application
export const TEAM_MEMBER_NAMES = [
  "Ana Marić",
  "Marko Petrović", 
  "Petra Babić",
  "Luka Novak",
  "Sofia Antić"
];

// Team member data with extended information
export const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Ana Marić",
    email: "ana.maric@4ssystem.hr",
    role: "Senior Sales Manager",
    department: "Sales",
    avatar: "AM",
    bgColor: "from-blue-500 to-blue-600",
    isManager: true,
    isKAM: true,
  },
  {
    id: 2,
    name: "Marko Petrović",
    email: "marko.petrovic@4ssystem.hr", 
    role: "Sales Representative",
    department: "Sales",
    avatar: "MP",
    bgColor: "from-green-500 to-green-600",
    isManager: false,
    isKAM: true,
  },
  {
    id: 3,
    name: "Petra Babić",
    email: "petra.babic@4ssystem.hr",
    role: "Support Specialist", 
    department: "Support",
    avatar: "PB",
    bgColor: "from-purple-500 to-purple-600",
    isManager: false,
    isKAM: true,
  },
  {
    id: 4,
    name: "Luka Novak",
    email: "luka.novak@4ssystem.hr",
    role: "Junior Sales",
    department: "Sales", 
    avatar: "LN",
    bgColor: "from-orange-500 to-orange-600",
    isManager: false,
    isKAM: true,
  },
  {
    id: 5,
    name: "Sofia Antić",
    email: "sofia.antic@4ssystem.hr",
    role: "Support Specialist",
    department: "Support",
    avatar: "SA", 
    bgColor: "from-pink-500 to-pink-600",
    isManager: false,
    isKAM: true,
  }
];

// Helper functions
export const getTeamMemberByName = (name) => {
  return TEAM_MEMBERS.find(member => member.name === name);
};

export const getTeamMembersByDepartment = (department) => {
  return TEAM_MEMBERS.filter(member => member.department === department);
};

export const getKAMMembers = () => {
  return TEAM_MEMBERS.filter(member => member.isKAM);
};

export const getKAMNames = () => {
  return getKAMMembers().map(member => member.name);
};
