import * as React from "react"
import { ThemeToggle } from "../ThemeToggle"
import { APPS, type AppId } from "./apps"

type MenuItem = {
  label: string
  onClick?: () => void
  href?: string
  external?: boolean
  disabled?: boolean
}

type MenuDef = {
  name: string
  items: MenuItem[]
}

export const Menubar: React.FC<{
  onOpenWindow?: (id: AppId) => void
}> = ({ onOpenWindow }) => {
  const [time, setTime] = React.useState<Date | null>(null)
  const [openMenu, setOpenMenu] = React.useState<string | null>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setTime(new Date())
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    if (!openMenu) return
    const onDocClick = (event: MouseEvent) => {
      if (menuRef.current?.contains(event.target as Node)) return
      setOpenMenu(null)
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [openMenu])

  const menus: MenuDef[] = [
    {
      name: "File",
      items: APPS.map(app => ({
        label: app.label,
        onClick: () => {
          onOpenWindow?.(app.id)
          setOpenMenu(null)
        },
      })),
    },
    {
      name: "View",
      items: [
        {
          label: "Reload",
          onClick: () => {
            if (typeof window !== "undefined") window.location.reload()
            setOpenMenu(null)
          },
        },
        {
          label: "Source on GitHub",
          href: "https://github.com/shravan097/shravan097.github.io",
          external: true,
        },
      ],
    },
    {
      name: "Help",
      items: [
        {
          label: "About",
          onClick: () => {
            onOpenWindow?.("about")
            setOpenMenu(null)
          },
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/shravan-dhakal/",
          external: true,
        },
        {
          label: "GitHub",
          href: "https://github.com/shravan097",
          external: true,
        },
      ],
    },
  ]

  return (
    <div
      ref={menuRef}
      className="fixed top-0 left-0 right-0 z-[200] h-11 flex items-center px-2 sm:px-4 dark:text-slate-200 text-slate-700 text-xs sm:text-sm font-mono select-none border-b dark:border-slate-700/50 border-slate-200"
      style={{
        height: 44,
        background: "color-mix(in srgb, var(--color-background-surface) 88%, transparent)",
        backdropFilter: "blur(16px)",
      }}
    >
      <span
        className="font-bold mr-3 sm:mr-6 dark:text-indigo-400 text-indigo-600 flex-shrink-0"
        style={{ textShadow: "0 0 12px rgba(99,102,241,0.6)" }}
      >
        Shravan OS
      </span>
      {menus.map(menu => (
        <div key={menu.name} className="relative mr-3 sm:mr-5">
          <button
            type="button"
            onClick={() => setOpenMenu(openMenu === menu.name ? null : menu.name)}
            className={`cursor-pointer transition-colors min-h-[44px] flex items-center sm:min-h-0 ${
              openMenu === menu.name
                ? "dark:text-white text-slate-900"
                : "dark:text-slate-400 text-slate-500 dark:hover:text-slate-200 hover:text-slate-700"
            }`}
          >
            {menu.name}
          </button>
          {openMenu === menu.name && (
            <div
              className="absolute left-0 top-full mt-0.5 py-1 min-w-[160px] rounded-md shadow-xl border dark:border-slate-600/80 border-slate-200 overflow-hidden"
              style={{
                background:
                  "color-mix(in srgb, var(--color-background-surface) 98%, transparent)",
                backdropFilter: "blur(12px)",
              }}
            >
              {menu.items.map((item, index) => {
                const content = (
                  <span className="block w-full text-left px-3 py-2 sm:py-1.5 text-sm min-h-[44px] sm:min-h-0 flex items-center">
                    {item.label}
                  </span>
                )
                const className =
                  "block w-full text-left dark:text-slate-300 text-slate-600 dark:hover:bg-slate-700/50 hover:bg-slate-200 dark:hover:text-white hover:text-slate-900 transition-colors " +
                  (item.disabled ? "opacity-50 cursor-not-allowed" : "")
                if (item.href) {
                  return (
                    <a
                      key={index}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer" : undefined}
                      className={className}
                      onClick={() => setOpenMenu(null)}
                    >
                      {content}
                    </a>
                  )
                }
                return (
                  <button
                    key={index}
                    type="button"
                    className={className}
                    disabled={item.disabled}
                    onClick={item.onClick}
                  >
                    {content}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      ))}
      <div className="ml-auto flex items-center gap-2 sm:gap-4 dark:text-slate-300 text-slate-500 text-xs">
        <ThemeToggle />
        {time && (
          <>
            <span className="hidden sm:inline">
              {time.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="font-bold">
              {time.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
