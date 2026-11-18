import React from 'react';
import { PROFILE } from '../data/profile';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-card glass-surface">
          <div className="hero-badges">
            <span className="chip chip--accent">Computer Engineering Diploma (Final Year)</span>
            <span className="chip">Independent Idea Creator</span>
            <span className="chip">AI-Assisted Builder</span>
            <span className="chip">Traditional & Digital Artist</span>
          </div>

          <h1 className="hero-title">{PROFILE.name}</h1>

          <p className="hero-tagline">{PROFILE.intro}</p>

          <p className="hero-note">{PROFILE.honestNote}</p>

          <div className="hero-actions">
            <a href="#gallery" className="glass-btn glass-btn--primary">
              Explore Art Gallery
            </a>
            <a href="#projects" className="glass-btn">
              View Selected Projects
            </a>
            <a href="#connect" className="glass-btn">
              Collaborate / Contact
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
