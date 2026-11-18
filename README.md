# Krish Makwana — Personal Digital Space

A responsive, Apple-inspired Liquid Glass personal website, creative portfolio, and iOS Photos-style art gallery built with React, TypeScript, and CSS.

## Quick Start

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

## Central Configuration

All content is cleanly separated into `src/data/`:

- `src/data/profile.ts` — Identity, bio, skills, education, collaboration & support options, and contact email.
- `src/data/socials.ts` — GitHub, YouTube, Instagram, Pinterest, and existing website links.
- `src/data/projects.ts` — Working projects and projects under development (`zip-to-git`, `dropfast`, `ikis-paint-web`, `driftjs`).
- `src/data/artwork.ts` — Traditional Art and Digital Art gallery metadata.

## Adding Your Actual Artwork

1. Place your original image files (`.jpg`, `.png`, `.webp`) inside `public/artwork/`.
2. Add an entry for each piece in `src/data/artwork.ts` with its `src`, `title`, `medium` (`"traditional"` or `"digital"`), `date` (`YYYY-MM-DD`), and optional `description` or `collections`.
3. You can also test-load images directly in the browser using the **+ Add Artwork** button in the Gallery section.
