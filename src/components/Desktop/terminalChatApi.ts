const CHAT_API_URL = process.env.GATSBY_CHAT_API_URL ?? ""

export type ChatApiResult =
  | { ok: true; text: string }
  | { ok: false; status: number; message: string }

export function isChatConfigured(): boolean {
  return CHAT_API_URL.length > 0
}

export async function sendChatMessage(message: string): Promise<ChatApiResult> {
  if (!CHAT_API_URL) {
    return { ok: false, status: 0, message: "Chat is not configured." }
  }

  const response = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  })

  let payload: { text?: string; error?: string } = {}
  try {
    payload = (await response.json()) as { text?: string; error?: string }
  } catch {
    return {
      ok: false,
      status: response.status,
      message: `Request failed (${response.status}).`,
    }
  }

  if (response.status === 429) {
    return {
      ok: false,
      status: 429,
      message: payload.error ?? "Too many requests. Try again in a minute.",
    }
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: payload.error ?? `Request failed (${response.status}).`,
    }
  }

  return { ok: true, text: (payload.text ?? "").trim() }
}
