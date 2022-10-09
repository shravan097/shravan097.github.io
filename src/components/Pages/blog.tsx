import { graphql, Link, useStaticQuery } from "gatsby"
import * as React from "react"
import { SocialLogos } from "./socialLogos"
// import  "../../gatsby-types"

const Blog = React.forwardRef((_props, ref: React.LegacyRef<HTMLDivElement>) =>  {

  const allMarkdownQuery = graphql`
    {
      allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
        edges {
          node {
            id
            frontmatter {
              date
              slug
              title
            }
          }
        }
      }
    }
  `
  const data = useStaticQuery(allMarkdownQuery)
  return (
    <div id="blog" ref={ref} className="flex h-full w-full justify-center items-center">
      <div className="mx-4 my-4 flex flex-col content-center">
        <div className="flex justify-center text-center content-center flex-col">
            <p className="text-5xl"> Recent Blog Posts </p>
            <div className="my-4">
              <div className="h-64 overflow-y-auto">
                {
                  data?.allMarkdownRemark?.edges?.map((item: { node: { frontmatter: { date: any; slug: any; title: any } } }) => {
                    const {date, slug, title} = item.node.frontmatter
                    return (
                      <div className="my-4">
                        <Link to={slug}><p className="hover:underline text-2xl">{title}</p></Link>
                        <i className="text-base">Published At {date}</i>
                        <div className="border-b-2 mt-2 border-zinc-300"></div>
                      </div>
                    )
                    })
                }
              </div>
            </div>
        </div>
        <SocialLogos/>
      </div>
    </div>
  )
})

export default Blog