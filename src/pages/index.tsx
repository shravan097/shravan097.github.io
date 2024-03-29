import * as React from "react"
import type { HeadFC } from "gatsby"
import { IntroPage } from "../components/Pages/intropage"
import { Navbar } from "../components/Navbar/navbar"
import { childContainer, parentContainer } from "../styles/shared"
import { Education } from "../components/Pages/education"
import { Experience } from "../components/Pages/experience"
import Blog from "../components/Pages/blog"
import { SEO } from "../components/seo"

 
const IndexPage = () => {
  const educationRef = React.useRef<HTMLDivElement>(null)
  const introRef = React.useRef<HTMLDivElement>(null)
  const experienceRef = React.useRef<HTMLDivElement>(null)
  const blogRef =  React.useRef<HTMLDivElement>(null)
  
  const scrollTo = {
    education: (): void => educationRef.current?.scrollIntoView(),
    intro: (): void => introRef.current?.scrollIntoView(),
    experience: (): void => experienceRef.current?.scrollIntoView(),
    blogRef: (): void => blogRef.current?.scrollIntoView(),
  }
  return (
    <div className={`${parentContainer}`}>
      {/* todo - fix having to duplicate nav bar on every page.
      is there a way to just write this once for other sub pages ?  */}
      <Navbar scrollTo={scrollTo}/>
      <div className={`${childContainer}`}>
        <IntroPage ref={introRef}/>
        <Education ref={educationRef}/>
        <Experience ref={experienceRef}/>
        <Blog ref={blogRef} />
      </div>
    </div>
      
  )
}

export default IndexPage

export const Head: HeadFC = () => (
  <SEO title="Shravan" description="Shravan's Portfolio & Blog"/>
)
