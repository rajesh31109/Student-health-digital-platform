import { useState, useEffect } from "react";
import { getApiBaseUrl } from "@/config/api";
import { 
  Heart, 
  Search, 
  Plus, 
  Users, 
  FileText, 
  Calendar,
  LogOut,
  User,
  ClipboardList,
  Activity,
  Thermometer,
  Eye,
  Droplet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const MedicalOfficerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("register");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState([
    { label: "Students Registered", value: "0", icon: Users, color: "text-health-teal" },
    { label: "Checkups Today", value: "0", icon: ClipboardList, color: "text-health-blue" },
    { label: "Pending Checkups", value: "0", icon: Calendar, color: "text-health-orange" },
    { label: "Reports Generated", value: "0", icon: FileText, color: "text-health-green" },
  ]);
  
  // Registration form state
  const [studentForm, setStudentForm] = useState({
    name: "",
    dob: "",
    gender: "",
    school: "",
    class: "",
    section: "",
    fatherName: "",
    motherName: "",
    address: "",
    district: "",
    mandal: "",
    village: "",
    phc: "",
  });

  // Health data form state
  const [healthForm, setHealthForm] = useState({
    studentId: "",
    bloodGroup: "",
    heartRate: "",
    bloodPressure: "",
    temperature: "",
    hemoglobin: "",
    visionLeft: "",
    visionRight: "",
    weight: "",
    height: "",
    // Medical conditions
    diabetes: false,
    asthma: false,
    allergies: false,
    epilepsy: false,
    heartCondition: false,
    skinDisease: false,
    dentalIssues: false,
    hearingIssues: false,
    otherConditions: "",
    remarks: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Not authenticated. Please login again.");
        navigate("/login/medical-officer");
        return;
      }

      // Fetch MO statistics
      const response = await fetch(`${getApiBaseUrl()}/mo/statistics`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const stats_data = data.data;
          setStats([
            { label: "Students Registered", value: stats_data.totalStudents || "0", icon: Users, color: "text-health-teal" },
            { label: "Checkups Today", value: stats_data.checkupsToday || "0", icon: ClipboardList, color: "text-health-blue" },
            { label: "Pending Checkups", value: stats_data.pendingCheckups || "0", icon: Calendar, color: "text-health-orange" },
            { label: "Reports Generated", value: stats_data.reportsGenerated || "0", icon: FileText, color: "text-health-green" },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Could not load statistics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    toast.success("Logged out successfully");
    navigate("/login/medical-officer");
  };

  const handleStudentRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const response = await fetch(`${getApiBaseUrl()}/mo/students/register`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(studentForm)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Student registered! Health ID: ${data.data.healthId}`);
        setStudentForm({
          name: "", dob: "", gender: "", school: "", class: "", section: "",
          fatherName: "", motherName: "", address: "", district: "", mandal: "",
          village: "", phc: "",
        });
        fetchDashboardData(); // Refresh stats
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register student");
    }
  };

  const handleHealthDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const response = await fetch(`${getApiBaseUrl()}/mo/health-records`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(healthForm)
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Health data recorded successfully!");
        setHealthForm({
          studentId: "", bloodGroup: "", heartRate: "", bloodPressure: "",
          temperature: "", hemoglobin: "", visionLeft: "", visionRight: "",
          weight: "", height: "", diabetes: false, asthma: false, allergies: false,
          epilepsy: false, heartCondition: false, skinDisease: false,
          dentalIssues: false, hearingIssues: false, otherConditions: "", remarks: "",
        });
        fetchDashboardData(); // Refresh stats
      } else {
        toast.error(data.message || "Recording failed");
      }
    } catch (error) {
      console.error("Health data error:", error);
      toast.error("Failed to record health data");
    }
  };

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
                Student digital health profile
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Medical Officer</span>
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} variant="health">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid mb-6">
            <TabsTrigger value="register" className="gap-2">
              <Plus className="w-4 h-4" />
              Register Student
            </TabsTrigger>
            <TabsTrigger value="health" className="gap-2">
              <Activity className="w-4 h-4" />
              Health Entry
            </TabsTrigger>
            <TabsTrigger value="search" className="gap-2">
              <Search className="w-4 h-4" />
              Search Records
            </TabsTrigger>
          </TabsList>

          {/* Student Registration Tab */}
          <TabsContent value="register">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Student Registration</CardTitle>
                <CardDescription>Register a new student in the health profile system</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStudentRegistration} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Student Name *</Label>
                      <Input
                        value={studentForm.name}
                        onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                        placeholder="Full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth *</Label>
                      <Input
                        type="date"
                        value={studentForm.dob}
                        onChange={(e) => setStudentForm({ ...studentForm, dob: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender *</Label>
                      <Select value={studentForm.gender} onValueChange={(v) => setStudentForm({ ...studentForm, gender: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>School Name *</Label>
                      <Input
                        value={studentForm.school}
                        onChange={(e) => setStudentForm({ ...studentForm, school: e.target.value })}
                        placeholder="School name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Class *</Label>
                      <Select value={studentForm.class} onValueChange={(v) => setStudentForm({ ...studentForm, class: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(12)].map((_, i) => (
                            <SelectItem key={i + 1} value={`${i + 1}`}>Class {i + 1}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Input
                        value={studentForm.section}
                        onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value })}
                        placeholder="A, B, C..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Father's Name *</Label>
                      <Input
                        value={studentForm.fatherName}
                        onChange={(e) => setStudentForm({ ...studentForm, fatherName: e.target.value })}
                        placeholder="Father's name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mother's Name *</Label>
                      <Input
                        value={studentForm.motherName}
                        onChange={(e) => setStudentForm({ ...studentForm, motherName: e.target.value })}
                        placeholder="Mother's name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        value={studentForm.address}
                        onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                        placeholder="Full address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>District *</Label>
                      <Input
                        value={studentForm.district}
                        onChange={(e) => setStudentForm({ ...studentForm, district: e.target.value })}
                        placeholder="District name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mandal *</Label>
                      <Input
                        value={studentForm.mandal}
                        onChange={(e) => setStudentForm({ ...studentForm, mandal: e.target.value })}
                        placeholder="Mandal name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Village</Label>
                      <Input
                        value={studentForm.village}
                        onChange={(e) => setStudentForm({ ...studentForm, village: e.target.value })}
                        placeholder="Village name"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2 lg:col-span-1">
                      <Label>Primary Health Center (PHC) *</Label>
                      <Input
                        value={studentForm.phc}
                        onChange={(e) => setStudentForm({ ...studentForm, phc: e.target.value })}
                        placeholder="PHC name"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Register Student
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Data Entry Tab */}
          <TabsContent value="health">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Health Data Entry</CardTitle>
                <CardDescription>Record health checkup data for a student</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHealthDataSubmit} className="space-y-8">
                  {/* Student Selection */}
                  <div className="space-y-2">
                    <Label>Student Health ID *</Label>
                    <Input
                      value={healthForm.studentId}
                      onChange={(e) => setHealthForm({ ...healthForm, studentId: e.target.value })}
                      placeholder="Enter Student Health ID"
                      required
                    />
                  </div>

                  {/* Vital Signs */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Activity className="w-5 h-5 text-health-teal" />
                      Vital Signs
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Droplet className="w-4 h-4 text-red-500" />
                          Blood Group
                        </Label>
                        <Select value={healthForm.bloodGroup} onValueChange={(v) => setHealthForm({ ...healthForm, bloodGroup: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                              <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          Heart Rate (bpm)
                        </Label>
                        <Input
                          type="number"
                          value={healthForm.heartRate}
                          onChange={(e) => setHealthForm({ ...healthForm, heartRate: e.target.value })}
                          placeholder="72"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Blood Pressure (mmHg)</Label>
                        <Input
                          value={healthForm.bloodPressure}
                          onChange={(e) => setHealthForm({ ...healthForm, bloodPressure: e.target.value })}
                          placeholder="120/80"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-orange-500" />
                          Temperature (°F)
                        </Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={healthForm.temperature}
                          onChange={(e) => setHealthForm({ ...healthForm, temperature: e.target.value })}
                          placeholder="98.6"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hemoglobin (g/dL)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={healthForm.hemoglobin}
                          onChange={(e) => setHealthForm({ ...healthForm, hemoglobin: e.target.value })}
                          placeholder="12.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-500" />
                          Vision Left Eye
                        </Label>
                        <Input
                          value={healthForm.visionLeft}
                          onChange={(e) => setHealthForm({ ...healthForm, visionLeft: e.target.value })}
                          placeholder="6/6"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-500" />
                          Vision Right Eye
                        </Label>
                        <Input
                          value={healthForm.visionRight}
                          onChange={(e) => setHealthForm({ ...healthForm, visionRight: e.target.value })}
                          placeholder="6/6"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Weight (kg)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={healthForm.weight}
                          onChange={(e) => setHealthForm({ ...healthForm, weight: e.target.value })}
                          placeholder="45"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Height (cm)</Label>
                        <Input
                          type="number"
                          value={healthForm.height}
                          onChange={(e) => setHealthForm({ ...healthForm, height: e.target.value })}
                          placeholder="150"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical Conditions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Medical Conditions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { key: "diabetes", label: "Diabetes" },
                        { key: "asthma", label: "Asthma" },
                        { key: "allergies", label: "Allergies" },
                        { key: "epilepsy", label: "Epilepsy" },
                        { key: "heartCondition", label: "Heart Condition" },
                        { key: "skinDisease", label: "Skin Disease" },
                        { key: "dentalIssues", label: "Dental Issues" },
                        { key: "hearingIssues", label: "Hearing Issues" },
                      ].map((condition) => (
                        <div key={condition.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={condition.key}
                            checked={healthForm[condition.key as keyof typeof healthForm] as boolean}
                            onCheckedChange={(checked) =>
                              setHealthForm({ ...healthForm, [condition.key]: checked })
                            }
                          />
                          <Label htmlFor={condition.key} className="cursor-pointer">{condition.label}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>Other Conditions / Remarks</Label>
                      <Input
                        value={healthForm.otherConditions}
                        onChange={(e) => setHealthForm({ ...healthForm, otherConditions: e.target.value })}
                        placeholder="Any other medical conditions or notes"
                      />
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Save Health Record
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Search Records Tab */}
          <TabsContent value="search">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Search Student Records</CardTitle>
                <CardDescription>Find and view existing student health records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by Health ID, Name, or School"
                      className="flex-1"
                    />
                    <Button>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  {/* Sample Results */}
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Recent Records:</p>
                    {[
                      { id: "KR12345678", name: "Ravi Kumar", school: "ZPHS Anantapur", class: "Class 8" },
                      { id: "KR12345679", name: "Priya Sharma", school: "ZPHS Kadiri", class: "Class 6" },
                      { id: "KR12345680", name: "Kiran Reddy", school: "MPPS Uravakonda", class: "Class 4" },
                    ].map((student) => (
                      <Card key={student.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-foreground">{student.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {student.id} • {student.school} • {student.class}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MedicalOfficerDashboard;
