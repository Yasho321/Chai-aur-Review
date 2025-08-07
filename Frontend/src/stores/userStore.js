import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
  preRegisteredUsers: [],
  isLoading: false,
  isPreRegistering: false,
  isDeleting: false,

  // Pre register single user (admin only)
  preRegisterUser: async (data) => {
    try {
      set({ isPreRegistering: true });
      const response = await axiosInstance.post('/user/pre-register', data);
      set(state => ({
        preRegisteredUsers: [...state.preRegisteredUsers, response.data.preRegisteredUser]
      }));
      toast.success("User pre-registered successfully");
      return response.data.preRegisteredUser;
    } catch (error) {
      console.error("Error pre-registering user:", error);
      toast.error("Error pre-registering user");
      throw error;
    } finally {
      set({ isPreRegistering: false });
    }
  },

  // Pre register users via CSV (admin only)
  preRegisterCSV: async (formData) => {
    try {
      set({ isPreRegistering: true });
      const response = await axiosInstance.post('/user/pre-register/csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Add successful results to the store
      if (response.data.successfulResults) {
        set(state => ({
          preRegisteredUsers: [...state.preRegisteredUsers, ...response.data.successfulResults]
        }));
      }
      
      toast.success(`Processed ${response.data.successful} users successfully`);
      return response.data;
    } catch (error) {
      console.error("Error pre-registering via CSV:", error);
      toast.error("Error pre-registering via CSV");
      throw error;
    } finally {
      set({ isPreRegistering: false });
    }
  },

  // Pre register users via JSON (admin only)
  preRegisterJSON: async (data) => {
    try {
      set({ isPreRegistering: true });
      const response = await axiosInstance.post('/user/pre-register/json', data);
      
      // Add successful results to the store
      const successfulUsers = response.data.results
        .filter(result => result.status === 'success')
        .map(result => result.preRegisterUser);
      
      set(state => ({
        preRegisteredUsers: [...state.preRegisteredUsers, ...successfulUsers]
      }));
      
      toast.success(`Processed ${response.data.successful} users successfully`);
      return response.data;
    } catch (error) {
      console.error("Error pre-registering via JSON:", error);
      toast.error("Error pre-registering via JSON");
      throw error;
    } finally {
      set({ isPreRegistering: false });
    }
  },

  // Get pre-registered users (admin only)
  getPreRegisteredUsers: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get('/user/pre-registered');
      set({ preRegisteredUsers: response.data.preRegisteredUsers });
      return response.data.preRegisteredUsers;
    } catch (error) {
      console.error("Error fetching pre-registered users:", error);
      toast.error("Error fetching pre-registered users");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    try {
      set({ isDeleting: true });
      await axiosInstance.delete(`/user/${userId}`);
      set(state => ({
        preRegisteredUsers: state.preRegisteredUsers.filter(user => user._id !== userId)
      }));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
      throw error;
    } finally {
      set({ isDeleting: false });
    }
  },

  // Clear user data
  clearUserData: () => {
    set({
      preRegisteredUsers: []
    });
  }
}));