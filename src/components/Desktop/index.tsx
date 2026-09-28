import * as React from "react"
import { Typewriter } from "react-simple-typewriter"
import { FileExplorer } from "../FileExplorer"
import { APPS, type AppId } from "./apps"
import { BlogContent } from "./BlogContent"
import { DesktopIcon } from "./DesktopIcon"
import { Dock } from "./Dock"
import { DOCK_CLEARANCE, MENUBAR_HEIGHT } from "./layout"
import { Menubar } from "./Menubar"
import { Snake } from "./Snake"
import { Terminal } from "./Terminal"
import { Window } from "./Window"

type WindowState = {
  isOpen: boolean
  zIndex: number
}

function initialWindowStates(): Record<string, WindowState> {
  const base = Object.fromEntries(
    APPS.map((app, index) => [app.id, { isOpen: false, zIndex: index + 1 }])
  ) as Record<string, WindowState>

  // On small screens, multiple overlapping windows are unusable — start with Finder only.
  const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 640

  let zIndex = 10
  for (const app of APPS) {
    if (app.openByDefault && (!isSmallScreen || app.id === "finder")) {
      zIndex += 1
      base[app.id] = { isOpen: true, zIndex }
    }
  }
  return base
}

export const Desktop: React.FC = () => {
  const [mounted, setMounted] = React.useState(false)
  const [maxZ, setMaxZ] = React.useState(12)
  const [windowStates, setWindowStates] =
    React.useState<Record<string, WindowState>>(initialWindowStates)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const bringOpen = React.useCallback((id: string) => {
    setMaxZ(z => {
      const newZ = z + 1
      setWindowStates(states => ({
        ...states,
        [id]: { isOpen: true, zIndex: newZ },
      }))
      return newZ
    })
  }, [])

  const closeWindow = (id: string) => {
    setWindowStates(states => ({
      ...states,
      [id]: { ...states[id], isOpen: false },
    }))
  }

  const focusWindow = (id: string) => {
    setMaxZ(z => {
      const newZ = z + 1
      setWindowStates(states => ({
        ...states,
        [id]: { ...states[id], zIndex: newZ },
      }))
      return newZ
    })
  }

  const openWindowIds = Object.entries(windowStates)
    .filter(([, state]) => state.isOpen)
    .map(([id]) => id)

  if (!mounted) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--color-background-body)",
        }}
      />
    )
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: "var(--color-background-body)",
        backgroundImage:
          "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <Menubar onOpenWindow={bringOpen as (id: AppId) => void} />

      <div
        className="absolute left-2 sm:left-3 flex flex-col gap-0.5 sm:gap-1"
        style={{ top: MENUBAR_HEIGHT + 8, bottom: DOCK_CLEARANCE, overflowY: "auto" }}
      >
        {APPS.map(app => (
          <DesktopIcon
            key={app.id}
            icon={app.icon}
            label={app.label}
            onOpen={() => bringOpen(app.id)}
          />
        ))}
      </div>

      <div
        className="absolute bottom-20 right-4 sm:right-6 font-mono text-[10px] sm:text-xs text-right pointer-events-none select-none hidden sm:block max-w-[200px]"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Double-click to open · Drag windows to move
      </div>

      <div
        className="absolute overflow-hidden pointer-events-none"
        style={{ top: 0, bottom: 0, left: 0, right: 0 }}
      >
        {APPS.map(app => {
          const state = windowStates[app.id]
          if (!state?.isOpen) return null
          return (
            <Window
              key={app.id}
              id={app.id}
              title={app.title}
              icon={app.icon}
              defaultX={app.defaultX}
              defaultY={app.defaultY}
              defaultWidth={app.defaultWidth}
              defaultHeight={app.defaultHeight}
              zIndex={state.zIndex}
              onClose={() => closeWindow(app.id)}
              onFocus={() => focusWindow(app.id)}
            >
              <WindowContent id={app.id} onOpenApp={bringOpen} />
            </Window>
          )
        })}
      </div>

      <Dock openWindows={openWindowIds} onOpen={bringOpen} />
    </div>
  )
}

const WindowContent: React.FC<{
  id: AppId
  onOpenApp: (id: string) => void
}> = ({ id, onOpenApp }) => {
  switch (id) {
    case "finder":
      return (
        <FileExplorer
          embedded
          initialPath={["about", "about-readme"]}
          onOpenApp={onOpenApp}
        />
      )
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
    case "snake":
      return <Snake />
    default:
      return null
  }
}

const AboutContent: React.FC = () => (
  <div
    className="flex flex-col items-center justify-center h-full p-8 gap-5"
    style={{ background: "var(--color-background-surface)" }}
  >
    <img
      src="https://avatars.githubusercontent.com/u/23582455?v=4"
      alt="Shravan Dhakal"
      className="w-28 h-28 rounded-full object-cover"
      style={{ boxShadow: "0 0 32px rgba(99,102,241,0.6), 0 8px 24px rgba(0,0,0,0.6)" }}
    />
    <div className="text-center">
      <p
        className="font-mono font-extrabold uppercase leading-none dark:text-indigo-400 text-indigo-600"
        style={{ fontSize: "3.5rem", textShadow: "0 0 24px rgba(99,102,241,0.5)" }}
      >
        <Typewriter cursor loop words={["Shravan"]} />
      </p>
      <p
        className="font-mono font-extrabold uppercase leading-none mt-1 dark:text-slate-100 text-slate-800"
        style={{ fontSize: "3.5rem" }}
      >
        Dhakal
      </p>
      <p className="font-mono text-lg mt-3 dark:text-slate-400 text-slate-500">
        Software Engineer · 8+ years
      </p>
    </div>
    <div className="flex gap-3 mt-1">
      <a
        href="https://www.linkedin.com/in/shravan-dhakal/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm text-white font-semibold transition-all hover:opacity-90 hover:scale-105"
        style={{ background: "#0A66C2", boxShadow: "0 0 16px rgba(10,102,194,0.5)" }}
      >
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
        GitHub ↗
      </a>
    </div>
  </div>
)

const EducationContent: React.FC = () => (
  <div
    className="flex flex-col items-center justify-center h-full p-8 gap-6"
    style={{ background: "var(--color-background-surface)" }}
  >
    <a href="https://www.ccny.cuny.edu/" target="_blank" rel="noreferrer">
      <img
        className="h-16 w-auto transition-opacity hover:opacity-80 dark:invert invert-0"
        alt="CCNY logo"
        src="https://upload.wikimedia.org/wikipedia/commons/2/25/CCNY_logo_flush_left.svg"
      />
    </a>
    <div className="text-center w-full border-t pt-5" style={{ borderColor: "var(--color-border)" }}>
      <p className="font-mono text-xl font-bold dark:text-slate-100 text-slate-800">
        BS Computer Science
      </p>
      <p className="font-mono text-base mt-1 dark:text-slate-400 text-slate-500">
        City College of New York
      </p>
      <p className="font-mono text-base mt-2 font-bold dark:text-indigo-400 text-indigo-600">
        Class of 2019
      </p>
    </div>
  </div>
)

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
    style={{ background: "var(--color-background-surface)" }}
  >
    {EXPERIENCE_SECTIONS.map(section => (
      <div key={section.title} className="mb-6 last:mb-0">
        <h2
          className="font-mono text-base font-bold mb-3 pb-1.5 border-b dark:text-indigo-400 text-indigo-600"
          style={{ borderColor: "var(--color-border)" }}
        >
          {section.title}
        </h2>
        <ul className="space-y-1.5">
          {section.items.map(item => (
            <li
              key={item}
              className="font-mono text-sm flex items-start gap-2 dark:text-slate-300 text-slate-600"
            >
              <span
                className="dark:text-indigo-400 text-indigo-600"
                style={{ marginTop: "2px" }}
              >
                ▸
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)
