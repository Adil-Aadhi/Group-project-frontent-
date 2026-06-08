import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { useNavigate } from "react-router-dom";

function LoginForm({onForgotPassword }) {
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
        err.response?.data?.message || "Login failed"
      );
      console.log(err.response?.data);
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

         {error && <p>{error}</p>}

        <div className="auth-row">
          <label className="auth-check">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <button type="button" onClick={onForgotPassword}>Forgot password?</button>
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </>
  );
}

export default LoginForm;
