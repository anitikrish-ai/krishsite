export type ArtMedium = 'traditional' | 'digital';

export interface ArtworkItem {
  id: string;
  title: string;
  src: string;
  medium: ArtMedium;
  date: string; // ISO YYYY-MM-DD
  description?: string;
  collections?: string[];
  favorite?: boolean;
  tags?: string[];
}

export interface ArtCollection {
  id: string;
  name: string;
  description: string;
  isPrimary?: boolean;
  mediumFilter?: ArtMedium;
}

export const PRIMARY_COLLECTIONS: ArtCollection[] = [
  {
    id: 'traditional-art',
    name: 'Traditional Art',
    description: 'Pencil sketches, hand-drawn anime artwork, portraits, and pen & paper illustrations.',
    isPrimary: true,
    mediumFilter: 'traditional',
  },
  {
    id: 'digital-art',
    name: 'Digital Art',
    description: 'Digital sketches, anime-inspired illustrations, digital painting, and visual experiments.',
    isPrimary: true,
    mediumFilter: 'digital',
  },
];

/**
 * Add your actual artwork files to /public/artwork/ and register them here.
 * Example:
 * {
 *   id: 'art-01',
 *   title: 'Character Pencil Study',
 *   src: '/artwork/character-study.jpg',
 *   medium: 'traditional',
 *   date: '2026-10-14',
 *   description: 'Graphite pencil sketch on A4 paper.',
 *   collections: ['traditional-art'],
 *   favorite: true,
 *   tags: ['pencil', 'anime', 'portrait'],
 * }
 */
export const INITIAL_ARTWORK: ArtworkItem[] = [];
