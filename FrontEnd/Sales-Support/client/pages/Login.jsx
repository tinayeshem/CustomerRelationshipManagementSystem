import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Heart,
  Lock,
  Mail,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      },
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simple validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Use the AuthContext login function
    try {
      const result = await onLogin(formData.email, formData.password);
      if (!result.success) {
        setError(result.error);
      }
      // If successful, the AuthContext will handle the redirect
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (email) => {
    const account = predefinedAccounts[email];
    setFormData({
      email: email,
      password: account.password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
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

      <div className="w-full max-w-md z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-dark-blue to-primary shadow-xl">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 rounded-full bg-light-blue">
                <TrendingUp className="h-4 w-4 text-dark-blue" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-dark-blue mb-2">
            Welcome to 4S System
          </h1>
          <p className="text-lg text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-2xl border-blue-200/50 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-dark-blue">
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 border-blue-200 focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 border-blue-200 focus:border-blue-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-dark-blue hover:bg-dark-blue-hover text-white py-2 h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="mt-6 shadow-lg border-blue-200/50 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-center text-dark-blue">
              Demo Accounts
            </CardTitle>
            <CardDescription className="text-center text-sm">
              Click on any team member to auto-fill their credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(predefinedAccounts).map(([email, account]) => (
                <button
                  key={email}
                  onClick={() => handleDemoLogin(email)}
                  className="p-3 text-left rounded-lg border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${account.user.bgColor} flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {account.user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {account.user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {account.user.role}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 4S System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
