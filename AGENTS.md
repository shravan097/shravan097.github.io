# AI / LLM context for this repo

**Read this file first** for project context instead of scanning the whole codebase. This repo is a personal portfolio site that presents as a **Desktop OS** (draggable windows, dock, terminal).

---

## Project at a glance

| What | Details |
|------|--------|
| **Purpose** | Personal portfolio + blog for Shravan Dhakal. Marketing/identity: name, LinkedIn, GitHub are always visible (dock). |
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
│   │   ├── Desktop/          # ★ Main UI: OS shell
│   │   │   ├── index.tsx     # Orchestrator, window defs, window content (About/Education/Experience)
│   │   │   ├── Window.tsx    # Draggable macOS-style window (title bar, close)
│   │   │   ├── Menubar.tsx   # Top bar: "Shravan OS", clock
│   │   │   ├── Dock.tsx      # Bottom dock: avatar, name, LinkedIn, GitHub, app launchers
│   │   │   ├── DesktopIcon.tsx
│   │   │   ├── Terminal.tsx  # Interactive terminal (whoami, open linkedin, etc.)
│   │   │   └── BlogContent.tsx  # Blog list (GraphQL)
│   │   ├── Navbar/           # Legacy; not used on index (Desktop replaces it)
│   │   ├── Pages/            # Legacy section components (intropage, education, experience, blog)
│   │   ├── Icons/, socialLogos.tsx, tags.tsx, seo.tsx
│   ├── posts/                # Markdown blog posts
│   └── styles/               # global.css, shared.tsx
├── bin/                      # Hermit env (hermit.hcl, README.hermit.md)
├── run                       # Script: activate Hermit + npm run develop
├── gatsby-config.ts
├── tailwind.config.js
└── AGENTS.md                 # This file
```

---

## Where to change things

- **Add/change an “app” (window):** `src/components/Desktop/index.tsx` — extend `WINDOW_DEFS`, add a case in `WindowContent`, and optionally add a dock item in `Dock.tsx` (`APPS`).
- **Dock branding (name, LinkedIn, GitHub):** `src/components/Desktop/Dock.tsx`.
- **Terminal commands:** `src/components/Desktop/Terminal.tsx` — `COMMANDS` and the `open linkedin` / `open github` handling.
- **Blog content:** Add `.md` in `src/posts/`; frontmatter must include `slug`, `title`, `date`, `tags`. Blog list is GraphQL in `BlogContent.tsx`.
- **Site metadata / SEO:** `gatsby-config.ts` `siteMetadata` and `src/components/seo.tsx`.
- **Global styles:** `src/styles/global.css`; Tailwind config in `tailwind.config.js`.

---

## Conventions and gotchas

- **SSR:** The Desktop is client-only. `Desktop/index.tsx` uses a `mounted` check and renders a blank dark div during SSR to avoid hydration mismatch.
- **No react-rnd:** Windows are draggable via plain React state + mouse events in `Window.tsx`.
- **Blog:** Uses `gatsby-transformer-remark`; blog template is the dynamic page under `src/pages/`.
- **Old components:** `Navbar`, `IntroPage`, `Education`, `Experience`, `Blog` under `components/Pages/` are legacy; the live index uses Desktop and in-window content defined in `Desktop/index.tsx` (AboutContent, EducationContent, ExperienceContent) plus `BlogContent.tsx` for the blog list.

---

## Quick reference for prompts

- “Change the dock” → `Dock.tsx`.
- “Add a new window/app” → `Desktop/index.tsx` (WINDOW_DEFS + WindowContent).
- “Add a terminal command” → `Terminal.tsx`.
- “Edit blog list query or styling” → `BlogContent.tsx`.
- “Run the site” → `./run` or Hermit + `npm run develop` (see above).
