import * as React from "react"

export type Theme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "theme"

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "light" || stored === "dark") return stored
  } catch {
    /* ignore */
  }
  return null
}

function getSystemTheme(): Theme {
  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark"
  }
  return "light"
}

function getInitialTheme(): Theme {
  // gatsby-ssr.ts sets data-theme before first paint — stay in sync with it.
  if (typeof document !== "undefined") {
    const current = document.documentElement.dataset.theme
    if (current === "light" || current === "dark") return current
  }
  return getStoredTheme() ?? getSystemTheme()
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.dataset.astryxTheme = "neutral"
  root.classList.toggle("dark", theme === "dark")
  root.style.colorScheme = theme
}

function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* ignore */
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(getInitialTheme)

  React.useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Follow the OS theme live — unless the user explicitly picked one.
  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function")
      return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = (event: MediaQueryListEvent) => {
      if (getStoredTheme()) return
      setThemeState(event.matches ? "dark" : "light")
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  const setTheme = React.useCallback((next: Theme) => {
    persistTheme(next)
    setThemeState(next)
  }, [])
  const toggleTheme = React.useCallback(
    () =>
      setThemeState(prev => {
        const next = prev === "dark" ? "light" : "dark"
        persistTheme(next)
        return next
      }),
    []
  )

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider")
  return ctx
}
