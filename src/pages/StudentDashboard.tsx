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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StudentHealthChatbot from "@/components/StudentHealthChatbot";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/login/student");
  };

  const studentData = {
    name: "Ravi Kumar",
    healthId: "KR12345678",
    school: "ZPHS Anantapur",
    class: "Class 8 - Section A",
    dob: "15 March 2010",
    age: 13,
  };

  const latestVitals = {
    bloodGroup: "B+",
    heartRate: "78 bpm",
    bloodPressure: "110/70 mmHg",
    temperature: "98.4°F",
    hemoglobin: "13.2 g/dL",
    visionLeft: "6/6",
    visionRight: "6/6",
    weight: "42 kg",
    height: "152 cm",
    bmi: "18.2",
    lastCheckup: "15 Jan 2026",
  };

  const medicalConditions = [
    { condition: "Allergies", status: "Mild dust allergy", type: "warning" },
  ];

  const checkupHistory = [
    { date: "15 Jan 2026", type: "Quarterly Checkup", status: "Completed", notes: "All vitals normal" },
    { date: "15 Oct 2025", type: "Quarterly Checkup", status: "Completed", notes: "Slight vitamin D deficiency noted" },
    { date: "15 Jul 2025", type: "Quarterly Checkup", status: "Completed", notes: "All vitals normal" },
    { date: "15 Apr 2025", type: "Annual Health Screening", status: "Completed", notes: "Vision test - perfect" },
  ];

  const nutritionAdvice = [
    "Eat more green leafy vegetables for iron",
    "Include milk and dairy products for calcium",
    "Drink at least 8 glasses of water daily",
    "Eat fruits rich in Vitamin C",
  ];

  const vitalCards = [
    { label: "Blood Group", value: latestVitals.bloodGroup, icon: Droplet, color: "text-red-500" },
    { label: "Heart Rate", value: latestVitals.heartRate, icon: Heart, color: "text-red-500" },
    { label: "Blood Pressure", value: latestVitals.bloodPressure, icon: Activity, color: "text-health-teal" },
    { label: "Temperature", value: latestVitals.temperature, icon: Thermometer, color: "text-orange-500" },
    { label: "Hemoglobin", value: latestVitals.hemoglobin, icon: Droplet, color: "text-red-400" },
    { label: "Vision (L/R)", value: `${latestVitals.visionLeft} / ${latestVitals.visionRight}`, icon: Eye, color: "text-blue-500" },
    { label: "Weight", value: latestVitals.weight, icon: Weight, color: "text-health-blue" },
    { label: "Height", value: latestVitals.height, icon: Ruler, color: "text-health-green" },
  ];

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
                  Last Checkup: {latestVitals.lastCheckup}
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
            <Card variant="health" className="flex-1">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">BMI (Body Mass Index)</p>
                    <p className="text-2xl font-bold text-foreground">{latestVitals.bmi}</p>
                  </div>
                  <Badge className="bg-health-green/10 text-health-green">Normal</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Medical Conditions */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-health-orange" />
                Medical Conditions
              </CardTitle>
              <CardDescription>Known health conditions and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              {medicalConditions.length > 0 ? (
                <div className="space-y-3">
                  {medicalConditions.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-foreground">{item.condition}</p>
                        <p className="text-sm text-muted-foreground">{item.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-foreground">No known medical conditions</p>
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
            <div className="space-y-4">
              {checkupHistory.map((checkup, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-health-teal/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-health-teal" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{checkup.type}</p>
                      <p className="text-sm text-muted-foreground">{checkup.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">{checkup.status}</Badge>
                    <p className="text-sm text-muted-foreground">{checkup.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Note:</strong> This data is read-only. For any corrections or updates, please contact your Primary Health Center (PHC).
          </p>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
