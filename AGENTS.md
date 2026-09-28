# AI / LLM context for this repo

**Read this file first** for project context instead of scanning the whole codebase. This repo is a personal portfolio site that presents as a **Desktop OS** (draggable windows, dock, terminal).

---

## Project at a glance

| What | Details |
|------|--------|
| **Purpose** | Personal portfolio + blog for Shravan Dhakal. **macOS Desktop shell** (menubar + dock + windows) with an **Astryx File Explorer** inside the Finder window. |
| **Live site** | https://shravan097.github.io/ |
| **Framework** | Gatsby 4 (React, SSG) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v3 |
| **Hosting** | GitHub Pages (`gh-pages` branch); CI in `.github/workflows/website.yml` |

---

## How to run

- **With Hermit (recommended):** `./run` after one-time setup (`hermit init`, `. bin/activate-hermit`, `hermit install node`, `npm install`). See `bin/README.hermit.md`.
- **Without Hermit:** `npm install` then `npm run develop` (requires Node/npm on the system).

---

## Repo structure (what lives where)

```
├── src/
│   ├── pages/
│   │   ├── index.tsx          # Entry: renders <Desktop /> only
│   │   ├── 404.tsx
│   │   └── {MarkdownRemark...}.tsx   # Blog post template
│   ├── components/
│   │   ├── Desktop/          # ★ Shell: menubar, dock, windows
│   │   │   ├── index.tsx     # WINDOW_DEFS + WindowContent (Finder, About, Snake, …)
│   │   │   ├── Window.tsx    # Draggable macOS-style window
│   │   │   ├── Menubar.tsx   # Top bar: "Shravan OS", clock
│   │   │   ├── Dock.tsx      # Bottom dock: avatar, LinkedIn, GitHub, apps
│   │   │   ├── Snake.tsx     # Retro Snake game
│   │   │   ├── Terminal.tsx  # Interactive terminal
│   │   │   └── BlogContent.tsx
│   │   ├── FileExplorer/     # Astryx Finder UI (embedded in Finder window)
│   │   │   ├── index.tsx     # Toolbar + grid/list/column/gallery views
│   │   │   ├── filesystem.ts # Portfolio → folder/file tree
│   │   │   ├── views.tsx     # Grid / List / Gallery layouts
│   │   │   └── DetailPanel.tsx
│   │   ├── Navbar/           # Legacy; not used on index
│   │   ├── Pages/            # Legacy section components (intropage, education, experience, blog)
│   │   ├── Icons/, socialLogos.tsx, tags.tsx, seo.tsx
│   ├── posts/                # Markdown blog posts
│   └── styles/               # global.css, shared.tsx
├── bin/                      # Hermit env (hermit.hcl, README.hermit.md)
├── static/                   # Copied verbatim to site root on build
│   ├── llms.txt              # LLM/agent summary of the site (llms.txt standard)
│   ├── llms-full.txt         # Full profile + all blog post content
│   └── robots.txt            # Crawler policy + sitemap reference
├── workers/chat-api/         # Cloudflare Worker powering the terminal AI chat (OpenRouter)
├── run                       # Script: activate Hermit + npm run develop
├── gatsby-config.ts
├── tailwind.config.js
└── AGENTS.md                 # This file
```

---

## Where to change things

- **Add/change an app window:** add one entry to `Desktop/apps.ts` — Dock, File menu, and desktop icons update automatically. Then add a `WindowContent` case in `Desktop/index.tsx`.
- **Add/change portfolio files in Finder:** `FileExplorer/filesystem.ts` (+ `resolveOpenAction` for double-click) and `DetailPanel.tsx`.
- **File Explorer toolbar / view modes:** `FileExplorer/index.tsx` + `views.tsx`.
- **Layout chrome (menubar / dock clearance):** `Desktop/layout.ts`.
- **Terminal commands:** `Desktop/Terminal.tsx`.
- **Astryx theme/CSS:** `gatsby-browser.ts` + `src/styles/global.css`.
- **Blog content:** Add `.md` in `src/posts/`; frontmatter must include `slug`, `title`, `date`, `tags`.
- **Site metadata / SEO:** `gatsby-config.ts` + `src/components/seo.tsx`.
- **Agent/LLM site summaries:** `static/llms.txt` (index) + `static/llms-full.txt` (full content) — keep in sync when profile, skills, or blog posts change.
- **Terminal AI chat (prompt, context, model, rate limiting):** `workers/chat-api/src/index.ts` — deploy with `npm run chat-api:deploy`.

---

## Conventions and gotchas

- **SSR:** Desktop and FileExplorer use a `mounted` check to avoid hydration mismatch.
- **Windows stay below menubar:** `Window.tsx` clamps `y >= MENUBAR_HEIGHT` from `layout.ts`.
- **Finder UX:** single-click selects / previews; double-click opens (app window, external URL, or blog route).
- **Astryx:** Requires React 19; installed with `legacy-peer-deps` for Gatsby 4. Theme CSS imported in `gatsby-browser.ts`.
- **Blog:** Uses `gatsby-transformer-remark`; posts also appear under Finder’s Blog folder.
- **Old components:** `Navbar`, `IntroPage`, etc. under `components/Pages/` are legacy.

---

## Quick reference for prompts

- “Change the dock” → `Dock.tsx`.
- “Add a new window/app” → `Desktop/index.tsx` (WINDOW_DEFS + WindowContent).
- “Add a terminal command” → `Terminal.tsx`.
- “Edit blog list query or styling” → `BlogContent.tsx`.
- “Run the site” → `./run` or Hermit + `npm run develop` (see above).
