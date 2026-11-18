import React from 'react';
import { PROFILE } from '../data/profile';
import { ExternalLinkIcon, MailIcon } from './Icons';

export const Connect: React.FC = () => {
  return (
    <section id="connect" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Connect</span>
          <h2 className="section-title">Collaborate, Support & Contact</h2>
        </div>

        <div className="connect-grid">
          <article className="connect-card glass-surface">
            <div>
              <h3 style={{ margin: '0 0 8px' }}>{PROFILE.collaboration.heading}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {PROFILE.collaboration.summary}
              </p>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              {PROFILE.collaboration.options.map((opt) => (
                <div
                  key={opt.title}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--glass-border)',
                  }}
                >
                  <strong style={{ fontSize: '0.9375rem' }}>{opt.title}</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {opt.description}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="connect-card glass-surface">
            <div>
              <h3 style={{ margin: '0 0 8px' }}>{PROFILE.support.heading}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {PROFILE.support.summary}
              </p>
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              {PROFILE.support.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-btn"
                  style={{ justifyContent: 'space-between', width: '100%' }}
                >
                  <span>{link.label}</span>
                  <ExternalLinkIcon size={15} />
                </a>
              ))}
            </div>

            <div
              style={{
                marginTop: 'auto',
                paddingTop: 14,
                borderTop: '1px solid var(--glass-border)',
                display: 'grid',
                gap: 10,
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Direct Contact</h3>
              <a
                href={`mailto:${PROFILE.contact.email}`}
                className="glass-btn glass-btn--primary"
                style={{ width: '100%' }}
              >
                <MailIcon size={17} />
                <span>{PROFILE.contact.email}</span>
              </a>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {PROFILE.contact.note}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
