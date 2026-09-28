import { Avatar } from "@astryxdesign/core/Avatar"
import { Icon } from "@astryxdesign/core/Icon"
import { IconButton } from "@astryxdesign/core/IconButton"
import { Layout, LayoutContent, HStack, VStack } from "@astryxdesign/core/Layout"
import { List, ListItem } from "@astryxdesign/core/List"
import { MetadataList, MetadataListItem } from "@astryxdesign/core/MetadataList"
import { Section } from "@astryxdesign/core/Section"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@astryxdesign/core/SegmentedControl"
import { Text } from "@astryxdesign/core/Text"
import { TextInput } from "@astryxdesign/core/TextInput"
import { Toolbar } from "@astryxdesign/core/Toolbar"
import {
  AdjustmentsHorizontalIcon,
  Bars4Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  ShareIcon,
  Squares2X2Icon,
  TableCellsIcon,
  TagIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline"
import { FolderIcon } from "@heroicons/react/24/solid"
import { graphql, navigate, useStaticQuery } from "gatsby"
import * as React from "react"
import { DetailPanel } from "./DetailPanel"
import {
  buildFilesystem,
  findItem,
  getCurrentFolderItems,
  getFileExtension,
  getTagsForItem,
  resolveOpenAction,
  type FileSystemItem,
} from "./filesystem"
import { GalleryView, GridView, ListView } from "./views"

export type ViewMode = "grid" | "list" | "column" | "gallery"

type FileExplorerProps = {
  embedded?: boolean
  initialPath?: string[]
  /** Opens a desktop app window (Finder double-click). */
  onOpenApp?: (appId: string) => void
}

const DEFAULT_PATH = ["about", "about-readme"]

const containerStyle = (embedded: boolean): React.CSSProperties =>
  embedded ? { height: "100%", minHeight: 0 } : { height: "100dvh" }

const columnRowStyle: React.CSSProperties = { overflowX: "auto", overflowY: "hidden" }
const scrollableStyle: React.CSSProperties = { overflowY: "auto" }
const fixedColumnStyle: React.CSSProperties = { flexShrink: 0 }
const detailColumnStyle: React.CSSProperties = {
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 360,
}

function filterItems(items: FileSystemItem[], query: string): FileSystemItem[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return items
  return items.filter(item => item.name.toLowerCase().includes(trimmed))
}

function stopWindowDrag(event: React.MouseEvent | React.TouchEvent) {
  event.stopPropagation()
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  embedded = false,
  initialPath = DEFAULT_PATH,
  onOpenApp,
}) => {
  const [mounted, setMounted] = React.useState(false)
  const [selectedPath, setSelectedPath] = React.useState<string[]>(initialPath)
  const [pathHistory, setPathHistory] = React.useState<string[][]>([initialPath])
  const [historyIndex, setHistoryIndex] = React.useState(0)
  const [viewMode, setViewMode] = React.useState<ViewMode>("column")
  const [groupByType, setGroupByType] = React.useState(true)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [tagsOpen, setTagsOpen] = React.useState(false)
  const [moreOpen, setMoreOpen] = React.useState(false)
  const [shareMessage, setShareMessage] = React.useState<string | null>(null)
  const toolbarRef = React.useRef<HTMLDivElement>(null)

  const data = useStaticQuery(graphql`
    {
      allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
        edges {
          node {
            id
            frontmatter {
              date
              slug
              title
            }
          }
        }
      }
    }
  `)

  const filesystem = React.useMemo(() => {
    const blogPosts =
      data?.allMarkdownRemark?.edges?.map(
        ({
          node,
        }: {
          node: { id: string; frontmatter: { date: string; slug: string; title: string } }
        }) => ({
          id: node.id,
          title: node.frontmatter.title,
          slug: node.frontmatter.slug,
          date: node.frontmatter.date,
        })
      ) ?? []
    return buildFilesystem(blogPosts)
  }, [data])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!tagsOpen && !moreOpen) return
    const onDocClick = (event: MouseEvent) => {
      if (toolbarRef.current?.contains(event.target as Node)) return
      setTagsOpen(false)
      setMoreOpen(false)
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [tagsOpen, moreOpen])

  const navigateTo = (path: string[]) => {
    setSelectedPath(path)
    setHistoryIndex(currentIndex => {
      setPathHistory(previous => {
        const next = previous.slice(0, currentIndex + 1)
        next.push(path)
        return next
      })
      return currentIndex + 1
    })
  }

  const goBack = () => {
    if (historyIndex <= 0) return
    const nextIndex = historyIndex - 1
    setHistoryIndex(nextIndex)
    setSelectedPath(pathHistory[nextIndex])
  }

  const goForward = () => {
    if (historyIndex >= pathHistory.length - 1) return
    const nextIndex = historyIndex + 1
    setHistoryIndex(nextIndex)
    setSelectedPath(pathHistory[nextIndex])
  }

  const columns = React.useMemo(() => {
    const cols: { items: FileSystemItem[]; selectedId: string | null }[] = []
    cols.push({ items: filesystem, selectedId: selectedPath[0] ?? null })
    let currentItems = filesystem
    for (let index = 0; index < selectedPath.length; index++) {
      const selected = currentItems.find(item => item.id === selectedPath[index])
      if (selected?.children && selected.children.length > 0) {
        cols.push({
          items: selected.children,
          selectedId: selectedPath[index + 1] ?? null,
        })
        currentItems = selected.children
      } else {
        break
      }
    }
    return cols
  }, [filesystem, selectedPath])

  const currentFolderName = React.useMemo(() => {
    if (selectedPath.length === 0) return "Portfolio"
    const lastId = selectedPath[selectedPath.length - 1]
    const item = findItem(filesystem, lastId)
    if (item?.type === "folder") return item.name
    if (selectedPath.length >= 2) {
      const parent = findItem(filesystem, selectedPath[selectedPath.length - 2])
      return parent?.name ?? "Portfolio"
    }
    return "Portfolio"
  }, [filesystem, selectedPath])

  const selectedItem = React.useMemo(() => {
    if (selectedPath.length === 0) return null
    const lastId = selectedPath[selectedPath.length - 1]
    return findItem(filesystem, lastId)
  }, [filesystem, selectedPath])

  const currentFolderItems = React.useMemo(
    () => filterItems(getCurrentFolderItems(filesystem, selectedPath), searchQuery),
    [filesystem, selectedPath, searchQuery]
  )

  const showDetailPanel =
    selectedItem != null &&
    (selectedItem.type === "file" || selectedItem.contentType != null)

  const handleSelect = (columnIndex: number, itemId: string) => {
    navigateTo([...selectedPath.slice(0, columnIndex), itemId])
  }

  const handleFlatSelect = (itemId: string) => {
    const parentPath = selectedPath.length > 0 ? selectedPath.slice(0, -1) : []
    const lastId = selectedPath[selectedPath.length - 1]
    const lastItem = findItem(filesystem, lastId)
    const basePath =
      lastItem?.type === "folder" ? selectedPath : parentPath.length ? parentPath : []
    navigateTo([...basePath, itemId])
  }

  /** Double-click / Enter: open file in its app, link, or drill into folder. */
  const handleOpen = (columnIndex: number | null, itemId: string) => {
    const item = findItem(filesystem, itemId)
    if (!item) return

    const action = resolveOpenAction(item)
    switch (action.kind) {
      case "folder": {
        if (columnIndex == null) {
          handleFlatSelect(itemId)
        } else {
          handleSelect(columnIndex, itemId)
        }
        break
      }
      case "app":
        onOpenApp?.(action.appId)
        break
      case "url":
        window.open(action.url, "_blank", "noopener,noreferrer")
        break
      case "route":
        navigate(action.slug)
        break
      case "none":
        break
    }
  }

  const handleShare = async () => {
    const shareText = `Shravan Dhakal — ${currentFolderName}`
    const shareUrl = typeof window !== "undefined" ? window.location.href : ""
    try {
      if (navigator.share) {
        await navigator.share({ title: shareText, url: shareUrl })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        setShareMessage("Link copied!")
      }
    } catch {
      setShareMessage("Share cancelled")
    }
    setTimeout(() => setShareMessage(null), 2000)
  }

  const itemTags = getTagsForItem(selectedItem)

  if (!mounted) {
    return (
      <div
        style={{
          height: embedded ? "100%" : "100dvh",
          background: "var(--color-background-body)",
        }}
      />
    )
  }

  const toolbar = (
    <div ref={toolbarRef} onMouseDown={stopWindowDrag} onTouchStart={stopWindowDrag}>
      <Toolbar
        label={embedded ? "Finder" : "Shravan Dhakal"}
        size="sm"
        dividers={["bottom"]}
        startContent={
          <>
            <IconButton
              variant="ghost"
              size="sm"
              icon={<Icon icon={ChevronLeftIcon} size="sm" />}
              onClick={goBack}
              isDisabled={historyIndex <= 0}
              label="Go back"
            />
            <IconButton
              variant="ghost"
              size="sm"
              icon={<Icon icon={ChevronRightIcon} size="sm" />}
              onClick={goForward}
              isDisabled={historyIndex >= pathHistory.length - 1}
              label="Go forward"
            />
            <Text type="label">{currentFolderName}</Text>
          </>
        }
        centerContent={
          // Hidden on narrow windows — view switching stays available via the More menu.
          <div className="hidden sm:block">
          <SegmentedControl
            value={viewMode}
            onChange={value => setViewMode(value as ViewMode)}
            label="View mode"
          >
            <SegmentedControlItem
              value="grid"
              label="Grid"
              icon={<Icon icon={Squares2X2Icon} size="sm" />}
              isLabelHidden
            />
            <SegmentedControlItem
              value="list"
              label="List"
              icon={<Icon icon={Bars4Icon} size="sm" />}
              isLabelHidden
            />
            <SegmentedControlItem
              value="column"
              label="Column"
              icon={<Icon icon={ViewColumnsIcon} size="sm" />}
              isLabelHidden
            />
            <SegmentedControlItem
              value="gallery"
              label="Gallery"
              icon={<Icon icon={TableCellsIcon} size="sm" />}
              isLabelHidden
            />
          </SegmentedControl>
          </div>
        }
        endContent={
          <>
            {searchOpen ? (
              <TextInput
                label="Search files"
                isLabelHidden
                size="sm"
                width={140}
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Filter…"
                hasClear
              />
            ) : null}
            <div className="hidden sm:block">
              <IconButton
                variant={groupByType ? "primary" : "ghost"}
                size="sm"
                icon={<Icon icon={AdjustmentsHorizontalIcon} size="sm" />}
                label="Group by type"
                onClick={() => setGroupByType(value => !value)}
              />
            </div>
            <IconButton
              variant="ghost"
              size="sm"
              icon={<Icon icon={ShareIcon} size="sm" />}
              label="Share"
              onClick={handleShare}
            />
            <div className="relative">
              <IconButton
                variant={tagsOpen ? "primary" : "ghost"}
                size="sm"
                icon={<Icon icon={TagIcon} size="sm" />}
                label="Tags"
                onClick={() => {
                  setTagsOpen(open => !open)
                  setMoreOpen(false)
                }}
              />
              {tagsOpen && (
                <div
                  className="absolute right-0 top-full mt-1 z-50 rounded-lg border shadow-xl p-3 min-w-[180px]"
                  style={{
                    background: "var(--color-background-surface)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <Text type="label">Tags</Text>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {itemTags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "var(--color-background-muted)" }}
                        >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <IconButton
                variant={moreOpen ? "primary" : "ghost"}
                size="sm"
                icon={<Icon icon={EllipsisHorizontalIcon} size="sm" />}
                label="More"
                onClick={() => {
                  setMoreOpen(open => !open)
                  setTagsOpen(false)
                }}
              />
              {moreOpen && (
                <div
                  className="absolute right-0 top-full mt-1 z-50 rounded-lg border shadow-xl py-1 min-w-[160px]"
                  style={{
                    background: "var(--color-background-surface)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  {[
                    {
                      label: "Open",
                      action: () => {
                        if (selectedItem) handleOpen(null, selectedItem.id)
                        setMoreOpen(false)
                      },
                    },
                    {
                      label: "Copy name",
                      action: () => {
                        if (selectedItem) navigator.clipboard.writeText(selectedItem.name)
                        setMoreOpen(false)
                      },
                    },
                    {
                      label: "Icons",
                      action: () => {
                        setViewMode("grid")
                        setMoreOpen(false)
                      },
                    },
                    {
                      label: "List",
                      action: () => {
                        setViewMode("list")
                        setMoreOpen(false)
                      },
                    },
                    {
                      label: "Columns",
                      action: () => {
                        setViewMode("column")
                        setMoreOpen(false)
                      },
                    },
                  ].map(menuItem => (
                    <button
                      key={menuItem.label}
                      type="button"
                      className="block w-full text-left px-3 py-2 text-sm hover:opacity-80"
                      onClick={menuItem.action}
                    >
                      {menuItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <IconButton
              variant={searchOpen ? "primary" : "ghost"}
              size="sm"
              icon={<Icon icon={MagnifyingGlassIcon} size="sm" />}
              label="Search"
              onClick={() => setSearchOpen(open => !open)}
            />
          </>
        }
      />
      {shareMessage && (
        <div className="px-3 py-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>
          {shareMessage}
        </div>
      )}
    </div>
  )

  const flatViewProps = {
    items: currentFolderItems,
    selectedId: selectedPath[selectedPath.length - 1] ?? null,
    onSelect: handleFlatSelect,
    onOpen: (itemId: string) => handleOpen(null, itemId),
    groupByType,
  }

  const contentBody =
    viewMode === "column" ? (
      <HStack height="100%" style={columnRowStyle}>
        {columns.map((column, columnIndex) => {
          const filteredItems = filterItems(column.items, searchQuery)
          const showDivider = columnIndex < columns.length - 1 || showDetailPanel
          return (
            <Section
              key={columnIndex}
              width={240}
              padding={2}
              variant="transparent"
              dividers={showDivider ? ["end"] : undefined}
              style={{ ...scrollableStyle, ...fixedColumnStyle }}
            >
              <List density="compact" hasDividers={false}>
                {(groupByType
                  ? [
                      ...filteredItems.filter(item => item.type === "folder"),
                      ...filteredItems.filter(item => item.type === "file"),
                    ]
                  : [...filteredItems].sort((left, right) =>
                      left.name.localeCompare(right.name)
                    )
                ).map(item => {
                  const isSelected = column.selectedId === item.id
                  const hasChildren =
                    item.type === "folder" &&
                    item.children != null &&
                    item.children.length > 0
                  return (
                    <div
                      key={item.id}
                      onDoubleClick={event => {
                        event.preventDefault()
                        handleOpen(columnIndex, item.id)
                      }}
                    >
                      <ListItem
                        label={item.name}
                        startContent={
                          <Icon
                            icon={item.type === "folder" ? FolderIcon : DocumentIcon}
                            color={item.type === "folder" ? "accent" : "secondary"}
                            size="sm"
                          />
                        }
                        endContent={
                          hasChildren ? (
                            <Icon icon={ChevronRightIcon} size="xsm" color="secondary" />
                          ) : undefined
                        }
                        onClick={() => handleSelect(columnIndex, item.id)}
                        isSelected={isSelected}
                      />
                    </div>
                  )
                })}
              </List>
            </Section>
          )
        })}
        {showDetailPanel && selectedItem && (
          <Section
            padding={6}
            variant="transparent"
            style={{ ...scrollableStyle, ...detailColumnStyle }}
          >
            {selectedItem.contentType === "terminal" || selectedItem.contentType === "snake" ? (
              <DetailPanel selectedItem={selectedItem} />
            ) : (
              <VStack gap={4} hAlign="center">
                <Avatar name={selectedItem.name} size={96} />
                <VStack gap={1} hAlign="center">
                  <Text type="label">{selectedItem.name}</Text>
                  <Text type="supporting">
                    {getFileExtension(selectedItem.name)} Document
                  </Text>
                </VStack>
                <MetadataList title="Information">
                  <MetadataListItem label="Owner">Shravan Dhakal</MetadataListItem>
                  <MetadataListItem label="Kind">
                    {getFileExtension(selectedItem.name)} Document
                  </MetadataListItem>
                </MetadataList>
                <DetailPanel selectedItem={selectedItem} />
              </VStack>
            )}
          </Section>
        )}
      </HStack>
    ) : (
      <div style={{ ...scrollableStyle, height: "100%" }}>
        {viewMode === "list" && <ListView {...flatViewProps} />}
        {viewMode === "grid" && <GridView {...flatViewProps} />}
        {viewMode === "gallery" && <GalleryView {...flatViewProps} />}
        {showDetailPanel && selectedItem && viewMode !== "gallery" && (
          <Section padding={4} variant="transparent">
            <DetailPanel selectedItem={selectedItem} />
          </Section>
        )}
      </div>
    )

  return (
    <Layout
      style={containerStyle(embedded)}
      height="fill"
      header={toolbar}
      content={
        <LayoutContent padding={0} isScrollable={false}>
          {contentBody}
        </LayoutContent>
      }
    />
  )
}
