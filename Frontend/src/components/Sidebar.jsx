import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  MessageSquare, 
  Users, 
  Settings,
  LogOut,
  Star
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'User Reviews', href: '/user-reviews', icon: Star },
  { name: 'Feedback', href: '/feedback', icon: MessageSquare },
  { name: 'Users', href: '/users', icon: Users, adminOnly: true },
];

export function Sidebar({ className }) {
  const { authUser, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">🔥</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">MasterJi</h2>
          </div>
          
          <div className="space-y-1">
            {navigation
              .filter(item => !item.adminOnly || authUser?.role === 'admin')
              .map((item) => (
              <Button
                key={item.name}
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={() => navigate(item.href)}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
        
        {authUser && (
          <div className="px-3 py-2 border-t border-border">
            <div className="flex items-center gap-3 mb-4 px-3 py-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">
                  {authUser.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{authUser.name}</p>
                <p className="text-xs text-muted-foreground">{authUser.role}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}