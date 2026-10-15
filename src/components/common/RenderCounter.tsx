import { useRef, useEffect } from 'react'

interface RenderCounterProps {
  componentName?: string
  variant?: 'compact' | 'pill' | 'badge'
  className?: string
}

/**
 * RenderCounter de Alta Precisão (Zero State Overhead).
 * NÃO utiliza useState interno para evitar auto-re-renders.
 * O efeito visual de 'flash' é aplicado diretamente no nó DOM via CSS.
 */
export function RenderCounter({
  componentName,
  variant = 'compact',
  className = '',
}: RenderCounterProps) {
  const renders = useRef(0)
  renders.current += 1

  const domRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = domRef.current
    if (!el) return

    // Animação de flash direto via DOM - sem re-render do React!
    el.classList.add('ring-2', 'ring-amber-400', 'bg-amber-500/30', 'scale-105')
    const timer = setTimeout(() => {
      el.classList.remove('ring-2', 'ring-amber-400', 'bg-amber-500/30', 'scale-105')
    }, 200)

    return () => clearTimeout(timer)
  })

  if (variant === 'pill') {
    return (
      <span
        ref={domRef}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700/60 transition-transform duration-150 ${className}`}
        title={`Renderizações: ${renders.current}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        {componentName && <span className="opacity-75">{componentName}:</span>}
        <span className="font-bold text-white">{renders.current}</span>
        <span className="text-[10px] text-slate-400">renders</span>
      </span>
    )
  }

  return (
    <span
      ref={domRef}
      className={`inline-flex items-center gap-1 text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700/60 transition-transform duration-150 ${className}`}
      title={`Contador de renderizações: ${renders.current}`}
    >
      <span className="text-[10px] uppercase tracking-wider text-slate-400">R:</span>
      <span className="font-bold text-slate-200">{renders.current}</span>
    </span>
  )
}
