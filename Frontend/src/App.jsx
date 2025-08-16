import { useEffect } from "react";

import { Toaster  } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as HotToast } from "react-hot-toast";
import { useAuthStore } from "./stores/authStore";
import Dashboard from "./pages/Dashboard.jsx";
import Courses from "./pages/Courses.jsx";
import Feedback from "./pages/Feedback.jsx";
import Users from "./pages/Users.jsx";
import UserReviews from "./pages/UserReviews.jsx";
import CourseDetails from "./pages/CourseDetails";
import NotFound from "./pages/NotFound.jsx";
import { Navigate } from "react-router-dom";
import AuthSuccess from "./pages/AuthSuccess";

const queryClient = new QueryClient();

function AppContent() {
  const { checkAuth , isLoggedOut } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="dark">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
         <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/courses" element={!isLoggedOut ? <Courses /> : <Navigate to="/" />} />
          <Route path="/courses/:courseId" element={!isLoggedOut ? <CourseDetails /> : <Navigate to="/" />} />
          <Route path="/feedback" element={!isLoggedOut ? <Feedback /> : <Navigate to="/" />} />
          <Route path="/users" element={!isLoggedOut ? <Users /> : <Navigate to="/" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={!isLoggedOut ? <NotFound /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      <HotToast 
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'white',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;