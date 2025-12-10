
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Briefcase, FileText, User, Award, Code, Video } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeJobs: 3,
    appliedJobs: 12,
    profileViews: 24,
    profileCompleteness: 75,
    verifiedSkills: 2,
    completedAssessments: 1
  });

  // Navigation functions
  const goToSearch = () => navigate("/user-dashboard/search");
  const goToActiveJobs = () => navigate("/user-dashboard/active");
  const goToAppliedJobs = () => navigate("/user-dashboard/applied");
  const goToResume = () => navigate("/user-dashboard/resume");
  const goToProfile = () => navigate("/user-dashboard/profile");
  const goToSkillsQuiz = () => navigate("/user-dashboard/skills-quiz");
  const goToCodingAssessment = () => navigate("/user-dashboard/coding-assessment");
  const goToCreateMeeting = () => navigate("/meeting/create");
  const goToJoinMeeting = () => navigate("/meeting/join");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Manage your job search effectively.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover-scale card-shadow cursor-pointer" onClick={goToActiveJobs}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              Jobs you're considering
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale card-shadow cursor-pointer" onClick={goToAppliedJobs}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Applied Jobs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.appliedJobs}</div>
            <p className="text-xs text-muted-foreground">
              Total applications sent
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale card-shadow cursor-pointer" onClick={goToProfile}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profileViews}</div>
            <p className="text-xs text-muted-foreground">
              In the last 30 days
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale card-shadow cursor-pointer" onClick={goToProfile}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Profile Completeness</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profileCompleteness}%</div>
            <p className="text-xs text-muted-foreground">
              Complete your profile to increase visibility
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale card-shadow cursor-pointer" onClick={goToSkillsQuiz}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Verified Skills</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verifiedSkills}</div>
            <p className="text-xs text-muted-foreground">
              Verify more skills to stand out
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale card-shadow cursor-pointer" onClick={goToCodingAssessment}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Coding Assessments</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAssessments}</div>
            <p className="text-xs text-muted-foreground">
              Complete coding challenges
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-purple-600" />
              Video Meetings
            </CardTitle>
            <CardDescription>
              Create or join video meetings for interviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                onClick={goToCreateMeeting} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Video className="mr-2 h-4 w-4" />
                Create Meeting
              </Button>
              <Button 
                onClick={goToJoinMeeting} 
                variant="outline" 
                className="w-full"
              >
                Join Meeting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 card-shadow">
          <CardHeader>
            <CardTitle>Recently Applied Jobs</CardTitle>
            <CardDescription>
              Track your recent applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium">{application.role}</div>
                    <div className="text-sm text-muted-foreground">{application.company}</div>
                  </div>
                  <Badge variant={application.status === "Pending" ? "outline" : application.status === "Rejected" ? "destructive" : "default"}>
                    {application.status}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" onClick={goToAppliedJobs}>
                View All Applications
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 card-shadow">
          <CardHeader>
            <CardTitle>Recommended Jobs</CardTitle>
            <CardDescription>
              Based on your skills and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <div key={job.id} className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium">{job.role}</div>
                    <div className="text-sm text-muted-foreground">{job.company}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{job.postedAt}</div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" onClick={goToSearch}>
                Explore All Jobs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            A complete profile increases your chances of being noticed by recruiters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Award className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <div className="font-medium">Verify your skills</div>
                  <div className="text-sm text-muted-foreground">
                    Take interactive quizzes to verify your skills and stand out to recruiters
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={goToSkillsQuiz}>Take Quiz</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Code className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <div className="font-medium">Complete coding assessments</div>
                  <div className="text-sm text-muted-foreground">
                    Solve programming challenges to demonstrate your coding abilities
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={goToCodingAssessment}>Solve Challenges</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <div className="font-medium">Upload your resume</div>
                  <div className="text-sm text-muted-foreground">
                    Let our AI analyze your resume and suggest improvements
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={goToResume}>Upload</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <div className="font-medium">Complete your profile</div>
                  <div className="text-sm text-muted-foreground">
                    Fill in your skills, experience, and preferences
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={goToProfile}>Edit Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Sample data
const recentApplications = [
  { id: 1, role: "Frontend Developer", company: "Tech Solutions Inc.", status: "Pending" },
  { id: 2, role: "UX Designer", company: "Creative Minds", status: "Reviewing" },
  { id: 3, role: "Product Manager", company: "Innovate Ltd.", status: "Rejected" },
];

const recommendedJobs = [
  { id: 1, role: "Full Stack Developer", company: "Digital Creations", postedAt: "2d ago" },
  { id: 2, role: "React Developer", company: "Web Experts", postedAt: "1d ago" },
  { id: 3, role: "UI/UX Designer", company: "Design Hub", postedAt: "Just now" },
];

export default UserDashboard;
