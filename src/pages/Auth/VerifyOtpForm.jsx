import { useMemo, useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

// ─── Animation phase machine ───────────────────────────────────────────────
// idle → verifying → success-flash → collapse → checkmark → done
// idle → verifying → error → idle (auto-reset after 1 s)

function VerifyOtpForm({ onBack, email, verifyOtp, resendOtp, onSuccess }) {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [status, setStatus] = useState("idle"); // idle | error | resent
  const [phase, setPhase] = useState("idle"); // idle | verifying | flash | collapse | checkmark | done
  const { loading } = useAuth();

  const successTimers = useRef([]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => successTimers.current.forEach(clearTimeout);
  }, []);

  const code = useMemo(() => digits.join(""), [digits]);

  // ── Original digit logic — untouched ──────────────────────────────────────
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

  // ── Submit — original logic preserved, navigation delayed ─────────────────
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (code.length !== 6) {
      setStatus("error");
      return;
    }

    setPhase("verifying");

    try {
      await verifyOtp({ email, otp: code });

      // Step 2: flash
      setPhase("flash");

      const t1 = setTimeout(() => {
        // Step 3: collapse
        setPhase("collapse");

        const t2 = setTimeout(() => {
          // Step 4: checkmark
          setPhase("checkmark");

          const t3 = setTimeout(() => {
            // Step 5+6: done, then navigate after 1 s
            setPhase("done");

            const t4 = setTimeout(() => {
              onSuccess(); // original navigation — delayed until after full sequence
            }, 1000);

            successTimers.current.push(t4);
          }, 500);

          successTimers.current.push(t3);
        }, 500);

        successTimers.current.push(t2);
      }, 300);

      successTimers.current.push(t1);
    } catch (error) {
      console.log(error.response?.data);

      // Failure flow: shake + red border for 1 s, then auto-reset
      setPhase("error");

      const errTimer = setTimeout(() => {
        setPhase("idle");
        setStatus("error");
      }, 1000);

      successTimers.current.push(errTimer);
    }
  };

  // ── Resend — original logic untouched ─────────────────────────────────────
  const resendCode = async () => {
    try {
      await resendOtp({ email });

      setDigits(Array(6).fill(""));
      setStatus("resent");
      setPhase("idle");

      document.getElementById("otp-0")?.focus();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  // ── Derived booleans ──────────────────────────────────────────────────────
  const isVerifying = phase === "verifying";
  const isFlash = phase === "flash";
  const isCollapse = phase === "collapse";
  const isCheckmark = phase === "checkmark" || phase === "done";
  const isError = phase === "error";
  const showOtpGrid = !isCollapse && !isCheckmark;
  const showSuccessView = isCollapse || isCheckmark;

  return (
    <>
      {/* ── Header mark ──────────────────────────────────────────────────── */}
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
        {/* ── OTP grid → success collapse view ─────────────────────────── */}
        <fieldset className="auth-otp">
          <legend>6 digit OTP code</legend>

          <AnimatePresence mode="wait">
            {/* OTP input grid */}
            {showOtpGrid && (
              <motion.div
                key="otp-grid"
                className="auth-otp__grid"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {digits.map((digit, index) => (
                  <motion.div
                    key={index}
                    className={`otp-box-wrap${isVerifying ? " is-verifying" : ""}${isFlash ? " is-flash" : ""}${isError ? " is-error" : ""}`}
                    animate={
                      isError
                        ? { x: [0, -6, 6, -4, 4, 0] }
                        : { x: 0 }
                    }
                    transition={
                      isError
                        ? { duration: 0.45, ease: "easeInOut" }
                        : { duration: 0.2 }
                    }
                  >
                    {/* Sweeping border overlay — only visible when verifying */}
                    <AnimatePresence>
                      {isVerifying && (
                        <motion.span
                          className="otp-sweep"
                          key="sweep"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          aria-hidden="true"
                        />
                      )}
                    </AnimatePresence>

                    <motion.input
                      id={`otp-${index}`}
                      aria-label={`Digit ${index + 1}`}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      value={digit}
                      onChange={(event) => updateDigit(index, event.target.value)}
                      onKeyDown={(event) => handleKeyDown(index, event)}
                      disabled={isVerifying || isFlash}
                      animate={{
                        opacity: isFlash ? [1, 0] : 1,
                      }}
                      transition={
                        isFlash
                          ? { duration: 0.25, ease: "easeOut" }
                          : { duration: 0.15 }
                      }
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Success collapse → checkmark view */}
            {showSuccessView && (
              <motion.div
                key="success-view"
                className="otp-success-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                {/* Collapsing boxes → checkmark */}
                <AnimatePresence mode="wait">
                  {isCollapse && (
                    <motion.div
                      key="collapse-boxes"
                      className="otp-collapse-boxes"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          className="otp-collapse-box"
                          layout
                          initial={{ opacity: 1, scale: 1 }}
                          animate={{
                            opacity: 0,
                            scale: 0.4,
                            x: i < 3 ? (i - 2.5) * -28 : (i - 2.5) * 28,
                          }}
                          transition={{
                            duration: 0.4,
                            delay: i * 0.04,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                        />
                      ))}
                    </motion.div>
                  )}

                  {isCheckmark && (
                    <motion.div
                      key="checkmark"
                      className="otp-checkmark"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.34, 1.56, 0.64, 1], // spring-like overshoot
                        times: [0, 0.7, 1],
                      }}
                    >
                      {/* SVG checkmark */}
                      <svg
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <motion.path
                          d="M10 24l10 10 18-18"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                        />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success label — fades in with checkmark */}
                <AnimatePresence>
                  {isCheckmark && (
                    <motion.p
                      className="otp-success-label"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.35 }}
                    >
                      Account Verified Successfully
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </fieldset>

        {/* ── Status messages ───────────────────────────────────────────── */}
        <div className="auth-status" aria-live="polite">
          {status === "error" && phase === "idle" && (
            <p className="auth-status__error">
              Enter all 6 digits to verify your email.
            </p>
          )}
          {status === "resent" && <p>A new code has been sent.</p>}
        </div>

        {/* ── Submit button — hidden after success ───────────────────────── */}
        <AnimatePresence>
          {!showSuccessView && (
            <motion.button
              key="verify-btn"
              type="submit"
              className="auth-submit"
              disabled={loading || isVerifying || isFlash}
              exit={{ opacity: 0, y: 6, transition: { duration: 0.2 } }}
            >
              {isVerifying || loading ? "Verifying..." : "Verify"}
            </motion.button>
          )}
        </AnimatePresence>
      </form>

      {/* ── Footer links — hidden after success ───────────────────────────── */}
      <AnimatePresence>
        {!showSuccessView && (
          <motion.div
            key="footer-links"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <p className="auth-switch">
              Did not receive a code?{" "}
              <button type="button" onClick={resendCode}>
                Resend OTP
              </button>
            </p>

            <button
              type="button"
              className="auth-secondary-action"
              onClick={onBack}
            >
              Back to account details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default VerifyOtpForm;
