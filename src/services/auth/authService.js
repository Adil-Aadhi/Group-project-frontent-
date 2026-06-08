import api from "../api/axios";

export const registerCompany = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginCompany = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
};

export const resendOtp = async (data) => {
  const response = await api.post(
    "/auth/resend-otp",
    data
  );

  return response.data;
};

export const resendForgotPasswordOtp = async (data) => {
  const response = await api.post(
    "/auth/resend-forgot-password-otp",
    data
  );

  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await api.post(
    "/auth/forgot-password",
    data
  );

  return response.data;
};
export const verifyForgotPasswordOtp = async (data) => {
  const response = await api.post(
    "/auth/verify-forgot-password-otp",
    data
  );

  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post(
    "/auth/reset-password",
    data
  );

  return response.data;
};