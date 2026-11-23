import React from 'react';
import { PROJECTS, ProjectItem } from '../data/projects';
import { ExternalLinkIcon } from './Icons';

const ProjectCard: React.FC<{ project: ProjectItem }> = ({ project }) => {
  return (
    <article className="project-card glass-surface">
      <div>
        <div className="project-card-head">
          <div>
            <h3 className="project-title">{project.title}</h3>
            {project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
          </div>
          <span className="chip">
            {project.status === 'working' ? 'Working' : 'Under Development'}
          </span>
        </div>

        {project.screenshot && (
          <img
            src={project.screenshot}
            alt={`${project.title} preview`}
            className="project-screenshot"
            loading="lazy"
            style={{ marginTop: 14 }}
          />
        )}

        <p className="project-desc" style={{ marginTop: 14 }}>
          {project.description}
        </p>

        {project.note && (
          <p className="project-subtitle" style={{ marginTop: 10 }}>
            {project.note}
          </p>
        )}
      </div>

      <div>
        <div className="tag-list">
          {project.technologies.map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>

        <div className="project-links">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-btn glass-btn--sm"
            >
              <span>Repository</span>
              <ExternalLinkIcon size={14} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-btn glass-btn--sm glass-btn--primary"
            >
              <span>Open Live App</span>
              <ExternalLinkIcon size={14} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export const Projects: React.FC = () => {
  const workingProjects = PROJECTS.filter((p) => p.status === 'working');
  const devProjects = PROJECTS.filter((p) => p.status === 'in-development');

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Projects</span>
          <h2 className="section-title">Selected Builds & Experiments</h2>
          <p className="section-subtitle">
            Selected projects across web tools and collaborative college engineering work. This is not an exhaustive list.
          </p>
        </div>

        <div className="project-group">
          <h3 className="project-group-title">
            <span className="status-dot status-dot--working" aria-hidden="true" />
            <span>Working Projects</span>
          </h3>
          <div className="projects-grid">
            {workingProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        <div className="project-group" style={{ marginBottom: 0 }}>
          <h3 className="project-group-title">
            <span className="status-dot status-dot--dev" aria-hidden="true" />
            <span>Projects Under Development</span>
          </h3>
          <div className="projects-grid">
            {devProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
