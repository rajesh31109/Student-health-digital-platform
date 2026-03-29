import { 
  Heart, 
  User, 
  LogOut,
  Activity,
  Eye,
  Droplet,
  Weight,
  Ruler,
  Thermometer,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Apple,
  Pill
} from "lucide-react";
import { useEffect, useState } from "react";
import { getApiBaseUrl } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StudentHealthChatbot from "@/components/StudentHealthChatbot";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface HealthRecord {
  date: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  height: string;
  bloodGroup: string;
  hemoglobin: string;
  visionLeft: string;
  visionRight: string;
  notes: string;
}

interface StudentData {
  healthId: string;
  name: string;
  school: string;
  class: string;
  dob: string;
  age: number;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [latestVitals, setLatestVitals] = useState<HealthRecord | null>(null);
  const [checkupHistory, setCheckupHistory] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const healthId = localStorage.getItem("healthId");
      const userName = localStorage.getItem("userName");

      if (!token) {
        toast.error("Not authenticated. Please login again.");
        navigate("/login/student");
        return;
      }

      // Fetch health records from backend
      const response = await fetch(`${getApiBaseUrl()}/student/health-records`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch health records");
      }

      const data = await response.json();

      if (data.success && data.data) {
        const records = data.data;
        
        // Set student data
        setStudentData({
          healthId: healthId || "TG-01-1968-0001",
          name: userName || "Student",
          school: records[0]?.school || "PHC School",
          class: records[0]?.class || "Class 10",
          dob: records[0]?.dob || "15 March 2010",
          age: records[0]?.age || 14
        });

        // Set latest vitals
        if (records.length > 0) {
          setLatestVitals(records[0]);
        }

        // Set checkup history
        setCheckupHistory(records);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to load health records. Using demo data.");
      
      // Fallback to demo data
      setStudentData({
        healthId: localStorage.getItem("healthId") || "TG-01-1968-0001",
        name: localStorage.getItem("userName") || "Student User",
        school: "ZPHS Anantapur",
        class: "Class 10",
        dob: "15 March 2010",
        age: 14
      });

      setLatestVitals({
        date: new Date().toISOString().split('T')[0],
        bloodPressure: "110/70 mmHg",
        heartRate: "78 bpm",
        temperature: "98.4°F",
        weight: "42 kg",
        height: "152 cm",
        bloodGroup: "B+",
        hemoglobin: "13.2 g/dL",
        visionLeft: "6/6",
        visionRight: "6/6",
        notes: "All vitals normal"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("healthId");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/login/student");
  };

  const vitalCards = latestVitals ? [
    { label: "Blood Group", value: latestVitals.bloodGroup, icon: Droplet, color: "text-red-500" },
    { label: "Heart Rate", value: latestVitals.heartRate, icon: Heart, color: "text-red-500" },
    { label: "Blood Pressure", value: latestVitals.bloodPressure, icon: Activity, color: "text-health-teal" },
    { label: "Temperature", value: latestVitals.temperature, icon: Thermometer, color: "text-orange-500" },
    { label: "Hemoglobin", value: latestVitals.hemoglobin, icon: Droplet, color: "text-red-400" },
    { label: "Vision (L/R)", value: `${latestVitals.visionLeft} / ${latestVitals.visionRight}`, icon: Eye, color: "text-blue-500" },
    { label: "Weight", value: latestVitals.weight, icon: Weight, color: "text-health-blue" },
    { label: "Height", value: latestVitals.height, icon: Ruler, color: "text-health-green" },
  ] : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin">
                <Heart className="w-8 h-8 text-health-blue mx-auto mb-4" />
              </div>
              <p className="text-muted-foreground">Loading your health records...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card variant="elevated">
          <CardContent className="pt-6">
            <p className="text-foreground text-center">Unable to load student data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-display font-bold text-foreground">
                Student Digital health Profile
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{studentData.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 container mx-auto px-4">
        {/* Student Info Card */}
        <Card variant="elevated" className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-health-blue/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-health-blue" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{studentData.name}</h1>
                  <p className="text-muted-foreground">{studentData.school} • {studentData.class}</p>
                  <p className="text-sm text-muted-foreground">DOB: {studentData.dob} • Age: {studentData.age} years</p>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <Badge variant="outline" className="text-lg font-mono px-4 py-2">
                  Health ID: {studentData.healthId}
                </Badge>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Last Checkup: {latestVitals?.date || "Not available"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vitals Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-health-teal" />
            Latest Health Vitals
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vitalCards.map((vital, index) => (
              <Card key={index} variant="health">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <vital.icon className={`w-8 h-8 ${vital.color} mb-2`} />
                    <p className="text-sm text-muted-foreground">{vital.label}</p>
                    <p className="text-xl font-bold text-foreground">{vital.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 flex gap-4">
            {latestVitals && (
              <Card variant="health" className="flex-1">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Height • Weight</p>
                      <p className="text-lg font-bold text-foreground">{latestVitals.height} • {latestVitals.weight}</p>
                    </div>
                    <Badge className="bg-health-green/10 text-health-green">Recorded</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Medical Conditions */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-health-orange" />
                Health Status
              </CardTitle>
              <CardDescription>Current health Assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-foreground">All systems normal</p>
                  <p className="text-sm text-muted-foreground">Last assessed: {latestVitals?.date || "Recently"}</p>
                </div>
              </div>
              {error && (
                <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Health Assistant Chatbot */}
          <StudentHealthChatbot />
        </div>

        {/* Checkup History */}
        <Card variant="elevated" className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-health-blue" />
              Checkup History
            </CardTitle>
            <CardDescription>Record of all health checkups</CardDescription>
          </CardHeader>
          <CardContent>
            {checkupHistory.length > 0 ? (
              <div className="space-y-4">
                {checkupHistory.map((checkup, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-health-teal/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-health-teal" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Health Checkup</p>
                        <p className="text-sm text-muted-foreground">{checkup.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">Completed</Badge>
                      <p className="text-sm text-muted-foreground">{checkup.notes || "Vitals recorded"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No checkup records available yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Note:</strong> This data is read-only and synced with your Primary Health Center (PHC) records.
          </p>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
