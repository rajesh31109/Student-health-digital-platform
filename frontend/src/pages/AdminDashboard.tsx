import { useState, useEffect } from "react";
import { getApiBaseUrl } from "@/config/api";
import { 
  Heart, 
  Search, 
  Users, 
  FileText, 
  LogOut,
  User,
  BarChart3,
  TrendingUp,
  MapPin,
  School,
  Building,
  Filter,
  Download,
  Activity,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Total Students", value: "0", icon: Users, color: "text-health-blue", change: "+0%" },
    { label: "Schools Covered", value: "0", icon: School, color: "text-health-teal", change: "+0" },
    { label: "Checkups This Month", value: "0", icon: Activity, color: "text-health-green", change: "+0%" },
    { label: "Reports Generated", value: "0", icon: FileText, color: "text-health-orange", change: "+0" },
  ]);
  const [healthAlerts, setHealthAlerts] = useState([
    { type: "Anemia Cases", count: 0, severity: "high", mandal: "N/A" },
    { type: "Vision Issues", count: 0, severity: "medium", mandal: "N/A" },
    { type: "Underweight Students", count: 0, severity: "high", mandal: "N/A" },
    { type: "Dental Problems", count: 0, severity: "low", mandal: "N/A" },
  ]);
  const [topSchools, setTopSchools] = useState([
    { name: "School 1", students: 0, checkups: 0, completion: 0 },
    { name: "School 2", students: 0, checkups: 0, completion: 0 },
  ]);
  const [consultationTypes, setConsultationTypes] = useState<Array<{type: string, count: number}>>([]);

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const fetchAdminDashboard = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Not authenticated. Please login again.");
        navigate("/login/admin");
        return;
      }

      // Fetch admin dashboard statistics
      const response = await fetch(`${getApiBaseUrl()}/admin/dashboard/statistics`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const dashboard_data = data.data;
          setStats([
            { label: "Total Students", value: dashboard_data.totalStudents?.toString() || "0", icon: Users, color: "text-health-blue", change: "+0%" },
            { label: "Medical Officers", value: dashboard_data.totalMedicalOfficers?.toString() || "0", icon: Users, color: "text-health-teal", change: "+0" },
            { label: "Checkups This Month", value: dashboard_data.consultationsThisMonth?.toString() || "0", icon: Activity, color: "text-health-green", change: "+0%" },
            { label: "Health Records", value: dashboard_data.totalHealthRecords?.toString() || "0", icon: FileText, color: "text-health-orange", change: "+0" },
          ]);

          // Handle consultation types
          if (dashboard_data.consultationTypes && typeof dashboard_data.consultationTypes === 'object') {
            const typesArray = Object.entries(dashboard_data.consultationTypes).map(([type, count]: [string, any]) => ({
              type,
              count: count || 0
            })).sort((a, b) => b.count - a.count);
            setConsultationTypes(typesArray);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Could not load dashboard statistics. Please try again.");
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
    navigate("/login/admin");
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
                Student Digital Health Profile
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="w-4 h-4" />
                <span>DMHO Admin</span>
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
                    <p className="text-xs text-health-green flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger>
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d.toLowerCase()}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedMandal} onValueChange={setSelectedMandal}>
                <SelectTrigger>
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select Mandal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Mandals</SelectItem>
                  {mandals.map((m) => (
                    <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Search school name..." className="w-full" />
              <Button className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Health Alerts
            </TabsTrigger>
            <TabsTrigger value="schools" className="gap-2">
              <School className="w-4 h-4" />
              Schools
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Health Statistics Summary</CardTitle>
                  <CardDescription>Overview of student health across the district</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Normal Health Status", value: 78, color: "bg-health-green" },
                      { label: "Minor Issues", value: 15, color: "bg-health-orange" },
                      { label: "Requires Attention", value: 7, color: "bg-red-500" },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-medium">{item.value}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Common Health Issues</CardTitle>
                  <CardDescription>Top reported conditions this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {consultationTypes.length > 0 ? (
                      consultationTypes.slice(0, 5).map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium text-foreground">{item.type}</p>
                            <p className="text-sm text-muted-foreground">{item.count} cases</p>
                          </div>
                          <Badge variant="outline">{item.count}</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Health Alerts Tab */}
          <TabsContent value="alerts">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-health-orange" />
                  Active Health Alerts
                </CardTitle>
                <CardDescription>Areas requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthAlerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        alert.severity === "high"
                          ? "border-red-500/30 bg-red-500/5"
                          : alert.severity === "medium"
                          ? "border-yellow-500/30 bg-yellow-500/5"
                          : "border-green-500/30 bg-green-500/5"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <AlertTriangle
                          className={`w-6 h-6 ${
                            alert.severity === "high"
                              ? "text-red-500"
                              : alert.severity === "medium"
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-foreground">{alert.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {alert.count} cases in {alert.mandal} Mandal
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={alert.severity === "high" ? "destructive" : "outline"}
                        >
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schools Tab */}
          <TabsContent value="schools">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>School-wise Statistics</CardTitle>
                <CardDescription>Health checkup completion by school</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSchools.map((school, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-health-blue/10 flex items-center justify-center">
                          <School className="w-5 h-5 text-health-blue" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{school.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {school.checkups}/{school.students} students checked
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-foreground">{school.completion}%</p>
                          <p className="text-xs text-muted-foreground">Completion</p>
                        </div>
                        <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              school.completion >= 90 ? "bg-health-green" :
                              school.completion >= 80 ? "bg-health-orange" : "bg-red-500"
                            }`}
                            style={{ width: `${school.completion}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Download health data reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Monthly Health Summary", description: "Complete overview of student health this month", type: "PDF" },
                    { title: "Anemia Report", description: "Students with low hemoglobin levels", type: "Excel" },
                    { title: "Vision Screening Report", description: "Students with vision problems", type: "PDF" },
                    { title: "School-wise Report", description: "Health data organized by school", type: "Excel" },
                    { title: "Mandal-wise Report", description: "Health data organized by mandal", type: "PDF" },
                    { title: "Vaccination Status", description: "Vaccination records summary", type: "Excel" },
                  ].map((report, index) => (
                    <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{report.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                        </div>
                        <Badge variant="outline">{report.type}</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
