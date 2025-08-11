import { useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { Layout } from "@/components/Layout";
import { useAuthStore } from "@/stores/authStore";
import { useCourseStore } from "@/stores/courseStore";
import { useFeedbackStore } from "@/stores/feedbackStore";
import { useUserStore } from "@/stores/userStore";
import { 
  BookOpen, 
  MessageSquare, 
  Users, 
  Star
} from "lucide-react";

export default function Dashboard() {
  const { authUser } = useAuthStore();
  const { courses, getCourses } = useCourseStore();
  const { myFeedbacks, getMyFeedback } = useFeedbackStore();
  const { preRegisteredUsers, getPreRegisteredUsers } = useUserStore();

  useEffect(() => {
    if (authUser) {
      getCourses();
      getMyFeedback();
      if (authUser.role === 'admin') {
        getPreRegisteredUsers();
      }
    }
  }, [authUser, getCourses, getMyFeedback, getPreRegisteredUsers]);

  if (!authUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">📝</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to Chai aur Review</h1>
          <p className="text-muted-foreground mb-8"></p>
          <button
            onClick={() => window.location.href = 'http://localhost:8080/api/auth/google'}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Started with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your feedbacks and courses.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Courses"
            value={courses.length}
            subtitle={authUser.role === 'admin' ? 'Total courses' : 'Enrolled courses'}
            icon={BookOpen}
          />
          
          
          
          <StatCard
            title="Feedback"
            value={myFeedbacks.length}
            subtitle="Submissions"
            icon={MessageSquare}
          />
          
          {authUser.role === 'admin' && (
            <StatCard
              title="Users"
              value={preRegisteredUsers.length}
              subtitle="Pre-registered"
              icon={Users}
            />
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Courses</h2>
            <div className="space-y-3">
              {courses.slice(0, 5).map((course) => (
                <div key={course._id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{course.title}</p>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                  </div>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Active
                  </span>
                </div>
              ))}
              {courses.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No courses available</p>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Feedback</h2>
            <div className="space-y-3">
              {myFeedbacks.slice(0, 5).map((feedback) => (
                <div key={feedback._id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{feedback.courseId?.title}</p>
                    <p className="text-sm text-muted-foreground">{feedback.textContent?.slice(0, 50)}...</p>
                  </div>
                  <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded">
                    {feedback.status}
                  </span>
                </div>
              ))}
              {myFeedbacks.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No feedback submitted yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}