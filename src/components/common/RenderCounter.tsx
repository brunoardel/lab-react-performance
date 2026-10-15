import { createContext, useContext, useRef, useEffect } from 'react'

export const RenderResetContext = createContext<number>(0)

interface RenderCounterProps {
  componentName?: string
  variant?: 'compact' | 'pill' | 'badge'
  className?: string
  resetKey?: number
}

/**
 * RenderCounter com Suporte a Reset Real (0 Renders Inicial/Reset).
 * - Utiliza RenderResetContext para zerar todos os contadores simultaneamente.
 * - Elimina a duplicação do React StrictMode.
 * - Animação de flash aplicada via DOM direto (sem useState).
 */
export function RenderCounter({
  componentName,
  variant = 'compact',
  className = '',
  resetKey,
}: RenderCounterProps) {
  const contextResetKey = useContext(RenderResetContext)
  const activeResetKey = resetKey !== undefined ? resetKey : contextResetKey

  const renders = useRef(0)
  const isFirstMount = useRef(true)
  const lastResetKey = useRef(activeResetKey)
  const domRef = useRef<HTMLSpanElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)

  // Quando a chave de reset muda, zera a contagem e reseta o baseline
  if (lastResetKey.current !== activeResetKey) {
    lastResetKey.current = activeResetKey
    renders.current = 0
    isFirstMount.current = true
  }

  useEffect(() => {
    // Na primeira montagem após um reset, mantemos em 0 para demonstrar estado limpo
    if (isFirstMount.current) {
      isFirstMount.current = false
      if (countRef.current) {
        countRef.current.textContent = '0'
      }
      return
    }

    // A cada re-render subsequente efetivamente commitado no DOM:
    renders.current += 1
    if (countRef.current) {
      countRef.current.textContent = String(renders.current)
    }

    const el = domRef.current
    if (el) {
      el.classList.add('ring-2', 'ring-amber-400', 'bg-amber-500/30', 'scale-105')
      const timer = setTimeout(() => {
        el.classList.remove('ring-2', 'ring-amber-400', 'bg-amber-500/30', 'scale-105')
      }, 200)
      return () => clearTimeout(timer)
    }
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
        <span ref={countRef} className="font-bold text-white">
          {renders.current}
        </span>
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
      <span ref={countRef} className="font-bold text-slate-200">
        {renders.current}
      </span>
    </span>
  )
}
