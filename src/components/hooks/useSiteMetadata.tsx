import { graphql, useStaticQuery } from "gatsby"

export const useSiteMetadata = () => {
  const data = useStaticQuery(graphql`
    query {
      site(siteMetadata: {}) {
        siteMetadata {
          title
          description
          image
          siteUrl
        }
      }
    }
  `)

  return data.site.siteMetadata
}