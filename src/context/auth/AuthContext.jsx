import { createContext, useEffect, useState } from "react";
import {
  registerCompany,
  loginCompany,
  verifyOtp,
  resendOtp,
  forgotPassword as forgotPasswordService,
  verifyForgotPasswordOtp,
  resetPassword,
  resendForgotPasswordOtp
} from "../../services/auth/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = (data) => {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("schema_name", data.schema_name);

    setIsAuthenticated(true);
  };

  const register = async (formData) => {
    try {
      setLoading(true);

      return await registerCompany(formData);
    } finally {
      setLoading(false);
    }
  };

  const verifyAccountOtp = async (payload) => {
    try {
      setLoading(true);

      const data = await verifyOtp(payload);

      handleAuthSuccess(data);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);

      const data = await loginCompany(credentials);

      handleAuthSuccess(data);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const resendAccountOtp = async (payload) => {
    try {
      setLoading(true);

      return await resendOtp(payload);
    } finally {
      setLoading(false);
    }
  };

  const resendForgotPasswordOtpHandler = async (payload) => {
  try {
    setLoading(true);

    return await resendForgotPasswordOtp(payload);
  } finally {
    setLoading(false);
  }
};

  const forgotPassword = async (data) => {
    try {
      setLoading(true);

      const response =
        await forgotPasswordService(data);

      return response;
    } finally {
      setLoading(false);
    }
  };

  const verifyForgotPasswordOtpHandler = async (payload) => {
    try {
      setLoading(true);

      return await verifyForgotPasswordOtp(payload);
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordHandler = async (payload) => {
    try {
      setLoading(true);

      return await resetPassword(payload);
    } finally {
      setLoading(false);
    }
  };
  // const logout = () => {
  //   localStorage.removeItem("access_token");
  //   localStorage.removeItem("schema_name");

  //   setIsAuthenticated(false);
  // };

  return (
    <AuthContext.Provider
      value={{
        register,
        verifyAccountOtp,
        resendAccountOtp,
        login,
        forgotPassword,
        verifyForgotPasswordOtp:
          verifyForgotPasswordOtpHandler,
        resetPassword:
          resetPasswordHandler,
        resendForgotPasswordOtp:
          resendForgotPasswordOtpHandler, 
        // logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};