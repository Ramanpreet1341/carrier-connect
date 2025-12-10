
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Download, CheckCircle, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyResume: React.FC = () => {
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
  
  const goToSkillsQuiz = () => {
    navigate("/user-dashboard/skills-quiz");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-800">My Resume</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="analyze">Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="py-4">
          <Card className="glass-card">
            <CardContent className="py-4">
              <div className="border border-purple-100 rounded-lg p-6 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-purple-800">{userName}</h2>
                  <p className="text-muted-foreground">Job Title</p>
                  <div className="text-sm text-muted-foreground">
                    <p>{userEmail} | (555) 000-0000 | Location</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-purple-700">Summary</h3>
                  <p className="text-sm">
                    Experienced Frontend Developer with 5+ years of expertise in building responsive web applications using React, TypeScript, and modern web technologies. Passionate about creating user-friendly interfaces and optimizing web performance.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-purple-700">Experience</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Senior Frontend Developer</p>
                          <p className="text-sm text-muted-foreground">Company Name</p>
                        </div>
                        <p className="text-sm text-muted-foreground">2020 - Present</p>
                      </div>
                      <ul className="list-disc text-sm pl-4 mt-2 space-y-1">
                        <li>Led the development of the company's main web application using React and TypeScript</li>
                        <li>Improved web performance by 40% through code optimization and lazy loading</li>
                        <li>Collaborated with UX designers to implement new features and improve user experience</li>
                      </ul>
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Frontend Developer</p>
                          <p className="text-sm text-muted-foreground">Company Name</p>
                        </div>
                        <p className="text-sm text-muted-foreground">2018 - 2020</p>
                      </div>
                      <ul className="list-disc text-sm pl-4 mt-2 space-y-1">
                        <li>Developed responsive web interfaces for various client projects</li>
                        <li>Implemented state management with Redux for complex applications</li>
                        <li>Created custom React hooks to improve code reusability</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-purple-700">Skills</h3>
                    <Button variant="outline" size="sm" onClick={goToSkillsQuiz}>
                      <Award className="h-4 w-4 mr-1" />
                      Verify Skills
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["React", "TypeScript", "JavaScript", "HTML", "CSS", "Redux", "Next.js", "Tailwind CSS", "Git"].map((skill) => (
                      <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="edit" className="py-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Resume Editor</CardTitle>
              <CardDescription>
                Edit your resume information below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Resume editor coming soon. In the future, you'll be able to directly edit your resume here.
                </p>
                <Button variant="outline" disabled>Edit Resume</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analyze" className="py-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>AI Resume Analysis</CardTitle>
              <CardDescription>
                Get insights and suggestions to improve your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Your resume is ATS-friendly</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-purple-700">Strengths</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li>Strong technical skills section with relevant keywords</li>
                      <li>Clear work experience with quantifiable achievements</li>
                      <li>Well-structured layout that's easy to scan</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-purple-700">Suggestions</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li>Add more quantifiable achievements to showcase impact</li>
                      <li>Consider adding a projects section to highlight specific work</li>
                      <li>Include certifications relevant to your field</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-purple-100 pt-4">
                  <h4 className="font-medium text-purple-700 mb-2">Skills Verification</h4>
                  <p className="text-sm mb-3">Verify your skills through quizzes to increase your credibility to recruiters.</p>
                  <Button onClick={goToSkillsQuiz}>
                    <Award className="h-4 w-4 mr-2" />
                    Take Skills Quiz
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyResume;
