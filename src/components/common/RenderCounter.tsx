import { useRef, useEffect, useState } from 'react'

interface RenderCounterProps {
  componentName?: string
  variant?: 'compact' | 'pill' | 'badge'
  className?: string
}

export function RenderCounter({
  componentName,
  variant = 'compact',
  className = '',
}: RenderCounterProps) {
  const renders = useRef(0)
  renders.current += 1

  const [flashing, setFlashing] = useState(false)

  useEffect(() => {
    setFlashing(true)
    const timer = setTimeout(() => setFlashing(false), 250)
    return () => clearTimeout(timer)
  }, [renders.current])

  if (variant === 'pill') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-medium transition-all duration-200 ${
          flashing
            ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.35)]'
            : 'bg-slate-800 text-slate-400 border border-slate-700/60'
        } ${className}`}
        title={`Renderizações: ${renders.current}`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            flashing ? 'bg-amber-400 animate-ping' : 'bg-slate-500'
          }`}
        />
        {componentName && <span className="opacity-75">{componentName}:</span>}
        <span>{renders.current} renders</span>
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-mono px-1.5 py-0.5 rounded transition-all duration-200 ${
        flashing
          ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/80'
          : 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
      } ${className}`}
      title={`Contador de renderizações: ${renders.current}`}
    >
      <span className="text-[10px] uppercase tracking-wider text-slate-400">R:</span>
      <span className="font-semibold text-slate-200">{renders.current}</span>
    </span>
  )
}
