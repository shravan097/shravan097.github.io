import * as React from "react"
import { isChatConfigured, sendChatMessage } from "./terminalChatApi"

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
  (or type anything — AI will reply)`,

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
 Type 'help' for commands. Type anything else to chat with AI.
`

type Line = { type: "input" | "output" | "banner" | "error" | "chat"; text: string }

const FALLBACK_REPLY = "Hi! Ask me anything or type 'help' for commands."

export const Terminal: React.FC = () => {
  const [input, setInput] = React.useState("")
  const [lines, setLines] = React.useState<Line[]>([{ type: "banner", text: BANNER }])
  const [cmdHistory, setCmdHistory] = React.useState<string[]>([])
  const [historyIdx, setHistoryIdx] = React.useState(-1)
  const [chatLoading, setChatLoading] = React.useState(false)
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

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
    setLines(prev => [...prev, { type: "output", text: "Thinking…" }])

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
      runChat(cmd)
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
