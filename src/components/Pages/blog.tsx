import { graphql, Link } from "gatsby"
import * as React from "react"
import { SocialLogos } from "./socialLogos"

const Blog = React.forwardRef((props, ref: React.LegacyRef<HTMLDivElement>) =>  {
  // @ts-ignore TODO - REPLACE LOGO HERE 
  // const { markdownRemark } = props.data
  console.log(props.data)
  return (
    <div ref={ref} className="flex h-full w-full justify-center items-center overflow-scroll">
      <div className="mx-4 my-4 flex flex-col content-center">
        <div className="flex justify-center text-center content-center flex-col">
            <p className="text-5xl"> Recent Blog Posts </p>
            <div className="overscroll-y">
              <Link to={'/blog/yam-to-dict'}><p className="hover:underline m-5 text-xl"> YAML to Dict </p></Link>
              <Link to={'/blog/google-home-church-bell'}><p className="hover:underline m-5 text-xl">Make Google Home Ring Church Bells Every Hour</p></Link>
            </div>
        </div>
        <SocialLogos/>
      </div>
    </div>
  )
})

// export const pageQuery = graphql`
//   query() {
//     file {
//       id
//     }
//     allFile(filter: {ext: {eq: ".md"}}) {
//       edges {
//         node {
//           name
//         }
//       }
//     }
//   }
// `
export default Blog