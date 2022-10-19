import { graphql, Link, useStaticQuery } from "gatsby"
import * as React from "react"
import { SocialLogos } from "../socialLogos"
import { Tags } from "../tags"
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
              tags
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
            <div className="border-t-4 border-zinc-700"/>
            <p className="text-5xl m-4">Recent Blog Posts</p>
            <div className="border-t-4 border-zinc-700"/>
            <div className="my-4">
              <div className="h-64 overflow-y-auto shadow-inner">
                {
                  data?.allMarkdownRemark?.edges?.map((item: { node: { frontmatter: { date: any; slug: any; title: any, tags: any } } }) => {
                    const {date, slug, title, tags} = item.node.frontmatter
                    return (
                      <div className="m-4">
                        <Link to={slug}><p className="hover:underline text-2xl">{title}</p></Link>
                        <i className="text-base">Published At {date}</i>
                        <Tags tags={tags} />
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