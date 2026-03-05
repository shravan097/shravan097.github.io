import * as React from "react"

type DesktopIconProps = {
  icon: string
  label: string
  onOpen: () => void
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onOpen }) => {
  const [selected, setSelected] = React.useState(false)
  const [isTouch, setIsTouch] = React.useState(false)
  const clickCount = React.useRef(0)
  const clickTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    setIsTouch(typeof window !== "undefined" && "ontouchstart" in window)
  }, [])

  const handleClick = () => {
    if (isTouch) {
      onOpen()
      return
    }
    clickCount.current += 1
    if (clickCount.current === 1) {
      setSelected(true)
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0
      }, 300)
    } else if (clickCount.current === 2) {
      if (clickTimer.current) clearTimeout(clickTimer.current)
      clickCount.current = 0
      setSelected(false)
      onOpen()
    }
  }

  return (
    <div
      className={`flex flex-col items-center cursor-default p-2 sm:p-2 rounded-lg select-none w-16 sm:w-20 min-h-[56px] sm:min-h-0 transition-all duration-150 touch-manipulation ${
        selected ? "bg-indigo-500/30 ring-1 ring-indigo-400/60" : "hover:bg-white/10 active:bg-white/15"
      }`}
      onClick={handleClick}
      onBlur={() => setSelected(false)}
      tabIndex={0}
      role="button"
    >
      <span className="text-3xl sm:text-4xl leading-none mb-0.5 sm:mb-1 drop-shadow-lg">{icon}</span>
      <span
        className="text-white text-[10px] sm:text-xs text-center font-mono leading-tight"
        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
      >
        {label}
      </span>
    </div>
  )
}
