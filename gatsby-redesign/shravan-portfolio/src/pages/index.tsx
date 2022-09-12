import * as React from "react"
import type { HeadFC } from "gatsby"
import { IntroPage } from "../components/Pages/intropage"
import { Navbar } from "../components/Navbar/navbar"
import "./index.css"


// todo - add meta tags for SEO 
const IndexPage = () => {
  return (
    <>
      {/* todo - fix having to duplicate nav bar on every page.
      is there a way to just write this once for other sub pages ?  */}
      <Navbar/>
      <div className="pt-16 sm:pl-64 flex flex-col overflow-auto bg-stone-200 justify-center items-center h-screen">
        <IntroPage/>
      </div>
    </>
      
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
