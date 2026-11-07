# Kingdom Seekers Fellowship Kitale — Website

Church website for KSF Kitale. React 19 + Vite + Tailwind CSS 4, deployed on Vercel.
Content is managed in PocketBase (hosted on PocketHost); every page has built-in
fallback content in `src/context/PocketBaseContext.tsx` so the site still renders
if the CMS is unreachable.

## Run locally

Requires Node.js 20+.

```bash
npm install
cp .env.example .env   # optional — only needed to point at a different PocketBase
npm run dev            # http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Type-check with `tsc --noEmit` |

## Project layout

- `src/pages/` — one component per route (routes are defined in `src/App.tsx`)
- `src/components/` — shared layout pieces (navbar, footer, preloader, PIN gate)
- `src/context/PocketBaseContext.tsx` — PocketBase client, global site settings, page/section content
- `src/utils/` — IndexedDB helpers and default questions for Bible Trivia
- `scripts/` — one-off PocketBase setup, seeding and migration scripts (`node scripts/<name>.mjs`)

## Content manager (`/cms-admin`)

Staff edit site content at `/cms-admin`.

**Accounts.** Team members are records in the PocketBase `users` collection, managed from
**Team & Access** inside the CMS:

| Role | Can do |
| --- | --- |
| Editor | Edit all website content, read contact messages |
| Admin | Everything an editor can, plus add / deactivate / remove team members |
| Owner (PocketBase superuser) | Everything, including the live schema |

Deactivating a member blocks their access immediately. The database rules behind this are
created by `node scripts/setup-cms-users.mjs` (dry run; add `--apply` to write).

**Content structure.** Owners get edit forms generated from the live schema. Staff accounts
can't read the schema, so they use the snapshot in `src/cms/schema.json` — re-run
`node scripts/export-cms-schema.mjs` after adding or changing fields in PocketBase.
Labels, help text and menu grouping live in `src/cms/config.ts`.

**Admin scripts** in `scripts/` read `pockethost_admin_email` / `pockethost_admin_password`
from `.env.local` (see `.env.example`).

## Deployment

Pushes to `main` deploy on Vercel. `vercel.json` rewrites all paths to `index.html`
so client-side routes work on refresh.
