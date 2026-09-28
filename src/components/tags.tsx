import * as React from "react"
export const Tags = (props: { tags: Array<String> }) => {
  if (!props.tags?.length) return null
  return(
    <div className= "flex flex-row justify-center">
     {
      props.tags.map(tag => {
        return (
           <p className="m-2 px-3 py-1 text-sm rounded-full font-semibold dark:bg-zinc-700 dark:text-zinc-100 bg-zinc-200 text-zinc-700"> {tag} </p>
        )
      })
     }
    </div>
  )
}
