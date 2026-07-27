# mb-crew — Portfolio de Manuel Bolaños

Sitio de presentación personal: single one page con secciones ancladas (`/about`, `/stack`, `/experience`, `/projects`, `/contact`), construido con **Next.js (App Router) + React (JS) + Tailwind CSS v4** y desplegado en **Vercel** mediante GitHub Actions.

- Plan de trabajo y decisiones: [docs/PLAN.md](docs/PLAN.md)
- Diseño de referencia (screenshots y datos extraídos): [reference/](reference/)

## Requisitos

- **Node.js 22** (la versión está fijada en [.nvmrc](.nvmrc); con nvm: `nvm use`)
- npm (incluido con Node)

## Ejecutar el proyecto en local

```bash
# 1. Clonar e instalar dependencias (también instala los hooks de git via husky)
git clone https://github.com/manolosky/mb-crew.git
cd mb-crew
npm install

# 2. Levantar el servidor de desarrollo
npm run dev
```

Abre <http://localhost:3000> en el navegador. La página se recarga automáticamente al editar archivos en `src/`.

Para probar el build de producción en local:

```bash
npm run build
npm run start   # sirve el build en http://localhost:3000
```

## Scripts disponibles

| Script                 | Qué hace                                                             |
| ---------------------- | -------------------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo con hot reload                                |
| `npm run build`        | Build de producción                                                  |
| `npm run start`        | Sirve el build de producción                                         |
| `npm run lint`         | ESLint sobre todo el proyecto                                        |
| `npm run lint:fix`     | ESLint corrigiendo lo autocorregible                                 |
| `npm run format`       | Prettier sobre todo el proyecto (ordena también las clases Tailwind) |
| `npm run format:check` | Verifica formato sin escribir                                        |
| `npm test`             | Suite de tests (Vitest + React Testing Library), una sola pasada     |
| `npm run test:watch`   | Tests en modo watch                                                  |

## Calidad y pre-commit

Cada commit ejecuta automáticamente (via Husky + lint-staged):

1. **ESLint** (cero warnings permitidos) y **Prettier** sobre los archivos staged.
2. **La suite de tests completa** (`npm test`).

Si algo falla, el commit se bloquea. Los mismos checks correrán en GitHub Actions antes de cada deploy.

## Estructura del proyecto

```
src/
├── app/            # App Router: layout raíz, página, estilos globales (tokens)
├── components/ui/  # Átomos reutilizables (Button, Badge, Chip, Card, …)
├── data/           # portfolio.json — todo el contenido del sitio
└── lib/            # Acceso a datos, registro de iconos, helpers
```

Convención: los archivos que contienen JSX usan extensión `.jsx`.
