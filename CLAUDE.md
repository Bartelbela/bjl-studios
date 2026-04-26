# BJL Studios — Claude Code Configuration

## Project
Marketing site for BJL Studios (Digital agency, Mönchengladbach).
Stack: Static HTML + Tailwind (locally built) + vanilla JS + small Node API.
Domain: bjl-studios.de · Repo: github.com/Bartelbela/bjl-studios

## Architecture
- `index.html` — single-page site, hash-anchored sections
- `datenschutz.html`, `impressum.html` — legal pages (DE)
- `api/server.js` — Node HTTP server, forwards contact form to Telegram
- `nginx.conf` — reverse proxy, security headers, rate limiting
- `docker-compose.yml` — local dev + production runtime
- `.github/workflows/deploy.yml` — CI: lint → test → Lighthouse → deploy

## Design Workflow
NEVER invent designs. Always wait for input from Béla:
1. Reference (Stitch screenshot OR site + HTML)
2. Rebuild pixel-perfect in HTML + Tailwind
3. German copy, brand colors, dark mode supported

## Design System
- Primary White `#FFFFFF`, Accent Blue `#60A5FA`
- Font: Inter + Archivo Black (locally hosted, no Google Fonts CDN)
- Mobile-first, dark mode default
- Respect `prefers-reduced-motion`

## Tech Rules
- All code & comments in English; all UI copy in German (i18n via `T` object, EN fallback)
- No heavy JS frameworks
- Tailwind via local CLI (`npm run build:css`), NOT CDN
- Server-side input validation on every API endpoint
- No third-party scripts without consent banner

## Commands
- `npm run dev` — Tailwind watch + local server
- `npm run build` — Tailwind build + asset optimisation
- `npm run lint` — Prettier + html-validate + eslint (api)
- `npm run test` — Node test runner (api) + Playwright (e2e)
- `npm run lighthouse` — Lighthouse CI against local build
- `docker compose up -d --build` — full prod stack

## Quality Gates (must pass before merge to main)
- Prettier + html-validate clean
- Playwright smoke test green
- Lighthouse: Performance / A11y / Best-Practices / SEO ≥ 95
- `/security-review` executed for changes touching `api/` or `nginx.conf`

## Subagents
- `designer` · layout, animations, visual fidelity
- `developer` · JS, interactivity, build pipeline
- `copywriter` · German marketing copy, tone
- `translator` · DE ⇄ EN i18n keys
- `qa` · manual & exploratory testing
- `seo-specialist` · JSON-LD, meta, sitemap, robots
- `a11y-auditor` · WCAG 2.2 AA
- `security-auditor` · CSP, validation, deps
- `perf-engineer` · images, critical CSS, budgets
- `devops` · Docker, nginx, CI/CD

## Skills (use proactively)
- `/review` before every PR merge
- `/security-review` before every release & on api/nginx changes
- `/simplify` after large edits to `index.html`

## MCP Servers (recommended)
- GitHub MCP — PRs/issues/releases
- Playwright MCP — e2e + screenshot diffs
- Google Drive MCP — design asset exchange with Béla

## Workflow Rules
- After every change: state what changed in 1–2 sentences
- Never start a section without a design reference
- On `main`: commit with conventional-commit message, push, let CI deploy
- Never bypass hooks (`--no-verify`) — fix the root cause
- Never re-introduce Tailwind CDN, Google Fonts CDN, or 3rd-party scripts without consent

## Out of scope (don't add unless asked)
- Heavy JS frameworks (React, Vue, Next, …)
- Backend databases (project uses Telegram as inbox)
- A/B-Testing platforms, marketing automation
- Custom CMS — content lives in `index.html` + `T` object
