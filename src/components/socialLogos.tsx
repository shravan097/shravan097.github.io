import * as React from "react"
import { Github } from "./Icons/github"
import { Linkedin } from "./Icons/linkedin"
export const SocialLogos = () => {
  return(
    <div className= "container flex flex-row pt-4 justify-center">
      <a href="https://www.linkedin.com/in/shravan-dhakal/" className="mx-2 font-mono text-2xl text-slate-600 font-thin leading-4">
        <Linkedin/>
      </a>
      <a href="https://github.com/shravan097" className="mx-2 font-mono text-2xl text-slate-600 font-thin leading-4">
        <Github/>
      </a>
    </div>
  )
}
