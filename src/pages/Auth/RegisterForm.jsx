import { useAuth } from "../../hooks/auth/useAuth";
import { useState } from "react";

function RegisterForm({ onVerifyOtp }) {
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    company_name: "",
    website_link: "",
    industry: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await register(formData);

      console.log(response);

      // Move to OTP page/modal
      onVerifyOtp({
        email: formData.email,
      });
    } catch (error) {
      console.log(error.response);
      console.log(error.response?.data);
      console.log(error.response?.data?.detail);
    }
  };

  return (
    <>
      <div className="auth-card__header">
        <p>Start your intelligence workspace</p>
        <h1>Start your free trial</h1>
        <span>
          Build a workspace for company tracking, market signals, and AI
          strategy briefs.
        </span>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form__grid">
          <div className="auth-field">
            <label htmlFor="company-name">Company Name</label>
            <input
              id="company-name"
              name="company_name"
              type="text"
              autoComplete="organization"
              required
              placeholder="VoxIntel"
              value={formData.company_name}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="company-website">Company Website</label>
            <input
              id="company-website"
              name="website_link"
              type="url"
              autoComplete="url"
              required
              placeholder="https://company.com"
              value={formData.website_link}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="industry">Industry</label>
          <select id="industry" name="industry" required value={formData.industry} onChange={handleChange}>
            <option value="">Select industry</option>
            <option value="saas">SaaS</option>
            <option value="fintech">Fintech</option>
            <option value="ecommerce">Ecommerce</option>
            <option value="healthcare">Healthcare</option>
            <option value="professional-services">Professional Services</option>
          </select>
        </div>

        <div className="auth-field">
          <label htmlFor="company-email">Company Email</label>
          <input
            id="company-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="auth-form__grid">
          <div className="auth-field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Confirm password"
              value={formData.confirm_password}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </>
  );
}

export default RegisterForm;
