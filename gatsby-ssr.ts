import * as React from "react"
import type { GatsbySSR } from "gatsby"
import { ThemeProvider } from "./src/components/ThemeProvider"

export const wrapRootElement: GatsbySSR["wrapRootElement"] = ({ element }) =>
  React.createElement(ThemeProvider, null, element)

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme =
      stored === 'light' || stored === 'dark'
        ? stored
        : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-astryx-theme', 'neutral');
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    root.style.colorScheme = theme;
  } catch (e) {}
})();
`

export const onRenderBody: GatsbySSR["onRenderBody"] = ({
  setPreBodyComponents,
  setHeadComponents,
}) => {
  setHeadComponents([
    React.createElement("meta", {
      key: "color-scheme",
      name: "color-scheme",
      content: "light dark",
    }),
  ])
  setPreBodyComponents([
    React.createElement("script", {
      key: "theme-init",
      dangerouslySetInnerHTML: { __html: themeInitScript },
    }),
  ])
}
