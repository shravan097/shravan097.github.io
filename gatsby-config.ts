import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Shravan Dhakal Portfolio`,
    siteUrl: `https://shravan097.github.io/`
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: ['gatsby-plugin-postcss', {
    resolve: 'gatsby-plugin-google-gtag',
    options: {
      "trackingId": ["G-JZY81GW26R"],
      "pluginConfig": {
        head: true
      },
    }
  }, "gatsby-plugin-sitemap", "gatsby-plugin-mdx", {
    resolve: 'gatsby-source-filesystem',
    options: {
      "name": "pages",
      "path": "./src/pages/"
    },
    __key: "pages"
  },
  ]
};

export default config;
