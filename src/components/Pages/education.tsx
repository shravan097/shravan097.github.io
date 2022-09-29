import * as React from "react"
import { SocialLogos } from "./socialLogos"

export const Education = React.forwardRef((_props, ref: React.LegacyRef<HTMLDivElement>) =>  {
  return (
    <div ref={ref} className="snap-start flex h-full w-full justify-center items-center">
      <div className="flex flex-col justify-center">
        <div className="flex flex-row content-center">
          <a className='content-center w-full' href="https://www.ccny.cuny.edu/">
            <img className='h-auto w-full rounded-sm' alt='ccny logo' src='https://upload.wikimedia.org/wikipedia/commons/2/25/CCNY_logo_flush_left.svg' />
          </a>
          <div className="w-auto ml-2" />
          <div className="w-auto mr-2 border-l-2 border-zinc-400" />
          <div className="w-full flex flex-col">
            <p className="font-mono text-xl">BS Computer Science</p>
            <p className="font-mono text-xl">2019</p>
          </div>
        </div>
        <SocialLogos/>
      </div>   
    </div>
  )
})
