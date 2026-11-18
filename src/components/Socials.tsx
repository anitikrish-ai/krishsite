import React from 'react';
import { SOCIAL_PROFILES } from '../data/socials';
import { ExternalLinkIcon, SocialIcon } from './Icons';

export const Socials: React.FC = () => {
  return (
    <section id="socials" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Socials</span>
          <h2 className="section-title">Around the Web</h2>
          <p className="section-subtitle">
            Code repositories, video experiments, art posts, and visual inspiration boards.
          </p>
        </div>

        <div className="socials-grid">
          {SOCIAL_PROFILES.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card glass-surface"
            >
              <div className="social-icon-box">
                <SocialIcon platform={item.id} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <strong>{item.label}</strong>
                  <ExternalLinkIcon size={14} />
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--accent-blue)', marginTop: 2 }}>
                  {item.username}
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
