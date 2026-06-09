import { useAuth } from "../../hooks/auth/useAuth";
import { useState, useEffect } from "react";
import { checkCompanyUrl } from "../../services/auth/companyService";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";
import {
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

// ─── Password strength helpers ────────────────────────────────────────────────

function calcStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0‒4
}

const STRENGTH_META = [
  { label: "Weak",   color: "var(--pw-weak)"   },
  { label: "Fair",   color: "var(--pw-fair)"   },
  { label: "Good",   color: "var(--pw-good)"   },
  { label: "Strong", color: "var(--pw-strong)" },
];

// ─── Component ────────────────────────────────────────────────────────────────

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

  const [urlStatus, setUrlStatus] = useState({
    loading: false,
    valid: null,
    message: "",
  });

  // ── new password-UX state ──────────────────────────────────────────────────
  const [pwFocused, setPwFocused]   = useState(false);
  const [pwTouched, setPwTouched]   = useState(false);
  const [cfmTouched, setCfmTouched] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Inline guard replaces the alert()
    if (formData.password !== formData.confirm_password) {
      setCfmTouched(true);
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

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    formData.email
  );

  useEffect(() => {
    if (!formData.website_link.trim()) {
      setUrlStatus({
        loading: false,
        valid: null,
        message: "",
      });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setUrlStatus({
          loading: true,
          valid: null,
          message: "Checking...",
        });

        const result = await checkCompanyUrl(
          formData.website_link
        );

        setUrlStatus({
          loading: false,
          valid: result.valid,
          message: result.message,
        });
      } catch {
        setUrlStatus({
          loading: false,
          valid: false,
          message: "Validation failed",
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData.website_link]);

  // ── derived password state ─────────────────────────────────────────────────
  const pw       = formData.password;
  const cfm      = formData.confirm_password;
  const strength = calcStrength(pw);

  const checks = [
    { label: "8+ characters",    met: pw.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(pw) },
    { label: "Number",           met: /[0-9]/.test(pw) },
    { label: "Special character",met: /[^A-Za-z0-9]/.test(pw) },
  ];

  const showPwPanel = pwFocused || pwTouched || pw.length > 0;

  const passwordsMatch = pw === cfm;
  const showCfmStatus  = cfmTouched && cfm.length > 0;

  // active bar color = color of current strength level (or none for 0)
  const barColor = strength > 0
    ? STRENGTH_META[strength - 1].color
    : "var(--border)";

  const strengthLabel = strength > 0
    ? STRENGTH_META[strength - 1].label
    : "";

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
            <label htmlFor="company-website">
              Company Website
            </label>

            <div className="website-input-wrapper">
              <input
                id="company-website"
                name="website_link"
                type="text"
                autoComplete="url"
                required
                placeholder="company.com"
                value={formData.website_link}
                onChange={handleChange}
              />

              {!urlStatus.loading &&
                  urlStatus.valid === true && (
                    <FaCheckCircle
                      className="url-indicator success"
                    />
                )}

                {!urlStatus.loading &&
                  urlStatus.valid === false && (
                    <FaTimesCircle
                      className="url-indicator error"
                    />
                )}
                {urlStatus.loading && (
                  <FaSpinner
                    className="url-indicator loading"
                  />
                )}
            </div>
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
          {formData.email && !isEmailValid && (
            <p className="field-error">
              Please enter a valid email address
            </p>
          )}
        </div>

        {/* ── Password grid ─────────────────────────────────────────────── */}
        <div className="auth-form__grid">

          {/* Password field + strength panel */}
          <div className="auth-field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Create password"
              value={pw}
              onChange={(e) => { handleChange(e); setPwTouched(true); }}
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
            />

            {/* Strength meter — fade/slide in when panel should show */}
            <AnimatePresence initial={false}>
              {showPwPanel && (
                <motion.div
                  className="pw-panel"
                  key="pw-panel"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  {/* 4 strength bars */}
                  <div className="pw-bars" aria-hidden="true">
                    {[1, 2, 3, 4].map((bar) => (
                      <motion.span
                        key={bar}
                        className="pw-bar"
                        animate={{
                          backgroundColor:
                            strength >= bar ? barColor : "var(--border)",
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    ))}
                  </div>

                  {/* Strength label */}
                  <AnimatePresence mode="wait">
                    {strengthLabel && (
                      <motion.p
                        key={strengthLabel}
                        className="pw-label"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: barColor }}
                      >
                        {strengthLabel}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Checklist */}
                  <ul className="pw-checklist" role="list">
                    {checks.map((c) => (
                      <motion.li
                        key={c.label}
                        className={`pw-check-item${c.met ? " is-met" : ""}`}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.22 }}
                      >
                        <motion.span
                          animate={{
                            color: c.met
                              ? "var(--success)"
                              : "var(--text-secondary)",
                          }}
                          transition={{ duration: 0.25 }}
                          className="pw-check-icon"
                        >
                          {c.met
                            ? <HiCheckCircle aria-hidden="true" />
                            : <HiXCircle    aria-hidden="true" />}
                        </motion.span>
                        <motion.span
                          animate={{
                            color: c.met
                              ? "var(--text-primary)"
                              : "var(--text-secondary)",
                          }}
                          transition={{ duration: 0.25 }}
                          className="pw-check-label"
                        >
                          {c.label}
                        </motion.span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Confirm password field + inline match indicator */}
          <div className="auth-field">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Confirm password"
              value={cfm}
              onChange={(e) => { handleChange(e); setCfmTouched(true); }}
            />

            <AnimatePresence initial={false}>
              {showCfmStatus && (
                <motion.p
                  key={passwordsMatch ? "match" : "mismatch"}
                  className={`pw-cfm-status${passwordsMatch ? " is-match" : " is-mismatch"}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  {passwordsMatch
                    ? <><HiCheckCircle aria-hidden="true" /> Passwords match</>
                    : <><HiXCircle    aria-hidden="true" /> Passwords do not match</>
                  }
                </motion.p>
              )}
            </AnimatePresence>
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
