export interface ChatRateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>
}

export interface Env {
  OPENROUTER_API_KEY: string
  OPENROUTER_MODEL?: string
  CHAT_RATE_LIMITER: ChatRateLimiter
}

const ALLOWED_ORIGIN = "https://shravan097.github.io"

const SYSTEM_PROMPT = `You are a friendly assistant in Shravan Dhakal's portfolio terminal. Keep replies to 1-2 short, natural sentences.

Focus on career and tech topics that fit a resume site: Shravan's background, skills, experience, education, tech stack, industries he's worked in, and how to connect (LinkedIn, GitHub). You can also help with this portfolio or terminal (e.g. commands, where to learn more).

Stay in the professional lane — software engineering, his work, and job-related questions are all fair game. If someone goes clearly off-topic (recipes, politics, random trivia), briefly steer them back toward his career or tech background instead of answering at length.

Use the context below as your main source. You can speak naturally and helpfully; if you don't know something specific about Shravan, say so briefly rather than making things up.`

const CHAT_CONTEXT = `About Shravan Dhakal:
- Name: Shravan Dhakal. Username: shravan097.
- Role: Software Engineer.
- LinkedIn: linkedin.com/in/shravan-dhakal/
- GitHub: github.com/shravan097
- Education: BS Computer Science, City College of New York (CCNY), graduated 2019.
- Skills and tech: Languages: TypeScript, Python, Ruby. Frontend: React, Redux. Backend: Microservices, Monolithic, Serverless, Message Queues, REST, GraphQL. Cloud: AWS. Industries: Automotive IoT, Healthtech, Fintech.`

const MAX_MESSAGE_LENGTH = 500
const MAX_OUTPUT_TOKENS = 150
const DEFAULT_OPENROUTER_MODEL = "openai/gpt-4o-mini"

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
  const { success } = await env.CHAT_RATE_LIMITER.limit({ key: ip })
  return !success
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
