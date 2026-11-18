# Krish Makwana — Portfolio (Lenso UI)

React 19 + Vite + Lenso UI (StyleX). Hash-routed multi-page site: Home, About, Projects, Art, Collaborate, Support, Links, Contact, Privacy, Terms, 404.

```bash
npm install
npm run dev
npm run build
```

- Content: `src/data/` (profile, projects, socials, artwork)
- Motion: `src/fx.tsx` (aurora background, scroll reveal, tilt cards, typewriter, counters, marquee, scroll progress). All respect `prefers-reduced-motion`.
- Page transitions: View Transitions API where supported, plus an entrance animation.
- Add artwork: put images in `public/artwork/` and register them in `src/data/artwork.ts`.
