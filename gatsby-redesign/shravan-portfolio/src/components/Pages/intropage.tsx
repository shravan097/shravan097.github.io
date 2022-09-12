import * as React from "react"
import { SocialLogos } from "./socialLogos"

export const IntroPage = () =>  {
  return (
    <>
      <div className="max-w-xs w-6/12 sm:w-4/12">
        <img src="https://avatars.githubusercontent.com/u/23582455?v=4" alt="..." className="shadow rounded-full max-w-full h-auto align-middle" />
      </div>
      <div className="container mt-16">
        <Name firstName="Shravan" lastName="Dhakal" />
        <JobTitle title='Software Engineer' />
        <SocialLogos />
      </div>
    </>
  )
}


const Name = (props: {firstName: string, lastName: string}) => {
  return (
    <>
    <div className= "container flex justify-center">
      <p className="font-mono text-7xl font-extrabold leading-4 uppercase"> {props.firstName} </p>
    </div>
    <div className= "container flex pt-12 justify-center">
      <p className="font-mono text-7xl font-extrabold leading-4 uppercase"> {props.lastName} </p>
    </div>
    </>
    
  )
}

const JobTitle = (props: {title: string}) => {
  return (
    <div className= "container flex pt-16 justify-center">
    <p className="font-mono text-2xl text-slate-600 font-normal leading-4"> {props.title} </p>
  </div>
  )
}

