import * as React from "react"
import { SocialLogos } from "./socialLogos"
import { Typewriter } from 'react-simple-typewriter'

export const IntroPage = React.forwardRef((_props, ref: React.LegacyRef<HTMLDivElement>) =>  {
  return (
    <div ref={ref} className="snap-start flex flex-col justify-center h-full w-full items-center">
      <div className="max-w-xs w-6/12 sm:w-4/12">
        <img src="https://avatars.githubusercontent.com/u/23582455?v=4" alt="profile picture" className="shadow rounded-full max-w-full h-auto align-middle" />
      </div>

      <Name firstName="Shravan" lastName="Dhakal" />
      <JobTitle title='Software Engineer' />
      <SocialLogos />
    </div>
  )
})


const Name = (props: {firstName: string, lastName: string}) => {
  return (
    <div className= "my-4 flex flex-col justify-center items-center w-full">
      <p className="font-mono text-7xl font-extrabold uppercase"> <Typewriter cursor={true} loop={true} words={[props.firstName]} /> </p>
      <p className="font-mono text-7xl font-extrabold uppercase"> {props.lastName} </p>
    </div>
  )
}

const JobTitle = (props: {title: string}) => {
  return (
  <div className= "flex my-2 justify-center items-center">
    <p className="font-mono text-2xl text-slate-600 font-normal"> {props.title} </p>
  </div>
  )
}

