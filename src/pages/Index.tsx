
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, CheckCircle, Search, FileText, Video, User, Building } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600 mr-2" />
              <span className="font-bold text-2xl text-purple-800">CareerConnect</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-purple-600 font-medium">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-purple-600 font-medium">How It Works</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-purple-600 font-medium">Testimonials</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/login")}>Sign In</Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => navigate("/register")}>Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white flex-grow min-h-[90vh] flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-4xl sm:text-5xl font-bold text-purple-800 leading-tight">
                AI-Powered Hiring <br /> Made <span className="text-purple-600">Simple</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                CareerConnect automates the complete hiring process, from resume analysis to interviews, making job seeking and recruitment efficient.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-6 py-6" onClick={() => navigate("/register")}>
                  Get Started
                </Button>
                <Button variant="outline" className="text-lg px-6 py-6" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
              </div>
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-purple-100 border border-white flex items-center justify-center">
                      <User className="h-4 w-4 text-purple-700" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Join <span className="font-medium text-foreground">1,200+</span> users already on CareerConnect
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -left-10 h-32 w-32 bg-purple-100 rounded-full filter blur-3xl opacity-50"></div>
              <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-purple-200 rounded-full filter blur-3xl opacity-50"></div>
              <div className="bg-white rounded-xl shadow-xl border border-border p-6 relative z-10 animate-fade-in">
                <div className="flex justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Building className="h-5 w-5 text-purple-700" />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">Tech Solutions Inc.</div>
                      <div className="text-sm text-muted-foreground">Frontend Developer</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center">Match: 95%</Badge>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-purple-100 rounded w-full"></div>
                  <div className="h-4 bg-purple-100 rounded w-5/6"></div>
                  <div className="h-4 bg-purple-100 rounded w-4/6"></div>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Apply Now</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-purple-800 mb-4">Platform Features</h2>
            <p className="text-lg text-muted-foreground">
              Designed for both job seekers and recruiters to streamline the hiring process
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-border hover-scale card-shadow">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-purple-800">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-purple-800 mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Our AI-powered platform connects job seekers with the right opportunities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-12">
                {steps.map((step, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-purple-800">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="absolute -top-10 -left-10 h-32 w-32 bg-purple-200 rounded-full filter blur-3xl opacity-50"></div>
              <div className="bg-white rounded-xl shadow-xl p-6 relative z-10">
                <div className="relative">
                  <div className="aspect-video bg-purple-100 rounded-lg mb-4"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">See CareerConnect in Action</h3>
                <p className="text-muted-foreground">Watch how our platform simplifies the hiring process for everyone involved.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-100 to-purple-300 rounded-xl p-12 text-purple-900 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring Process?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already benefiting from our AI-powered platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-black hover:bg-purple-50 text-lg px-6 py-6" onClick={() => navigate("/register")}>
                Sign Up Now
              </Button>
              <Button variant="outline" className="text-black border-white hover:bg-purple-500 text-lg px-6 py-6" onClick={() => navigate("/login")}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 mr-2" />
                <span className="font-bold text-xl">CareerConnect</span>
              </div>
              <p className="text-purple-200 mb-4">
                AI-powered platform that automates the complete hiring process.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-purple-200 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="text-purple-200 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" className="text-purple-200 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">For Job Seekers</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-200 hover:text-white">Search Jobs</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white">Resume Analysis</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white">Interview Preparation</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white">Career Resources</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">For Recruiters</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-200 hover:text-white">Post Jobs</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white">AI Screening</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white">Applicant Tracking</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white">Interview Management</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-200 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-700 mt-8 pt-8 text-center text-purple-200">
          </div>
        </div>
      </footer>
    </div>
  );
};

// Sample data
const Badge = ({ children, className }) => {
  return (
    <div className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </div>
  );
};

const features = [
  {
    title: "AI Resume Analysis",
    description: "Our AI analyzes and extracts key information from resumes to match candidates with the right jobs.",
    icon: <FileText className="h-6 w-6 text-purple-700" />,
  },
  {
    title: "Smart Job Matching",
    description: "Advanced algorithms match job seekers with opportunities that align with their skills and preferences.",
    icon: <Search className="h-6 w-6 text-purple-700" />,
  },
  {
    title: "Automated Interviews",
    description: "Schedule and conduct automated initial interviews to streamline the candidate screening process.",
    icon: <Video className="h-6 w-6 text-purple-700" />,
  },
  {
    title: "Applicant Tracking",
    description: "Comprehensive dashboard to track applications, interviews, and hiring status in real-time.",
    icon: <User className="h-6 w-6 text-purple-700" />,
  },
  {
    title: "Skill Assessments",
    description: "Create custom assessments to evaluate technical skills and qualifications of candidates.",
    icon: <CheckCircle className="h-6 w-6 text-purple-700" />,
  },
  {
    title: "Analytics & Insights",
    description: "Detailed analytics on recruitment performance, applicant demographics, and hiring trends.",
    icon: <Building className="h-6 w-6 text-purple-700" />,
  },
];

const steps = [
  {
    title: "Create Your Profile",
    description: "Sign up and create your profile as either a job seeker or recruiter.",
  },
  {
    title: "AI Resume Analysis",
    description: "Our AI analyzes your resume or job postings to identify key skills and qualifications.",
  },
  {
    title: "Smart Matching",
    description: "Get matched with the most relevant jobs or candidates based on our AI algorithm.",
  },
  {
    title: "Automated Assessments",
    description: "Complete or create skill assessments to validate technical expertise.",
  },
];

export default Index;
