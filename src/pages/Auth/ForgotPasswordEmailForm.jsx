import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { FaSpinner } from "react-icons/fa";

function ForgotPasswordEmailForm({ onVerifyOtp }) {
  const { forgotPassword, loading } = useAuth();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await forgotPassword({ email });

      onVerifyOtp({ email });
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <>
      <div className="auth-card__header">
        <p>Password Recovery</p>
        <h1>Forgot Password</h1>
        <span>
          Enter your registered email address to receive a verification code.
        </span>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label>Email</label>
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="auth-submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="btn-spinner" />
              Sending...
            </>
          ) : (
            "Send OTP"
          )}
        </button>
      </form>
    </>
  );
}

export default ForgotPasswordEmailForm;