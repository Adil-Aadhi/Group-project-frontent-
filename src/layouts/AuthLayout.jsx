import Logo from "../components/common/Logo";
import ThemeToggle from "../components/ui/ThemeToggle";

const metrics = [
  { label: "Signals tracked", value: "18.4K" },
  { label: "Market shifts", value: "312" },
  { label: "AI confidence", value: "94%" },
];

const features = [
  "Competitor Intelligence",
  "AI Strategic Insights",
  "Real-Time Monitoring",
];

function AuthLayout({ children }) {
  return (
    <main className="auth-page">
      <div className="auth-shell auth-fade-in">
        <section className="auth-showcase">
          <div className="auth-glow auth-glow--top" />
          <div className="auth-glow auth-glow--bottom" />

          <div className="auth-showcase__logo">
            <Logo />
          </div>

          <div className="auth-showcase__content">
            <div className="auth-badge mt-6">
              <span />
              AI-Powered Intelligence
            </div>

            <h1 className="auth-showcase__title">
              Transform Data Into Strategic <span className="text-orange-500">Intelligence</span>
            </h1>

            <p className="auth-showcase__copy">
              Monitor competitors, uncover opportunities, and make smarter
              decisions with AI-powered business intelligence.
            </p>

            <div className="auth-feature-list">
              {features.map((feature) => (
                <div key={feature} className="auth-feature">
                  <span>✓</span>
                  {feature}
                </div>
              ))}
            </div>

            <div className="auth-preview auth-float">
              <div className="auth-preview__header">
                <div>
                  <p>Intelligence Overview</p>
                  <h2>Market pulse</h2>
                </div>
                <span>Live</span>
              </div>

              <div className="auth-metrics">
                {metrics.map((metric) => (
                  <div key={metric.label} className="auth-metric">
                    <p>{metric.value}</p>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>

              <div className="auth-chart-card">
                <div className="auth-chart-card__top">
                  <span>Opportunity velocity</span>
                  <strong>+28%</strong>
                </div>

                <div className="auth-chart">
                  {[42, 58, 46, 72, 64, 86, 78, 96].map((height, index) => (
                    <span
                      key={height + index}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-panel__top">
            <div className="auth-panel__mobile-logo">
              <Logo />
            </div>
            <ThemeToggle />
          </div>

          <div className="auth-panel__body">{children}</div>
        </section>
      </div>
    </main>
  );
}

export default AuthLayout;
