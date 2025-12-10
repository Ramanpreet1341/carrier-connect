
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [userRole, setUserRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Store user role for session
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userEmail", email);

      setIsLoading(false);

      // Navigate to appropriate dashboard based on role
      if (userRole === "user") {
        navigate("/user-dashboard");
      } else if (userRole === "recruiter") {
        navigate("/recruiter-dashboard");
      } else if (userRole === "admin") {
        navigate("/admin-dashboard");
      }

      toast({
        title: "Login successful",
        description: `Welcome back to CareerConnect!`,
      });
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-up">
      <div className="md:hidden flex flex-col items-center mb-8 text-center">
        <div className="bg-purple-500 text-white rounded-full p-3 mb-4">
          <Shield size={32} />
        </div>
        <h1 className="text-2xl font-bold text-purple-800">CareerConnect</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-powered hiring platform
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Choose your role and sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <Tabs defaultValue="user" className="w-full mb-6" onValueChange={setUserRole}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="user">Job Seeker</TabsTrigger>
                <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-purple-600 hover:text-purple-800">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-600 hover:text-purple-800 font-medium">
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
