import * as React from "react"

type AppDef = {
  id: string
  icon: string
  label: string
}

const APPS: AppDef[] = [
  { id: "about", icon: "👤", label: "About" },
  { id: "education", icon: "🎓", label: "Education" },
  { id: "experience", icon: "💼", label: "Experience" },
  { id: "blog", icon: "📝", label: "Blog" },
  { id: "terminal", icon: "⌨️", label: "Terminal" },
]

type DockProps = {
  openWindows: string[]
  onOpen: (id: string) => void
}

export const Dock: React.FC<DockProps> = ({ openWindows, onOpen }) => {
  return (
    <div
      className="fixed bottom-2 left-2 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[200] flex items-end gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl overflow-x-auto overflow-y-hidden scrollbar-hide"
      style={{ background: "rgba(15,23,42,0.88)", backdropFilter: "blur(24px)", WebkitOverflowScrolling: "touch" }}
    >
      {/* --- Persistent Branding: Name badge --- */}
      <div className="flex flex-col items-center mx-0.5 sm:mx-1 group flex-shrink-0">
        <div className="relative">
          <img
            src="https://avatars.githubusercontent.com/u/23582455?v=4"
            alt="Shravan Dhakal"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover transition-transform group-hover:-translate-y-2 duration-200"
            style={{ boxShadow: "0 0 20px rgba(99,102,241,0.7), 0 4px 12px rgba(0,0,0,0.5)" }}
          />
          {/* green "online" dot */}
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900"
            style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
          />
        </div>
        <span
          className="text-xs font-mono font-bold mt-1"
          style={{ color: "#818cf8", textShadow: "0 0 8px rgba(129,140,248,0.8)" }}
        >
          Shravan
        </span>
      </div>

      {/* Separator */}
      <div className="w-px h-10 sm:h-12 bg-white/10 mx-1 sm:mx-1.5 self-center flex-shrink-0" />

      {/* --- Persistent Branding: LinkedIn --- */}
      <a
        href="https://www.linkedin.com/in/shravan-dhakal/"
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center group mx-0.5 flex-shrink-0 min-w-[44px]"
        title="Shravan on LinkedIn"
      >
        <div
          className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-transform group-hover:-translate-y-2 duration-200"
          style={{
            background: "#0A66C2",
            boxShadow: "0 0 18px rgba(10,102,194,0.8), 0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 fill-white">
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
            <circle cx="4" cy="4" r="2" />
          </svg>
          {/* pulsing ring */}
          <span
            className="absolute inset-0 rounded-xl animate-ping opacity-30"
            style={{ background: "#0A66C2" }}
          />
        </div>
        <span className="text-[10px] sm:text-xs font-mono mt-0.5 sm:mt-1 text-blue-400 group-hover:text-blue-300 font-semibold transition-colors">
          LinkedIn
        </span>
      </a>

      {/* --- Persistent Branding: GitHub --- */}
      <a
        href="https://github.com/shravan097"
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center group mx-0.5 sm:mr-2 flex-shrink-0 min-w-[44px]"
        title="shravan097 on GitHub"
      >
        <div
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-transform group-hover:-translate-y-2 duration-200"
          style={{
            background: "#24292e",
            boxShadow: "0 0 14px rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 fill-white">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </div>
        <span className="text-[10px] sm:text-xs font-mono mt-0.5 sm:mt-1 text-slate-400 group-hover:text-white font-semibold transition-colors">
          GitHub
        </span>
      </a>

      {/* Separator */}
      <div className="w-px h-10 sm:h-12 bg-white/10 mx-1 sm:mx-1.5 self-center flex-shrink-0" />

      {/* App launchers */}
      {APPS.map(app => (
        <button
          key={app.id}
          onClick={() => onOpen(app.id)}
          className="flex flex-col items-center group relative mx-0.5 flex-shrink-0 min-w-[44px] min-h-[44px]"
          title={`Open ${app.label}`}
          type="button"
        >
          <div
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl transition-transform group-hover:-translate-y-2 duration-200"
            style={{
              background: "rgba(51,65,85,0.8)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {app.icon}
          </div>
          <span className="text-[10px] sm:text-xs font-mono mt-0.5 sm:mt-1 text-slate-500 group-hover:text-slate-300 transition-colors">
            {app.label}
          </span>
          {/* Open indicator dot */}
          {openWindows.includes(app.id) && (
            <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-slate-300" />
          )}
        </button>
      ))}
    </div>
  )
}
