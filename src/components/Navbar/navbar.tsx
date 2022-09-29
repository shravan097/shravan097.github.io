import { useLocation } from "@reach/router"
import { Link } from "gatsby"
import * as React from "react"
import { Cross } from "../Icons/cross"
import { Hamburger } from "../Icons/hamburger"

export const Navbar = (props: NavbarProps) => {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <nav className="hidden sm:flex w-auto flex-col justify-center h-screen bg-zinc-800 shadow-2xl overflow-hidden">
          <div className="flex flex-row sm:flex-col items-center ">
            <div onClick={props.scrollTo.intro} className="my-2 mx-16 font-bold text-2xl text-slate-200 hover:underline decoration-gray-500 decoration-4"> Intro </div>
            <div onClick={props.scrollTo.education} className="my-2 mx-16 font-bold text-2xl text-slate-200 hover:underline decoration-gray-500 decoration-4"> Education </div>
            <div onClick={props.scrollTo.experience} className="my-2 mx-16 font-bold text-2xl text-slate-200 hover:underline decoration-gray-500 decoration-4"> Experience </div>
            <div onClick={props.scrollTo.inconstruction} className="my-2 mx-16 font-bold text-2xl text-slate-200 hover:underline decoration-gray-500 decoration-4"> Blog </div>
          </div>
      </nav>

      {/* Mobile */}
      <nav className="flex sm:hidden flex-col w-screen h-auto bg-zinc-800 shadow-2xl overflow-hidden items-start z-10 sticky top-0">
        <button type="button" className="mx-4 my-4 rounded-md text-gray-400 hover:text-white " aria-controls="mobile-menu" aria-expanded="true" onClick={() => setOpen(!open)}>
          { open ? <Cross/> : <Hamburger/> }
        </button>
        {/* todo - simply this open &&  */}
        {open && <div onClick={props.scrollTo.intro} className="mx-4 my-2 font-bold text-2xl text-slate-200 hover:underline decoration-gray-500 decoration-4"> Intro </div>}
        {open && <div onClick={props.scrollTo.education} className="mx-4 my-2 font-bold text-2xl text-slate-200 hover:underline decoration-gray-500 decoration-4"> Education </div>}
        {open && <div onClick={props.scrollTo.experience} className="mx-4 my-2 font-bold text-2xl text-slate-200 hover:underline decoration-gray-500 decoration-4"> Experience </div>}
        {open && <div onClick={props.scrollTo.inconstruction} className="mx-4  my-2 font-bold text-2xl text-slate-200 hover:underline decoration-gray-500 decoration-4"> Blog </div>}
      </nav>
    </>
  )
}

type NavbarProps = {
  scrollTo: {
    education: () => void
    intro: () => void
    experience: () => void,
    inconstruction: () => void
  }
}