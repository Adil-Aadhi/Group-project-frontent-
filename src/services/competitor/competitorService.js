import axios from "axios";

// Assuming your base axios instance with token interceptors is ready in your api folder
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export const competitorService = {
  // Fetch only the tracked competitors for the logged-in user
  getTrackedCompetitors: async () => {
    const response = await axios.get(`${API_URL}/competitors/`);
    return response.data;
  },

  // Trigger the background AI web agent to scan for 6 companies
  scanCompetitors: async (searchCriteria) => {
    // searchCriteria = { industry: "...", district: "...", state: "..." }
    const response = await axios.post(`${API_URL}/competitors/search/`, searchCriteria);
    return response.data; // Expected: Array of 6 discovered companies
  },

  // Save explicitly selected companies to the database
  trackSelectedCompetitors: async (selectedCompanies) => {
    // selectedCompanies = Array of company objects chosen by user
    const response = await axios.post(`${API_URL}/competitors/add/`, { companies: selectedCompanies });
    return response.data;
  },

  // Delete a specific competitor via 3-dot menu
  deleteCompetitor: async (competitorId) => {
    const response = await axios.delete(`${API_URL}/competitors/${competitorId}/`);
    return response.data;
  }
};