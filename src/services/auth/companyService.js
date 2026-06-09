import api from "../api/axios";

export const checkCompanyUrl = async (url) => {
  const response = await api.get("/company/check-url", {
    params: { url },
  });

  return response.data;
};