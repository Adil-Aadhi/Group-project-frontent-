import { useAuth } from "../../hooks/auth/useAuth";
import { useState, useEffect, useRef } from "react";
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
  { label: "Weak", color: "var(--pw-weak)" },
  { label: "Fair", color: "var(--pw-fair)" },
  { label: "Good", color: "var(--pw-good)" },
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
  const [pwFocused, setPwFocused] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);
  const [cfmTouched, setCfmTouched] = useState(false);

  // ── industry dropdown state ────────────────────────────────────────────────
  const [industryOpen, setIndustryOpen] = useState(false);
  const industryRef = useRef(null);

  const INDUSTRY_OPTIONS = [
    { value: "saas", label: "SaaS" },
    { value: "fintech", label: "Fintech" },
    { value: "ecommerce", label: "Ecommerce" },
    { value: "healthcare", label: "Healthcare" },
    { value: "professional-services", label: "Professional Services" },
  ];

  const selectedIndustry = INDUSTRY_OPTIONS.find(
    (o) => o.value === formData.industry
  ) ?? null;

  // close on outside click
  useEffect(() => {
    if (!industryOpen) return;
    const handler = (e) => {
      if (industryRef.current && !industryRef.current.contains(e.target)) {
        setIndustryOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [industryOpen]);

  const handleIndustrySelect = (value) => {
    // Synthesise a change event so existing handleChange + formData stay intact
    handleChange({ target: { name: "industry", value } });
    setIndustryOpen(false);
  };

  const handleIndustryKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIndustryOpen((o) => !o);
    }
    if (e.key === "Escape") setIndustryOpen(false);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = INDUSTRY_OPTIONS.findIndex((o) => o.value === formData.industry);
      const next = INDUSTRY_OPTIONS[(idx + 1) % INDUSTRY_OPTIONS.length];
      handleChange({ target: { name: "industry", value: next.value } });
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = INDUSTRY_OPTIONS.findIndex((o) => o.value === formData.industry);
      const prev = INDUSTRY_OPTIONS[(idx - 1 + INDUSTRY_OPTIONS.length) % INDUSTRY_OPTIONS.length];
      handleChange({ target: { name: "industry", value: prev.value } });
    }
  };

  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");

    // Inline guard replaces the alert()
    if (!isFormValid) {
      setPwTouched(true);
      setCfmTouched(true);
      return;
    }

    try {
      const response = await register(formData);

      console.log(response);

      // Move to OTP page/modal
      onVerifyOtp({
        email: formData.email,
        companyName: formData.company_name
      });
    } catch (error) {
      setSubmitError(
        error.response?.data?.detail ||
        "Something went wrong. Please try again."
      );
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
  const pw = formData.password;
  const cfm = formData.confirm_password;
  const strength = calcStrength(pw);

  const checks = [
    { label: "8+ characters", met: pw.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(pw) },
    { label: "Number", met: /[0-9]/.test(pw) },
    { label: "Special character", met: /[^A-Za-z0-9]/.test(pw) },
  ];

  const showPwPanel = pwFocused

  const passwordsMatch = pw === cfm;
  const showCfmStatus = cfmTouched && cfm.length > 0;

  // active bar color = color of current strength level (or none for 0)
  const barColor = strength > 0
    ? STRENGTH_META[strength - 1].color
    : "var(--border)";

  const strengthLabel = strength > 0
    ? STRENGTH_META[strength - 1].label
    : "";

  const isPasswordValid =
    pw.length >= 8 &&
    /[A-Z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw);

  const isFormValid =
    urlStatus.valid === true &&
    isEmailValid &&
    isPasswordValid &&
    passwordsMatch;
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

        {/* ── Industry custom dropdown ───────────────────────────────────── */}
        <div className="auth-field" ref={industryRef}>
          <label id="industry-label">Industry</label>

          {/* Hidden native select keeps form validation & formData in sync */}
          <input
            type="hidden"
            name="industry"
            value={formData.industry}
            required
          />

          {/* Trigger button */}
          <button
            id="industry"
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={industryOpen}
            aria-labelledby="industry-label"
            aria-controls="industry-listbox"
            className={`industry-trigger${industryOpen ? " is-open" : ""
              }${!formData.industry ? " is-placeholder" : ""
              }`}
            onClick={() => setIndustryOpen((o) => !o)}
            onKeyDown={handleIndustryKeyDown}
          >
            <span className="industry-trigger__label">
              {selectedIndustry ? selectedIndustry.label : "Select industry"}
            </span>

            <motion.span
              className="industry-trigger__chevron"
              animate={{ rotate: industryOpen ? 180 : 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 6l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          </button>

          {/* Animated dropdown panel */}
          <AnimatePresence>
            {industryOpen && (
              <motion.ul
                id="industry-listbox"
                role="listbox"
                aria-labelledby="industry-label"
                className="industry-listbox"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              >
                {INDUSTRY_OPTIONS.map((opt) => {
                  const isSelected = formData.industry === opt.value;
                  return (
                    <motion.li
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      className={`industry-option${isSelected ? " is-selected" : ""
                        }`}
                      onClick={() => handleIndustrySelect(opt.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleIndustrySelect(opt.value);
                        }
                      }}
                      tabIndex={0}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.14 }}
                    >
                      <span className="industry-option__label">{opt.label}</span>

                      {isSelected && (
                        <motion.span
                          className="industry-option__check"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.18 }}
                          aria-hidden="true"
                        >
                          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M3 8l3.5 3.5L13 4.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.span>
                      )}
                    </motion.li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div className="auth-field">
          <div className="email-input-wrapper">
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

            {formData.email.length > 0 &&
              (isEmailValid ? (
                <FaCheckCircle
                  className="email-status success"
                />
              ) : (
                <FaTimesCircle
                  className="email-status error"
                />
              ))}
          </div>
        </div>

        {/* ── Password grid ─────────────────────────────────────────────── */}
        <div className="auth-form__grid">

          {/* Password */}
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
              onChange={(e) => {
                handleChange(e);
                setPwTouched(true);
              }}
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
            />
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <div className="confirm-password-wrapper">
              <input
                id="confirm-password"
                name="confirm_password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Confirm password"
                value={cfm}
                onChange={(e) => {
                  handleChange(e);
                  setCfmTouched(true);
                }}
              />

              {cfm.length > 0 &&
                (passwordsMatch ? (
                  <HiCheckCircle
                    className="confirm-status success"
                  />
                ) : (
                  <HiXCircle
                    className="confirm-status error"
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Password Panel BELOW BOTH FIELDS */}
        <AnimatePresence initial={false}>
          {showPwPanel && (
            <motion.div
              className="pw-panel-full"
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <motion.h4
                className="pw-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Password Strength
              </motion.h4>

              {/* Strength Bars */}
              <div className="pw-bars">
                {[1, 2, 3, 4].map((bar) => (
                  <motion.span
                    key={bar}
                    className="pw-bar"
                    animate={{
                      backgroundColor:
                        strength >= bar
                          ? barColor
                          : "var(--border)",
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                  />
                ))}
              </div>

              {/* Strength Label */}
              {strengthLabel && (
                <motion.p
                  className="pw-label"
                  style={{
                    color: barColor,
                  }}
                >
                  {strengthLabel}
                </motion.p>
              )}

              {/* Checklist */}
              <ul className="pw-checklist">
                {checks.map((c) => (
                  <li
                    key={c.label}
                    className={`pw-check-item ${c.met ? "is-met" : ""
                      }`}
                  >
                    {c.met ? (
                      <HiCheckCircle className="pw-check-icon" />
                    ) : (
                      <HiXCircle className="pw-check-icon" />
                    )}

                    <span>{c.label}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {submitError && (
            <motion.div
              className="submit-error"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {submitError}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          className="auth-submit"
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <>
              <FaSpinner className="btn-spinner" />
              Creating...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </>
  );
}

export default RegisterForm;
