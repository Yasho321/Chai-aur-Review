import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: false,
  isLoggedOut: false,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const response = await axiosInstance.get('/auth/me');
      set({ 
        authUser: response.data.user,
        isLoggedOut: false 
      });
    } catch (error) {
      console.error("check auth error:", error);
      set({ 
        authUser: null,
        isLoggedOut: true 
      });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
      set({ isCheckingAuth: true });
      
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem("authToken");
      set({ 
        authUser: null,
        isLoggedOut: true 
      });
      toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Google OAuth login will redirect to Google
  loginWithGoogle: () => {
    window.location.href = 'https://chai-aur-review.onrender.com/api/auth/google';

  }
}));