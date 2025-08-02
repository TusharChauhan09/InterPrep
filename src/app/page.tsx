"use client";

import { Grid } from "@/components/Grid";
import { Testimonials } from "@/components/Testimonials";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Code2, Users, Calendar, Clock, Video, MessageSquare } from "lucide-react";

const Home = () => {
  const { isSignedIn } = useAuth();

  const features = [
    {
      icon: Video,
      title: "Live Video Interviews",
      description: "Conduct real-time video interviews with high-quality streaming technology"
    },
    {
      icon: Code2,
      title: "Code Editor",
      description: "Built-in code editor with syntax highlighting for technical interviews"
    },
    {
      icon: MessageSquare,
      title: "Real-time Chat",
      description: "Communicate seamlessly during interviews with integrated chat"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Schedule and manage interviews with ease"
    },
    {
      icon: Clock,
      title: "Interview Recordings",
      description: "Review and analyze past interviews for continuous improvement"
    },
    {
      icon: Users,
      title: "Multi-role Support",
      description: "Support for both interviewers and candidates with role-based features"
    }
  ];

  return (
    <div>
      <Grid />
      
      {/* Features Section */}
      <div className="container max-w-6xl mx-auto py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need for Perfect Interviews
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            InterPrep provides all the tools you need to conduct, practice, and excel in technical interviews
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="container max-w-4xl mx-auto py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Ace Your Next Interview?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of professionals who have improved their interview skills with InterPrep
        </p>
        
        <div className="flex gap-4 justify-center">
          {isSignedIn ? (
            <Link href="/arena">
              <Button size="lg" className="px-8">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/arena">
                <Button size="lg" className="px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg" className="px-8">
                  Learn More
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <Testimonials 
        title={'Trusted by aspiring professionals worldwide'} 
        description={"Join thousands of candidates leveling up their careers with Interprep - your ultimate platform for interview success."} 
      />
    </div>
  );
};

export default Home;