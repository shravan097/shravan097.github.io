import * as React from "react"

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
  onOpenWindow?: (id: string) => void
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
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return
      setOpenMenu(null)
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [openMenu])

  const menus: MenuDef[] = [
    {
      name: "File",
      items: [
        {
          label: "New Window — About",
          onClick: () => {
            onOpenWindow?.("about")
            setOpenMenu(null)
          },
        },
        {
          label: "New Window — Terminal",
          onClick: () => {
            onOpenWindow?.("terminal")
            setOpenMenu(null)
          },
        },
        {
          label: "New Window — Blog",
          onClick: () => {
            onOpenWindow?.("blog")
            setOpenMenu(null)
          },
        },
      ],
    },
    {
      name: "View",
      items: [
        {
          label: "Reload Page",
          onClick: () => {
            if (typeof window !== "undefined") window.location.reload()
            setOpenMenu(null)
          },
        },
        {
          label: "View Source on GitHub",
          href: "https://github.com/shravan097/shravan097.github.io",
          external: true,
        },
      ],
    },
    {
      name: "Help",
      items: [
        {
          label: "About Shravan OS",
          onClick: () => {
            onOpenWindow?.("about")
            setOpenMenu(null)
          },
        },
        {
          label: "LinkedIn — Shravan Dhakal",
          href: "https://www.linkedin.com/in/shravan-dhakal/",
          external: true,
        },
        {
          label: "GitHub — shravan097",
          href: "https://github.com/shravan097",
          external: true,
        },
      ],
    },
  ]

  return (
    <div
      ref={menuRef}
      className="fixed top-0 left-0 right-0 z-[200] min-h-[44px] h-8 sm:h-7 flex items-center px-2 sm:px-4 text-slate-200 text-xs sm:text-sm font-mono select-none border-b border-slate-700/50"
      style={{ background: "rgba(15,23,42,0.92)", backdropFilter: "blur(16px)" }}
    >
      <span
        className="font-bold mr-3 sm:mr-6 text-indigo-400 flex-shrink-0"
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
              openMenu === menu.name ? "text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {menu.name}
          </button>
          {openMenu === menu.name && (
            <div
              className="absolute left-0 top-full mt-0.5 py-1 min-w-[200px] rounded-md shadow-xl border border-slate-600/80 overflow-hidden"
              style={{ background: "rgba(15,23,42,0.98)", backdropFilter: "blur(12px)" }}
            >
              {menu.items.map((item, i) => {
                const content = (
                  <span className="block w-full text-left px-3 py-2 sm:py-1.5 text-sm min-h-[44px] sm:min-h-0 flex items-center">
                    {item.label}
                  </span>
                )
                const className =
                  "block w-full text-left text-slate-300 hover:bg-slate-600/50 active:bg-slate-600/50 hover:text-white transition-colors " +
                  (item.disabled ? "opacity-50 cursor-not-allowed" : "")
                if (item.href) {
                  return (
                    <a
                      key={i}
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
                    key={i}
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
      <div className="ml-auto flex items-center gap-4 text-slate-300 text-xs">
        {time && (
          <>
            <span>
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
