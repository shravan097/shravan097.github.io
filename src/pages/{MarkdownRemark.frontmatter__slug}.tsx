import React from "react"
import { graphql } from "gatsby"
import ReactMarkdown from "react-markdown"
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import "./md.css"

// @ts-ignore
export default function Template({data}) {
  const { markdownRemark } = data
  const { frontmatter, rawMarkdownBody } = markdownRemark
  return (
    <>
    <div className="flex flex-col justify-evenly">
      <div className="p-4 h-auto bg-zinc-400 text-white font-mono flex flex-col shadow-lg justify-center text-center">
        <p className="text-4xl">{frontmatter.title.toUpperCase()}</p>
        <i className="text-xl">{frontmatter.date}</i>
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
    
    
      {/* <div className="flex flex-col items-center overflow-scroll">
        <div className="my-8">
          <h1>{frontmatter.title}</h1>
          <h3 className="my-4">Published on: {frontmatter.date}</h3>
        </div>
        
        <ReactMarkdown children={rawMarkdownBody} className=""/>
      </div> */}
      
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