# Editing Guide — Shabbir Khan Portfolio

This is a plain-English map of the codebase: what to open, and what to change,
for every section and every interactive effect. Nothing here requires deep
Next.js knowledge — mostly it's "open this file, change this value."

Run `npm run dev` and keep `http://localhost:3000` open in another window
while you edit — everything hot-reloads.

---

## 1. The one file you'll touch most: `lib/data.ts`

Almost all *text* on the site lives here, not scattered across components.
It's organized into exported blocks:

| Export | Powers | 
|---|---|
| `profile` | Name, role, tagline, intro paragraph, location, email, social links, CV path |
| `aboutDetails` | The 6 monospace rows in About (Role / Based in / Status / Focus / Study / Lead) |
| `toolkitCategories` | The two Toolkit columns (Design / Engineering) and their rows |
| `skills` | The right-to-left ticker under the hero |
| `stats` | The 4 big numbers below About |
| `work` | All 6 projects — card content **and** full case-study page content |
| `services` | The 5 rows in Services |
| `lab` | The 3 rows in Experiment Lab |
| `experience` | The career rows in About |
| `foundations` | The 4 "principles" cards in About |

**To change any text on the site** (a name, a stat, a project description),
find it in one of these arrays and edit the string. No other file needs to
change.

### Adding a new project

Copy one of the existing objects inside the `work` array (e.g. the whole
`kiss-camden` entry), paste it as a new array item, and edit every field —
including the nested `caseStudy` object (that's what powers the full
`/work/<slug>` page). The `slug` field becomes the URL, and the page is
generated automatically — you don't need to touch the routing.

### Swapping photography

Images are centralized in `lib/images.ts`:

```ts
export const images = {
  codeDev: u("photo-1774901128302-e2bbd154da44"),
  hotelLobby: u("photo-1758193783649-13371d7fb8dd"),
  // ...
};
```

Each project in `lib/data.ts` references one of these (`image: images.hotelLobby`).
To swap a photo, either point it at a different existing entry, or add a new
one: grab any Unsplash photo URL in the form
`https://images.unsplash.com/photo-XXXXXXXXXX-XXXXXXXXXXXX`, add it as a new
key in `images.ts`, and reference that key from `data.ts`.

To use your **own** image instead of a stock photo: drop the file into
`public/images/`, then reference it as `"/images/your-file.jpg"` directly
(no need to go through `images.ts` for local files).

---

## 2. Section-by-section

Each homepage section is its own component in `components/`, assembled in
`app/page.tsx` in this order:

```
Hero → SkillsMarquee → About → Stats → Toolkit → Services → Work → Lab → Contact → Footer
```

To reorder sections, reorder the lines in `app/page.tsx`. To remove one
entirely, delete its line (and its import at the top).

### Hero — `components/Hero.tsx`

- **Name particles**: two `<CursorDrivenParticleTypography>` blocks, one for
  "SHABBIR" (mint) and one for "Khan" (lime, script font). Change the `text`
  prop to change the wording; change `color` (a hex string) to recolor;
  change `fontFamily` to use a different typeface for either word.
- **"hey, I'm" script line**: plain text, edit directly in the JSX.
- **Role line**: pulled from `profile.role` in `data.ts`.
- **Bottom-left description**: pulled from `profile.tagline` and
  `profile.intro`.
- **Download CV button**: `href={profile.cv}` — points at `public/cv.pdf`.
  Replace that file with your real CV (same filename), or change
  `profile.cv` in `data.ts` to a different path.
- **Background halftone**: see [HalftoneField](#halftonefield) below.

### SkillsMarquee — `components/SkillsMarquee.tsx`

Purely driven by the `skills` array in `data.ts`. Add/remove/reorder entries
there — the ticker updates automatically. Speed is controlled by the
`marquee-reverse` animation duration in `tailwind.config.ts` (currently
`26s` — lower = faster).

### About — `components/About.tsx`

- Intro paragraph: `profile.intro`.
- Detail rows (Role/Based in/Status/etc.): `aboutDetails` array.
- Portrait: see [DotPortrait](#dotportrait) below. The source image is
  `public/images/profile.jpg` — swap that file to change the photo (keep the
  same filename, or update the `src` prop on `<DotPortrait>` in `About.tsx`).
- "Foundations" 4-card grid: `foundations` array.
- Career rows: `experience` array. The inward-indent hover (role slides
  right, year slides left) is CSS transition classes on the row — look for
  `group-hover:translate-x-4` / `group-hover:-translate-x-4` if you want to
  adjust how far they move.

### Stats — `components/Stats.tsx`

Driven by the `stats` array. Each `value` (e.g. `"25+"`) is animated as a
count-up automatically by the `Counter` component — as long as it *starts*
with a number, the count-up works, and any trailing text (`+`, `%`, etc.) is
preserved.

### Toolkit — `components/Toolkit.tsx` + `components/ToolkitRow.tsx`

Content comes from `toolkitCategories` — two objects (`heading`, `tag`,
`items[]`). Add a third category and the grid will need `md:grid-cols-3`
instead of `md:grid-cols-2` in `Toolkit.tsx` to fit it.

The cursor-follow spotlight on each row lives in `ToolkitRow.tsx` — it's a
CSS radial-gradient positioned via a custom property (`--mx`) updated on
`mousemove`. To make the spotlight bigger/smaller, change the `180px` in the
`radial-gradient(180px circle at ...)` string.

The coordinate footer ("RAWALPINDI · PK...") is hardcoded text in
`Toolkit.tsx` — edit directly if you move.

### Services — `components/Services.tsx`

Driven by the `services` array (`index`, `title`, `detail`). The hover
effect (indent + bold + slight scale) is on the `<h3>` — look for the
`group-hover:translate-x-4 ... group-hover:font-bold ... group-hover:scale-[1.03]`
classes to tune the amount.

### Work — `components/Work.tsx` + `components/WorkRow.tsx`

Cards are generated from the `work` array. Each row shows `year`, `title`,
`summary`, `tag`, and `caseStudy.role` (as the second meta line on the
right). The inward-indent hover and the cursor-follow liquid preview both
live in `WorkRow.tsx` — see [LiquidImage](#liquidimage) below for the
preview effect itself.

Clicking a row goes to `/work/<slug>` — the full case-study template lives
at `app/work/[slug]/page.tsx` and pulls everything from that project's
`caseStudy` object in `data.ts`. You don't need to touch the page file to
edit case-study content.

### Lab — `components/Lab.tsx` + `components/LabRow.tsx`

Driven by the `lab` array (`tags[]`, `title`, `detail`, `link`). The
directional color-fill sweep, glow, zoom, and indent are all in
`LabRow.tsx` — it tracks a `hovered` boolean and flips `transformOrigin`
between `"left"` and `"right"` so the fill sweeps in and retreats in
opposite directions.

### Contact — `components/Contact.tsx`

- Headline: the "Let's build / something / unforgettable." text is directly
  in the JSX (not in `data.ts`, since it's a one-off design element) — edit
  the strings inside the `<h2>` tags.
- Email/socials: pulled from `profile`.
- Form fields: plain HTML inputs; submission logic posts to
  `app/api/contact/route.ts` (see the main `README.md` for Resend setup).

### Footer — `components/Footer.tsx`

- Background video: the `<video src="...">` tag — swap the URL for your own
  hosted clip, or remove the `<video>` element entirely to fall back to just
  the halftone + gradient.
- Contact/location/site link columns: mostly pulled from `profile`, with a
  couple of hardcoded labels you can edit directly.

### Nav — `components/Nav.tsx`

The five nav items are a `links` array at the top of the file:

```ts
const links = [
  { n: "01", id: "about", label: "ABOUT", href: "/#about" },
  // ...
];
```

Add, remove, or reorder entries here. The `id` must match a section's `id`
attribute for the active-section bracket (`( 01/ABOUT )`) to track correctly
(see [useActiveSection](#useactivesection)).

---

## 3. Interaction components — how the effects work and how to tune them

### HalftoneField

`components/HalftoneField.tsx` — a canvas grid of dots that ripple toward
the cursor. Used in the Hero (interactive, parallax-shifted) and Footer
(static ambient shimmer).

| Prop | Default | What it does |
|---|---|---|
| `spacing` | `22` | Distance between dots in px — higher = sparser grid |
| `dotColor` | `"195,255,252"` | RGB (no `rgba()` wrapper) — this is mint |
| `maxRadius` | `3.2` | How big a dot grows at the cursor's center |
| `influence` | `130` | Radius (px) of the cursor's effect zone |
| `interactive` | `true` | `false` = ambient shimmer only, ignores the mouse (used in the footer) |

To make the hero's halftone react more/less, adjust `influence` and
`maxRadius` where `<HalftoneField>` is called in `Hero.tsx`.

### Particle-dissolve typography

`components/ui/cursor-driven-particles-typography.tsx` — renders text as
canvas particles that scatter from the cursor and drift back. Used for the
hero name.

| Prop | What it does |
|---|---|
| `text` | The word/phrase to render |
| `fontFamily` | Any loaded font — e.g. `"General Sans, sans-serif"` or `"Caveat, cursive"` |
| `fontSize` | Base size in px (auto-capped to fit the container width) |
| `particleDensity` | Lower = more particles (denser sampling grid) |
| `dispersionStrength` | How hard particles get pushed away from the cursor |
| `returnSpeed` | How quickly particles drift back to formation (higher = snappier) |
| `color` | Hex color of the particles |

If the motion feels too fast/jittery, lower `dispersionStrength` first, then
`returnSpeed`. Both are currently tuned fairly gently (`11` and `0.065` in
the hero) — the component's defaults are punchier if you want more energy
elsewhere.

### DotPortrait

`components/DotPortrait.tsx` — same particle-repulsion idea as above, but
samples a real photo's pixel brightness instead of rendering text. Used for
the About portrait.

| Prop | What it does |
|---|---|
| `src` | Path to the image (local `/images/...` or a full URL) |
| `dotColor` | RGB string, same format as HalftoneField |
| `step` | Sampling interval in px — lower = more, smaller dots (slower to render) |

### LiquidImage

`components/LiquidImage.tsx` — wraps an image in an SVG turbulence filter
that ripples based on real mouse speed. Used in Work's hover preview and the
case-study galleries. No tunable props beyond `src`/`alt`/`className` — the
ripple intensity is tied to how fast you move the mouse, by design.

### CustomCursor

`components/CustomCursor.tsx` — the global cursor replacement (desktop
only). Three modes: a small mint dot by default, a larger ring over
links/buttons, and a rotating "MOVE • MOVE •" badge over any element tagged
`data-cursor="move"` (currently just the Hero's `<section>`). To make
another section show the MOVE cursor, add `data-cursor="move"` to its
wrapping element.

### useActiveSection

`lib/useActiveSection.ts` — an `IntersectionObserver` hook that tells the
Nav and the bottom HUD bar which section is currently in view. It watches a
fixed list of ids: `["about", "services", "work", "lab", "contact"]`. If you
rename a section's `id` or add a new trackable section, update that array
(and the matching `SECTION_LABELS` map in `components/HudBar.tsx`) too.

### Reveal

`components/Reveal.tsx` — a small wrapper that fades + slides content up
when it scrolls into view. Used on every section header for a consistent
"scroll reveal" feel. To apply it somewhere new:

```tsx
import Reveal from "@/components/Reveal";

<Reveal delay={0.1}>
  <YourContent />
</Reveal>
```

`delay` (seconds) staggers multiple `Reveal`s if you want a cascade effect.

### Counter

`components/Counter.tsx` — animates a number counting up from zero when it
scrolls into view. Used for Stats and Work's card statistics. Just pass a
`value` string (e.g. `"25+"`, `"3.75"`, `"100%"`) — it parses the leading
number and animates it, keeping any prefix/suffix as static text.

---

## 4. Colors, fonts, and global styles

### Colors — `tailwind.config.ts`

```ts
colors: {
  ink: "#0a0a0a",        // page background
  surface: "#131313",    // card/panel background
  line: "#242424",       // borders/dividers
  paper: "#f2f1ed",      // primary text (off-white)
  muted: "#8f9490",       // secondary text
  mint: "#c3fffc",        // primary accent
  "mint-ink": "#06201f",  // dark text used on mint-filled backgrounds
  lime: "#c6ff3d",        // secondary accent
  "lime-ink": "#1c2600",  // dark text used on lime-filled backgrounds
}
```

Change any hex here and it updates everywhere that color name is used as a
Tailwind class (`text-mint`, `bg-lime`, `border-mint`, etc.) — you don't
need to find-and-replace hex codes across components.

Some effects (halftone dots, glow shadows, cursor colors) use raw `rgba(...)`
strings instead of Tailwind classes, since they're set from JavaScript, not
CSS classes. Those live in `globals.css` (search for `195,255,252`, the RGB
form of mint) and in the individual canvas/SVG components listed above.

### Fonts — `app/layout.tsx` + `tailwind.config.ts`

- **Display** (`font-display`, headings): General Sans, loaded via a
  Fontshare `<link>` tag in `layout.tsx`.
- **Body** (`font-body`, paragraphs): Switzer, same Fontshare link.
- **Mono** (`font-mono`, labels/HUD/index numbers): IBM Plex Mono, via
  `next/font/google`.
- **Script** (`font-script`, accent words): Caveat, via `next/font/google`.

To swap any of these for a different typeface: if it's a Google Font,
change the `next/font/google` import in `layout.tsx`; if it's a Fontshare
font, edit the `f[]=` query params in the `<link>` href; then update the
matching entry in `tailwind.config.ts`'s `fontFamily` block.

### Global effects — `app/globals.css`

- `.fill-hover` — the "card flips to solid color fill" hover pattern used on
  Toolkit and (in an earlier design pass) Work.
- `.glow-text` — text-shadow glow, used on accent headlines.
- `.underline-sweep` — the left-to-right underline hover animation.
- `.corner-bracket` / `.section-frame` — the Figma-style corner brackets on
  bordered cards.
- `.ambient-blob` — the blurred glow shapes behind Hero and Contact.
- `prefers-reduced-motion` handling — near the top of the file; animations
  are automatically disabled site-wide for users who've requested reduced
  motion at the OS level. Don't remove this block.

---

## 5. Quick recipes

**"I want to change the accent color everywhere."**
Edit `mint` (and `mint-ink`) or `lime` (and `lime-ink`) in
`tailwind.config.ts`. For the handful of raw `rgba()` values in
`globals.css` and the canvas/SVG components, do a project-wide search for
the old RGB string (e.g. `195,255,252`) and replace it.

**"I want to add a 7th project."**
Add an entry to the `work` array in `lib/data.ts` (copy an existing one as a
template, including its `caseStudy` object). Nothing else needs to change.

**"I want to remove the particle name effect and just show plain text."**
In `Hero.tsx`, replace the two `<CursorDrivenParticleTypography>` blocks
with a plain `<h1>SHABBIR</h1><h1>Khan</h1>` — the rest of the hero layout
is unaffected.

**"An interaction feels too intense/fast."**
Check the tuning table for that component above — almost every effect has a
speed/strength prop you can dial back rather than needing to rewrite logic.

**"I want a new section (e.g. Testimonials)."**
1. Add a data array to `lib/data.ts`.
2. Create `components/Testimonials.tsx` following the pattern of an existing
   simple section (e.g. `Services.tsx`) — import `Reveal` for the header.
3. Import and place it in `app/page.tsx`.
4. If it should be in the nav, add it to `links` in `Nav.tsx` and to
   `SECTION_IDS` in `useActiveSection.ts` (and `SECTION_LABELS` in
   `HudBar.tsx`).

---

For setup, deployment, and the contact form's Resend configuration, see the
main `README.md`.

---

## 6. Admin dashboard — add/edit/delete projects without touching code

**URL**: `/admin` (redirects to `/admin/login` if you're not signed in).

**Credentials**: username `admin`, password given to you separately in chat
(not stored in plaintext anywhere in this repo). Change it whenever you like
— see below.

### How it works

- Project data lives in `data/projects.json` instead of hardcoded TypeScript.
  The homepage's Work section and every `/work/<slug>` case-study page read
  from this file on every request (`export const dynamic = "force-dynamic"`
  on the relevant route files), so admin changes appear on the live site
  immediately — no rebuild or redeploy needed.
- Auth is a real (small-scale) implementation, not a stub: the password is
  stored as a **bcrypt hash** (never plaintext), sessions are **httpOnly,
  signed cookies** (HMAC-SHA256, 8-hour expiry), username/password checks use
  constant-time comparison to resist timing attacks, and login attempts are
  rate-limited per IP (8 attempts / 15 minutes).
- Every admin page and API route independently verifies the session
  server-side before doing anything — there's no "trust the client" step.

### Changing the password

1. Generate a new bcrypt hash:
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('your-new-password', 12))"
   ```
2. Put the result in `.env.local` as `ADMIN_PASSWORD_HASH`.

   **Important**: bcrypt hashes contain `$` characters, and Next.js expands
   `$VAR`-style syntax in `.env` files — an unescaped hash gets silently
   mangled and login will fail with no obvious error. Escape every `$` as
   `\$`:
   ```
   ADMIN_PASSWORD_HASH=\$2b\$12\$abcxyz...restofhash
   ```
3. Restart the dev server (or redeploy) for the new value to take effect.

### Deployment note — this matters

The admin dashboard writes to `data/projects.json` on disk via Node's `fs`
module. That works perfectly for:
- `npm run dev` / `npm run start` locally
- Self-hosted Node servers (a VPS, Railway, Render, Fly.io, etc.)

It will **not persist** on Vercel or other serverless platforms with
read-only production filesystems — writes will either fail or silently not
survive past that single request. If you deploy there and want the admin
dashboard to work, swap the storage layer in `lib/projectsStore.ts` for a
real database or a service like Vercel KV/Postgres — the four functions
(`getProjects`, `createProject`, `updateProject`, `deleteProject`) are the
only place that needs to change; nothing else in the app talks to the
filesystem directly.

### Security notes for future changes

- Never commit `.env.local` — it's already gitignored.
- If you add more admin routes, always start them with a
  `hasValidSession()` check (see `lib/adminAuth.ts`) before doing anything.
- The rate limiter (`lib/rateLimit.ts`) is in-memory and best-effort — fine
  for a single small server, not a substitute for a real rate-limiting
  service if this ever needs to handle serious traffic or attack attempts.

---

## 8. Deploying with a real database (required for the admin panel to work on Vercel)

Everything the admin panel manages — projects, skills, services, lab, stats,
about-details, toolkit, admin accounts, and site settings — now lives in a
**Postgres database**, not JSON files. This is what makes the admin panel
actually work once deployed: Vercel's filesystem is read-only in production,
so file-based storage would silently fail to save anything there.

### Step 1 — Create a Postgres database

Any standard Postgres works. The easiest free options:

- **[Neon](https://neon.tech)** (recommended — this is what Vercel's own
  Postgres integration uses under the hood now) — create a project, copy
  the connection string it gives you.
- **[Supabase](https://supabase.com)** — create a project, copy the
  connection string from Project Settings → Database.
- Vercel's dashboard also has a "Storage" tab where you can add a Postgres
  database directly (backed by Neon) and it'll set the env var for you
  automatically.

You'll end up with a connection string that looks like:
```
postgres://user:password@host/dbname?sslmode=require
```

### Step 2 — Create a Vercel Blob store (for logo uploads)

In your Vercel project → Storage → Create Database → **Blob**. This
auto-adds a `BLOB_READ_WRITE_TOKEN` environment variable to your project —
you don't need to copy it manually if you create it from within the Vercel
dashboard for this project.

### Step 3 — Apply the schema and seed your data

From your local machine, with the project's dependencies installed
(`npm install`):

```bash
DATABASE_URL="your-connection-string-from-step-1" \
SEED_ADMIN_USERNAME=admin \
SEED_ADMIN_EMAIL=you@example.com \
SEED_ADMIN_PASSWORD="choose-a-real-password" \
node scripts/seed.mjs
```

This creates all the tables, loads the existing `data/*.json` content
(your current projects, skills, services, etc.) into the database, and
creates your admin login. **Use your real email** — that's where password
reset emails will go. Safe to re-run any time (it upserts, never duplicates).

### Step 4 — Set environment variables in Vercel

Project Settings → Environment Variables. Add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | from Step 1 (skip if Vercel's Postgres integration set it automatically — it may be named `POSTGRES_URL`; if so, either rename it or add `DATABASE_URL` pointing to the same value) |
| `BLOB_READ_WRITE_TOKEN` | from Step 2 (usually auto-set) |
| `ADMIN_SESSION_SECRET` | a random 32+ character string — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `SITE_URL` | your production URL, e.g. `https://shabbirk.com` (used to build password-reset links) |
| `RESEND_API_KEY` | your Resend key (needed for both the contact form and password-reset emails) |
| `CONTACT_FROM_EMAIL` | a verified sending address on your Resend domain |
| `CONTACT_TO_EMAIL` | where contact form submissions should land |

### Step 5 — Push to GitHub and deploy

```bash
git init
git add .
git commit -m "Initial deploy"
git remote add origin <your-github-repo-url>
git push -u origin main
```

Then in Vercel: **New Project** → import that repo → it'll auto-detect
Next.js → deploy. As long as the environment variables from Step 4 are set,
the build will succeed and the site (including the database-backed content)
will work immediately.

### Step 6 — Log in and take it from here

Visit `https://yoursite.com/admin/login`, sign in with the username/password
from Step 3. From there:

- **Site Settings** (`/admin/settings`) — set your real site title, upload
  a logo (replaces the "S" badge in the nav).
- **Forgot password** — fully functional; a real password-reset email will
  send via Resend once `RESEND_API_KEY` is set.
- Everything else (Projects, Skills, Services, Lab, Toolkit, Stats, About
  Details) works exactly as documented in sections 6–7 above — the only
  thing that changed is where the data is stored.

### What changed under the hood

- `lib/db.ts` — the shared Postgres connection pool (`pg`, not the
  deprecated `@vercel/postgres` — works with any standard Postgres).
- `lib/projectsStore.ts` and `lib/contentStore.ts` — same function
  signatures as before, now backed by SQL instead of `fs.readFile`/`writeFile`.
- `lib/adminAuth.ts` — credentials are checked against the `admin_users`
  table (bcrypt) instead of environment variables; sessions are still
  signed cookies (that part didn't need a database).
- `lib/siteSettings.ts` — new; backs the Settings page.
- `db/schema.sql` — the full schema, safe to re-run.
- `scripts/seed.mjs` — one-time (but re-runnable) migration from the old
  `data/*.json` files into the database. Those JSON files are no longer
  read by the running app — they only exist now as the seed script's
  input, so keep them around if you might want to re-seed from scratch.

### Local development against the database

Add `DATABASE_URL` (pointing at a local Postgres, or a free Neon/Supabase
dev branch) to `.env.local`, run the seed script once against it, then
`npm run dev` as usual.
