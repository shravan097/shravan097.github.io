export interface Env {
  OPENROUTER_API_KEY: string
  RATE_LIMIT_PER_MINUTE: string
  OPENROUTER_MODEL?: string
}

const ALLOWED_ORIGIN = "https://shravan097.github.io"

const SYSTEM_PROMPT = `You are a friendly assistant in a developer's portfolio terminal. Reply in 1-2 short sentences. Be natural: greet back for hello/hi, answer career-related questions briefly. Never apologize, ask for clarification, or say the request is unclear.

Scope — only answer questions about:
- Shravan Dhakal (who he is, background, skills, education, experience, work, tech stack, industries, contact links)
- This portfolio site or terminal (commands, how to learn more about him)

Do NOT answer unrelated questions (general trivia, homework, news, politics, personal advice, coding help, recipes, math, etc.). For off-topic messages, politely decline in one short sentence and suggest typing 'help' or asking about Shravan's background, skills, or experience. Do not attempt the off-topic task even briefly.

When answering about the portfolio owner: use ONLY the facts in the context below. Do not add, infer, or assume any fact not explicitly stated there. For example, "AWS" in context means a technology he uses (cloud), not his employer. If something is not in the context, say you don't know or only state what is in the context. Do not give non-factual answers.`

const CHAT_CONTEXT = `Facts about the portfolio owner (answer ONLY from this; do not add or assume anything else):
- Name: Shravan Dhakal. Username: shravan097.
- Role: Software Engineer.
- LinkedIn: linkedin.com/in/shravan-dhakal/
- GitHub: github.com/shravan097
- Education: BS Computer Science, City College of New York (CCNY), graduated 2019.
- Skills and tech (things he works with, not employers): Languages: TypeScript, Python, Ruby. Frontend: React, Redux. Backend: Microservices, Monolithic, Serverless, Message Queues, REST, GraphQL. Cloud: AWS (as in the platform). Industries he has worked in: Automotive IoT, Healthtech, Fintech.`

const MAX_MESSAGE_LENGTH = 500
const MAX_OUTPUT_TOKENS = 150
const DEFAULT_OPENROUTER_MODEL = "openai/gpt-4o-mini"
const RATE_LIMIT_WINDOW_SECONDS = 60

function isAllowedOrigin(origin: string | null): boolean {
  return origin === ALLOWED_ORIGIN
}

function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  }
  if (isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN
  }
  return headers
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  })
}

function clientIp(request: Request): string {
  return request.headers.get("CF-Connecting-IP") ?? "unknown"
}

async function isRateLimited(env: Env, ip: string): Promise<boolean> {
  const limit = Math.max(1, parseInt(env.RATE_LIMIT_PER_MINUTE, 10) || 10)
  const bucket = Math.floor(Date.now() / (RATE_LIMIT_WINDOW_SECONDS * 1000))
  const cacheKey = new Request(`https://rate-limit.local/${encodeURIComponent(ip)}/${bucket}`)
  const cached = await caches.default.match(cacheKey)
  const count = cached ? parseInt(await cached.text(), 10) || 0 : 0
  if (count >= limit) return true
  await caches.default.put(
    cacheKey,
    new Response(String(count + 1), {
      headers: { "Cache-Control": `max-age=${RATE_LIMIT_WINDOW_SECONDS + 30}` },
    })
  )
  return false
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin")

    if (request.method === "OPTIONS") {
      if (!isAllowedOrigin(origin)) {
        return new Response(null, { status: 403 })
      }
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, origin)
    }

    if (!isAllowedOrigin(origin)) {
      return json({ error: "Forbidden" }, 403, origin)
    }

    if (!env.OPENROUTER_API_KEY) {
      return json({ error: "Server not configured" }, 503, origin)
    }

    const ip = clientIp(request)
    if (await isRateLimited(env, ip)) {
      return json({ error: "Too many requests. Try again in a minute." }, 429, origin)
    }

    let message: string
    try {
      const body = (await request.json()) as { message?: unknown }
      message = String(body.message ?? "").trim().slice(0, MAX_MESSAGE_LENGTH)
    } catch {
      return json({ error: "Invalid JSON body" }, 400, origin)
    }

    if (!message) {
      return json({ error: "message is required" }, 400, origin)
    }

    const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://shravan097.github.io",
        "X-Title": "Shravan OS Terminal",
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
        max_tokens: MAX_OUTPUT_TOKENS,
        messages: [
          { role: "system", content: `${SYSTEM_PROMPT}\n\n${CHAT_CONTEXT}` },
          { role: "user", content: message },
        ],
      }),
    })

    if (!openRouterRes.ok) {
      const detail = await openRouterRes.text()
      console.error("OpenRouter error", openRouterRes.status, detail)
      return json({ error: "Upstream model error" }, 502, origin)
    }

    const data = (await openRouterRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const text = data.choices?.[0]?.message?.content?.trim() ?? ""

    return json({ text: text || "Sorry, I couldn't generate a reply." }, 200, origin)
  },
}
