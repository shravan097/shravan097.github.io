import * as React from "react"
import { DOCK_CLEARANCE, MENUBAR_HEIGHT, WINDOW_MARGIN } from "./layout"

type WindowProps = {
  id: string
  title: string
  icon: string
  defaultX: number
  defaultY: number
  defaultWidth: number
  defaultHeight: number
  zIndex: number
  onClose: () => void
  onFocus: () => void
  children: React.ReactNode
}

export const Window: React.FC<WindowProps> = ({
  title,
  icon,
  defaultX,
  defaultY,
  defaultWidth,
  defaultHeight,
  zIndex,
  onClose,
  onFocus,
  children,
}) => {
  const [pos, setPos] = React.useState({ x: defaultX, y: Math.max(defaultY, MENUBAR_HEIGHT) })
  const [size, setSize] = React.useState({ w: defaultWidth, h: defaultHeight })
  const dragging = React.useRef(false)
  const dragOffset = React.useRef({ x: 0, y: 0 })
  const touchId = React.useRef<number | null>(null)

  const clampPos = React.useCallback(
    (x: number, y: number) => {
      const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1024
      const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 768
      const maxX = Math.max(WINDOW_MARGIN, viewportWidth - size.w - WINDOW_MARGIN)
      const maxY = Math.max(
        MENUBAR_HEIGHT,
        viewportHeight - size.h - DOCK_CLEARANCE
      )
      return {
        x: Math.max(WINDOW_MARGIN, Math.min(x, maxX)),
        y: Math.max(MENUBAR_HEIGHT, Math.min(y, maxY)),
      }
    },
    [size.w, size.h]
  )

  React.useEffect(() => {
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1024
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 768
    const maxWidth = Math.min(defaultWidth, viewportWidth - WINDOW_MARGIN * 2)
    const maxHeight = Math.min(
      defaultHeight,
      viewportHeight - MENUBAR_HEIGHT - DOCK_CLEARANCE
    )
    setSize({ w: maxWidth, h: maxHeight })
    setPos(previous => clampPos(previous.x, previous.y))
  }, [defaultWidth, defaultHeight, clampPos])

  const onTitleMouseDown = (event: React.MouseEvent) => {
    dragging.current = true
    dragOffset.current = { x: event.clientX - pos.x, y: event.clientY - pos.y }
    event.preventDefault()
  }

  const onTitleTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length !== 1) return
    dragging.current = true
    touchId.current = event.touches[0].identifier
    dragOffset.current = {
      x: event.touches[0].clientX - pos.x,
      y: event.touches[0].clientY - pos.y,
    }
  }

  const onTitleTouchMove = (event: React.TouchEvent) => {
    if (!dragging.current || touchId.current === null) return
    const touch = Array.from(event.touches).find(
      candidate => candidate.identifier === touchId.current
    )
    if (!touch) return
    event.preventDefault()
    setPos(
      clampPos(touch.clientX - dragOffset.current.x, touch.clientY - dragOffset.current.y)
    )
  }

  const onTitleTouchEnd = () => {
    dragging.current = false
    touchId.current = null
  }

  React.useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (!dragging.current) return
      setPos(
        clampPos(event.clientX - dragOffset.current.x, event.clientY - dragOffset.current.y)
      )
    }
    const onMouseUp = () => {
      dragging.current = false
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [clampPos])

  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        maxWidth: `calc(100vw - ${WINDOW_MARGIN * 2}px)`,
        maxHeight: `calc(100vh - ${MENUBAR_HEIGHT + DOCK_CLEARANCE}px)`,
        zIndex,
        pointerEvents: "auto",
      }}
      onMouseDown={onFocus}
    >
      <div
        className="flex flex-col rounded-xl overflow-hidden shadow-2xl border"
        style={{
          height: "100%",
          background: "var(--color-background-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div
          className="flex items-center px-2 sm:px-3 h-9 sm:h-9 min-h-[44px] cursor-move select-none flex-shrink-0 touch-none"
          style={{
            background: "var(--color-background-muted)",
            borderBottom: "1px solid var(--color-border)",
          }}
          onMouseDown={onTitleMouseDown}
          onTouchStart={onTitleTouchStart}
          onTouchMove={onTitleTouchMove}
          onTouchEnd={onTitleTouchEnd}
          onTouchCancel={onTitleTouchEnd}
        >
          <div className="flex gap-1.5 sm:gap-2 items-center flex-shrink-0">
            <button
              onMouseDown={event => event.stopPropagation()}
              onClick={onClose}
              className="w-8 h-8 sm:w-3 sm:h-3 rounded-full hover:opacity-80 transition-opacity flex items-center justify-center flex-shrink-0"
              style={{ background: "#ef4444" }}
              title="Close"
              type="button"
              aria-label="Close window"
            >
              <span className="text-red-900 font-bold text-xs leading-none">✕</span>
            </button>
            <div
              className="w-3 h-3 rounded-full hidden sm:block"
              style={{ background: "#eab308" }}
            />
            <div
              className="w-3 h-3 rounded-full hidden sm:block"
              style={{ background: "#22c55e" }}
            />
          </div>
          <div className="flex-1 flex items-center justify-center gap-1.5 pointer-events-none min-w-0 px-1">
            <span className="text-sm leading-none flex-shrink-0">{icon}</span>
            <span className="text-xs sm:text-sm dark:text-slate-300 text-slate-600 font-mono truncate">
              {title}
            </span>
          </div>
        </div>

        <div
          className="flex-1 overflow-auto min-h-0 text-sm"
          style={{ color: "var(--color-text-primary)" }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
