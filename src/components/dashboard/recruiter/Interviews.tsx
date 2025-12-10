
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Video, Clock, Users, Plus, ArrowRight } from "lucide-react";

const Interviews: React.FC = () => {
  const upcomingInterviews = [
    {
      id: 1,
      candidate: {
        name: "Candidate 1",
        position: "Senior Frontend Developer",
        avatar: "C1",
      },
      date: "2025-04-08",
      time: "10:00 AM",
      duration: 60,
      interviewers: ["Interviewer 1", "Interviewer 2"],
      type: "Technical",
    },
    {
      id: 2,
      candidate: {
        name: "Candidate 2",
        position: "UI/UX Designer",
        avatar: "C2",
      },
      date: "2025-04-09",
      time: "2:00 PM",
      duration: 45,
      interviewers: ["Interviewer 1", "Interviewer 2"],
      type: "Portfolio Review",
    },
    {
      id: 3,
      candidate: {
        name: "Candidate 3",
        position: "Full Stack Developer",
        avatar: "C3",
      },
      date: "2025-04-10",
      time: "11:30 AM",
      duration: 60,
      interviewers: ["Interviewer 1", "Interviewer 2"],
      type: "Technical",
    },
  ];

  const pastInterviews = [
    {
      id: 4,
      candidate: {
        name: "Candidate 4",
        position: "Product Manager",
        avatar: "C4",
      },
      date: "2025-04-01",
      time: "9:00 AM",
      duration: 45,
      interviewers: ["Interviewer 1", "Interviewer 2"],
      type: "Behavioral",
      feedback: "Strong communication skills, good product knowledge",
      rating: 4,
    },
    {
      id: 5,
      candidate: {
        name: "Candidate 5",
        position: "DevOps Engineer",
        avatar: "C5",
      },
      date: "2025-03-30",
      time: "3:30 PM",
      duration: 60,
      interviewers: ["Interviewer 1", "Interviewer 2"],
      type: "Technical",
      feedback: "Excellent technical skills, needs improvement in communication",
      rating: 3,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-purple-800">Interviews</h1>
          <p className="text-muted-foreground">Schedule and manage candidate interviews</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
          <CardDescription>
            Your scheduled interviews for the next 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingInterviews.map((interview) => (
              <Card key={interview.id} className="border border-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-purple-100 text-purple-700">
                          {interview.candidate.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{interview.candidate.name}</h4>
                        <p className="text-sm text-muted-foreground">{interview.candidate.position}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{interview.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{interview.time} ({interview.duration} min)</span>
                        </div>
                      </div>
                      
                      <Badge className="bg-purple-700">
                        {interview.type}
                      </Badge>
                      
                      <Button className="hidden sm:inline-flex">
                        <Video className="h-4 w-4 mr-2" />
                        Join Interview
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-purple-100 flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground mr-1">Interviewers:</span>
                      <span>{interview.interviewers.join(", ")}</span>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="sm:hidden">
                      <span>Details</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Past Interviews</CardTitle>
          <CardDescription>
            Review completed interviews and provide feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pastInterviews.map((interview) => (
              <Card key={interview.id} className="border border-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-purple-100 text-purple-700">
                          {interview.candidate.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{interview.candidate.name}</h4>
                        <p className="text-sm text-muted-foreground">{interview.candidate.position}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="hidden md:flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{interview.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{interview.time} ({interview.duration} min)</span>
                        </div>
                      </div>
                      
                      <Badge className="bg-purple-700">
                        {interview.type}
                      </Badge>
                      
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i}
                            className={`w-5 h-5 ${i < interview.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-purple-100">
                    <h5 className="text-sm font-medium mb-1">Feedback:</h5>
                    <p className="text-sm">{interview.feedback}</p>
                    
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Interviews;
