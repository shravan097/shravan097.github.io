import * as React from "react"
import { SocialLogos } from "../socialLogos"

export const InConstruction = React.forwardRef((_props, ref: React.LegacyRef<HTMLDivElement>) =>  {
  // TODO - REPLACE LOGO HERE
  return (
    <div ref={ref} className="flex h-full w-full justify-center items-center">
      <div className="mx-4 flex flex-col">
        <div className="container flex justify-center">
            <p className="text-5xl"> 👋 work in progress ... 👷</p>
        </div>
        <SocialLogos/>
      </div>
    </div>
  )
})
