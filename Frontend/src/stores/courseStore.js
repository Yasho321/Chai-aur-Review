import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useCourseStore = create((set, get) => ({
  courses: [],
  currentCourse: null,
  courseUsers: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  // Get all courses
  getCourses: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get('/course/');
      set({ courses: response.data.courses });
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Error fetching courses");
    } finally {
      set({ isLoading: false });
    }
  },

  // Create course (admin only)
  createCourse: async (data) => {
    try {
      set({ isCreating: true });
      const response = await axiosInstance.post('/course/', data);
      set(state => ({ 
        courses: [...state.courses, response.data.course] 
      }));
      toast.success("Course created successfully");
      return response.data.course;
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Error creating course");
      throw error;
    } finally {
      set({ isCreating: false });
    }
  },

  // Update course (admin only)
  updateCourse: async (courseId, data) => {
    try {
      set({ isUpdating: true });
      const response = await axiosInstance.put(`/course/${courseId}`, data);
      set(state => ({
        courses: state.courses.map(course => 
          course._id === courseId ? response.data.course : course
        )
      }));
      toast.success("Course updated successfully");
      return response.data.course;
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Error updating course");
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },

  // Delete course (admin only)
  deleteCourse: async (courseId) => {
    try {
      set({ isDeleting: true });
      await axiosInstance.delete(`/course/${courseId}`);
      set(state => ({
        courses: state.courses.filter(course => course._id !== courseId)
      }));
      toast.success("Course deleted successfully");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Error deleting course");
      throw error;
    } finally {
      set({ isDeleting: false });
    }
  },

  // Get course users (admin only)
  getCourseUsers: async (courseId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(`/course/${courseId}/users`);
      set({ courseUsers: response.data.data });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching course users:", error);
      toast.error("Error fetching course users");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Enroll users (admin only)
  enrollUsers: async (courseId, emails) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post(`/course/${courseId}/enrollusers`, { emails });
      toast.success("Users enrolled successfully");
      return response.data;
    } catch (error) {
      console.error("Error enrolling users:", error);
      toast.error("Error enrolling users");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Set current course
  setCurrentCourse: (course) => {
    set({ currentCourse: course });
  },

  // Clear course data
  clearCourseData: () => {
    set({
      courses: [],
      currentCourse: null,
      courseUsers: null
    });
  }
}));