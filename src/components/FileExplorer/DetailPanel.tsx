import { Link } from "gatsby"
import * as React from "react"
import { Typewriter } from "react-simple-typewriter"
import { Terminal } from "../Desktop/Terminal"
import { Snake } from "../Desktop/Snake"
import type { FileSystemItem } from "./filesystem"
import { getFileExtension } from "./filesystem"

type DetailPanelProps = {
  selectedItem: FileSystemItem | null
}

const EXPERIENCE_SECTIONS = [
  {
    title: "Backend Development",
    items: [
      "Microservice, Monolithic, Serverless Architecture",
      "Message Queues, RESTful, GraphQL",
      "AWS",
    ],
  },
  {
    title: "Industries",
    items: ["Automotive IoT", "Healthtech", "Fintech"],
  },
  {
    title: "Tech",
    items: ["TypeScript", "Python", "Ruby", "React", "Redux"],
  },
]

export const DetailPanel: React.FC<DetailPanelProps> = ({ selectedItem }) => {
  if (!selectedItem) return null

  if (selectedItem.contentType === "terminal") {
    return (
      <div style={{ height: "100%", minHeight: 320 }}>
        <Terminal />
      </div>
    )
  }

  if (selectedItem.contentType === "snake") {
    return (
      <div style={{ height: "100%", minHeight: 280 }}>
        <Snake />
      </div>
    )
  }

  if (selectedItem.contentType === "about") {
    return <AboutDetail />
  }

  if (selectedItem.contentType === "education") {
    return <EducationDetail />
  }

  if (selectedItem.contentType === "experience") {
    return <ExperienceDetail />
  }

  if (selectedItem.contentType === "blog-post" && selectedItem.slug) {
    return (
      <div className="flex flex-col items-center gap-4 py-2">
        <p className="text-center">{selectedItem.name}</p>
        <Link to={selectedItem.slug}>Open blog post →</Link>
      </div>
    )
  }

  if (selectedItem.contentType === "external" && selectedItem.url) {
    return (
      <div className="flex flex-col items-center gap-4 py-2">
        <p className="text-center">{selectedItem.name}</p>
        <a href={selectedItem.url} target="_blank" rel="noreferrer">
          Open in browser ↗
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <p className="text-center">{selectedItem.name}</p>
      <p>{getFileExtension(selectedItem.name)} Document</p>
    </div>
  )
}

const AboutDetail: React.FC = () => (
  <div className="flex flex-col items-center gap-5 py-2">
    <img
      src="https://avatars.githubusercontent.com/u/23582455?v=4"
      alt="Shravan Dhakal"
      className="rounded-full object-cover"
      style={{ width: 96, height: 96 }}
    />
    <div className="text-center">
      <p style={{ fontSize: "1.75rem", fontWeight: 700 }}>
        <Typewriter cursor loop words={["Shravan"]} />
      </p>
      <p style={{ fontSize: "1.75rem", fontWeight: 700 }}>Dhakal</p>
      <p style={{ marginTop: 8 }}>Software Engineer · 8+ years</p>
    </div>
    <div className="flex flex-wrap justify-center gap-3">
      <a href="https://www.linkedin.com/in/shravan-dhakal/" target="_blank" rel="noreferrer">
        LinkedIn ↗
      </a>
      <a href="https://github.com/shravan097" target="_blank" rel="noreferrer">
        GitHub ↗
      </a>
    </div>
  </div>
)

const EducationDetail: React.FC = () => (
  <div className="flex flex-col items-center gap-5 py-2">
    <a href="https://www.ccny.cuny.edu/" target="_blank" rel="noreferrer">
      <img
        className="h-14 w-auto"
        alt="CCNY logo"
        src="https://upload.wikimedia.org/wikipedia/commons/2/25/CCNY_logo_flush_left.svg"
      />
    </a>
    <div className="text-center">
      <p style={{ fontSize: "1.125rem", fontWeight: 700 }}>BS Computer Science</p>
      <p>City College of New York</p>
      <p style={{ fontWeight: 700, marginTop: 8 }}>Class of 2019</p>
    </div>
  </div>
)

const ExperienceDetail: React.FC = () => (
  <div className="py-2">
    {EXPERIENCE_SECTIONS.map(section => (
      <div key={section.title} style={{ marginBottom: 20 }}>
        <p style={{ fontWeight: 700, marginBottom: 8 }}>{section.title}</p>
        <ul>
          {section.items.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)
