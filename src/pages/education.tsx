import { HeadFC } from "gatsby"
import { Navbar } from "../components/Navbar/navbar"
import { Education } from "../components/Pages/education"
import * as React from "react"
import { childContainer, parentContainer } from "../styles/shared"

export const EducationPage = () =>  {
  return (
    <div className={parentContainer}>
      <Navbar/>
      <div className={childContainer}>
       <Education/>
      </div>
    </div>
  )
}

export default EducationPage

export const Head: HeadFC = () => <title>Education Page</title>
