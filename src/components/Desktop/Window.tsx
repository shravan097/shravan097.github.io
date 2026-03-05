import * as React from "react"

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
  const [pos, setPos] = React.useState({ x: defaultX, y: defaultY })
  const [size, setSize] = React.useState({ w: defaultWidth, h: defaultHeight })
  const dragging = React.useRef(false)
  const dragOffset = React.useRef({ x: 0, y: 0 })
  const touchId = React.useRef<number | null>(null)

  const clampPos = React.useCallback((x: number, y: number) => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1024
    const vh = typeof window !== "undefined" ? window.innerHeight : 768
    const margin = 8
    const maxX = Math.max(0, vw - size.w - margin)
    const maxY = Math.max(0, vh - size.h - margin - 32)
    return {
      x: Math.max(margin, Math.min(x, maxX)),
      y: Math.max(margin, Math.min(y, maxY)),
    }
  }, [size.w, size.h])

  React.useEffect(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1024
    const vh = typeof window !== "undefined" ? window.innerHeight : 768
    const maxW = Math.min(defaultWidth, vw - 16)
    const maxH = Math.min(defaultHeight, vh - 80)
    setSize({ w: maxW, h: maxH })
    setPos(prev => clampPos(prev.x, prev.y))
  }, [defaultWidth, defaultHeight, clampPos])

  const onTitleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    e.preventDefault()
  }

  const onTitleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    dragging.current = true
    touchId.current = e.touches[0].identifier
    dragOffset.current = {
      x: e.touches[0].clientX - pos.x,
      y: e.touches[0].clientY - pos.y,
    }
  }

  const onTitleTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current || touchId.current === null) return
    const t = Array.from(e.touches).find(touch => touch.identifier === touchId.current)
    if (!t) return
    e.preventDefault()
    const next = clampPos(t.clientX - dragOffset.current.x, t.clientY - dragOffset.current.y)
    setPos(next)
  }

  const onTitleTouchEnd = () => {
    dragging.current = false
    touchId.current = null
  }

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const next = clampPos(e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y)
      setPos(next)
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
        maxWidth: "calc(100vw - 16px)",
        maxHeight: "calc(100vh - 80px)",
        zIndex,
      }}
      onMouseDown={onFocus}
    >
      <div
        className="flex flex-col rounded-xl overflow-hidden shadow-2xl border border-slate-700/60"
        style={{ height: "100%", background: "#0f172a" }}
      >
        {/* macOS-style title bar — mouse + touch drag */}
        <div
          className="flex items-center px-2 sm:px-3 h-9 sm:h-9 min-h-[44px] cursor-move select-none flex-shrink-0 touch-none"
          style={{ background: "#1e293b", borderBottom: "1px solid rgba(51,65,85,0.8)" }}
          onMouseDown={onTitleMouseDown}
          onTouchStart={onTitleTouchStart}
          onTouchMove={onTitleTouchMove}
          onTouchEnd={onTitleTouchEnd}
          onTouchCancel={onTitleTouchEnd}
        >
          <div className="flex gap-1.5 sm:gap-2 items-center flex-shrink-0">
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={onClose}
              className="w-8 h-8 sm:w-3 sm:h-3 rounded-full hover:opacity-80 transition-opacity flex items-center justify-center flex-shrink-0"
              style={{ background: "#ef4444" }}
              title="Close"
              type="button"
              aria-label="Close window"
            >
              <span className="text-red-900 font-bold text-xs leading-none">✕</span>
            </button>
            <div className="w-3 h-3 rounded-full hidden sm:block" style={{ background: "#eab308" }} />
            <div className="w-3 h-3 rounded-full hidden sm:block" style={{ background: "#22c55e" }} />
          </div>
          <div className="flex-1 flex items-center justify-center gap-1.5 pointer-events-none min-w-0 px-1">
            <span className="text-sm leading-none flex-shrink-0">{icon}</span>
            <span className="text-xs sm:text-sm text-slate-300 font-mono truncate">{title}</span>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto min-h-0 text-slate-100 text-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
