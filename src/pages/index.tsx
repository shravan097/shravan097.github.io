import * as React from "react"
import type { HeadFC } from "gatsby"
import { IntroPage } from "../components/Pages/intropage"
import { Navbar } from "../components/Navbar/navbar"
import "./index.css"
import { childContainer, parentContainer } from "../styles/shared"


// todo - add meta tags for SEO 
const IndexPage = () => {
  return (
    <div className={parentContainer}>
      {/* todo - fix having to duplicate nav bar on every page.
      is there a way to just write this once for other sub pages ?  */}
      <Navbar/>
      <div className={childContainer}>
        <IntroPage/>
      </div>
    </div>
      
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
