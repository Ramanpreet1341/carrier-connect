
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit2, MapPin, Mail, Phone, Github, Linkedin, Globe, CheckCircle, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User Name");
  const [userEmail, setUserEmail] = useState("user@example.com");

  useEffect(() => {
    // Get user name from localStorage
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    
    if (storedName) {
      setUserName(storedName);
    }
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  // Simulated verified skills
  const verifiedSkills = ["React", "TypeScript"];
  
  const goToSkillsQuiz = () => {
    navigate("/user-dashboard/skills-quiz");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-800">My Profile</h1>
        <Button variant="outline">
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="" />
                <AvatarFallback className="bg-purple-100 text-purple-700 text-xl font-medium">
                  {userName && userName !== "User Name" 
                    ? userName.trim().split(" ").length >= 2
                      ? (userName.trim().split(" ")[0][0] + userName.trim().split(" ")[userName.trim().split(" ").length - 1][0]).toUpperCase()
                      : userName.substring(0, 2).toUpperCase()
                    : "JS"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{userName}</h2>
              <p className="text-muted-foreground">Job Title</p>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Location</span>
              </div>
              <div className="w-full mt-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">(555) 000-0000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">github.com/username</span>
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">linkedin.com/in/profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">website.com</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Frontend developer with 5+ years of experience specializing in React and TypeScript. 
                Passionate about creating intuitive user interfaces and delivering exceptional user experiences. 
                Strong problem-solving skills and attention to detail.
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Skills</CardTitle>
              <Button variant="outline" size="sm" onClick={goToSkillsQuiz}>
                <Award className="h-4 w-4 mr-2" />
                Verify Skills
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Redux", "Next.js", "Tailwind CSS", "REST API", "GraphQL", "Git", "CI/CD", "Jest", "Webpack"].map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="outline" 
                    className={verifiedSkills.includes(skill) 
                      ? "bg-green-50 text-green-700 border-green-200 flex items-center gap-1" 
                      : "bg-purple-50 text-purple-700 border-purple-200"}
                  >
                    {verifiedSkills.includes(skill) && <CheckCircle className="h-3 w-3 mr-1" />}
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Job Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Job Type</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Full-time</Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Contract</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Work Location</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Remote</Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Hybrid</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Salary Expectation</p>
                  <p className="text-sm">$90,000 - $120,000 per year</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Preferred Industries</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Tech</Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Finance</Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Healthcare</Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Education</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
