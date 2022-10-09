import React from "react"
import { graphql, Link } from "gatsby"
import ReactMarkdown from "react-markdown"
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import "./md.css"
import { Typewriter } from "react-simple-typewriter"
import { SocialLogos } from "../components/Pages/socialLogos"
import { Home } from "../components/Icons/home"

// @ts-ignore
export default function Template({data}) {
  const { markdownRemark } = data
  const { frontmatter, rawMarkdownBody } = markdownRemark
  
  return (
    <>
      <div className="flex flex-col justify-evenly">
        <div className="p-4 h-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-mono flex flex-col shadow-lg justify-center text-center">
          <Link to="/" ><Home/></Link>
          <p className="text-4xl"><Typewriter cursor={true} loop={1} words={[frontmatter.title.toUpperCase()]} /></p>
          <i className="text-xl">{frontmatter.date}</i>
          <SocialLogos />
        </div>
        <div className="flex h-full w-full overflow-y-scroll">
          <ReactMarkdown 
            children={rawMarkdownBody} 
            className="markdown-body"
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    // @ts-ignore todo - fix theming
                    style={oneDark} 
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
            />
        </div>
      </div>
    </>
  )
}

export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      rawMarkdownBody
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
      }
    }
  }
`