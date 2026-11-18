export type ProjectStatus = 'working' | 'in-development';

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  status: ProjectStatus;
  description: string;
  technologies: string[];
  repoUrl?: string;
  liveUrl?: string;
  screenshot?: string;
  note?: string;
  collaborative?: boolean;
}

/**
 * Selected Projects Configuration
 * Add, edit, or reorder projects here.
 * Status "working" and "in-development" are displayed in separate sections.
 */
export const PROJECTS: ProjectItem[] = [
  {
    id: 'zip-to-git',
    title: 'ZIP-TO-GIT',
    subtitle: 'Mobile-Friendly GitHub Publishing Tool',
    status: 'working',
    description:
      'A simple GitHub publishing tool. Users connect their GitHub account, upload a project ZIP, and publish it to GitHub through an easy workflow. Designed to make project uploading convenient even from smaller devices, including mobile.',
    technologies: ['Web App', 'GitHub OAuth / API', 'ZIP Handling', 'Mobile-First UI'],
    repoUrl: 'https://github.com/anitikrish-ai/zip-to-git',
    note: 'Selected working project focused on accessible publishing from mobile devices.',
  },
  {
    id: 'dropfast',
    title: 'DROPFAST',
    subtitle: 'Cross-Device File & Image Sharing',
    status: 'working',
    description:
      'A fast file and image sharing platform for transferring content between devices, including one-to-one and one-to-many sharing.',
    technologies: ['Web Platform', 'File Transfer', 'Responsive UI'],
    liveUrl: 'https://dropfast.lovable.app',
    note: 'Live web application for quick one-to-one and one-to-many transfers.',
  },
  {
    id: 'ikis-paint-web',
    title: 'IKIS PAINT WEB',
    subtitle: 'Desktop Browser Painting Application',
    status: 'in-development',
    description:
      'A browser-based painting application inspired by ibis Paint X, featuring Liquid Glass support. Designed for desktop browsers only.',
    technologies: ['HTML5 Canvas', 'TypeScript / JS', 'Liquid Glass UI', 'Desktop Only'],
    repoUrl: 'https://github.com/anitikrish-ai/ikis-paint-web',
    note: 'Designed for desktop browsers only.',
  },
  {
    id: 'driftjs',
    title: 'DRIFTJS',
    subtitle: 'Collaborative College Project',
    status: 'in-development',
    collaborative: true,
    description:
      'Built collaboratively with my friends as a college project. DriftJS is a frontend UI framework and reactivity engine powered by an in-browser register-based Bytecode Virtual Machine and an Ahead-of-Time optimizing compiler. It compiles .drift Single File Components into compact instruction streams and executes them using a lightweight 256-register VM for direct DOM updates, with SSR and SSG support through shared compiled bytecode.',
    technologies: ['TypeScript', 'AOT Compiler', '256-Register VM', 'SSR / SSG', '.drift SFC'],
    repoUrl: 'https://github.com/driftjs-org',
    note: 'Collaborative engineering work built together with college friends.',
  },
];
