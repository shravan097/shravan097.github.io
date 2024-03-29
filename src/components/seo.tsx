import React from "react"
import { useSiteMetadata } from "./hooks/useSiteMetadata"

export const SEO = (params: Partial<SEOProps>) => {
  const { title: defaultTitle, description: defaultDescription, image, siteUrl, twitterUsername } = useSiteMetadata()

  const seo = {
    title: params?.title || defaultTitle,
    description: params?.description || defaultDescription,
    image: `${siteUrl}${image}`,
    url: `${params?.pathname || ``}`,
    twitterUsername,
  }

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:creator" content={seo.twitterUsername} />
      <meta name="google-site-verification" content="8rR2-kZ3CL9O3lx-3V9xIiZxtHn8y8ZMPd5KRisbx8s" />
      <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>👤</text></svg>" />
      {params?.children}
    </>
  )
}

type SEOProps = { title: string, description: string, pathname: string, children: any }