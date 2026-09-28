import * as React from "react"
import { isChatConfigured, sendChatMessage } from "./terminalChatApi"

/**
 * Retro-modern terminal: Warp-style UX (command suggestions, tab completion,
 * status strip, floating prompt bar) wrapped in a CRT phosphor aesthetic.
 */

const COMMANDS: Record<string, string> = {
  help: `  COMMANDS
  ─────────────────────────────────
  whoami         who is this?
  about          detailed bio
  skills         tech stack & languages
  education      education history
  experience     work experience
  ls             list files
  pwd            print working directory
  date           current date & time
  echo <text>    print text
  clear          clear terminal
  open linkedin  open LinkedIn profile
  open github    open GitHub profile
  ─────────────────────────────────
  anything else  chat with AI`,

  whoami: "shravan097 — Software Engineer · 8+ years",

  about: `╔══════════════════════════════════╗
║        Shravan Dhakal            ║
║   Software Engineer · 8+ years   ║
╠══════════════════════════════════╣
║  LinkedIn  shravan-dhakal        ║
║  GitHub    shravan097            ║
╚══════════════════════════════════╝`,

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

  pwd: "/Users/shravan",
}

const BANNER = `  ____  _                    ___  ____
 / ___|| |__  _ __ ___   / _ \\/ ___|
 \\___ \\| '_ \\| '__/ _ \\ | | | \\___ \\
  ___) | | | | | | (_) || |_| |___) |
 |____/|_| |_|_|  \\___/  \\___/|____/

 Welcome to Shravan OS  v1.0.0
 Type 'help' for commands. Type anything else to chat with AI.
`

/** Warp-style autocomplete source. */
const SUGGESTIONS: { cmd: string; hint: string }[] = [
  { cmd: "help", hint: "list commands" },
  { cmd: "whoami", hint: "who is this?" },
  { cmd: "about", hint: "detailed bio" },
  { cmd: "skills", hint: "tech stack" },
  { cmd: "education", hint: "education history" },
  { cmd: "experience", hint: "work experience" },
  { cmd: "ls", hint: "list files" },
  { cmd: "pwd", hint: "working directory" },
  { cmd: "date", hint: "date & time" },
  { cmd: "echo <text>", hint: "print text" },
  { cmd: "open linkedin", hint: "LinkedIn ↗" },
  { cmd: "open github", hint: "GitHub ↗" },
  { cmd: "clear", hint: "clear screen" },
]

function getSuggestions(input: string): { cmd: string; hint: string }[] {
  const query = input.trim().toLowerCase()
  if (!query) return []
  const firstWord = query.split(/\s+/)[0]
  return SUGGESTIONS.filter(
    s =>
      s.cmd !== query &&
      (s.cmd.startsWith(query) || s.cmd.split(/\s+/)[0].startsWith(firstWord))
  ).slice(0, 3)
}

type Line = { type: "input" | "output" | "banner" | "error" | "chat" | "thinking"; text: string }

const FALLBACK_REPLY = "Hi! Ask me anything or type 'help' for commands."

const MONO = '"SF Mono", "Menlo", "Monaco", "Cascadia Code", "Courier New", monospace'

/** Classic zsh prompt: green user@host, blue dir, dim %. */
const Prompt: React.FC = () => (
  <span className="flex-shrink-0 whitespace-nowrap">
    <span style={{ color: "#4ade80", textShadow: "0 0 8px rgba(74,222,128,0.45)" }}>
      shravan@portfolio
    </span>
    <span style={{ color: "#60a5fa" }}> ~ </span>
    <span style={{ color: "#64748b" }}>%</span>
  </span>
)

export const Terminal: React.FC = () => {
  const [input, setInput] = React.useState("")
  const [lines, setLines] = React.useState<Line[]>([{ type: "banner", text: BANNER }])
  const [cmdHistory, setCmdHistory] = React.useState<string[]>([])
  const [historyIdx, setHistoryIdx] = React.useState(-1)
  const [chatLoading, setChatLoading] = React.useState(false)
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const suggestions = React.useMemo(() => getSuggestions(input), [input])

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [lines])

  const runChat = React.useCallback(async (userInput: string) => {
    if (typeof window === "undefined") return

    if (!isChatConfigured()) {
      setLines(prev => [
        ...prev,
        {
          type: "error",
          text: "Chat is not configured. Set GATSBY_CHAT_API_URL for this build.",
        },
      ])
      return
    }

    setChatLoading(true)
    setLines(prev => [...prev, { type: "thinking", text: "AI thinking" }])

    try {
      const result = await sendChatMessage(userInput)
      setLines(prev => {
        const next = [...prev]
        if (result.ok) {
          next[next.length - 1] = {
            type: "chat",
            text: result.text || FALLBACK_REPLY,
          }
        } else {
          next[next.length - 1] = {
            type: "error",
            text: result.message,
          }
        }
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

  const commit = (cmd: string) => {
    setCmdHistory(h => [cmd, ...h])
    setHistoryIdx(-1)
    setInput("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = input.trim()
    if (!cmd) return

    const lower = cmd.toLowerCase()
    const newLines: Line[] = [{ type: "input", text: cmd }]

    if (lower === "clear") {
      setLines([{ type: "banner", text: BANNER }])
      commit(cmd)
      return
    }

    if (lower === "open linkedin") {
      if (typeof window !== "undefined")
        window.open("https://www.linkedin.com/in/shravan-dhakal/", "_blank")
      newLines.push({ type: "output", text: "Opening LinkedIn... ↗" })
    } else if (lower === "open github") {
      if (typeof window !== "undefined") window.open("https://github.com/shravan097", "_blank")
      newLines.push({ type: "output", text: "Opening GitHub... ↗" })
    } else if (lower === "date") {
      newLines.push({ type: "output", text: new Date().toString() })
    } else if (lower.startsWith("echo ")) {
      newLines.push({ type: "output", text: cmd.slice(5) })
    } else if (lower in COMMANDS) {
      newLines.push({ type: "output", text: COMMANDS[lower] })
    } else {
      setLines(l => [...l, ...newLines])
      commit(cmd)
      runChat(cmd)
      return
    }

    setLines(l => [...l, ...newLines])
    commit(cmd)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      // Classic shell tab-completion: complete to the first suggestion.
      if (suggestions.length > 0) {
        e.preventDefault()
        setInput(suggestions[0].cmd)
      }
      return
    }
    if (e.key === "Escape") {
      if (input) {
        e.preventDefault()
        setInput("")
      }
      return
    }
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
      className="relative h-full w-full flex flex-col overflow-hidden min-h-0 font-mono text-sm"
      style={{
        fontFamily: MONO,
        background:
          "radial-gradient(ellipse at 50% 0%, #101820 0%, #0a0f14 55%, #070b0f 100%)",
      }}
    >
      {/* CRT scanlines + vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 3px)",
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.55)",
        }}
      />

      {/* Status strip */}
      <div
        className="relative flex items-center gap-2 px-3 py-1.5 border-b flex-shrink-0"
        style={{
          borderColor: "rgba(51,65,85,0.5)",
          background: "rgba(8,12,16,0.9)",
        }}
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{
            background: chatLoading ? "#fbbf24" : "#4ade80",
            boxShadow: `0 0 6px ${chatLoading ? "#fbbf24" : "#4ade80"}`,
          }}
        />
        <span className="text-xs" style={{ color: "#94a3b8" }}>
          zsh — shravan@portfolio
        </span>
        <span className="ml-auto text-[10px] tracking-wider" style={{ color: "#475569" }}>
          {chatLoading ? "AI · thinking…" : "ready"}
        </span>
      </div>

      {/* Output */}
      <div
        className="relative flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 min-h-0 min-w-0"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="flex flex-col gap-1 min-w-0">
          {lines.map((line, i) => {
            if (line.type === "banner") {
              return (
                <pre
                  key={i}
                  className="text-xs leading-tight mb-1 whitespace-pre font-semibold overflow-x-auto scrollbar-hide"
                  style={{
                    color: "#818cf8",
                    textShadow: "0 0 12px rgba(129,140,248,0.5)",
                  }}
                >
                  {line.text}
                </pre>
              )
            }
            if (line.type === "input") {
              return (
                <div key={i} className="flex flex-wrap gap-x-1.5 min-w-0">
                  <Prompt />
                  <span className="break-all text-xs" style={{ color: "#e2e8f0" }}>
                    {line.text}
                  </span>
                </div>
              )
            }
            if (line.type === "thinking") {
              return (
                <div key={i} className="flex flex-wrap gap-x-1.5 min-w-0">
                  <span
                    className="text-xs animate-pulse"
                    style={{ color: "#fbbf24", textShadow: "0 0 8px rgba(251,191,36,0.4)" }}
                  >
                    ⚡ {line.text}…
                  </span>
                </div>
              )
            }
            if (line.type === "error") {
              return (
                <pre
                  key={i}
                  className="text-xs leading-relaxed whitespace-pre-wrap break-words min-w-0"
                  style={{ color: "#f87171", textShadow: "0 0 8px rgba(248,113,113,0.25)" }}
                >
                  {`zsh: ${line.text}`}
                </pre>
              )
            }
            if (line.type === "chat") {
              return (
                <div key={i} className="flex flex-wrap gap-x-1.5 mt-1 min-w-0">
                  <span
                    className="flex-shrink-0 text-xs font-bold"
                    style={{ color: "#a78bfa", textShadow: "0 0 8px rgba(167,139,250,0.4)" }}
                  >
                    ⌁ AI
                  </span>
                  <pre
                    className="text-xs leading-relaxed whitespace-pre-wrap break-words flex-1 min-w-0"
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
                className="text-xs leading-relaxed whitespace-pre-wrap break-words min-w-0"
                style={{
                  color: "#a7f3d0",
                  textShadow: "0 0 6px rgba(167,243,208,0.15)",
                }}
              >
                {line.text}
              </pre>
            )
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Warp-style suggestion bar */}
      {suggestions.length > 0 && !chatLoading && (
        <div
          className="relative flex items-center gap-1.5 px-3 py-1.5 border-t flex-shrink-0 overflow-x-auto scrollbar-hide"
          style={{
            borderColor: "rgba(51,65,85,0.5)",
            background: "rgba(8,12,16,0.95)",
          }}
        >
          <span className="text-[10px] flex-shrink-0 tracking-wider" style={{ color: "#475569" }}>
            SUGGEST
          </span>
          {suggestions.map(s => (
            <button
              key={s.cmd}
              type="button"
              onClick={() => {
                setInput(s.cmd)
                inputRef.current?.focus()
              }}
              className="flex-shrink-0 text-xs px-2 py-0.5 rounded-md border transition-colors"
              style={{
                color: "#4ade80",
                borderColor: "rgba(74,222,128,0.3)",
                background: "rgba(74,222,128,0.08)",
              }}
              title={s.hint}
            >
              {s.cmd}
            </button>
          ))}
        </div>
      )}

      {/* Floating prompt bar */}
      <form
        onSubmit={handleSubmit}
        className="relative flex-shrink-0 px-2 pb-2"
        style={{ background: "rgba(8,12,16,0.95)" }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg border"
          style={{
            borderColor: "rgba(74,222,128,0.25)",
            background: "rgba(10,15,20,0.9)",
            boxShadow: "0 0 0 1px rgba(74,222,128,0.05), 0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <Prompt />
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-0 bg-transparent outline-none text-xs py-0.5"
            style={{
              fontFamily: MONO,
              color: "#e2e8f0",
              caretColor: "#4ade80",
              textShadow: "0 0 6px rgba(74,222,128,0.2)",
            }}
            placeholder={chatLoading ? "AI is thinking…" : "type a command…"}
            spellCheck={false}
            autoComplete="off"
            disabled={chatLoading}
          />
          <span className="text-[10px] flex-shrink-0 hidden sm:inline" style={{ color: "#475569" }}>
            tab ↹ complete
          </span>
        </div>
      </form>
    </div>
  )
}
