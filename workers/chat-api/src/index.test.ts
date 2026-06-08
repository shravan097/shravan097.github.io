import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import worker, { type ChatRateLimiter, type Env } from "./index"

const ALLOWED_ORIGIN = "https://shravan097.github.io"

function createMockRateLimiter(limit: number): ChatRateLimiter {
  const counts = new Map<string, number>()
  return {
    limit: async ({ key }) => {
      const count = (counts.get(key) ?? 0) + 1
      counts.set(key, count)
      return { success: count <= limit }
    },
  }
}

function createEnv(overrides: Partial<Env> = {}, rateLimit = 10): Env {
  return {
    OPENROUTER_API_KEY: "test-key",
    CHAT_RATE_LIMITER: createMockRateLimiter(rateLimit),
    ...overrides,
  }
}

function chatRequest(
  body: unknown,
  options: {
    method?: string
    origin?: string | null
    ip?: string
  } = {}
): Request {
  const headers = new Headers()
  const method = options.method ?? "POST"

  if (options.origin) {
    headers.set("Origin", options.origin)
  }
  if (options.ip) {
    headers.set("CF-Connecting-IP", options.ip)
  }
  if (method === "POST") {
    headers.set("Content-Type", "application/json")
  }

  return new Request("https://portfolio-chat-api.example/", {
    method,
    headers,
    body: method === "POST" ? JSON.stringify(body) : undefined,
  })
}

describe("portfolio chat API worker", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.includes("openrouter.ai")) {
          return new Response(
            JSON.stringify({
              choices: [{ message: { content: "Hi, I am Shravan's assistant." } }],
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          )
        }
        throw new Error(`Unexpected fetch: ${url}`)
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("allows CORS preflight from the portfolio origin", async () => {
    const response = await worker.fetch(
      chatRequest(null, { method: "OPTIONS", origin: ALLOWED_ORIGIN }),
      createEnv()
    )

    expect(response.status).toBe(204)
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(ALLOWED_ORIGIN)
  })

  it("rejects preflight from other origins", async () => {
    const response = await worker.fetch(
      chatRequest(null, { method: "OPTIONS", origin: "https://evil.example" }),
      createEnv()
    )

    expect(response.status).toBe(403)
  })

  it("rejects POST without the portfolio origin", async () => {
    const response = await worker.fetch(
      chatRequest({ message: "hello" }, { origin: "http://localhost:8000" }),
      createEnv()
    )

    expect(response.status).toBe(403)
    await expect(response.json()).resolves.toEqual({ error: "Forbidden" })
  })

  it("rejects non-POST methods", async () => {
    const response = await worker.fetch(
      chatRequest(null, { method: "GET", origin: ALLOWED_ORIGIN }),
      createEnv()
    )

    expect(response.status).toBe(405)
  })

  it("returns 503 when OpenRouter key is missing", async () => {
    const response = await worker.fetch(
      chatRequest({ message: "hello" }, { origin: ALLOWED_ORIGIN }),
      createEnv({ OPENROUTER_API_KEY: "" })
    )

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({ error: "Server not configured" })
  })

  it("validates JSON body and message field", async () => {
    const invalidJson = await worker.fetch(
      new Request("https://portfolio-chat-api.example/", {
        method: "POST",
        headers: {
          Origin: ALLOWED_ORIGIN,
          "Content-Type": "application/json",
        },
        body: "{not-json",
      }),
      createEnv()
    )
    expect(invalidJson.status).toBe(400)

    const emptyMessage = await worker.fetch(
      chatRequest({ message: "   " }, { origin: ALLOWED_ORIGIN }),
      createEnv()
    )
    expect(emptyMessage.status).toBe(400)
    await expect(emptyMessage.json()).resolves.toEqual({ error: "message is required" })
  })

  it("returns model text on success", async () => {
    const response = await worker.fetch(
      chatRequest({ message: "hello" }, { origin: ALLOWED_ORIGIN, ip: "1.2.3.4" }),
      createEnv()
    )

    expect(response.status).toBe(200)
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(ALLOWED_ORIGIN)
    await expect(response.json()).resolves.toEqual({
      text: "Hi, I am Shravan's assistant.",
    })

    const openRouterFetch = vi.mocked(fetch)
    expect(openRouterFetch).toHaveBeenCalledOnce()
    const [, openRouterInit] = openRouterFetch.mock.calls[0]
    const headers = openRouterInit?.headers as Record<string, string>
    expect(headers.Authorization).toBe("Bearer test-key")
  })

  it("rate limits repeated requests from the same IP", async () => {
    const env = createEnv({}, 2)

    expect(
      (await worker.fetch(
        chatRequest({ message: "hello" }, { origin: ALLOWED_ORIGIN, ip: "9.9.9.9" }),
        env
      )).status
    ).toBe(200)
    expect(
      (await worker.fetch(
        chatRequest({ message: "hello again" }, { origin: ALLOWED_ORIGIN, ip: "9.9.9.9" }),
        env
      )).status
    ).toBe(200)

    const limited = await worker.fetch(
      chatRequest({ message: "one more" }, { origin: ALLOWED_ORIGIN, ip: "9.9.9.9" }),
      env
    )
    expect(limited.status).toBe(429)
    await expect(limited.json()).resolves.toEqual({
      error: "Too many requests. Try again in a minute.",
    })
  })

  it("maps upstream OpenRouter failures to 502", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("upstream down", { status: 500 }))
    )

    const response = await worker.fetch(
      chatRequest({ message: "hello" }, { origin: ALLOWED_ORIGIN, ip: "5.5.5.5" }),
      createEnv()
    )

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({ error: "Upstream model error" })
  })
})
