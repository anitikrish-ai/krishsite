# krishsite

Static site, no build step. Deploys as-is on Vercel (see `vercel.json`).

## UI system: Liquid Glass

Load order on every page: `css/tokens.css`, `css/glass.css`, `css/main.css` (the gallery adds `css/gallery.css`).

| File | Role |
| --- | --- |
| `css/tokens.css` | Colour, glass material values, radii, spacing, motion. Light and dark. Generated dark block is identical for explicit theme and OS preference. |
| `css/glass.css` | The glass material (backdrop blur, tint, sheen, rim light, shadow) and its accessibility fallbacks. |
| `css/main.css` | Components: header, nav, lists, cards, buttons, fields, sheet, footer. |
| `js/liquid-glass.js` | Rim refraction for Chromium (SVG displacement map). Other browsers use the frosted CSS fallback. |
| `js/ui.js` | Mobile menu, header depth on scroll, wires refraction to `[data-glass="refract"]`. |
| `js/dialog.js` | Accessible modal sheets on native `<dialog>`: `krishDialog.prompt()` and `krishDialog.choose()`. |

Three material tiers:

1. **`.glass`** floats over content (navigation, toolbars). Blur plus rim refraction.
2. **surfaces** (`.card`, `.list`, `.empty`) hold content. Translucent, no blur.
3. **`.glass-strong`** for sheets and menus. Denser fill, deeper shadow.

Rules: never nest one `backdrop-filter` element inside another (put the glass on a sibling layer, see `.bar-glass`); keep `--muted` text off tier-1 glass; buttons are rounded rectangles, never capsules.

To add refraction to a new floating element: give it the `glass` class and `data-glass="refract"`. Tune with `data-lg-scale`, `data-lg-chroma`, `data-lg-border`, `data-lg-blur`.

Accessibility: `prefers-reduced-transparency`, `prefers-contrast: more`, `forced-colors` and `prefers-reduced-motion` all remove blur and refraction or motion and fall back to solid surfaces.

## Content

Edit `js/config.js` (identity, socials, projects) and `js/gallery-data.js` (artwork). Images go in `art/images/`.

## Credits

Material values and design principles adapted from [Lenso UI](https://github.com/lenso) (MIT). Refraction technique from [liquid-glass](https://github.com/deepika-builds/liquid-glass) (MIT, `js/LICENSE-liquid-glass.txt`). Typeface Inter (SIL OFL, `fonts/Inter-OFL.txt`), self-hosted for non-Apple devices.
