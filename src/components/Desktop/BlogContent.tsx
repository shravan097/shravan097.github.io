import { graphql, Link, useStaticQuery } from "gatsby"
import * as React from "react"
import { Tags } from "../tags"

export const BlogContent: React.FC = () => {
  const data = useStaticQuery(graphql`
    {
      allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
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
  `)

  return (
    <div className="p-4 h-full overflow-y-auto" style={{ background: "#0f172a" }}>
      <h2
        className="font-mono text-lg font-bold mb-4 pb-2 border-b"
        style={{ color: "#818cf8", borderColor: "rgba(51,65,85,0.8)" }}
      >
        📝 Recent Blog Posts
      </h2>
      <div className="space-y-4">
        {data?.allMarkdownRemark?.edges?.map(
          ({
            node,
          }: {
            node: { id: string; frontmatter: { date: string; slug: string; title: string; tags: string[] } }
          }) => {
            const { date, slug, title, tags } = node.frontmatter
            return (
              <div
                key={node.id}
                className="pb-3 border-b"
                style={{ borderColor: "rgba(51,65,85,0.5)" }}
              >
                <Link to={slug}>
                  <p
                    className="font-mono text-base hover:underline transition-colors"
                    style={{ color: "#a5b4fc" }}
                  >
                    {title}
                  </p>
                </Link>
                <p className="font-mono text-xs mt-1" style={{ color: "#64748b" }}>
                  {date}
                </p>
                <Tags tags={tags} />
              </div>
            )
          }
        )}
      </div>
    </div>
  )
}
