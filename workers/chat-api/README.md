# Terminal chat API (OpenRouter + rate limit)

Cloudflare Worker that proxies terminal chat to [OpenRouter](https://openrouter.ai/) with **per-IP rate limiting**. The API key stays on the server.

Browser requests are accepted **only** from `https://shravan097.github.io` (CORS + required `Origin` header).

## Cloudflare configuration

Set these on the worker in the Cloudflare dashboard:

| Name | Type | Example |
|------|------|---------|
| `OPENROUTER_API_KEY` | Secret (encrypted) | your OpenRouter key |
| `RATE_LIMIT_PER_MINUTE` | Variable | `10` |

Optional: `OPENROUTER_MODEL` in `wrangler.toml` or dashboard (defaults to `openai/gpt-4o-mini`).

No KV namespace required — rate-limit counters use the Workers Cache API.

## Deploy

```bash
cd workers/chat-api
npm install
cp .dev.vars.example .dev.vars   # local dev only
npm run deploy
```

Note the Worker URL (e.g. `https://portfolio-chat-api.<account>.workers.dev`).

## Run server only (local)

From repo root:

```bash
npm run chat-api:dev
```

Worker listens on `http://127.0.0.1:8787`. Test with:

```bash
curl -X POST http://127.0.0.1:8787 \
  -H "Content-Type: application/json" \
  -H "Origin: https://shravan097.github.io" \
  -d '{"message":"hello"}'
```

## Gatsby

Set the Worker URL at build time:

```bash
# .env.development (copy from .env.development.example)
GATSBY_CHAT_API_URL=https://portfolio-chat-api.<account>.workers.dev
```

For production, add `GATSBY_CHAT_API_URL` to your build environment before `gatsby build`.

## Rate limit

**10 requests per minute per IP** by default (`RATE_LIMIT_PER_MINUTE`).
