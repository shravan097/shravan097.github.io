import { HeadFC } from "gatsby"
import React from "react"
import { Navbar } from "../components/Navbar/navbar"
import { SocialLogos } from "../components/Pages/socialLogos"

export const WorkInProgressPage = () =>  {
  return (
    <>
      <Navbar/>
      <div className="pt-16 sm:pl-64 flex flex-col overflow-auto bg-stone-200 justify-evenly items-center h-screen">
        <div className="container flex justify-center">
          <p className="text-5xl">👋 work in progress ... 👷</p>
        </div>
        <SocialLogos/>
      </div>
    </>
  )
}

export default WorkInProgressPage

export const Head: HeadFC = () => <title>Education Page</title>
