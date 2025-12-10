
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

const RegisterForm = () => {
  const [userRole, setUserRole] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Store user information in localStorage
      if (userRole === "user" && name) {
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", userRole);
      } else if (userRole === "recruiter" && name) {
        localStorage.setItem("companyName", name);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", userRole);
      } else if (userRole === "admin" && name) {
        localStorage.setItem("adminName", name);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", userRole);
      }

      setIsLoading(false);
      navigate("/verification");

      toast({
        title: "Registration successful",
        description: "We've sent a verification code to your email.",
      });
    }, 1500);
  };

  const getPlaceholder = () => {
    switch (userRole) {
      case "user":
        return "Your full name";
      case "recruiter":
        return "Company name";
      case "admin":
        return "Admin name";
      default:
        return "Your name";
    }
  };

  const getNameLabel = () => {
    switch (userRole) {
      case "user":
        return "Full Name";
      case "recruiter":
        return "Company Name";
      case "admin":
        return "Admin Name";
      default:
        return "Name";
    }
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
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Choose your role and create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <Tabs defaultValue="user" className="w-full mb-6" onValueChange={setUserRole}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="user">Job Seeker</TabsTrigger>
                <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{getNameLabel()}</Label>
                <Input
                  id="name"
                  placeholder={getPlaceholder()}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 hover:text-purple-800 font-medium">
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm;
