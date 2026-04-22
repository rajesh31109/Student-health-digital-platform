import { useState } from "react";
import { Building2, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getApiBaseUrl } from "@/config/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = getApiBaseUrl();
      console.log("Connecting to backend:", apiUrl);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${apiUrl}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Store authentication data
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("adminId", data.data.adminId);
        localStorage.setItem("userName", data.data.name);
        localStorage.setItem("userEmail", data.data.email);
        localStorage.setItem("role", "admin");

        toast.success(`Welcome, ${data.data.name}!`);
        navigate("/dashboard/admin");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.name === "AbortError") {
        toast.error("Request timeout - backend is not responding. Check /debug");
      } else {
        toast.error(`Login failed: ${error.message}. Check /debug for details.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 gradient-hero min-h-screen">
        <div className="container mx-auto px-4">
          <Link to="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to login options
          </Link>

          <div className="max-w-md mx-auto">
            <Card variant="elevated" className="animate-fade-up">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-health-green/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-health-green" />
                </div>
                <CardTitle className="text-2xl">Admin Login</CardTitle>
                <CardDescription>
                  DMHO & Authorized Team Members Only
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login to Dashboard"}
                  </Button>
                </form>

                <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Admin Access Includes:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• View student data by district/mandal/school</li>
                    <li>• Monitor health trends and statistics</li>
                    <li>• Generate reports for analysis</li>
                    <li>• Read-only access to all records</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
