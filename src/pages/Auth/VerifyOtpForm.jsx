import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";

function VerifyOtpForm({ onBack,email,verifyOtp,resendOtp,onSuccess, }) {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [status, setStatus] = useState("idle");
  const {loading } = useAuth();


  const code = useMemo(() => digits.join(""), [digits]);

  const updateDigit = (index, value) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = nextValue;
    setDigits(nextDigits);
    setStatus("idle");

    if (nextValue && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (code.length !== 6) {
      setStatus("error");
      return;
    }

    try {
      await verifyOtp({
        email,
        otp: code,
      });

      setStatus("success");
      onSuccess();
    } catch (error) {
      console.log(error.response?.data);

      setStatus("error");
    }
  };

  const resendCode = async () => {
    try {
      await resendOtp({
        email,
      });

      setDigits(Array(6).fill(""));
      setStatus("resent");

      document.getElementById("otp-0")?.focus();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <>
      <div className="auth-verify-mark">
        <span />
      </div>

      <div className="auth-card__header">
        <p>Secure workspace verification</p>
        <h1>Verify your email</h1>
        <span>
          Enter the 6 digit code sent to your company email to activate your
          VoxIntel workspace.
        </span>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <fieldset className="auth-otp">
          <legend>6 digit OTP code</legend>
          <div className="auth-otp__grid">
            {digits.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                aria-label={`Digit ${index + 1}`}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                value={digit}
                onChange={(event) => updateDigit(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
              />
            ))}
          </div>
        </fieldset>

        <div className="auth-status" aria-live="polite">
          {status === "success" && (
            <p className="auth-status__success">
              Verification successful. Your workspace is ready.
            </p>
          )}

          {status === "error" && (
            <p className="auth-status__error">
              Enter all 6 digits to verify your email.
            </p>
          )}

          {status === "resent" && <p>A new code has been sent.</p>}
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <p className="auth-switch">
        Did not receive a code?{" "}
        <button type="button" onClick={resendCode}>
          Resend OTP
        </button>
      </p>

      <button type="button" className="auth-secondary-action" onClick={onBack}>
        Back to account details
      </button>
    </>
  );
}

export default VerifyOtpForm;
