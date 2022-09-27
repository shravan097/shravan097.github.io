import { HeadFC } from "gatsby"
import React from "react"
import { Linkedin } from "../components/Icons/linkedin"
import { Navbar } from "../components/Navbar/navbar"
import { SocialLogos } from "../components/Pages/socialLogos"
import { childContainer, parentContainer } from "../styles/shared"

export const WorkInProgressPage = () =>  {
  return (
    <>
      <div className={parentContainer}>
        <Navbar/>
        <div className={childContainer}>
          <div className="container flex justify-center">
            <p className="text-5xl"> 👋 work in progress ... 👷</p>
          </div>
          <SocialLogos/>
        </div>
      </div>
      
      
    </>
  )
}

export default WorkInProgressPage

export const Head: HeadFC = () => <title>Education Page</title>
