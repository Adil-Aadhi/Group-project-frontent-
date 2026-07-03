import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function LoginForm({ onForgotPassword }) {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await login(formData);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Login failed"
      );
    }
  };
  return (
    <>
      <div className="auth-card__header">
        <p>Growth Intelligence Platform</p>
        <h1>Welcome back</h1>
        <span>
          Sign in to continue monitoring markets, competitors, and strategic
          opportunities.
        </span>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="submit-error"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="auth-row">
          <button type="button" onClick={onForgotPassword}>Forgot password?</button>
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? (
            <>
              <FaSpinner className="btn-spinner" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </>
  );
}

export default LoginForm;
