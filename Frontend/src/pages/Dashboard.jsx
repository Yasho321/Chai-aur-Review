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
  Star,Sun, User, CheckCircle, Clock, 
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button"



export default function Dashboard() {
  const { authUser ,loginWithGoogle , isLoggedOut} = useAuthStore();
  const { courses, getCourses } = useCourseStore();
  const { myFeedbacks, getMyFeedback } = useFeedbackStore();
  const { preRegisteredUsers, getPreRegisteredUsers } = useUserStore();

  const handleLogin = () =>{
    loginWithGoogle();
  }

  useEffect(() => {
    if (authUser) {
      getCourses();
      getMyFeedback();
      if (authUser.role === 'admin') {
        getPreRegisteredUsers();
      }
    }
  }, [authUser, getCourses, getMyFeedback, getPreRegisteredUsers]);

 
  if (isLoggedOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">⭐</span>
          </div>
          <span className="text-xl font-bold">Chai aur Review</span>
        </div>
        
      </header>

      {/* Main Content - Single Centered Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center space-y-12">
          {/* Hero Content */}
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Give <span className="text-orange-500">Reviews</span>. <br />
                Build Trust for the Chai <br />
                in the World.
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Gathering authentic reviews for our courses , to acknowledge the value we provide and the growth we bring to your lives. 
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick= {handleLogin}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg rounded-lg"
              >
                Give Reviews
              </Button>
              
            </div>
          </div>

          
          
        </div>
      </div>
    </div>
    );
  }

  if(!isLoggedOut && !authUser){
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex justify-center">
        <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
      </div>
    </div>
    )
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
          
          
          
          {authUser.role !== 'admin' && (<StatCard
            title="Feedback"
            value={myFeedbacks.length}
            subtitle="Submissions"
            icon={MessageSquare}
          />)}
          
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