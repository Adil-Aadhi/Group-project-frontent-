import React from "react";
import { Check, X, ArrowRight, TrendingUp, AlertTriangle } from "lucide-react";
import "./CompareCard.css";
// add this import at the top
import { OfferingGapChart, SocialCoverageChart, PriorityDistribution } from "../../components/competitorDetails/CompareCharts";

function GapColumn({ title, items, tone }) {
  return (
    <div className={`gap-column gap-column-${tone}`}>
      <h4 className="gap-column-title">{title}</h4>
      {items && items.length > 0 ? (
        <ul className="gap-column-list">
          {items.map((item, idx) => (
            <li key={idx}>
              {tone === "positive" ? (
                <Check size={14} className="gap-icon gap-icon-positive" />
              ) : (
                <AlertTriangle size={14} className="gap-icon gap-icon-negative" />
              )}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="gap-column-empty">None found.</p>
      )}
    </div>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span className={`priority-badge priority-badge-${priority}`}>
      {priority}
    </span>
  );
}

export default function CompareCard({ comparison }) {
  if (!comparison) {
    return (
      <div className="compare-card">
        <h3 className="card-title">Comparison</h3>
        <p className="compare-card-empty">
          Comparison data isn't available yet.
        </p>
      </div>
    );
  }

  const {
    competitor_name,
    positioning_gap,
    reputation,
    social_presence_gap,
    recommendations,
    narrative_gap_analysis,
    trajectory,
    data_freshness_note,
  } = comparison;

  const hasReputationData =
    reputation &&
    ((reputation.us?.praised_for?.length ?? 0) > 0 ||
      (reputation.us?.criticized_for?.length ?? 0) > 0 ||
      (reputation.competitor?.praised_for?.length ?? 0) > 0 ||
      (reputation.competitor?.criticized_for?.length ?? 0) > 0 ||
      reputation.us?.rating ||
      reputation.competitor?.rating);

  return (
    <div className="compare-card">
      <div className="compare-card-header">
        <h3 className="card-title">Comparison vs {competitor_name}</h3>
        {data_freshness_note && (
          <span className="compare-freshness">{data_freshness_note}</span>
        )}
      </div>

      {/* Positioning summary */}
      {narrative_gap_analysis && (
        <div className="compare-section">
          <div className="positioning-summary">
            <div className="positioning-summary-block">
              <span className="positioning-summary-label">Us</span>
              <p>{narrative_gap_analysis.our_summary_highlights}</p>
            </div>
            <div className="positioning-summary-block">
              <span className="positioning-summary-label">{competitor_name}</span>
              <p>{narrative_gap_analysis.competitor_summary_highlights}</p>
            </div>
          </div>
          {narrative_gap_analysis.tone_and_positioning_difference && (
            <div className="positioning-tone-note">
              <TrendingUp size={14} />
              <p>{narrative_gap_analysis.tone_and_positioning_difference}</p>
            </div>
          )}
        </div>
      )}

      {/* Offering gap */}
      {positioning_gap && (
        <div className="compare-section">
          <h4 className="compare-section-title">Offering Gap</h4>

          <OfferingGapChart
              positioningGap={positioning_gap}
              usName="Us"
              themName={competitor_name}
            />

          <div className="gap-grid">
            <GapColumn
              title="They have, we don't"
              items={positioning_gap.competitor_has_we_dont}
              tone="negative"
            />
            <GapColumn
              title="We have, they don't"
              items={positioning_gap.we_have_competitor_doesnt}
              tone="positive"
            />
          </div>
          {positioning_gap.overlap && positioning_gap.overlap.length > 0 && (
            <div className="gap-overlap">
              <span className="gap-overlap-label">Overlap</span>
              <span>{positioning_gap.overlap.join(", ")}</span>
            </div>
          )}
        </div>
      )}


      {/* Social presence gap */}
      {social_presence_gap && (
        <div className="compare-section">
          <h4 className="compare-section-title">Social Presence</h4>

           <SocialCoverageChart
              socialGap={social_presence_gap}
              usName="Us"
              themName={competitor_name}
            />

          <div className="social-gap-table" style={{ marginTop: 16 }}>
            <div className="social-gap-row social-gap-row-header">
              <span>Platform</span>
              <span>Us</span>
              <span>{competitor_name}</span>
            </div>
            {Array.from(
              new Set([
                ...(social_presence_gap.we_active_on || []),
                ...(social_presence_gap.competitor_active_on || []),
              ])
            ).map((platform) => (
              <div className="social-gap-row" key={platform}>
                <span className="social-gap-platform">
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </span>
                <span>
                  {social_presence_gap.we_active_on?.includes(platform) ? (
                    <Check size={15} className="gap-icon-positive" />
                  ) : (
                    <X size={15} className="gap-icon-negative" />
                  )}
                </span>
                <span>
                  {social_presence_gap.competitor_active_on?.includes(platform) ? (
                    <Check size={15} className="gap-icon-positive" />
                  ) : (
                    <X size={15} className="gap-icon-negative" />
                  )}
                </span>
              </div>
            ))}
          </div>
          {social_presence_gap.channels_competitor_has_we_lack?.length > 0 && (
            <p className="social-gap-callout">
              Opportunity: {competitor_name} is active on{" "}
              {social_presence_gap.channels_competitor_has_we_lack.join(", ")}{" "}
              — channels we haven't established a presence on.
            </p>
          )}
        </div>
      )}

      {/* Reputation */}
      <div className="compare-section">
        <h4 className="compare-section-title">Reputation</h4>
        {hasReputationData ? (
          <div className="reputation-grid">
            <div className="reputation-block">
              <span className="reputation-label">Us</span>
              {reputation.us.rating && <p className="reputation-rating">{reputation.us.rating}</p>}
              <GapColumn title="Praised for" items={reputation.us.praised_for} tone="positive" />
              <GapColumn title="Criticized for" items={reputation.us.criticized_for} tone="negative" />
            </div>
            <div className="reputation-block">
              <span className="reputation-label">{competitor_name}</span>
              {reputation.competitor.rating && (
                <p className="reputation-rating">{reputation.competitor.rating}</p>
              )}
              <GapColumn title="Praised for" items={reputation.competitor.praised_for} tone="positive" />
              <GapColumn title="Criticized for" items={reputation.competitor.criticized_for} tone="negative" />
            </div>
          </div>
        ) : (
          <p className="compare-section-empty">
            Not enough review data yet to compare reputation.
          </p>
        )}
      </div>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="compare-section">
          <h4 className="compare-section-title">Recommendations</h4>

          <PriorityDistribution recommendations={recommendations} />

          
          <div className="recommendation-list">
            {recommendations.map((rec, idx) => (
              <div className="recommendation-item" key={idx}>
                <div className="recommendation-item-header">
                  <PriorityBadge priority={rec.priority} />
                  <span className="recommendation-action">{rec.action}</span>
                </div>
                <p className="recommendation-why">
                  <ArrowRight size={12} /> {rec.why}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trajectory */}
      {trajectory && trajectory.length > 0 && (
        <div className="compare-section">
          <h4 className="compare-section-title">Recent Changes</h4>
          <div className="trajectory-list">
            {trajectory.map((t, idx) => (
              <div className="trajectory-item" key={idx}>
                <span className="trajectory-date">
                  {new Date(t.date).toLocaleDateString()}
                </span>
                <span className="trajectory-change">{t.change}</span>
                <span className="trajectory-signal">{t.signal}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}