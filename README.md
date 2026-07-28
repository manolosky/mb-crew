# mb-crew — Manuel Bolaños' Portfolio

Personal presentation site: a single one-page with anchored section routes (`/about`, `/stack`, `/experience`, `/projects`, `/contact`), built with **Next.js (App Router) + React (JS) + Tailwind CSS v4**, animated with **anime.js**, and deployed to **Vercel** through GitHub Actions.

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

## Project structure

```
src/
├── app/            # App Router: root layout, catch-all section route, global styles (tokens)
├── components/     # OnePage, sections, layout, domain cards and UI atoms
├── data/           # portfolio.json — all site content
└── lib/            # Data access, icon registry, helpers
```

Convention: files containing JSX use the `.jsx` extension.
