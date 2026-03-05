# Hermit environment

This is a [Hermit](https://github.com/cashapp/hermit) bin directory. Packages here (e.g. Node) are local to this project.

## First-time setup (from repo root)

1. **Install Hermit** (once on your machine):
   ```bash
   curl -fsSL https://github.com/cashapp/hermit/releases/download/stable/install.sh | /bin/bash
   ```
   Ensure `~/bin` (or Hermit’s install path) is in your `PATH`.

2. **Init and activate** (if `bin/activate-hermit` is missing, run `hermit init` first):
   ```bash
   . bin/activate-hermit
   hermit install node
   ```

3. **Install deps and run:**
   ```bash
   npm install
   npm run develop
   ```
   Or use the project script: `./run` (from repo root).

## Every other time

From repo root: `./run` — or run `. bin/activate-hermit` then `npm run develop`.
