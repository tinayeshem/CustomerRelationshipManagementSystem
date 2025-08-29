import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Pre-defined accounts for existing team members
  const predefinedAccounts = {
    "ana.maric@4ssystem.hr": {
      password: "AnaMaric2024!",
      user: {
        id: 1,
        name: "Ana Marić",
        email: "ana.maric@4ssystem.hr",
        role: "Senior Sales Manager",
        department: "Sales",
        avatar: "AM",
        bgColor: "from-blue-500 to-blue-600",
        permissions: [
          "dashboard",
          "clients",
          "activities",
          "reports",
          "team-management",
          "sales",
        ],
        isManager: true,
      },
    },
    "marko.petrovic@4ssystem.hr": {
      password: "MarkoPetrovic2024!",
      user: {
        id: 2,
        name: "Marko Petrović",
        email: "marko.petrovic@4ssystem.hr",
        role: "Sales Representative",
        department: "Sales",
        avatar: "MP",
        bgColor: "from-green-500 to-green-600",
        permissions: ["dashboard", "clients", "activities", "reports", "sales"],
        isManager: false,
      },
    },
    "petra.babic@4ssystem.hr": {
      password: "PetraBabic2024!",
      user: {
        id: 3,
        name: "Petra Babić",
        email: "petra.babic@4ssystem.hr",
        role: "Support Specialist",
        department: "Support",
        avatar: "PB",
        bgColor: "from-purple-500 to-purple-600",
        permissions: ["dashboard", "activities", "notifications", "support", "reports"],
        isManager: false,
      },
    },
    "luka.novak@4ssystem.hr": {
      password: "LukaNovak2024!",
      user: {
        id: 4,
        name: "Luka Novak",
        email: "luka.novak@4ssystem.hr",
        role: "Junior Sales",
        department: "Sales",
        avatar: "LN",
        bgColor: "from-orange-500 to-orange-600",
        permissions: ["dashboard", "clients", "activities"],
        isManager: false,
      },
    },
    "sofia.antic@4ssystem.hr": {
      password: "SofiaAntic2024!",
      user: {
        id: 5,
        name: "Sofia Antić",
        email: "sofia.antic@4ssystem.hr",
        role: "Support Specialist",
        department: "Support",
        avatar: "SA",
        bgColor: "from-pink-500 to-pink-600",
        permissions: ["dashboard", "activities", "notifications", "support", "reports"],
        isManager: false,
      },
    },
  };

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("4s_token");
        const userData = localStorage.getItem("4s_user");

        if (token === "authenticated" && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Clear invalid data
        localStorage.removeItem("4s_token");
        localStorage.removeItem("4s_user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);

      // Validate input parameters
      if (
        !email ||
        !password ||
        typeof email !== "string" ||
        typeof password !== "string"
      ) {
        return { success: false, error: "Email and password are required" };
      }

      // Check predefined accounts first
      const predefinedAccount = predefinedAccounts[email.toLowerCase()];
      if (predefinedAccount && predefinedAccount.password === password) {
        // Store user data
        localStorage.setItem("4s_user", JSON.stringify(predefinedAccount.user));
        localStorage.setItem("4s_token", "authenticated");
        setUser(predefinedAccount.user);
        setIsAuthenticated(true);
        return { success: true, user: predefinedAccount.user };
      }

      // Check custom created accounts
      const customUsers = JSON.parse(localStorage.getItem("4s_users") || "[]");
      const customAccount = customUsers.find(
        (account) =>
          account.email &&
          account.email.toLowerCase() === email.toLowerCase() &&
          account.password === password,
      );

      if (customAccount) {
        localStorage.setItem("4s_user", JSON.stringify(customAccount.user));
        localStorage.setItem("4s_token", "authenticated");
        setUser(customAccount.user);
        setIsAuthenticated(true);
        return { success: true, user: customAccount.user };
      }

      return { success: false, error: "Invalid email or password" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An error occurred during login" };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setIsLoading(true);

      // Validate input data
      if (
        !userData ||
        !userData.email ||
        !userData.password ||
        !userData.name
      ) {
        return {
          success: false,
          error: "Name, email, and password are required",
        };
      }

      if (
        typeof userData.email !== "string" ||
        typeof userData.password !== "string" ||
        typeof userData.name !== "string"
      ) {
        return { success: false, error: "Invalid input data format" };
      }

      // Check if email already exists in predefined accounts
      if (predefinedAccounts[userData.email.toLowerCase()]) {
        return {
          success: false,
          error: "This email is already registered by an existing team member",
        };
      }

      // Check if email already exists in custom accounts
      const customUsers = JSON.parse(localStorage.getItem("4s_users") || "[]");
      const emailExists = customUsers.some(
        (account) =>
          account.email &&
          account.email.toLowerCase() === userData.email.toLowerCase(),
      );

      if (emailExists) {
        return { success: false, error: "This email is already registered" };
      }

      // Generate initials for avatar
      const nameParts = userData.name.trim().split(" ");
      const initials =
        nameParts.length >= 2
          ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
          : nameParts[0][0] + (nameParts[0][1] || "");

      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role || "Team Member",
        department: userData.department || "General",
        avatar: initials.toUpperCase(),
        bgColor: "from-gray-500 to-gray-600",
        permissions: ["dashboard", "activities"], // Basic permissions for new users
        isManager: false,
      };

      // Store new user
      const newAccount = {
        email: userData.email.toLowerCase(),
        password: userData.password,
        user: newUser,
      };

      customUsers.push(newAccount);
      localStorage.setItem("4s_users", JSON.stringify(customUsers));

      return { success: true, user: newUser };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: "An error occurred during signup" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("4s_token");
    localStorage.removeItem("4s_user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    localStorage.setItem("4s_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.department === 'Support' && permission === 'reports') return true;
    return Array.isArray(user.permissions) && user.permissions.includes(permission);
  };

  const isManager = () => {
    return user?.isManager === true;
  };

  const getAllUsers = () => {
    // Get predefined users
    const predefinedUsers = Object.values(predefinedAccounts).map(
      (account) => account.user,
    );

    // Get custom users
    const customUsers = JSON.parse(
      localStorage.getItem("4s_users") || "[]",
    ).map((account) => account.user);

    return [...predefinedUsers, ...customUsers];
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    hasPermission,
    isManager,
    getAllUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
