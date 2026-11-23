export interface SkillGroup {
  category: string;
  items: string[];
}

export interface CollaborationOption {
  title: string;
  description: string;
}

export interface SupportLink {
  label: string;
  description: string;
  url: string;
}

export interface ProfileConfig {
  name: string;
  tagline: string;
  education: string;
  location: string;
  intro: string;
  honestNote: string;
  aboutStory: string[];
  traditionalArtFocus: string[];
  digitalArtFocus: string[];
  skills: SkillGroup[];
  collaboration: {
    heading: string;
    summary: string;
    options: CollaborationOption[];
  };
  support: {
    heading: string;
    summary: string;
    links: SupportLink[];
  };
  contact: {
    email: string;
    note: string;
  };
}

export const PROFILE: ProfileConfig = {
  name: 'Krish Makwana',
  tagline: 'Computer Engineering diploma student who builds browser tools and draws.',
  education: 'Final-year Computer Engineering Diploma student (planning to pursue a Bachelor’s degree next)',
  location: 'India',
  intro: 'I build browser tools like DROPFAST and draw pencil sketches and anime-inspired digital art.',
  honestNote: 'I am a Computer Engineering diploma student learning by building small web tools and drawing.',
  aboutStory: [
    'I am a final-year Computer Engineering Diploma student planning to pursue a degree after graduation. I build web tools and make visual art.',
    'On the technology side, I build practical web tools and creative software concepts while strengthening my foundations in HTML, CSS, JavaScript, SQL, and Python.',
    'I draw pencil and pen sketches on paper and explore anime-inspired characters, portraits, and digital illustration.'
  ],
  traditionalArtFocus: [
    'Pencil sketches',
    'Hand-drawn anime artwork',
    'Portraits and character drawings',
    'Pen and paper illustrations',
    'Physical drawing experiments',
  ],
  digitalArtFocus: [
    'Digital sketches and illustrations',
    'Anime-inspired digital artwork',
    'Digital painting and coloring',
    'Creative experiments and visual designs',
  ],
  skills: [
    {
      category: 'Web',
      items: ['HTML', 'CSS', 'JavaScript', 'SQL', 'Python'],
    },
    {
      category: 'Tools',
      items: ['Git & GitHub', 'UI Prototyping', 'Product Ideation'],
    },
    {
      category: 'Art',
      items: ['Pencil & Pen Sketching', 'Digital Illustration', 'Anime Character Art', 'Coloring & Visual Studies'],
    },
  ],
  collaboration: {
    heading: 'Hire Me & Collaborate',
    summary:
      'Open to student collaborations, creative web ideas, UI experiments, and custom anime-inspired sketch or illustration requests.',
    options: [
      {
        title: 'Idea & Web Prototype Collaboration',
        description:
          'Collaborate on lightweight web tools, interactive concepts, or student team projects.'
      },
      {
        title: 'Custom Art & Character Sketches',
        description:
          'Traditional pencil/pen drawings or digital anime-inspired character illustrations and visual studies.',
      },
      {
        title: 'College & Open Learning Projects',
        description:
          'Teaming up with fellow students and builders to explore new frameworks, creative apps, and developer utilities.',
      },
    ],
  },
  support: {
    heading: 'Support My Work',
    summary:
      'If you enjoy my creative experiments, drawings, or open tools, you can support me by exploring my projects, sharing feedback, or following my art channels.',
    links: [
      {
        label: 'Star Projects on GitHub',
        description: 'Check out open repositories and follow upcoming builds.',
        url: 'https://github.com/anitikrish-ai',
      },
      {
        label: 'Subscribe on YouTube',
        description: 'Follow @NUA_Lite for creative and tech uploads.',
        url: 'https://www.youtube.com/@NUA_Lite',
      },
      {
        label: 'Follow Art on Instagram',
        description: 'See sketches and visual experiments at @07krish_x.',
        url: 'https://www.instagram.com/07krish_x',
      },
    ],
  },
  contact: {
    email: 'krishuniverse07@gmail.com',
    note: 'Prefer a quick message? You can also reach out on Instagram or GitHub.',
  },
};
