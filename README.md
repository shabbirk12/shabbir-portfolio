# Shabbir Khan — Portfolio

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion.

## Design system

- **Colors**: near-black `#0a0a0a` bg, `#131313` surface, exact accent `#c3fffc` mint, `#06201f` mint-ink.
- **Type**: **General Sans** (display) + **Switzer** (body) via Fontshare `<link>`. **IBM Plex Mono** for HUD/data labels and **Caveat** (script) for accent lines — both via `next/font/google`.
- **Photography**: real Unsplash photos, mapped by theme in `lib/images.ts`. Profile portrait at `public/images/profile.jpg`.
- **CV**: a real generated PDF at `public/cv.pdf`, linked from the hero's "Download CV" button — replace with your own file any time (keep the same filename or update `profile.cv` in `lib/data.ts`).

## Interactions

- **Particle-dissolve hero name** — `components/ui/cursor-driven-particles-typography.tsx` renders "SHABBIR KHAN" as thousands of canvas particles that scatter away from the cursor and drift back to formation. Installed under `components/ui/` per shadcn convention.
- **Mouse-parallax halftone field** (`HalftoneField.tsx`) — a dot grid that both ripples toward the cursor *and* shifts the whole field opposite the cursor for a parallax "moving background" feel. Used interactively in the hero; used as a static ambient shimmer (`interactive={false}`) in the footer, per spec ("keep it, but don't move here").
- **3D dot portrait** (`DotPortrait.tsx`) — converts the About photo into a mouse-reactive particle field using the same repulsion physics as the hero typography, sampling real pixel brightness for dot size/opacity.
- **MOVE cursor** — rotating circular "MOVE • MOVE •" cursor badge (SVG `textPath`) shown whenever the pointer is over `data-cursor="move"` zones (the hero).
- **Liquid image hover** (`LiquidImage.tsx`) — SVG `feTurbulence`/`feDisplacementMap` filter driven by real mouse movement, used both on Work-row cursor-follow previews and inside case-study galleries.
- **Cursor-follow work previews** (`WorkRow.tsx`) — hovering a project row spawns a thumbnail that trails the cursor with spring physics. Rendered via `createPortal` into `document.body` and clamped to the viewport, so it can't be clipped or mispositioned by transformed/overflow-hidden ancestors or get pushed off-screen on smaller viewports.
- **Toolkit rows** — cursor-follow spotlight per row (CSS custom property updated on `mousemove`, no re-render) plus a hover indent, matching the reference two-column layout with per-item tags and a coordinate footer.
- **Services** — hover indents the title, shifts weight to bold, and scales up slightly.
- **Lab rows** — hover indents text, adds a soft mint glow around the card, and a *directional* color fill: sweeps in left-to-right on hover-in, retreats right-to-left on hover-out (`transformOrigin` toggled in JS between "left" and "right").
- **Footer** — static (non-interactive) halftone shimmer, a dimmed looping background video (real Mixkit stock footage, muted/no controls), and the same coordinate/index footer language as Toolkit.

All cursor/hover-only effects are desktop-only (`md:` breakpoint).

## Page structure (in order)

```
Hero            — particle name, mouse-parallax halftone, bottom-left description, CV download
Skills marquee  — right-to-left ticker of tools/skills
About           — description + monospace detail list, 3D dot portrait, foundations, career timeline
Stats           — 4 big animated stat numbers
Toolkit         — two-column DESIGN/ENGINEERING list, cursor-spotlight rows
Services        — 5 services, hover indent + bold
Work            — single-column list, cursor-follow liquid preview on hover
Lab             — experiments, directional fill sweep + glow + zoom
Contact         — Resend-backed form
Footer          — static halftone, background video, contact/location/site links
```

## Structure

```
app/
  layout.tsx                fonts (Fontshare + Google), metadata, cursor mount
  page.tsx                   assembles homepage sections in order above
  globals.css                  tokens, fill-hover, glow, underline-sweep, grain overlay
  api/contact/route.ts          Resend-backed form handler
  work/[slug]/page.tsx           full case-study page template (6 static routes)
components/
  ui/cursor-driven-particles-typography.tsx   shadcn-style particle text component
  HudBar, Nav, Hero, SkillsMarquee, About, Stats, Toolkit, ToolkitRow, Services,
  Work, WorkRow, Lab, LabRow, Contact, Footer
  HalftoneField, DotPortrait, LiquidImage, GalleryFrame, Reveal, Counter, CustomCursor
lib/
  data.ts                   all copy — projects, skills, stats, toolkit, about details
  images.ts                   curated real photography (Unsplash, free license)
  useActiveSection.ts         IntersectionObserver hook for nav + HUD section tracking
public/
  cv.pdf                     generated one-page CV, linked from the hero
  images/profile.jpg           portrait used by the About dot-portrait effect
```

## Editing content

All copy lives in **`lib/data.ts`** — `aboutDetails` (the monospace role/status list), `toolkitCategories` (the two-column Toolkit section), `skills` (marquee), `stats`, and the `work` array (each with a full `caseStudy`). Swap photography via `lib/images.ts`.

## Contact form setup

1. Sign up at resend.com, verify your sending domain.
2. Copy `.env.example` to `.env.local` and fill in `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`.
3. Locally: `npm run dev`. On Vercel: add the same three vars in Project Settings → Environment Variables.

## Commands

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run start    # run the production build
```

## Notes

- Respects `prefers-reduced-motion`.
- The particle-typography and dot-portrait effects use plain 2D canvas (no WebGL dependency).
- The footer's background video is hotlinked from Mixkit's free stock library (no attribution required under their free license) — swap the `src` in `Footer.tsx` for your own if you'd prefer to self-host it.
- Images load from `images.unsplash.com`, allowed via `next.config.js` `remotePatterns`.

## Update log (latest round)

- **Two-tone hero name**: "SHABBIR" (mint particles) and "Khan" (lime `#c6ff3d` particles, Caveat script font) render as two separate particle-dissolve canvases stacked into one lockup.
- **Smoother particle/halftone physics**: increased velocity damping and eased ripple/parallax factors so the cursor interactions feel calmer, less twitchy.
- **Lime accent** (`#c6ff3d` / `lime-ink` `#1c2600`) added alongside mint — used for the hero's Download CV button (now bottom-right), Contact's "something" script accent and CTA, and Work's hover/CTA states.
- **Site-wide scroll reveal**: section headers across Toolkit, Services, Lab, Work, Contact, and the skills marquee now fade/slide in on scroll via the shared `Reveal` component, matching the treatment About and Stats already had.
- **About**: larger intro copy, career rows now indent inward on hover (left content slides right, right content slides left, converging toward center).
- **Selected Work**: rebuilt row layout — year/title/description stacked on the left, two-line category meta right-aligned — with the same inward-indent hover, plus a lime "Contact me" CTA at the end of the section.
- **Contact**: new headline treatment — "Let's build **something** unforgettable." with the script word in lime, ambient blurred blobs, a large clickable email link, and a coordinate/index footer row matching Toolkit's language.

## Admin dashboard

Visit `/admin` to add, edit, or delete projects without touching code — see
`EDITING_GUIDE.md` section 6 for full details, credentials info, and an
important deployment note about where the write-based storage does and
doesn't work (works locally/self-hosted; needs a swap to a real database for
Vercel/serverless).

## Latest update — performance, consistency, and a real database

- **Fixed a critical bug**: the loading screen could get stuck just under
  100% and never reveal the site. Rewritten with a hard timeout fallback
  and completion logic decoupled from the progress animation — verified
  with real browser screenshots that it now always completes.
- **Performance**: canvas-based effects (the halftone fields, the About
  section's dot-portrait) now pause via `IntersectionObserver` when
  scrolled out of view, instead of running forever in the background. The
  footer's background video now lazy-loads only once you scroll near it.
- **Removed a duplicate**: the footer no longer repeats "Let's build
  something" — Contact already has an equivalent headline.
- **Color consistency**: the persistent nav bar and HUD now use the same
  lime accent as the hero/contact/work sections (they were mismatched
  with mint before), and the hero's accent color now matches the site's
  exact token value.
- **Real database**: projects, skills, services, lab, stats, about-details,
  toolkit, admin accounts, and site settings (title + logo) are now all
  stored in Postgres instead of JSON files — required for the admin panel
  to actually persist changes once deployed to Vercel. See
  `EDITING_GUIDE.md` section 8 for the full deployment walkthrough,
  including a working password-reset flow and logo upload via Vercel Blob.
