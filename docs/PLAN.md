# Plan de trabajo — Portfolio MB (mb-crew)

> Sitio de presentación personal de Manuel Bolaños: single one page con secciones ancladas,
> construido con Next.js (App Router) + React (JS) + Tailwind CSS, desplegado en Vercel con CI/CD en GitHub Actions.

---

## 1. Análisis de la referencia

Referencia: `reference/portfolio-standalone.html` (bundle autocontenido). Se desempaquetó en:

- `reference/extracted/page.html` — markup real de la página (React 18 + plantilla declarativa).
- `reference/extracted/portfolio-data.json` — **todo el contenido del sitio en JSON** (profile, hobbies, skills, experience, projects, education). Este JSON será la fuente de datos del proyecto.
- `reference/screenshots/` — capturas desktop (1440px) y mobile (390px), completas y por sección.

### Estructura de la página (6 secciones + nav + footer)

| #   | Sección       | id / ruta                     | Contenido                                                                                                                         |
| --- | ------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 0   | Navbar sticky | —                             | Logo "MB", enlaces de sección, CTA Contact, menú hamburguesa en móvil (breakpoint 820px)                                          |
| 1   | Hero          | `#top` → `/`                  | Video de fondo + overlays de gradiente, badge "Open to…", H1, chips de roles, tagline, CTAs (Get in touch / Download CV), 3 stats |
| 2   | About         | `#about` → `/about`           | Título, 2 párrafos, foto (placeholder), sub-bloque "Beyond the keyboard" con 4 hobby cards. Blobs animados de fondo               |
| 3   | Stack         | `#stack` → `/stack`           | 7 categorías de skills en cards con chips                                                                                         |
| 4   | Experience    | `#experience` → `/experience` | Timeline vertical con 5 puestos (rol, periodo, bullets, chips de stack)                                                           |
| 5   | Projects      | `#projects` → `/projects`     | 3 project cards (imagen placeholder, tag, blurb, bullets, chips)                                                                  |
| 6   | Contact       | `#contact` → `/contact`       | Card con gradiente, email/teléfono, botones sociales                                                                              |
| 7   | Footer        | —                             | Logo, © año, nota                                                                                                                 |

**Nota:** el JSON incluye `education` (6 entradas) pero la referencia **no la renderiza**. Decidir si se añade como sección `#education` o se omite (pendiente de confirmar).

### Design tokens detectados

- **Colores:** fondo claro `#eceef5`/`#fbfbfe`, superficie `#fff`, texto `#191c2b`/`#3d4463`/`#626a86`, bordes `#e2e5f0`/`#e6e9f4`, acento primario `#7c5cff`, gradiente de marca `#5b6cff → #7c5cff → #c14bff`, hero oscuro `#0b0d1a`, verde estado `#3ecf8e`.
- **Tipografías (Google Fonts):** Space Grotesk (títulos, 600/700), IBM Plex Sans (cuerpo), IBM Plex Mono (etiquetas, chips, meta).
- **Iconos:** Font Awesome 6 (solid + brands). En el proyecto se migrará a `react-icons` (paquete `fa6`) o SVG propios para no cargar la fuente completa de FA.
- **Radios:** 7–26px según componente; pills 999px. **Sombras:** suaves con tinte violeta `rgba(108,92,255,…)`.
- **Animaciones:** reveal on scroll (IntersectionObserver, fade + translateY 22px), blobs flotantes (`floaty` 12s/14s), hovers con elevación.
- **Layout:** contenedor max-width 1120px, paddings con `clamp()`, `scroll-margin-top: 84px` en secciones (nav sticky de 68px).

---

## 2. Stack tecnológico y decisiones

| Área              | Elección                                                                                                                    | Notas                                                                                                                                                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework         | **Next.js 15 (App Router)** + React 19, **JavaScript** (sin TS en componentes)                                              | Buenas prácticas: Server Components por defecto, `"use client"` solo donde hay interactividad (nav móvil, reveal)                                                                                 |
| CSS               | **Tailwind CSS v4**                                                                                                         | ⚠️ Asumo que "Twin" = **Tailwind**. Si te referías a `twin.macro` (Tailwind + styled-components), se ajusta el plan — confírmalo                                                                  |
| Rutas             | Ruta catch-all opcional `app/[[...section]]/page.js` que renderiza siempre la one-page y hace scroll a la sección de la URL | `/about`, `/stack`, `/experience`, `/projects`, `/contact` pre-generadas con `generateStaticParams`; scroll suave al montar y al navegar; actualización de URL al hacer scroll (opcional, fase 2) |
| Datos             | `src/data/portfolio.json` (extraído de la referencia)                                                                       | Abstraído para en el futuro servirlo vía REST/CMS                                                                                                                                                 |
| Iconos            | `react-icons` (Font Awesome 6)                                                                                              | Tree-shakeable, sin fuentes de iconos                                                                                                                                                             |
| Fuentes           | `next/font/google` (Space Grotesk, IBM Plex Sans, IBM Plex Mono)                                                            | Self-hosted automático, sin FOUT                                                                                                                                                                  |
| Tests             | **Vitest + React Testing Library** (unit/component)                                                                         | Análogo a las pruebas de WordPress: ESLint ≈ PHPCS, Vitest ≈ PHPUnit                                                                                                                              |
| Análisis estático | **ESLint 9** (`eslint-config-next` + reglas extra) + **Prettier**                                                           | ESLint con `next/core-web-vitals`; Prettier con plugin de Tailwind (ordena clases)                                                                                                                |
| Pre-commit        | **Husky + lint-staged**                                                                                                     | Cada commit: Prettier + ESLint sobre staged; `npm test` en pre-push (o en pre-commit si prefieres)                                                                                                |
| CI/CD             | **GitHub Actions → Vercel**                                                                                                 | Push a `main`: lint + test + build → deploy production. PRs: lint + test + preview deploy                                                                                                         |
| Hosting           | **Vercel**                                                                                                                  | Proyecto vinculado por `VERCEL_TOKEN` + `VERCEL_ORG_ID` + `VERCEL_PROJECT_ID` (secrets de GitHub)                                                                                                 |

### Equivalencia con el tooling de WordPress (lo que pides de PHPStan/PHPCS)

| WordPress / PHP       | Este proyecto                                                 | Qué valida                                                              |
| --------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| PHPCS (WPCS)          | ESLint + Prettier                                             | Estilo de código, buenas prácticas React/Next, orden de clases Tailwind |
| PHPStan               | ESLint reglas estrictas (`react-hooks`, `import`, `jsx-a11y`) | Errores estáticos, hooks mal usados, imports rotos, accesibilidad       |
| PHPUnit               | Vitest + React Testing Library                                | Render y comportamiento de componentes                                  |
| pre-commit (composer) | Husky + lint-staged                                           | Bloquea commits que no pasen las pruebas                                |

---

## 3. Arquitectura de componentes (atomización)

```
src/
├── app/
│   ├── layout.js                  # fuentes, metadata, <html lang>
│   ├── globals.css                # Tailwind + tokens (@theme)
│   └── [[...section]]/page.js    # one-page + scroll a sección
├── components/
│   ├── ui/                        # átomos reutilizables
│   │   ├── Button.js              # variantes: gradient, ghost/glass, white
│   │   ├── Badge.js               # pill con icono (roles, "open to")
│   │   ├── Chip.js                # etiqueta mono (skills, tech) + variante hover
│   │   ├── Card.js                # base: borde, radio, sombra, hover-lift
│   │   ├── SectionHeading.js      # kicker "01 — About" + H2 + descripción
│   │   ├── IconTile.js            # cuadrado con gradiente + icono
│   │   ├── Stat.js                # número gradiente + label
│   │   └── GradientBlob.js        # blobs decorativos animados
│   ├── layout/
│   │   ├── Navbar.js              # sticky + blur ("use client": menú móvil)
│   │   ├── MobileMenu.js
│   │   ├── Footer.js
│   │   └── Section.js             # wrapper: id, scroll-margin, contenedor 1120px
│   ├── sections/                  # organismos (Server Components)
│   │   ├── Hero.js
│   │   ├── About.js
│   │   ├── Stack.js
│   │   ├── Experience.js
│   │   ├── Projects.js
│   │   └── Contact.js
│   └── cards/                     # moléculas por dominio
│       ├── HobbyCard.js
│       ├── SkillGroupCard.js
│       ├── ExperienceItem.js      # nodo + línea de timeline + card
│       ├── ProjectCard.js
│       └── ContactMethod.js
├── hooks/
│   ├── useRevealOnScroll.js       # IntersectionObserver (client)
│   └── useScrollToSection.js      # scroll suave según ruta
├── data/
│   └── portfolio.json
└── lib/
    └── portfolio.js               # acceso a datos (futuro: fetch REST)
```

---

## 4. Requerimientos — lo que necesito de ti

### Assets (bloquean el resultado final, no el desarrollo — se usa placeholder mientras tanto)

1. **Video del hero**: `hero.mp4` + `hero.webm` (~10–20s, loop, sin audio) y `hero-poster.jpg`. Alternativa: imagen estática o gradiente animado en CSS.
2. **Foto personal** para About (ratio 4:5, mín. ~800×1000).
3. **Imágenes de proyectos** (3): rover 4WD, experimento IoT/TFT, algo que represente IA (ratio ~16:9, mín. 1200px de ancho).
4. **CV en PDF** para el botón "Download CV".
5. **Favicon / logo**: ¿basta el monograma "MB" con gradiente (se genera en SVG) o tienes logo propio?

### Información

6. **URLs reales de LinkedIn y GitHub** (en el JSON están como `#` / `your-handle`).
7. **Teléfono**: confirmar si se publica `+34 675 989 629` (es dato público en la web).
8. **Idioma del contenido**: la referencia está en inglés — ¿se queda en inglés, español, o bilingüe (i18n)? El plan asume **inglés** (como la referencia).
9. **Sección Education**: existe en los datos pero no en el diseño — ¿se añade o se omite?
10. **Metadata SEO**: título del sitio, descripción, dominio final (para Open Graph y sitemap).

### Cuentas, tokens y accesos (necesarios en la Fase 5)

11. **Repositorio GitHub**: crear repo remoto (p. ej. `manolosky99/mb-crew`) y conectarlo (`git remote add origin …`).
12. **Cuenta Vercel** con el proyecto creado (o permiso para crearlo con `vercel link`).
13. **Secrets en GitHub** (Settings → Secrets and variables → Actions):
    - `VERCEL_TOKEN` — token personal de Vercel (Account Settings → Tokens).
    - `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` — los genera `vercel link` en `.vercel/project.json`.
14. **Dominio propio** (opcional): si lo hay, se configura en Vercel.
15. **APIs**: ninguna necesaria — el sitio es estático con datos en JSON. (El formulario de contacto es `mailto:`; si más adelante quieres formulario real, haría falta un servicio tipo Resend — decisión futura.)

---

## 5. Fases de ejecución

### Fase 0 — Scaffolding y tooling _(base del proyecto)_

- [ ] `create-next-app` (JS, App Router, Tailwind, ESLint, `src/`).
- [ ] Configurar Prettier + `prettier-plugin-tailwindcss`; ESLint con reglas extra (`react-hooks`, `jsx-a11y`, `import`).
- [ ] Vitest + React Testing Library + jsdom; test de humo.
- [ ] Husky + lint-staged (pre-commit: lint + format; pre-push: tests).
- [ ] `.editorconfig`, `.nvmrc`, scripts npm (`dev`, `build`, `lint`, `format`, `test`, `test:watch`).
- [ ] Commit inicial y push (conventional commits).
- **Entregable:** proyecto arranca con `npm run dev`, tooling verde, pre-commit funcionando.

### Fase 1 — Design system y datos

- [ ] Tokens en Tailwind v4 (`@theme`): colores, gradiente de marca, fuentes, sombras, radios, animaciones `floaty`.
- [ ] Fuentes con `next/font/google`.
- [ ] `portfolio.json` + `lib/portfolio.js`.
- [ ] Átomos: Button, Badge, Chip, Card, SectionHeading, IconTile, Stat, GradientBlob — con tests básicos de render.
- **Entregable:** página de muestra con los átomos (se elimina después) + tests.

### Fase 2 — Secciones de la one-page

- [ ] Layout: Navbar (desktop + móvil), Section, Footer.
- [ ] Hero (con poster/gradiente mientras no haya video).
- [ ] About + HobbyCards + blobs.
- [ ] Stack (SkillGroupCard).
- [ ] Experience (timeline).
- [ ] Projects (ProjectCard).
- [ ] Contact.
- [ ] Reveal-on-scroll (`useRevealOnScroll`), respetando `prefers-reduced-motion`.
- **Entregable:** one-page completa fiel a los screenshots, responsive (breakpoint móvil ~820px).

### Fase 3 — Rutas y scroll

- [ ] `app/[[...section]]/page.js` + `generateStaticParams` (`about`, `stack`, `experience`, `projects`, `contact`).
- [ ] Scroll suave a la sección al cargar la URL y al navegar; 404 para rutas desconocidas.
- [ ] Nav con enlaces de ruta (no solo `#hash`) y estado activo.
- [ ] Metadata por sección (`generateMetadata`), sitemap y robots.
- **Entregable:** `/about` etc. cargan la one-page y aterrizan en su sección.

### Fase 4 — Calidad

- [ ] Tests de componentes clave (render con datos reales, navegación, menú móvil, scroll hook).
- [ ] Accesibilidad: landmarks, `aria`, contraste, foco visible, `alt`.
- [ ] Lighthouse ≥ 95 en Performance/A11y/Best Practices/SEO.
- [ ] Documentación: `README.md` (arranque) + `docs/TESTING.md` (suite de calidad, análoga a la de WordPress).
- **Entregable:** suite completa verde, documentada y abstraída del código de la página.

### Fase 5 — CI/CD con GitHub Actions y Vercel _(requiere puntos 11–13)_

- [ ] `vercel link` + secrets en GitHub.
- [ ] Workflow `ci.yml`: en PR y push → install, lint, test, build.
- [ ] Workflow `deploy.yml`: push a `main` → CI + `vercel build` + `vercel deploy --prebuilt --prod`; en PRs → preview deploy con URL comentada.
- [ ] Desactivar el auto-deploy de Vercel por Git para que el deploy pase **solo** por Actions (deployment protection).
- [ ] `docs/CI-CD.md`: diagrama del flujo, secrets, cómo rotar tokens, troubleshooting.
- **Entregable:** push a `main` = tests + deploy automático a producción.

### Fase 6 — Assets finales y cierre _(requiere puntos 1–10)_

- [ ] Integrar video hero, foto, imágenes de proyectos, CV.
- [ ] Enlaces sociales reales, metadata definitiva, dominio.
- [ ] QA visual final contra screenshots (desktop + móvil) y en dispositivos reales.

---

## 6. Riesgos y decisiones abiertas

1. **"Twin" vs Tailwind vs twin.macro** — el plan asume Tailwind CSS v4. Confirmar.
2. **Video del hero** — puede penalizar LCP; plan B: poster estático + gradientes animados, video con `preload="none"` y carga diferida.
3. **Sección Education** — ¿incluirla?
4. **Idioma / i18n** — si se quiere bilingüe, afecta a la Fase 3 (rutas `/es`, `/en`) y conviene decidirlo antes.
5. **ZIP mencionado** — dijiste que compartirías un .ZIP; solo llegó el HTML de referencia. Si el ZIP contiene algo más (assets, otro diseño), compártelo antes de la Fase 1.
