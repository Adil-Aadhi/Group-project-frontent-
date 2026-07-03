import { createContext, useEffect, useState } from "react";
import {
  registerCompany,
  loginCompany,
  verifyOtp,
  resendOtp,
  forgotPassword as forgotPasswordService,
  verifyForgotPasswordOtp,
  resetPassword,
  resendForgotPasswordOtp,
  refreshAccessToken
} from "../../services/auth/authService";
import { useAuthStore } from "../../store/authStore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { setAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        setLoading(true);
        const data = await refreshAccessToken();

        setAuth(data.access_token);
        console.log("Restored:", useAuthStore.getState());
      } catch (error) {
        console.log("No active session");
      } finally { setLoading(false); }

    };

    restoreSession();
  }, []);


  const handleAuthSuccess = (data) => {
    setAuth(data.access_token);
    console.log(useAuthStore.getState());
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