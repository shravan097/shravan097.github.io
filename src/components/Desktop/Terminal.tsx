import * as React from "react"

const COMMANDS: Record<string, string> = {
  help: `Available commands:
  whoami          who is this?
  about           detailed bio
  skills          tech stack & languages
  education       education history
  experience      work experience
  open linkedin   open LinkedIn profile in browser
  open github     open GitHub profile in browser
  ls              list files
  pwd             print working directory
  date            current date & time
  echo <text>     print text
  clear           clear terminal
  (or type anything — AI will reply, runs in browser, no login)`,

  whoami: "shravan097 — Software Engineer",

  about: `╔══════════════════════════════════════╗
║         Shravan Dhakal               ║
║         Software Engineer            ║
╠══════════════════════════════════════╣
║  LinkedIn  linkedin.com/in/shravan-dhakal/
║  GitHub    github.com/shravan097
╚══════════════════════════════════════╝`,

  skills: `Languages:   TypeScript · Python · Ruby
Frontend:    React · Redux
Backend:     Microservices · REST · GraphQL
             Message Queues · Serverless
Cloud:       AWS
Industries:  Automotive IoT · Healthtech · Fintech`,

  education: `Institution:  City College of New York (CCNY)
Degree:       BS Computer Science
Graduated:    2019`,

  experience: `Backend Development
  ▸ Microservice, Monolithic, Serverless Architecture
  ▸ Message Queues, RESTful, GraphQL
  ▸ AWS

Industries
  ▸ Automotive IoT
  ▸ Healthtech
  ▸ Fintech`,

  ls: `about.txt     resume.pdf    projects/
blog/         contact.txt   .ssh/`,

  pwd: `/Users/shravan`,
}

const BANNER = `  ____  _                    ___  ____
 / ___|| |__  _ __ ___   / _ \\/ ___|
 \\___ \\| '_ \\| '__/ _ \\ | | | \\___ \\
  ___) | | | | | | (_) || |_| |___) |
 |____/|_| |_|_|  \\___/  \\___/|____/

 Welcome to Shravan OS  v1.0.0
 Type 'help' for commands. Type anything else to chat (AI, no login).
`

type Line = { type: "input" | "output" | "banner" | "error" | "chat"; text: string }

const HF_CDN = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1"

/** Instruction-following model with ONNX files that load reliably in the browser. */
const CHAT_MODEL = "Xenova/LaMini-Flan-T5-248M"

const SYSTEM_PROMPT = `You are a friendly assistant in a developer's portfolio terminal. Reply in 1-2 short sentences. Be natural: greet back for hello/hi, answer questions briefly. Never apologize, ask for clarification, or say the request is unclear.
When answering about the portfolio owner: use ONLY the facts in the context below. Do not add, infer, or assume any fact not explicitly stated there. For example, "AWS" in context means a technology he uses (cloud), not his employer. If something is not in the context, say you don't know or only state what is in the context. Do not give non-factual answers.`

/** Context about Shravan (about, skills, education, experience) — AI must only state these facts, never invent. */
const CHAT_CONTEXT = `Facts about the portfolio owner (answer ONLY from this; do not add or assume anything else):
- Name: Shravan Dhakal. Username: shravan097.
- Role: Software Engineer.
- LinkedIn: linkedin.com/in/shravan-dhakal/
- GitHub: github.com/shravan097
- Education: BS Computer Science, City College of New York (CCNY), graduated 2019.
- Skills and tech (things he works with, not employers): Languages: TypeScript, Python, Ruby. Frontend: React, Redux. Backend: Microservices, Monolithic, Serverless, Message Queues, REST, GraphQL. Cloud: AWS (as in the platform). Industries he has worked in: Automotive IoT, Healthtech, Fintech.`

const FALLBACK_REPLY = "Hi! Ask me anything or type 'help' for commands."

function buildChatPrompt(userInput: string): string {
  return `Instruction: ${SYSTEM_PROMPT}\n\n${CHAT_CONTEXT}\n\nUser: ${userInput.trim()}\n\nResponse:`
}

/** Ask the model if it can answer naturally; returns true if unclear (use fallback). */
function buildUnclearPrompt(userInput: string): string {
  return `Can you answer this user message naturally? Reply with exactly one word: OK or UNCLEAR. User: ${userInput.trim()}\n\nReply:`
}

function parseUnclearFlag(raw: string): boolean {
  const t = raw.trim().toLowerCase()
  return t.includes("unclear") || t.startsWith("no")
}

type ChatPipe = (
  input: string,
  opts?: { max_new_tokens?: number }
) => Promise<Array<{ generated_text: string }>>

/** Load pipeline from CDN (avoids Gatsby/webpack bundling issues). Uses text2text-generation for reliable ONNX loading. */
async function loadChatPipeline(): Promise<ChatPipe> {
  const mod = await import(/* webpackIgnore: true */ HF_CDN)
  const pipeline = mod.pipeline
  const pipe = await pipeline("text2text-generation", CHAT_MODEL)
  return async (input, opts = {}) => {
    const result = await pipe(input, {
      max_new_tokens: opts?.max_new_tokens ?? 100,
      temperature: 0.7,
      repetition_penalty: 1.2,
      do_sample: true,
    })
    const arr = Array.isArray(result) ? result : [result]
    return arr.map((r: { generated_text?: string }) => ({ generated_text: r?.generated_text ?? "" }))
  }
}

export const Terminal: React.FC = () => {
  const [input, setInput] = React.useState("")
  const [lines, setLines] = React.useState<Line[]>([{ type: "banner", text: BANNER }])
  const [cmdHistory, setCmdHistory] = React.useState<string[]>([])
  const [historyIdx, setHistoryIdx] = React.useState(-1)
  const [chatLoading, setChatLoading] = React.useState(false)
  const pipelineRef = React.useRef<Awaited<ReturnType<typeof loadChatPipeline>> | null>(null)
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [lines])

  const runChatFallback = React.useCallback(async (userInput: string) => {
    if (typeof window === "undefined") return

    setChatLoading(true)
    setLines(prev => [
      ...prev,
      { type: "output", text: "⏳ Loading AI model (first time only, ~50MB)…" },
    ])
    try {
      if (!pipelineRef.current) {
        pipelineRef.current = await loadChatPipeline()
      }
      const pipe = pipelineRef.current

      setLines(prev => {
        const next = [...prev]
        next[next.length - 1] = { type: "output", text: "Thinking…" }
        return next
      })

      const unclearOut = await pipe(buildUnclearPrompt(userInput), { max_new_tokens: 6 })
      const unclearRaw = (unclearOut?.[0]?.generated_text ?? "").trim()
      if (parseUnclearFlag(unclearRaw)) {
        setLines(prev => {
          const next = [...prev]
          next[next.length - 1] = { type: "chat", text: FALLBACK_REPLY }
          return next
        })
        return
      }

      const prompt = buildChatPrompt(userInput)
      const out = await pipe(prompt, { max_new_tokens: 120 })
      let text = (out?.[0]?.generated_text ?? "").trim()
      text = text.replace(/^(Response:?\s*)/i, "").trim() || text
      setLines(prev => {
        const next = [...prev]
        next[next.length - 1] = { type: "chat", text: text || FALLBACK_REPLY }
        return next
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setLines(prev => {
        const next = [...prev]
        next[next.length - 1] = {
          type: "error",
          text: `AI failed: ${msg}\nType 'help' for commands.`,
        }
        return next
      })
    } finally {
      setChatLoading(false)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = input.trim()
    if (!cmd) return

    const lower = cmd.toLowerCase()
    const newLines: Line[] = [{ type: "input", text: cmd }]

    if (lower === "clear") {
      setLines([{ type: "banner", text: BANNER }])
      setInput("")
      setCmdHistory(h => [cmd, ...h])
      setHistoryIdx(-1)
      return
    }

    if (lower === "open linkedin") {
      if (typeof window !== "undefined")
        window.open("https://www.linkedin.com/in/shravan-dhakal/", "_blank")
      newLines.push({ type: "output", text: "Opening LinkedIn... ↗" })
    } else if (lower === "open github") {
      if (typeof window !== "undefined")
        window.open("https://github.com/shravan097", "_blank")
      newLines.push({ type: "output", text: "Opening GitHub... ↗" })
    } else if (lower === "date") {
      newLines.push({ type: "output", text: new Date().toString() })
    } else if (lower.startsWith("echo ")) {
      newLines.push({ type: "output", text: cmd.slice(5) })
    } else if (lower in COMMANDS) {
      newLines.push({ type: "output", text: COMMANDS[lower] })
    } else {
      setLines(l => [...l, ...newLines])
      setCmdHistory(h => [cmd, ...h])
      setHistoryIdx(-1)
      setInput("")
      runChatFallback(cmd)
      return
    }

    setLines(l => [...l, ...newLines])
    setCmdHistory(h => [cmd, ...h])
    setHistoryIdx(-1)
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      const idx = historyIdx + 1
      if (idx < cmdHistory.length) {
        setHistoryIdx(idx)
        setInput(cmdHistory[idx])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      const idx = historyIdx - 1
      if (idx < 0) {
        setHistoryIdx(-1)
        setInput("")
      } else {
        setHistoryIdx(idx)
        setInput(cmdHistory[idx])
      }
    }
  }

  return (
    <div
      className="h-full flex flex-col font-mono text-sm overflow-hidden min-h-0"
      style={{ background: "#0a0e17" }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto overflow-x-auto p-3 space-y-0.5 min-h-0">
        {lines.map((line, i) => {
          if (line.type === "banner") {
            return (
              <pre
                key={i}
                className="text-xs leading-tight mb-3 whitespace-pre"
                style={{ color: "#6366f1", wordBreak: "break-word" }}
              >
                {line.text}
              </pre>
            )
          }
          if (line.type === "input") {
            return (
              <div key={i} className="flex flex-wrap gap-x-2">
                <span className="flex-shrink-0 text-xs sm:text-sm" style={{ color: "#818cf8" }}>
                  shravan@portfolio:~$
                </span>
                <span className="break-all text-xs sm:text-sm" style={{ color: "#86efac" }}>
                  {line.text}
                </span>
              </div>
            )
          }
          if (line.type === "error") {
            return (
              <pre
                key={i}
                className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words"
                style={{ color: "#f87171" }}
              >
                {line.text}
              </pre>
            )
          }
          if (line.type === "chat") {
            return (
              <div key={i} className="flex flex-wrap gap-x-2">
                <span className="flex-shrink-0 text-xs" style={{ color: "#a78bfa" }}>
                  assistant:
                </span>
                <pre
                  className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words flex-1"
                  style={{ color: "#c4b5fd" }}
                >
                  {line.text}
                </pre>
              </div>
            )
          }
          return (
            <pre
              key={i}
              className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words"
              style={{ color: "#86efac" }}
            >
              {line.text}
            </pre>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t px-2 sm:px-3 py-2 flex-shrink-0 min-h-[48px]"
        style={{ borderColor: "rgba(51,65,85,0.8)", background: "rgba(15,23,42,0.6)" }}
      >
        <span className="flex-shrink-0 text-xs sm:text-sm" style={{ color: "#818cf8" }}>
          shravan@portfolio:~$
        </span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 bg-transparent outline-none text-xs sm:text-sm placeholder-slate-600 py-1"
          style={{ color: "#86efac", caretColor: "#86efac" }}
          placeholder={chatLoading ? "wait for response…" : "type a command or ask anything…"}
          spellCheck={false}
          autoComplete="off"
          disabled={chatLoading}
        />
      </form>
    </div>
  )
}
