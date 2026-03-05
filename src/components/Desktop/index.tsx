import * as React from "react"
import { Typewriter } from "react-simple-typewriter"
import { BlogContent } from "./BlogContent"
import { DesktopIcon } from "./DesktopIcon"
import { Dock } from "./Dock"
import { Menubar } from "./Menubar"
import { Terminal } from "./Terminal"
import { Window } from "./Window"

// ─── Window definitions ───────────────────────────────────────────────────────

type WindowDef = {
  id: string
  title: string
  icon: string
  defaultX: number
  defaultY: number
  defaultWidth: number
  defaultHeight: number
}

const WINDOW_DEFS: WindowDef[] = [
  {
    id: "about",
    title: "About Shravan",
    icon: "👤",
    defaultX: 80,
    defaultY: 30,
    defaultWidth: 420,
    defaultHeight: 480,
  },
  {
    id: "education",
    title: "Education",
    icon: "🎓",
    defaultX: 220,
    defaultY: 50,
    defaultWidth: 400,
    defaultHeight: 300,
  },
  {
    id: "experience",
    title: "Experience",
    icon: "💼",
    defaultX: 360,
    defaultY: 70,
    defaultWidth: 460,
    defaultHeight: 420,
  },
  {
    id: "blog",
    title: "Blog",
    icon: "📝",
    defaultX: 160,
    defaultY: 90,
    defaultWidth: 500,
    defaultHeight: 400,
  },
  {
    id: "terminal",
    title: "Terminal — shravan@portfolio",
    icon: "⌨️",
    defaultX: 280,
    defaultY: 40,
    defaultWidth: 620,
    defaultHeight: 380,
  },
]

// ─── Window state ─────────────────────────────────────────────────────────────

type WindowState = {
  isOpen: boolean
  zIndex: number
}

// ─── Desktop ──────────────────────────────────────────────────────────────────

export const Desktop: React.FC = () => {
  const [mounted, setMounted] = React.useState(false)
  const [maxZ, setMaxZ] = React.useState(10)
  const [windowStates, setWindowStates] = React.useState<Record<string, WindowState>>(() =>
    Object.fromEntries(WINDOW_DEFS.map((d, i) => [d.id, { isOpen: false, zIndex: i + 1 }]))
  )

  React.useEffect(() => {
    setMounted(true)
    // Auto-open terminal on load
    bringOpen("terminal")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const bringOpen = (id: string) => {
    setMaxZ(z => {
      const newZ = z + 1
      setWindowStates(s => ({ ...s, [id]: { isOpen: true, zIndex: newZ } }))
      return newZ
    })
  }

  const closeWindow = (id: string) => {
    setWindowStates(s => ({ ...s, [id]: { ...s[id], isOpen: false } }))
  }

  const focusWindow = (id: string) => {
    setMaxZ(z => {
      const newZ = z + 1
      setWindowStates(s => ({ ...s, [id]: { ...s[id], zIndex: newZ } }))
      return newZ
    })
  }

  const openWindowIds = Object.entries(windowStates)
    .filter(([, s]) => s.isOpen)
    .map(([id]) => id)

  if (!mounted) {
    // Avoid SSR mismatch — render blank dark screen during SSR
    return <div style={{ position: "fixed", inset: 0, background: "#0d1117" }} />
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: "#0d1117",
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      {/* Top menu bar */}
      <Menubar onOpenWindow={bringOpen} />

      {/* Desktop icons — left column, below menu bar */}
      <div
        className="absolute left-2 sm:left-3 flex flex-col gap-0.5 sm:gap-1"
        style={{ top: "32px" }}
      >
        {WINDOW_DEFS.map(def => (
          <DesktopIcon
            key={def.id}
            icon={def.icon}
            label={def.title}
            onOpen={() => bringOpen(def.id)}
          />
        ))}
      </div>

      {/* Hint text — hidden on small screens */}
      <div
        className="absolute bottom-20 right-4 sm:right-6 font-mono text-[10px] sm:text-xs text-right pointer-events-none select-none hidden sm:block max-w-[200px]"
        style={{ color: "rgba(148,163,184,0.4)" }}
      >
        Double-click icons to open · Drag windows to move
      </div>

      {/* Windows layer — more space for dock on mobile */}
      <div
        className="absolute"
        style={{ top: "28px", bottom: "72px", left: 0, right: 0 }}
      >
        {WINDOW_DEFS.map(def => {
          const state = windowStates[def.id]
          if (!state?.isOpen) return null
          return (
            <Window
              key={def.id}
              {...def}
              zIndex={state.zIndex}
              onClose={() => closeWindow(def.id)}
              onFocus={() => focusWindow(def.id)}
            >
              <WindowContent id={def.id} />
            </Window>
          )
        })}
      </div>

      {/* Bottom dock */}
      <Dock openWindows={openWindowIds} onOpen={bringOpen} />
    </div>
  )
}

// ─── Window content router ────────────────────────────────────────────────────

const WindowContent: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case "about":
      return <AboutContent />
    case "education":
      return <EducationContent />
    case "experience":
      return <ExperienceContent />
    case "blog":
      return <BlogContent />
    case "terminal":
      return <Terminal />
    default:
      return null
  }
}

// ─── About window ─────────────────────────────────────────────────────────────

const AboutContent: React.FC = () => (
  <div
    className="flex flex-col items-center justify-center h-full p-8 gap-5"
    style={{ background: "#0f172a" }}
  >
    <img
      src="https://avatars.githubusercontent.com/u/23582455?v=4"
      alt="Shravan Dhakal"
      className="w-28 h-28 rounded-full object-cover"
      style={{ boxShadow: "0 0 32px rgba(99,102,241,0.6), 0 8px 24px rgba(0,0,0,0.6)" }}
    />

    <div className="text-center">
      <p
        className="font-mono font-extrabold uppercase leading-none"
        style={{
          fontSize: "3.5rem",
          color: "#818cf8",
          textShadow: "0 0 24px rgba(99,102,241,0.5)",
        }}
      >
        <Typewriter cursor loop words={["Shravan"]} />
      </p>
      <p
        className="font-mono font-extrabold uppercase leading-none mt-1"
        style={{ fontSize: "3.5rem", color: "#e2e8f0" }}
      >
        Dhakal
      </p>
      <p className="font-mono text-lg mt-3" style={{ color: "#94a3b8" }}>
        Software Engineer
      </p>
    </div>

    <div className="flex gap-3 mt-1">
      <a
        href="https://www.linkedin.com/in/shravan-dhakal/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm text-white font-semibold transition-all hover:opacity-90 hover:scale-105"
        style={{
          background: "#0A66C2",
          boxShadow: "0 0 16px rgba(10,102,194,0.5)",
        }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
        LinkedIn ↗
      </a>
      <a
        href="https://github.com/shravan097"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm text-white font-semibold transition-all hover:opacity-90 hover:scale-105"
        style={{
          background: "#24292e",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
        GitHub ↗
      </a>
    </div>
  </div>
)

// ─── Education window ─────────────────────────────────────────────────────────

const EducationContent: React.FC = () => (
  <div
    className="flex flex-col items-center justify-center h-full p-8 gap-6"
    style={{ background: "#0f172a" }}
  >
    <a href="https://www.ccny.cuny.edu/" target="_blank" rel="noreferrer">
      <img
        className="h-16 w-auto transition-opacity hover:opacity-80"
        alt="CCNY logo"
        src="https://upload.wikimedia.org/wikipedia/commons/2/25/CCNY_logo_flush_left.svg"
        style={{ filter: "invert(1) brightness(0.9)" }}
      />
    </a>
    <div
      className="text-center w-full border-t pt-5"
      style={{ borderColor: "rgba(51,65,85,0.8)" }}
    >
      <p className="font-mono text-xl font-bold" style={{ color: "#e2e8f0" }}>
        BS Computer Science
      </p>
      <p className="font-mono text-base mt-1" style={{ color: "#94a3b8" }}>
        City College of New York
      </p>
      <p
        className="font-mono text-base mt-2 font-bold"
        style={{ color: "#818cf8" }}
      >
        Class of 2019
      </p>
    </div>
  </div>
)

// ─── Experience window ────────────────────────────────────────────────────────

const EXPERIENCE_SECTIONS = [
  {
    title: "Backend Development",
    items: [
      "Microservice, Monolithic, Serverless Architecture",
      "Message Queues, RESTful, GraphQL",
      "AWS",
    ],
  },
  {
    title: "Industries",
    items: ["Automotive IoT", "Healthtech", "Fintech"],
  },
  {
    title: "Tech",
    items: ["TypeScript", "Python", "Ruby", "React", "Redux"],
  },
]

const ExperienceContent: React.FC = () => (
  <div
    className="p-6 h-full overflow-y-auto"
    style={{ background: "#0f172a" }}
  >
    {EXPERIENCE_SECTIONS.map(section => (
      <div key={section.title} className="mb-6 last:mb-0">
        <h2
          className="font-mono text-base font-bold mb-3 pb-1.5 border-b"
          style={{ color: "#818cf8", borderColor: "rgba(51,65,85,0.8)" }}
        >
          {section.title}
        </h2>
        <ul className="space-y-1.5">
          {section.items.map(item => (
            <li
              key={item}
              className="font-mono text-sm flex items-start gap-2"
              style={{ color: "#cbd5e1" }}
            >
              <span style={{ color: "#6366f1", marginTop: "2px" }}>▸</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)
