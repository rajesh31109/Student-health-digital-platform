import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getApiBaseUrl } from "@/config/api";

const DebugPage = () => {
  const [apiHealth, setApiHealth] = useState<"checking" | "ok" | "error">("checking");
  const [apiUrl, setApiUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkApi = async () => {
      const url = getApiBaseUrl();
      setApiUrl(url);

      try {
        const response = await fetch(`${url}/health`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
          const data = await response.json();
          setApiHealth("ok");
        } else {
          setApiHealth("error");
          setErrorMessage(`API returned status ${response.status}`);
        }
      } catch (error: any) {
        setApiHealth("error");
        setErrorMessage(error?.message || "Failed to reach backend API");
      }
    };

    checkApi();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg border border-border p-8">
              <h1 className="text-2xl font-bold mb-6">🔧 System Diagnostics</h1>

              <div className="space-y-6">
                {/* API URL Configuration */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">Backend API Configuration</h2>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm break-all">
                    {apiUrl}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This is the URL your frontend is trying to connect to.
                  </p>
                </div>

                {/* API Health Check */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">Backend Health Check</h2>
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    {apiHealth === "checking" && (
                      <>
                        <Loader className="w-5 h-5 animate-spin text-blue-500" />
                        <span>Connecting to backend...</span>
                      </>
                    )}
                    {apiHealth === "ok" && (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-700">✅ Backend is running!</span>
                      </>
                    )}
                    {apiHealth === "error" && (
                      <>
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700">❌ Cannot connect to backend</span>
                      </>
                    )}
                  </div>
                  {errorMessage && (
                    <p className="text-sm text-red-600 mt-2">Error: {errorMessage}</p>
                  )}
                </div>

                {/* Troubleshooting Guide */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">⚠️ Troubleshooting</h2>
                  <div className="space-y-3 text-sm">
                    {apiHealth === "error" && (
                      <>
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                          <p className="font-semibold text-red-900 mb-2">Login is not working because:</p>
                          <ol className="list-decimal list-inside space-y-2 text-red-800">
                            <li><strong>Backend is not deployed</strong> - Deploy backend to Render first</li>
                            <li><strong>API URL not configured</strong> - Set VITE_API_URL in Vercel environment</li>
                            <li><strong>Network timeout</strong> - Backend server is down or unreachable</li>
                          </ol>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <p className="font-semibold text-blue-900 mb-2">✅ Quick Fix Steps:</p>
                          <ol className="list-decimal list-inside space-y-2 text-blue-800">
                            <li>
                              <strong>Deploy Backend to Render:</strong>
                              <ul className="list-disc list-inside ml-4 mt-1">
                                <li>Go to <a href="https://dashboard.render.com" className="underline">Render Dashboard</a></li>
                                <li>Click "New +" → "Blueprint"</li>
                                <li>Connect your GitHub repo</li>
                                <li>Add Supabase env variables</li>
                                <li>Deploy</li>
                              </ul>
                            </li>
                            <li>
                              <strong>Get Backend URL from Render Dashboard</strong> (e.g., https://xxx.onrender.com)
                            </li>
                            <li>
                              <strong>Update Vercel Environment:</strong>
                              <ul className="list-disc list-inside ml-4 mt-1">
                                <li>Go to <a href="https://vercel.com" className="underline">Vercel Project Settings</a></li>
                                <li>Add environment variable: <code className="bg-white px-2 py-1 rounded">VITE_API_URL=https://YOUR-RENDER-URL/api</code></li>
                                <li>Redeploy frontend</li>
                              </ul>
                            </li>
                          </ol>
                        </div>
                      </>
                    )}

                    {apiHealth === "ok" && (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <p className="font-semibold text-green-900 mb-2">✅ Backend is Connected!</p>
                        <p className="text-green-800">If login is still not working:</p>
                        <ul className="list-disc list-inside mt-2 text-green-800">
                          <li>Try clearing browser cache and refresh the page</li>
                          <li>Check browser console (F12) for errors</li>
                          <li>Verify test credentials are correct</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Test Credentials */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">📋 Test Credentials</h2>
                  <div className="space-y-3 text-sm">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="font-semibold mb-2">Admin Login:</p>
                      <p>Email: rajeshpulluri333@gmail.com</p>
                      <p>Password: Rajesh@123</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="font-semibold mb-2">Medical Officer:</p>
                      <p>Email: doctor@example.com</p>
                      <p>Password: doctor123</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="font-semibold mb-2">Student:</p>
                      <p>Health ID: TG-01-1968-0001</p>
                      <p>(No password needed)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DebugPage;
