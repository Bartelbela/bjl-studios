# BJL Studios

Marketing site for **BJL Studios** — Digital agency in Mönchengladbach, Germany.
Web Design · SEO · Social Media · Branding · Video Production.

Production: <https://bjl-studios.de>

---

## Stack

- Static HTML5 + locally built **Tailwind CSS**
- Vanilla JavaScript (no framework)
- **Node.js 20** HTTP API for the contact form (forwards to Telegram)
- **Nginx** reverse proxy + security headers + rate limiting
- **Docker Compose** for local + production runtime
- **GitHub Actions** for CI/CD (lint → test → Lighthouse → deploy)

## Project structure

```
.
├── index.html              # main single-page site
├── datenschutz.html        # privacy policy (DE)
├── impressum.html          # legal notice (DE)
├── src/styles.css          # Tailwind entry
├── tailwind.config.js
├── assets/                 # images, fonts, animation frames
├── api/                    # Node HTTP server for /api/contact
├── nginx.conf              # reverse proxy + security
├── docker-compose.yml
├── .github/workflows/
├── .claude/                # Claude Code agents + settings
└── CLAUDE.md               # project rules for Claude Code
```

## Prerequisites

- Node.js ≥ 20
- Docker + Docker Compose (for full stack)
- A Telegram bot token + chat id (for contact form forwarding)

## Setup

```powershell
git clone https://github.com/Bartelbela/bjl-studios.git
cd bjl-studios
npm install
Copy-Item .env.example .env   # fill in TG_BOT_TOKEN, TG_CHAT_ID
```

## Development

```powershell
npm run dev          # Tailwind watch + http-server on :8080
npm run build        # one-off Tailwind build (minified)
npm run lint         # Prettier + html-validate
npm run format       # auto-fix formatting
npm run test         # API tests + Playwright e2e
npm run lighthouse   # Lighthouse CI against local build
```

Full prod stack locally:

```powershell
docker compose up -d --build
```

## Deployment

Push to `main` → GitHub Actions runs the pipeline → SSH-deploys to the dockerbox → `docker compose up -d --build` → nginx reloads in place.

Required GitHub Secrets:
- `TG_BOT_TOKEN`, `TG_CHAT_ID`
- `SSH_HOST`, `SSH_USER`, `SSH_KEY`

## Working with Claude Code

This repo ships a Claude Code configuration in `.claude/` and rules in `CLAUDE.md`. Highlights:

- **Subagents**: `designer`, `developer`, `copywriter`, `translator`, `qa`, `seo-specialist`, `a11y-auditor`, `security-auditor`, `perf-engineer`, `devops`.
- **Skills used proactively**: `/review` (PRs), `/security-review` (api/nginx changes), `/simplify` (large edits).
- **MCPs (`.mcp.json`)**: GitHub, Playwright. Set `GITHUB_TOKEN` in your shell.

Read `CLAUDE.md` before changing anything — it documents the design workflow, brand system, and quality gates.

## Quality gates (must pass on `main`)

- Prettier + html-validate clean
- Playwright smoke tests green
- Lighthouse Performance / A11y / Best-Practices / SEO ≥ 95
- `/security-review` executed for any change in `api/` or `nginx.conf`

## License

Proprietary © BJL Studios. All rights reserved.
