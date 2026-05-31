// src/services/recommendService.js
import axios from "../utils/axios";// Ensure the correct path to your axiosInstance

export const fetchRecommendations = async () => {
  try {
    const response = await axios.get('/recommend');
    return response?.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};