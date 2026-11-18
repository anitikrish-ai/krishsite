# Krish Makwana — Portfolio (Lenso UI)

React 19 + Vite + Lenso UI (StyleX). Hash-routed, multi-page: Home, About, Projects, Art, Collaborate, Support, Links, Contact, Privacy, Terms, 404.

```bash
npm install
npm run dev      # local dev
npm run build    # typecheck + production build
```

## Content
Edit `src/data/` (profile, projects, socials, artwork). Add artwork by placing images in `public/artwork/` and registering them in `src/data/artwork.ts`.

## Supabase (config only)
1. Copy `.env.example` to `.env`
2. Fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. `import { supabase, isSupabaseConfigured } from "./lib/supabase"` wherever you add API calls.
Use only the public anon key in the frontend and keep Row Level Security enabled on every table.

## Security
- `vercel.json` and `public/_headers`: CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP/CORP.
- If you add services (analytics, embeds, new APIs), allow them in the CSP `connect-src` / `script-src`.
- Contact form validates and length-limits input; gallery uploads accept only raster images up to 15 MB.
- `.env` is git-ignored. `public/.well-known/security.txt` lists your contact.

## Motion
Page changes use a circular View Transition from the tap point. Everything respects `prefers-reduced-motion`, `prefers-reduced-transparency` and `prefers-contrast`.
