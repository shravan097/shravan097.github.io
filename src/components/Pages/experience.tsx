import * as React from "react"
import { SocialLogos } from "./socialLogos"

export const Experience = React.forwardRef((_props, ref: React.LegacyRef<HTMLDivElement>) =>  {
  // TODO - REPLACE LOGO HERE
  return (
    <div ref={ref} className="snap-start flex h-full w-full justify-center items-center">
      <div className="mx-4 flex flex-col">
        <div>
          <h1 className="font-mono text-2xl">Backend Development</h1>
          <ul className="list-disc">
            <li className="mx-8 font-mono text-xl">
              Microservice, Monolithic, Serverless Architecture
            </li>
            <li className="mx-8 font-mono text-xl">
              Message Queues, RESTful, GraphQL
            </li>
            <li className="mx-8 font-mono text-xl">
              AWS
            </li>
          </ul>
        </div>
        <div>
          <h1 className="mt-8 font-mono text-2xl">Fields</h1>
          <ul className="list-disc">
            <li className="mx-8 font-mono text-xl">
              Automotive IoT
            </li>
            <li className="mx-8 font-mono text-xl">
              Healthtech 
            </li>
            <li className="mx-8 font-mono text-xl">
              Fintech
            </li>
          </ul>
        </div>
        <div>
          <h1 className="mt-8 font-mono text-2xl">Tech</h1>
          <ul className="list-disc">
            <li className="mx-8 font-mono text-xl">
              Typescript
            </li>
            <li className="mx-8 font-mono text-xl">
              Python 
            </li>
            <li className="mx-8 font-mono text-xl">
              Ruby
            </li>
            <li className="mx-8 font-mono text-xl">
              React
            </li>
            <li className="mx-8 font-mono text-xl">
              Redux
            </li>
          </ul>
        </div>
        <SocialLogos/>
      </div>
    </div>
  )
})
