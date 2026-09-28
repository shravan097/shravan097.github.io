export type ContentType =
  | "about"
  | "education"
  | "experience"
  | "blog-list"
  | "blog-post"
  | "terminal"
  | "snake"
  | "external"

export type FileSystemItem = {
  id: string
  name: string
  type: "file" | "folder"
  contentType?: ContentType
  url?: string
  slug?: string
  children?: FileSystemItem[]
}

export const ROOT_FILESYSTEM: FileSystemItem[] = [
  {
    id: "about",
    name: "About Shravan",
    type: "folder",
    children: [{ id: "about-readme", name: "README.md", type: "file", contentType: "about" }],
  },
  {
    id: "education",
    name: "Education",
    type: "folder",
    children: [{ id: "education-ccny", name: "CCNY.md", type: "file", contentType: "education" }],
  },
  {
    id: "experience",
    name: "Experience",
    type: "folder",
    children: [
      { id: "experience-overview", name: "experience.md", type: "file", contentType: "experience" },
    ],
  },
  {
    id: "blog",
    name: "Blog",
    type: "folder",
    children: [],
  },
  {
    id: "applications",
    name: "Applications",
    type: "folder",
    children: [
      { id: "terminal-app", name: "Terminal.app", type: "file", contentType: "terminal" },
      { id: "snake-app", name: "Snake.app", type: "file", contentType: "snake" },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn.webloc",
    type: "file",
    contentType: "external",
    url: "https://www.linkedin.com/in/shravan-dhakal/",
  },
  {
    id: "github",
    name: "GitHub.webloc",
    type: "file",
    contentType: "external",
    url: "https://github.com/shravan097",
  },
]

export function findItem(items: FileSystemItem[], id: string): FileSystemItem | null {
  for (const item of items) {
    if (item.id === id) return item
    if (item.children) {
      const found = findItem(item.children, id)
      if (found) return found
    }
  }
  return null
}

export function getCurrentFolderItems(
  filesystem: FileSystemItem[],
  selectedPath: string[]
): FileSystemItem[] {
  if (selectedPath.length === 0) return filesystem
  const lastId = selectedPath[selectedPath.length - 1]
  const lastItem = findItem(filesystem, lastId)
  if (lastItem?.type === "folder" && lastItem.children) return lastItem.children
  if (selectedPath.length >= 2) {
    const parent = findItem(filesystem, selectedPath[selectedPath.length - 2])
    return parent?.children ?? filesystem
  }
  return filesystem
}

/** Maps a Finder file to a desktop app window id (if any). */
export function getAppIdForItem(item: FileSystemItem): string | null {
  switch (item.contentType) {
    case "about":
      return "about"
    case "education":
      return "education"
    case "experience":
      return "experience"
    case "blog-list":
      return "blog"
    case "terminal":
      return "terminal"
    case "snake":
      return "snake"
    default:
      if (item.id === "blog") return "blog"
      return null
  }
}

export type OpenItemResult =
  | { kind: "app"; appId: string }
  | { kind: "url"; url: string }
  | { kind: "route"; slug: string }
  | { kind: "folder" }
  | { kind: "none" }

/** What should happen when the user double-clicks / opens an item. */
export function resolveOpenAction(item: FileSystemItem): OpenItemResult {
  if (item.type === "folder") return { kind: "folder" }
  if (item.contentType === "external" && item.url) return { kind: "url", url: item.url }
  if (item.contentType === "blog-post" && item.slug) return { kind: "route", slug: item.slug }
  const appId = getAppIdForItem(item)
  if (appId) return { kind: "app", appId }
  return { kind: "none" }
}

export function getTagsForItem(item: FileSystemItem | null): string[] {
  if (!item) return []
  switch (item.contentType) {
    case "about":
      return ["portfolio", "engineer", "bio"]
    case "education":
      return ["ccny", "computer-science", "2019"]
    case "experience":
      return ["backend", "aws", "typescript", "fintech"]
    case "blog-post":
      return ["blog", "writing"]
    case "terminal":
      return ["cli", "retro", "tools"]
    case "snake":
      return ["retro", "game", "nostalgia"]
    case "external":
      return item.id === "linkedin" ? ["social", "professional"] : ["social", "code"]
    default:
      return item.type === "folder" ? ["folder"] : ["file"]
  }
}

export function getFileExtension(name: string): string {
  const dot = name.lastIndexOf(".")
  return dot > 0 ? name.substring(dot + 1).toUpperCase() : "File"
}

export type BlogPostMeta = {
  id: string
  title: string
  slug: string
  date: string
}

export function buildFilesystem(blogPosts: BlogPostMeta[]): FileSystemItem[] {
  return ROOT_FILESYSTEM.map(item => {
    if (item.id !== "blog") return item
    return {
      ...item,
      children: blogPosts.map(post => ({
        id: `blog-${post.id}`,
        name: `${post.title}.md`,
        type: "file" as const,
        contentType: "blog-post" as const,
        slug: post.slug,
      })),
    }
  })
}
