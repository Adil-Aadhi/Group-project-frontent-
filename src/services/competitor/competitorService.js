import api from "../api/axios";

export const competitorService = {
  getTrackedCompetitors: async () => {
    const response = await api.get("/competitors/");
    return response.data;
  },

  scanCompetitors: async (searchCriteria) => {
    const response = await api.post(
      "/competitors/discover",
      searchCriteria
    );

    return response.data;
  },

  trackSelectedCompetitors: async (selectedCompanies) => {
    const payload = selectedCompanies.map((company) => ({
      company_name: company.company_name,
      website_url: company.website_url,
      industry: company.industry || "",
      location: company.location || "",
      description: company.description || "",
    }));
    console.log("Payload:", payload);

    const response = await api.post(
      "/competitors/add",
      payload
    );

    return response.data;
  },

  addManualCompetitor: async (competitorData) => {
    const response = await api.post(
      "/competitors/",
      competitorData
    );

    return response.data;
  },

  deleteCompetitor: async (competitorId) => {
    const response = await api.delete(
      `/competitors/${competitorId}`
    );

    return response.data;
  },

  startAnalysis: async (competitor) => {

    console.log("Competitor:", competitor);
    const response = await api.post(
      "/competitors/analyze",
      {
        company_name: competitor.company_name,
        slug: competitor.slug,
      }
    );

    return response.data;
  },
};

export const getAnalyzedCompetitor = async (competitorId) => {
  try {
    const response = await api.get(`/competitors/${competitorId}/analysis`);
    return response.data;
  } catch (error) {
    console.error("Error fetching analyzed competitor:", error);
    throw error;
  }
};