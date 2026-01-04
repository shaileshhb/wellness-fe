/**
 * Exercises Service
 * Service layer for exercises-related API calls
 */
import apiClient from './client';

export const exercisesService = {
  /**
   * Get all exercises with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of items per page
   * @param {number} params.offset - Offset for pagination
   * @returns {Promise} API response
   */
  getExercises: async (params = { limit: 20, offset: 0 }) => {
    try {
      const response = await apiClient.get('/exercises', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search exercises with a limit (no total count returned)
   * @param {Object} params - Query parameters
   * @param {string} params.search - Search term
   * @param {number} [params.limit=50] - Max results to return
   * @returns {Promise} API response
   */
  searchExercises: async ({ search, limit = 50 }) => {
    try {
      const response = await apiClient.get('/search', {
        params: { search, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a single exercise by ID
   * @param {number} id - Exercise ID
   * @returns {Promise} API response
   */
  getExerciseById: async (id) => {
    try {
      const response = await apiClient.get(`/exercises/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get video stream URL
   * @param {string} videoPath - Video path (e.g., "branded/male-Bodyweight-dips-side.mp4")
   * @returns {string} Full video URL
   */
  getVideoUrl: (videoPath) => {
    // Extract the path after /media/videos/
    const path = videoPath.includes('/media/videos/') 
      ? videoPath.split('/media/videos/')[1] 
      : videoPath;
    return `${apiClient.defaults.baseURL}/videos/${path}`;
  },
};

