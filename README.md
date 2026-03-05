## Description

Repo for my [personal site](https://shravan097.github.io/). Built using Gatsby.

## Run with Hermit (recommended)

[Hermit](https://cashapp.github.io/hermit/) gives you a single command to run the site without installing Node globally.

**First time:** install Hermit, then from this repo:

```bash
hermit init
. bin/activate-hermit
hermit install node
npm install
```

**Then any time:**

```bash
./run
```

Or manually: `. bin/activate-hermit` then `npm run develop`. See `bin/README.hermit.md` for full details.

## Run without Hermit

```bash
npm install
npm run develop
```

Requires Node.js and npm installed on your system.
