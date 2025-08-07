import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useFeedbackStore = create((set, get) => ({
  feedbacks: [],
  myFeedbacks: [],
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,

  // Submit feedback
  submitFeedback: async (formData) => {
    try {
      set({ isSubmitting: true });
      const response = await axiosInstance.post('/feedback/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Feedback submitted successfully");
      
      // Add to my feedbacks
      set(state => ({
        myFeedbacks: [...state.myFeedbacks, response.data.feedback]
      }));
      
      return response.data.feedback;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Error submitting feedback");
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  // Get feedback as admin
  getFeedbackAsAdmin: async (courseId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(`/feedback/course/${courseId}`);
      set({ feedbacks: response.data.feedback });
      return response.data.feedback;
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Error fetching feedback");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Get my feedback as user
  getMyFeedback: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get('/feedback/my-feedback');
      set({ myFeedbacks: response.data.feedback });
      return response.data.feedback;
    } catch (error) {
      console.error("Error fetching my feedback:", error);
      toast.error("Error fetching my feedback");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete feedback
  deleteFeedback: async (feedbackId) => {
    try {
      set({ isDeleting: true });
      await axiosInstance.delete(`/feedback/${feedbackId}`);
      
      // Remove from both feedbacks and myFeedbacks
      set(state => ({
        feedbacks: state.feedbacks.filter(feedback => feedback._id !== feedbackId),
        myFeedbacks: state.myFeedbacks.filter(feedback => feedback._id !== feedbackId)
      }));
      
      toast.success("Feedback deleted successfully");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Error deleting feedback");
      throw error;
    } finally {
      set({ isDeleting: false });
    }
  },

  // Clear feedback data
  clearFeedbackData: () => {
    set({
      feedbacks: [],
      myFeedbacks: []
    });
  }
}));