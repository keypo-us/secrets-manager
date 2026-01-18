"use client"

import type { ReactNode } from "react"

interface HudFrameProps {
  children: ReactNode
  title?: string
  className?: string
}

export function HudFrame({ children, title, className = "" }: HudFrameProps) {
  return (
    <div className={`relative border border-orange-500/50 bg-black/80 backdrop-blur-sm ${className}`}>
      {/* Corner decorations */}
      <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-orange-400"></div>
      <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-orange-400"></div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-orange-400"></div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-orange-400"></div>

      {title && <div className="absolute -top-3 left-4 bg-black px-2 text-orange-400 text-xs font-mono">{title}</div>}

      <div className="p-6">{children}</div>
    </div>
  )
}
