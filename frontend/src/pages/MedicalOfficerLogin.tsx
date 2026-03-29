import { useState } from "react";
import { Stethoscope, Phone, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getApiBaseUrl } from "@/config/api";

const MedicalOfficerLogin = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      setOtpSent(true);
      toast.info("OTP feature coming soon. Please use Email+Password tab.");
    }
  };

  const handleOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("OTP login feature coming soon. Please use Email+Password tab.");
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/mo-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Store authentication data
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("moId", data.data.moId);
        localStorage.setItem("userName", data.data.name);
        localStorage.setItem("userEmail", data.data.email);
        localStorage.setItem("role", "medical_officer");

        toast.success(`Welcome, ${data.data.name}!`);
        navigate("/medical-officer-dashboard");
      } else {
        toast.error(data.message || "Invalid credentials");
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
                <div className="w-16 h-16 rounded-2xl bg-health-teal/10 flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-8 h-8 text-health-teal" />
                </div>
                <CardTitle className="text-2xl">Medical Officer Login</CardTitle>
                <CardDescription>
                  Access the health data entry portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="otp" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="otp">Mobile + OTP</TabsTrigger>
                    <TabsTrigger value="password">Username</TabsTrigger>
                  </TabsList>

                  <TabsContent value="otp">
                    {!otpSent ? (
                      <form onSubmit={handleSendOtp} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Mobile Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              type="tel"
                              placeholder="Enter 10-digit mobile number"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full" size="lg">
                          Send OTP
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleOtpLogin} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Enter OTP</label>
                          <Input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            required
                          />
                          <p className="text-sm text-muted-foreground">
                            OTP sent to +91 {phone}
                          </p>
                        </div>
                        <Button type="submit" className="w-full" size="lg">
                          Verify & Login
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full"
                          onClick={() => setOtpSent(false)}
                        >
                          Change Mobile Number
                        </Button>
                      </form>
                    )}
                  </TabsContent>

                  <TabsContent value="password">
                    <form onSubmit={handlePasswordLogin} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isLoading}
                        />
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
                        {isLoading ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MedicalOfficerLogin;
