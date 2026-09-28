import * as React from "react"
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline"
import { useTheme } from "./ThemeProvider"

export const ThemeToggle: React.FC = () => {
  const { toggleTheme } = useTheme()
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light and dark mode"
      title="Toggle light / dark mode"
      className="flex items-center justify-center w-8 h-8 rounded-md transition-colors dark:text-slate-300 text-slate-600 dark:hover:bg-white/10 hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
    >
      <SunIcon className="w-4 h-4 dark:hidden" />
      <MoonIcon className="w-4 h-4 hidden dark:block" />
    </button>
  )
}
