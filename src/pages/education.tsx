import { HeadFC } from "gatsby"
import { Navbar } from "../components/Navbar/navbar"
import { Education } from "../components/Pages/education"
import * as React from "react"

export const EducationPage = () =>  {
  return (
    <>
      <Navbar/>
      <div className="pt-16 sm:pl-64 flex flex-col overflow-auto bg-stone-200 justify-center items-center h-screen">
        <Education/>
      </div>
    </>
  )
}

export default EducationPage

export const Head: HeadFC = () => <title>Education Page</title>
