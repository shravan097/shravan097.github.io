import * as React from "react"
import { isCoarsePointer } from "../../utils/device"

type DesktopIconProps = {
  icon: string
  label: string
  onOpen: () => void
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onOpen }) => {
  const [isSelected, setIsSelected] = React.useState(false)

  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center cursor-pointer select-none w-16 sm:w-20 min-h-[56px] sm:min-h-0 transition-all duration-150 touch-manipulation active:scale-95 p-2 rounded-lg border-0 bg-transparent ${
        isSelected
          ? "bg-indigo-500/30 ring-1 ring-indigo-400/60"
          : "hover:bg-white/10 active:bg-white/15"
      }`}
      onClick={() => {
        // Touch devices: single tap opens (no double-tap needed).
        if (isCoarsePointer()) {
          onOpen()
          return
        }
        setIsSelected(true)
      }}
      onDoubleClick={() => {
        onOpen()
        setIsSelected(false)
      }}
      onBlur={() => setIsSelected(false)}
      title={label}
    >
      <span className="text-3xl sm:text-4xl leading-none mb-0.5 sm:mb-1 drop-shadow-lg">
        {icon}
      </span>
      <span
        className="text-white text-[10px] sm:text-xs text-center font-mono font-medium leading-tight block w-full truncate"
        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
      >
        {label}
      </span>
    </button>
  )
}
