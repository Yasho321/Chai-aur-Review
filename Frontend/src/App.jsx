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
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient();

function AppContent() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="dark">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/user-reviews" element={<UserReviews />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/users" element={<Users />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <HotToast 
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
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