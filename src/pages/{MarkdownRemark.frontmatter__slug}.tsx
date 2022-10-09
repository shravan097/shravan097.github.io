import React from "react"
import { graphql, Link } from "gatsby"
import ReactMarkdown from "react-markdown"
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import "./md.css"
import { SocialLogos } from "../components/Pages/socialLogos"
import { Home } from "../components/Icons/home"

// @ts-ignore
export default function Template({data}) {
  const { markdownRemark } = data
  const { frontmatter, rawMarkdownBody } = markdownRemark
  
  return (
    <>
      <div className="flex flex-col justify-evenly">
        <div className="py-4 h-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-mono flex flex-row shadow-lg flex-auto">
          <div className="mx-4 self-center w-1/8"><Link to="/#blog" ><Home/></Link></div>
          <div className="mx-4 w-full flex flex-col items-center text-center">
            <p className="text-4xl">{frontmatter.title.toUpperCase()}</p>
            <i className="text-xl self-left">{frontmatter.date}</i>
            <SocialLogos />
          </div>
          
        </div>
        <div className="flex min-h-screen w-full">
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