import { HeadFC } from "gatsby"
import * as React from "react"
import { Navbar } from "../components/Navbar/navbar"
import { Experience } from "../components/Pages/experience"
import { parentContainer, childContainer } from "../styles/shared"

export const ExperiencePage = () =>  {
  return (
    <>
    <div className={parentContainer}>
      <Navbar/>
      <div className={childContainer}>
       <Experience/>
      </div>
    </div>
    </>
    
  )
}
export default ExperiencePage

export const Head: HeadFC = () => <title>Experience Page</title>
