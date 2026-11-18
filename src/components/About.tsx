import React from 'react';
import { PROFILE } from '../data/profile';

export const About: React.FC = () => {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">About</span>
          <h2 className="section-title">Builder of Ideas, Artist at Heart</h2>
          <p className="section-subtitle">{PROFILE.education}</p>
        </div>

        <div className="about-grid">
          <article className="about-story glass-surface">
            {PROFILE.aboutStory.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </article>

          <div className="about-art-cards">
            <div className="art-focus-card glass-surface">
              <h3>Traditional Art</h3>
              <ul className="clean-list">
                {PROFILE.traditionalArtFocus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="art-focus-card glass-surface">
              <h3>Digital Art</h3>
              <ul className="clean-list">
                {PROFILE.digitalArtFocus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="skills-row">
            {PROFILE.skills.map((group) => (
              <div key={group.category} className="skill-card glass-surface">
                <h3>{group.category}</h3>
                <div className="tag-list">
                  {group.items.map((skill) => (
                    <span key={skill} className="chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
