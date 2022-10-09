import React from "react"
import { graphql, Link } from "gatsby"
import ReactMarkdown from "react-markdown"
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import "./md.css"
import { SocialLogos } from "../components/socialLogos"
import { LeftArrow } from "../components/Icons/leftArrow"
import { Tags } from "../components/tags"

// @ts-ignore
export default function Template({data}) {
  const { markdownRemark } = data
  const { frontmatter, rawMarkdownBody } = markdownRemark
  console.log({frontmatter})
  return (
    <>
      <div className="flex flex-col justify-evenly">
        <div className="py-4 h-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-mono flex flex-col shadow-lg flex-auto">
          <div className="w-full flex flex-col items-center text-center">
            <div className="my-2 animate-bounce">
              <Link to="/#blog" >
                <div className="flex flex-row hover:text-black">
                  <LeftArrow/>
                  <i className="mx-2">go back</i>
                </div>
              </Link>
            </div>
            <p className="text-4xl">{frontmatter.title.toUpperCase()}</p>
            <i className="text-xl self-left">{frontmatter.date}</i>
            <Tags tags={frontmatter?.tags} />
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
        tags
      }
    }
  }
`