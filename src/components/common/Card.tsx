import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
}

export function Card({ children, className = '', glow = false }: CardProps) {
  return (
    <div
      className={`relative rounded-xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm p-5 shadow-lg transition-all ${
        glow ? 'shadow-cyan-950/40 ring-1 ring-cyan-500/20' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
