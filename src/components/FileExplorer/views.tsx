import { Icon } from "@astryxdesign/core/Icon"
import { List, ListItem } from "@astryxdesign/core/List"
import { Text } from "@astryxdesign/core/Text"
import { ChevronRightIcon, DocumentIcon } from "@heroicons/react/24/outline"
import { FolderIcon } from "@heroicons/react/24/solid"
import * as React from "react"
import { isCoarsePointer } from "../../utils/device"
import type { FileSystemItem } from "./filesystem"

/** Single-line label with ellipsis — long names never wrap (macOS Finder convention). */
const ItemName: React.FC<{ name: string; type: "supporting" | "label" }> = ({
  name,
  type,
}) => (
  <span
    title={name}
    style={{
      display: "block",
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      textAlign: "center",
    }}
  >
    <Text type={type}>{name}</Text>
  </span>
)

/** Touch devices: single tap opens (iOS Files convention). Desktop: click selects. */
function handleItemClick(
  itemId: string,
  onSelect: (itemId: string) => void,
  onOpen: (itemId: string) => void
) {
  if (isCoarsePointer()) onOpen(itemId)
  else onSelect(itemId)
}

type ItemViewProps = {
  items: FileSystemItem[]
  selectedId: string | null
  onSelect: (itemId: string) => void
  onOpen: (itemId: string) => void
  groupByType: boolean
}

function sortItems(items: FileSystemItem[], groupByType: boolean): FileSystemItem[] {
  const sorted = [...items].sort((left, right) => left.name.localeCompare(right.name))
  if (!groupByType) return sorted
  return [
    ...sorted.filter(item => item.type === "folder"),
    ...sorted.filter(item => item.type === "file"),
  ]
}

export const ListView: React.FC<ItemViewProps> = ({
  items,
  selectedId,
  onSelect,
  onOpen,
  groupByType,
}) => (
  <List density="compact" hasDividers={false}>
    {sortItems(items, groupByType).map(item => (
      <div
        key={item.id}
        onDoubleClick={event => {
          event.preventDefault()
          onOpen(item.id)
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
            item.type === "folder" && item.children?.length ? (
              <Icon icon={ChevronRightIcon} size="xsm" color="secondary" />
            ) : undefined
          }
          onClick={() => handleItemClick(item.id, onSelect, onOpen)}
          isSelected={selectedId === item.id}
        />
      </div>
    ))}
  </List>
)

export const GridView: React.FC<ItemViewProps> = ({
  items,
  selectedId,
  onSelect,
  onOpen,
  groupByType,
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))",
      gap: 8,
      padding: 8,
    }}
  >
    {sortItems(items, groupByType).map(item => (
      <button
        key={item.id}
        type="button"
        onClick={() => handleItemClick(item.id, onSelect, onOpen)}
        onDoubleClick={event => {
          event.preventDefault()
          onOpen(item.id)
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          padding: "10px 6px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          touchAction: "manipulation",
          background:
            selectedId === item.id ? "var(--color-background-muted)" : "transparent",
        }}
      >
        <Icon
          icon={item.type === "folder" ? FolderIcon : DocumentIcon}
          color={item.type === "folder" ? "accent" : "secondary"}
          size="md"
        />
        <ItemName name={item.name} type="supporting" />
      </button>
    ))}
  </div>
)

export const GalleryView: React.FC<ItemViewProps> = ({
  items,
  selectedId,
  onSelect,
  onOpen,
  groupByType,
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
      gap: 12,
      padding: 12,
    }}
  >
    {sortItems(items, groupByType).map(item => (
      <button
        key={item.id}
        type="button"
        onClick={() => handleItemClick(item.id, onSelect, onOpen)}
        onDoubleClick={event => {
          event.preventDefault()
          onOpen(item.id)
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          padding: 16,
          borderRadius: 12,
          border: "none",
          cursor: "pointer",
          touchAction: "manipulation",
          background:
            selectedId === item.id ? "var(--color-background-muted)" : "transparent",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            background: "var(--color-background-muted)",
          }}
        >
          <Icon
            icon={item.type === "folder" ? FolderIcon : DocumentIcon}
            color={item.type === "folder" ? "accent" : "secondary"}
            size="lg"
          />
        </div>
        <ItemName name={item.name} type="label" />
      </button>
    ))}
  </div>
)
