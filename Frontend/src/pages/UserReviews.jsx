import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function PeerReviews() {
  // Mock data for peer reviews
  const peerReviews = [
    {
      id: 1,
      title: "React Component Architecture",
      author: "John Doe",
      status: "pending",
      dueDate: "2025-08-01",
      course: "Web Development"
    },
    {
      id: 2,
      title: "Database Design Project",
      author: "Jane Smith",
      status: "completed",
      dueDate: "2025-07-25",
      course: "Backend Development"
    },
    {
      id: 3,
      title: "API Design Document",
      author: "Mike Johnson",
      status: "in-review",
      dueDate: "2025-07-30",
      course: "Web Development"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'in-review':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'in-review':
        return AlertCircle;
      default:
        return Star;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Peer Reviews</h1>
          <p className="text-muted-foreground">Review and get feedback on your projects from peers.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Reviews"
            value="12"
            subtitle="All time"
            icon={Star}
          />
          
          <StatCard
            title="Completed"
            value="5"
            subtitle="This month"
            icon={CheckCircle}
          />
          
          <StatCard
            title="Pending"
            value="7"
            subtitle="Awaiting review"
            icon={Clock}
          />
          
          <StatCard
            title="Average Rating"
            value="4.5"
            subtitle="Out of 5 stars"
            icon={Star}
          />
        </div>

        {/* Peer Reviews List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Recent Reviews</h2>
            <Button>Submit for Review</Button>
          </div>

          <div className="grid gap-4">
            {peerReviews.map((review) => {
              const StatusIcon = getStatusIcon(review.status);
              return (
                <Card key={review.id} className="bg-card border-border shadow-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <StatusIcon className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-foreground">{review.title}</h3>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-1">
                          By {review.author} • {review.course}
                        </p>
                        
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(review.dueDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(review.status)}`}>
                          {review.status.replace('-', ' ')}
                        </span>
                        
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Instructions Card */}
        <Card className="bg-gradient-secondary border-border">
          <CardHeader>
            <CardTitle className="text-foreground">How Peer Reviews Work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-foreground font-bold">1</span>
                </div>
                <h3 className="font-medium text-foreground mb-2">Submit Your Work</h3>
                <p className="text-sm text-muted-foreground">
                  Share your project, code, or design for peer evaluation
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-foreground font-bold">2</span>
                </div>
                <h3 className="font-medium text-foreground mb-2">Review Others</h3>
                <p className="text-sm text-muted-foreground">
                  Provide constructive feedback on your peers' submissions
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-foreground font-bold">3</span>
                </div>
                <h3 className="font-medium text-foreground mb-2">Get Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  Receive valuable insights to improve your work
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}