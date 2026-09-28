export type AppId =
  | "finder"
  | "about"
  | "education"
  | "experience"
  | "blog"
  | "terminal"
  | "snake"

export type AppDef = {
  id: AppId
  /** Short dock / File menu label */
  label: string
  /** Window title bar */
  title: string
  icon: string
  defaultX: number
  defaultY: number
  defaultWidth: number
  defaultHeight: number
  /** Open on first load */
  openByDefault?: boolean
}

/**
 * Single source of truth for desktop apps.
 * Dock, File menu, desktop icons, and window content all read from this list.
 */
export const APPS: AppDef[] = [
  {
    id: "finder",
    label: "Finder",
    title: "Finder — Portfolio",
    icon: "📁",
    defaultX: 60,
    defaultY: 52,
    defaultWidth: 920,
    defaultHeight: 520,
    openByDefault: true,
  },
  {
    id: "about",
    label: "About",
    title: "About Shravan",
    icon: "👤",
    defaultX: 80,
    defaultY: 56,
    defaultWidth: 420,
    defaultHeight: 480,
  },
  {
    id: "education",
    label: "Education",
    title: "Education",
    icon: "🎓",
    defaultX: 220,
    defaultY: 56,
    defaultWidth: 400,
    defaultHeight: 300,
  },
  {
    id: "experience",
    label: "Experience",
    title: "Experience",
    icon: "💼",
    defaultX: 360,
    defaultY: 56,
    defaultWidth: 460,
    defaultHeight: 420,
  },
  {
    id: "blog",
    label: "Blog",
    title: "Blog",
    icon: "📝",
    defaultX: 160,
    defaultY: 56,
    defaultWidth: 500,
    defaultHeight: 400,
  },
  {
    id: "terminal",
    label: "Terminal",
    title: "Terminal — shravan@portfolio",
    icon: "⌨️",
    defaultX: 280,
    defaultY: 56,
    defaultWidth: 620,
    defaultHeight: 380,
    openByDefault: true,
  },
  {
    id: "snake",
    label: "Snake",
    title: "Snake.app",
    icon: "🐍",
    defaultX: 400,
    defaultY: 80,
    defaultWidth: 320,
    defaultHeight: 420,
  },
]

export function getApp(id: string): AppDef | undefined {
  return APPS.find(app => app.id === id)
}
