import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Shravan Dhakal`,
    description: "Software Engineer Portfolio & Blogs",
    siteUrl: `https://shravan097.github.io/`,
    image: 'https://avatars.githubusercontent.com/u/23582455?v=4'
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: ['gatsby-plugin-postcss', {
    resolve: 'gatsby-plugin-google-gtag',
    options: {
      trackingIds: ["G-JZY81GW26R"]
    }
  }, "gatsby-plugin-sitemap", {
    resolve: 'gatsby-source-filesystem',
    options: {
      "name": "pages",
      "path": `${__dirname}/src/pages/`
    },
    __key: "pages"
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `posts`,
      path: `${__dirname}/src/posts/`,
    },
  },
  `gatsby-transformer-remark`,
  {
    resolve: `gatsby-plugin-graphql-codegen`,
    options: {
      fileName: `./gatsby-graphql.ts`,
      documentPaths: [
        './src/**/*.{ts,tsx}',
      ],
    }
  }]
};

export default config;
