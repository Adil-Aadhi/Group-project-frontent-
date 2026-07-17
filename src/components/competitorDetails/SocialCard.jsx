import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaYoutube,
} from "react-icons/fa";
import './SocialCard.css'

const SOCIAL_ICONS = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  github: FaGithub,
  youtube: FaYoutube,
};

export default function SocialCard({ socials }) {
  if (!socials) return null;

  const entries = Object.entries(socials).filter(([, url]) => !!url);

  return (
    <div className="social-card">
      <h3 className="card-title">Social Presence</h3>

      {entries.length === 0 ? (
        <p className="social-card-empty">No social links found.</p>
      ) : (
        <div className="social-card-list">
          {entries.map(([platform, url]) => {
            const Icon = SOCIAL_ICONS[platform];
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-card-link"
              >
                {Icon && <Icon size={16} />}
                <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}