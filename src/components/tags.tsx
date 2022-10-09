import * as React from "react"
export const Tags = (props: { tags: Array<String> }) => {
  if (!props.tags?.length) return null
  return(
    <div className= "flex flex-row justify-center">
     {
      props.tags.map(tag => {
        return (
          <p className=" bg-zinc-400 m-2 px-3 py-1 text-sm text-zinc-800 rounded-full  font-semibold "> {tag} </p>
        )
      })
     }
    </div>
  )
}
