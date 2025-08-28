import { useState } from "react";
import { TEAM_MEMBERS } from "@/constants/teamMembers";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Eye,
  EyeOff,
  Heart,
  Lock,
  Mail,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  User,
  Building,
  Shield,
} from "lucide-react";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Existing team members (read-only display)
  const existingTeamMembers = TEAM_MEMBERS;

  const roles = [
    "Senior Sales Manager",
    "Sales Representative",
    "Sales Associate",
    "Junior Sales",
    "Support Specialist",
    "Senior Support",
    "Support Associate",
    "Team Lead",
    "Manager",
    "Director",
  ];

  const departments = [
    "Sales",
    "Support",
    "Marketing",
    "Operations",
    "Management",
    "IT",
    "Finance",
    "HR",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return "Please fill in all required fields";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters long";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // Use AuthContext signup function
      const result = await signup(formData);

      if (result.success) {
        setSuccess("Account created successfully! You can now sign in.");

        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
          department: "",
        });

        // Auto-redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        "An error occurred while creating your account. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generateAvatar = (name) => {
    const nameParts = name.trim().split(" ");
    return nameParts.length >= 2
      ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
      : nameParts[0][0] + (nameParts[0][1] || "");
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

      <div className="w-full max-w-5xl z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Signup Form */}
          <div>
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-dark-blue to-primary shadow-xl">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-light-blue">
                    <TrendingUp className="h-3 w-3 text-dark-blue" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-dark-blue mb-2">
                Join 4S System
              </h1>
              <p className="text-gray-600">
                Create your account to get started
              </p>
            </div>

            {/* Signup Form */}
            <Card className="shadow-2xl border-blue-200/50 bg-white/95 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center text-dark-blue">
                  Create Account
                </CardTitle>
                <CardDescription className="text-center">
                  Fill in your details to join the team
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

                  {success && (
                    <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">{success}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 border-blue-200 focus:border-blue-600"
                        required
                      />
                    </div>
                    {formData.name && (
                      <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                        <div className="w-6 h-6 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold text-xs">
                          {generateAvatar(formData.name)}
                        </div>
                        <span>
                          Your avatar will be:{" "}
                          {generateAvatar(formData.name).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email *
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-medium">
                        Role
                      </Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) =>
                          handleSelectChange("role", value)
                        }
                      >
                        <SelectTrigger className="border-blue-200 focus:border-blue-600">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="department"
                        className="text-sm font-medium"
                      >
                        Department
                      </Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) =>
                          handleSelectChange("department", value)
                        }
                      >
                        <SelectTrigger className="border-blue-200 focus:border-blue-600">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium"
                    >
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 border-blue-200 focus:border-blue-600"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
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
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Existing Team Members */}
          <div>
            <Card className="shadow-2xl border-blue-200/50 bg-white/95 backdrop-blur-sm h-fit">
              <CardHeader>
                <CardTitle className="text-xl text-center text-dark-blue flex items-center justify-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Current Team Members</span>
                </CardTitle>
                <CardDescription className="text-center">
                  These accounts already exist in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {existingTeamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-blue-200 bg-blue-50/50"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${member.bgColor} flex items-center justify-center text-white font-bold shadow-lg`}
                        >
                          {member.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {member.name}
                          </h3>
                          <p className="text-sm text-blue-600 font-medium">
                            {member.role}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member.email}
                          </p>
                          <div className="mt-1">
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                member.department === "Sales"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {member.department}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">Note:</p>
                      <p>
                        These team members already have accounts. If you're one
                        of them, please use the login page instead.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
