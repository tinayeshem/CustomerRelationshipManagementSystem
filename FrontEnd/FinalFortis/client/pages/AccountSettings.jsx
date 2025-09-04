import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, CheckCircle, Trash2, Shield, User as UserIcon, LogOut } from "lucide-react";

export default function AccountSettings() {
  const { user, deleteAccount, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onDelete = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsDeleting(true);
    const res = await deleteAccount({ confirmText, password });
    setIsDeleting(false);
    if (!res.success) {
      setError(res.error || "Failed to delete account");
      return;
    }
    setSuccess("Account deleted. Redirecting to login...");
    // redirection is handled by logout state in context; UI will swap to PublicApp
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <Card className="border-blue-200/50 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-dark-blue">
              <UserIcon className="h-5 w-5" />
              <span>Account Settings</span>
            </CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 rounded-lg border border-blue-200 bg-blue-50/60">
              <p className="text-sm text-gray-700"><span className="font-medium">Signed in as:</span> {user?.name} ({user?.email})</p>
              <p className="text-xs text-gray-500 mt-1">Role: {user?.role} · Department: {user?.department}</p>
            </div>

            <div className="mb-8">
              <Button
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 h-11"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>

            <div className="p-4 rounded-lg border border-red-200 bg-red-50/60">
              <h3 className="font-semibold text-red-700 flex items-center"><Trash2 className="h-4 w-4 mr-2"/> Delete Account</h3>
              <p className="text-sm text-red-700 mt-1">This action is permanent. Your account will be deleted everywhere and you will be signed out immediately.</p>

              {error && (
                <div className="mt-3 flex items-center space-x-2 p-2 bg-red-100 border border-red-200 rounded">
                  <AlertCircle className="h-4 w-4 text-red-700" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {success && (
                <div className="mt-3 flex items-center space-x-2 p-2 bg-green-100 border border-green-200 rounded">
                  <CheckCircle className="h-4 w-4 text-green-700" />
                  <span className="text-sm text-green-700">{success}</span>
                </div>
              )}

              <form onSubmit={onDelete} className="mt-4 space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="confirm" className="text-sm font-medium">Type DELETE to confirm</Label>
                  <Input id="confirm" value={confirmText} onChange={(e)=>setConfirmText(e.target.value)} placeholder="DELETE" className="border-red-200 focus:border-red-400"/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-sm font-medium">Enter your current password</Label>
                  <Input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Current password" className="border-red-200 focus:border-red-400"/>
                </div>
                <Button type="submit" disabled={isDeleting || confirmText !== "DELETE" || !password} className="bg-red-600 hover:bg-red-700 text-white w-full h-11">
                  {isDeleting ? "Deleting..." : "Permanently Delete Account"}
                </Button>
                <p className="text-xs text-gray-600 flex items-center"><Shield className="h-3 w-3 mr-1"/> For demo users, deletion blocks future login to this demo account.</p>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
