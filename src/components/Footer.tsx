import React from 'react';
import { PROFILE } from '../data/profile';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>
          © {new Date().getFullYear()} {PROFILE.name}. Built with TypeScript, React & Liquid Glass CSS.
        </span>
        <a href="#home" className="glass-btn glass-btn--sm">
          Back to top
        </a>
      </div>
    </footer>
  );
};
