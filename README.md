# mb-crew — Manuel Bolaños' Portfolio

Personal presentation site: a one-page portfolio with anchored section routes under `/portfolio` (`/portfolio/about`, `/portfolio/stack`, `/portfolio/experience`, `/portfolio/projects`, `/portfolio/contact`; the old `/about`-style URLs redirect there with a 308), built with **Next.js (App Router) + React (JS) + Tailwind CSS v4**, animated with **anime.js**, and deployed to **Vercel** through GitHub Actions.

> Working material (work plan, reference design, screenshots) lives outside version control, in the local `docs/` and `reference/` folders.

## Requirements

- **Node.js 22** (pinned in [.nvmrc](.nvmrc); with nvm: `nvm use`)
- npm (bundled with Node)

## Running the project locally

```bash
# 1. Clone and install dependencies (also installs git hooks via husky)
git clone https://github.com/manolosky/mb-crew.git
cd mb-crew
npm install

# 2. Start the development server
npm run dev
```

Open <http://localhost:3000> in your browser. The page hot-reloads as you edit files under `src/`.

To try the production build locally:

```bash
npm run build
npm run start   # serves the build at http://localhost:3000
```

## Available scripts

| Script                 | What it does                                                  |
| ---------------------- | ------------------------------------------------------------- |
| `npm run dev`          | Development server with hot reload                            |
| `npm run build`        | Production build                                              |
| `npm run start`        | Serves the production build                                   |
| `npm run lint`         | ESLint over the whole project                                 |
| `npm run lint:fix`     | ESLint fixing what is auto-fixable                            |
| `npm run format`       | Prettier over the whole project (also sorts Tailwind classes) |
| `npm run format:check` | Checks formatting without writing                             |
| `npm test`             | Test suite (Vitest + React Testing Library), single run       |
| `npm run test:watch`   | Tests in watch mode                                           |

## Quality gate and pre-commit

Every commit automatically runs (via Husky + lint-staged):

1. **ESLint** (zero warnings allowed) and **Prettier** over the staged files.
2. **The full test suite** (`npm test`).

If anything fails, the commit is blocked. The same checks run in GitHub Actions before every deploy.

## CI/CD

Deployments are handled exclusively by GitHub Actions — Vercel's own git integration is disabled (`vercel.json` → `git.deploymentEnabled: false`), so nothing reaches production without passing the quality gate.

- **Pull requests** (`.github/workflows/ci.yml`): lint → format check → tests → build, then a **preview deploy** whose URL appears in the workflow run summary.
- **Push to `main`** (`.github/workflows/deploy.yml`): the same quality gate, then `vercel build` + `vercel deploy --prebuilt --prod`. Build artifacts live only in the runner; the repository stays source-only.

Required repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

## Environment variables

Configured per environment in Vercel (never committed). Flags are plain values because the static pages read them at build time; secrets are only read at runtime, since Vercel "Sensitive" variables reach CI builds as the literal `[SENSITIVE]`.

| Variable                                                                                         | Kind       | Purpose                                                                                                                                               |
| ------------------------------------------------------------------------------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                                                           | Plain      | Public origin for metadata, sitemap and robots (defaults to `https://manuelbolanos.dev`)                                                              |
| `CONTACT_FORM_MODE`                                                                              | Plain flag | `off` (default in production), `dry-run` (default in development; accepts messages without delivering them) or `live` (sends leads to ActiveCampaign) |
| `ACTIVECAMPAIGN_API_URL`, `ACTIVECAMPAIGN_API_KEY`                                               | Secret     | Lead delivery in `live` mode; the field and list ids live in `src/lib/contact/activecampaign.config.js`                                               |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) | Secret     | Upstash Redis for rate limiting; without them rate limiting is skipped                                                                                |
| `RATE_LIMIT_SALT`                                                                                | Secret     | Keys the IP hash used by the rate limiter, so raw IPs are never stored                                                                                |

## Privacy and analytics

Google Tag Manager (and the GA4 tag inside it) only loads after the visitor accepts analytics cookies in the consent banner; the decision can be changed from "Cookie settings" in the footer. The contact form is protected by a honeypot, a minimum fill time, Vercel BotID and a per-visitor rate limit. The public notice lives at `/privacy`.

## Project structure

```
src/
├── app/            # App Router: root layout, home page, /portfolio catch-all section route, /privacy, global styles (tokens)
├── components/     # OnePage, sections, layout, contact form, consent banner, domain cards and UI atoms
├── data/           # portfolio.json — all site content
└── lib/            # Data access, route map, site URL, contact form (schema, Server Action, CRM adapter), consent and analytics, server utilities
```

`src/instrumentation-client.js` starts Vercel BotID and remembers landing-page UTM tags before the app hydrates.

Convention: files containing JSX use the `.jsx` extension.
