import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { useNavigate } from "react-router-dom";

function ResetPasswordForm({ email, otp }) {
  const { resetPassword, loading } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    try {
      await resetPassword({
        email,
        new_password: formData.password,
        confirm_password: formData.confirm_password,
      });

      navigate("/login");
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <>
      <div className="auth-card__header">
        <p>Password Recovery</p>
        <h1>Create New Password</h1>
        <span>
          Enter your new password below.
        </span>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label>New Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="auth-field">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirm_password"
            required
            value={formData.confirm_password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="auth-submit"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </>
  );
}

export default ResetPasswordForm;