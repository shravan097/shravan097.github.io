import * as React from "react"
import type { HeadFC } from "gatsby"
import { Desktop } from "../components/Desktop"
import { SEO } from "../components/seo"

const IndexPage = () => <Desktop />

export default IndexPage

export const Head: HeadFC = () => (
  <SEO title="Shravan OS" description="Shravan Dhakal — Software Engineer" />
)
