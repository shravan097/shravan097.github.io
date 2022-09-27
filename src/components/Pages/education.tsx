import * as React from "react"
import { SocialLogos } from "./socialLogos"

export const Education = () =>  {
  return (
    <>
    <div className="my-4 flex justify-center flex-row">
      <div className="mx-2">
        <a href="https://www.ccny.cuny.edu/">
          <img className='h-16 w-full rounded-sm' alt='ccny logo' src='https://upload.wikimedia.org/wikipedia/commons/2/25/CCNY_logo_flush_left.svg' />
        </a>
      </div>
      <div className="h-full mx-2 border-r-2 justify-center border-zinc-400" />
      <div className="mx-2 justify center flex-col">
        <p className="font-mono text-xl">BS Computer Science</p>
        <p className="font-mono text-xl">2019</p>
      </div>
    </div>
    <SocialLogos/>
    </>
    
  )
}
