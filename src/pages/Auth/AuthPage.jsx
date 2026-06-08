import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AuthLayout from "../../layouts/AuthLayout";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import VerifyOtpForm from "./VerifyOtpForm";
import ForgotPasswordEmailForm from "./ForgotPasswordEmailForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import ResetPasswordForm from "./ResetPasswordForm";

const formVariants = {
  initial: {
    opacity: 0,
    x: 28,
    scale: 0.985,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    x: -24,
    scale: 0.985,
  },
};

function AuthExperience() {
  const [view, setView] = useState("register");
  const isVerifyOtp =
      view === "verifyOtp" ||
      view === "forgotPasswordOtp";
  const [otpData, setOtpData] = useState(null);
  const navigate = useNavigate();

  const handleVerifyOtp = (data) => {
    setOtpData(data);
    setView("verifyOtp");
  };
  const {
      verifyAccountOtp,
      resendAccountOtp,
      verifyForgotPasswordOtp,
      resendForgotPasswordOtp,
    } = useAuth()

  return (
    <div
      className={`auth-card ${
        view === "register" ? "auth-card--wide" : "auth-card--narrow"
      } ${isVerifyOtp ? "auth-card--center" : ""}`}
    >
      {!isVerifyOtp && (
        <nav className="auth-tabs" aria-label="Authentication">
          <button
            type="button"
            onClick={() => setView("register")}
            aria-current={view === "register" ? "page" : undefined}
            className={view === "register" ? "is-active" : ""}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setView("login")}
            aria-current={view === "login" ? "page" : undefined}
            className={view === "login" ? "is-active" : ""}
          >
            Sign In
          </button>
        </nav>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          variants={formVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.26,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {view === "register" && (
            <RegisterForm onVerifyOtp={handleVerifyOtp} />
          )}
          {view === "login" && <LoginForm
                onForgotPassword={() => setView("forgotPassword")}
              />}
          {view === "verifyOtp" && (
            <VerifyOtpForm
              email={otpData?.email}
              onBack={() => setView("register")}
              verifyOtp={verifyAccountOtp}
              resendOtp={resendAccountOtp}
              onSuccess={() => navigate("/dashboard")}
            />
          )}
          {view === "forgotPassword" && (
          <ForgotPasswordEmailForm
            onVerifyOtp={(data) => {
              setOtpData(data);
              setView("forgotPasswordOtp");
            }}
          />
        )}
        {view === "forgotPasswordOtp" && (
          <VerifyOtpForm
            email={otpData?.email}
            onBack={() => setView("forgotPassword")}
            verifyOtp={verifyForgotPasswordOtp}
            resendOtp={resendForgotPasswordOtp}
            onSuccess={() => setView("resetPassword")}
          />
        )}

        {view === "resetPassword" && (
          <ResetPasswordForm
            email={otpData?.email}
          />
  )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function AuthPage() {
  return (
    <AuthLayout>
      <AuthExperience />
    </AuthLayout>
  );
}

export default AuthPage;
