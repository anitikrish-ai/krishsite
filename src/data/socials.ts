export type SocialPlatform =
  | 'github-primary'
  | 'github-personal'
  | 'youtube'
  | 'instagram'
  | 'pinterest'
  | 'website';

export interface SocialProfile {
  id: SocialPlatform;
  platform: string;
  label: string;
  username: string;
  url: string;
  description: string;
}

export const SOCIAL_PROFILES: SocialProfile[] = [
  {
    id: 'github-primary',
    platform: 'GitHub',
    label: 'GitHub (Primary)',
    username: '@anitikrish-ai',
    url: 'https://github.com/anitikrish-ai',
    description: 'Primary development account for AI-assisted tools and web apps.',
  },
  {
    id: 'github-personal',
    platform: 'GitHub',
    label: 'GitHub (Personal)',
    username: '@KrishMakwana07',
    url: 'https://github.com/KrishMakwana07',
    description: 'Personal GitHub profile and college experiments.',
  },
  {
    id: 'youtube',
    platform: 'YouTube',
    label: 'YouTube',
    username: '@NUA_Lite',
    url: 'https://www.youtube.com/@NUA_Lite',
    description: 'Video uploads, creative showcases, and experiments.',
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    label: 'Instagram',
    username: '@07krish_x',
    url: 'https://www.instagram.com/07krish_x',
    description: 'Traditional sketches, digital art, and personal updates.',
  },
  {
    id: 'pinterest',
    platform: 'Pinterest',
    label: 'Pinterest',
    username: 'Pinterest',
    url: 'https://pin.it/2QrPPjk8p',
    description: 'Visual inspiration boards, references, and art ideas.',
  },
  {
    id: 'website',
    platform: 'Website',
    label: 'Existing Website',
    username: 'krish07.vercel.app',
    url: 'https://krish07.vercel.app/',
    description: 'Previous personal web space on Vercel.',
  },
];
