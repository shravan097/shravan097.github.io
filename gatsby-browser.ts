import "@astryxdesign/core/reset.css"
import "@astryxdesign/core/astryx.css"
import "@astryxdesign/theme-neutral/theme.css"
import "./src/styles/global.css"
import * as React from "react"
import type { GatsbyBrowser } from "gatsby"
import { ThemeProvider } from "./src/components/ThemeProvider"

export const wrapRootElement: GatsbyBrowser["wrapRootElement"] = ({ element }) =>
  React.createElement(ThemeProvider, null, element)
