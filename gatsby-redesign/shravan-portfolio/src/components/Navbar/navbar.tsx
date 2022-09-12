import * as React from "react"
import { Cross } from "../Icons/cross"
import { Hamburger } from "../Icons/hamburger"

export const Navbar = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <>
    <nav className="hidden sm:flex w-auto flex-col justify-center h-full bg-zinc-800 shadow-2xl absolute overflow-hidden">
        <div className="flex flex-row sm:flex-col items-center ">
          <a href='./' className="my-2 mx-16 font-bold text-2xl text-slate-200 hover:underline decoration-gray-500 decoration-4"> Intro </a>
          <a href='./inprogress' className="my-2 mx-16 font-bold text-2xl text-slate-200 hover:underline decoration-gray-500 decoration-4"> Education </a>
          <a href='./inprogress' className="my-2 mx-16 font-bold text-2xl text-slate-200 hover:underline decoration-gray-500 decoration-4"> Experience </a>
          <a className="my-2 mx-16 font-bold text-2xl text-slate-200 hover:underline decoration-gray-500 decoration-4"> Blog </a>
        </div>
    </nav>

    {/* Mobile */}
    <nav className="flex sm:hidden flex-col w-screen h-auto bg-zinc-800 shadow-2xl absolute overflow-hidden items-start">
      <button type="button" className="mx-4 my-4 rounded-md text-gray-400 hover:text-white " aria-controls="mobile-menu" aria-expanded="true" onClick={() => setOpen(!open)}>
        { open ? <Cross/> : <Hamburger/> }
      </button>
      {/* todo - simply this open &&  */}
      {open && <a href='./' className="mx-4 my-2 font-bold text-2xl text-slate-200 hover:underline decoration-gray-500 decoration-4"> Intro </a>}
      {open && <a href='./inprogress' className="mx-4 my-2 font-bold text-2xl text-slate-200 hover:underline decoration-gray-500 decoration-4"> Education </a>}
      {open && <a href='./inprogress' className="mx-4 my-2 font-bold text-2xl text-slate-200 hover:underline decoration-gray-500 decoration-4"> Experience </a>}
      {open && <a href='./inprogress' className="mx-4  my-2 font-bold text-2xl text-slate-200 hover:underline decoration-gray-500 decoration-4"> Blog </a>}
    </nav>
    </>
    
    
  )
}