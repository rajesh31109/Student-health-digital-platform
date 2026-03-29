import { useState } from "react";
import { GraduationCap, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getApiBaseUrl } from "@/config/api";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [healthId, setHealthId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (healthId.length === 0) {
      toast.error("Please enter your Health ID");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/student-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ healthId: healthId.toUpperCase() })
      });

      const data = await response.json();

      if (data.success) {
        // Store authentication data
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("healthId", data.data.healthId);
        localStorage.setItem("userName", data.data.name);
        localStorage.setItem("role", "student");

        toast.success(`Welcome, ${data.data.name}!`);
        navigate("/dashboard/student");
      } else {
        toast.error(data.message || "Invalid Health ID");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
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
                <div className="w-16 h-16 rounded-2xl bg-health-blue/10 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-health-blue" />
                </div>
                <CardTitle className="text-2xl">Student Login</CardTitle>
                <CardDescription>
                  View your personal health records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Student Health ID</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter your Health ID number"
                        value={healthId}
                        onChange={(e) => setHealthId(e.target.value.toUpperCase())}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter your Health ID that was provided during registration
                    </p>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "View My Health Records"}
                  </Button>
                </form>

                <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Note:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• You can only view your own health data</li>
                    <li>• Data cannot be modified or deleted</li>
                    <li>• Contact your PHC for any corrections</li>
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

export default StudentLogin;
