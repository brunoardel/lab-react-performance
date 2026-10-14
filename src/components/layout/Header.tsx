import { Cpu, Zap, Activity } from 'lucide-react'
import { RenderCounter } from '../common/RenderCounter'

interface HeaderProps {
  currentTabLabel: string
  rfCode: string
}

export function Header({ currentTabLabel, rfCode }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white sm:text-base text-sm">
                ArqLab
              </span>
              <span className="rounded bg-cyan-950/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-400 border border-cyan-800/50">
                Viability Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Laboratório de Performance React Sênior
            </p>
          </div>
        </div>

        {/* Center Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 rounded-lg bg-slate-900/90 px-3 py-1.5 border border-slate-800 text-xs">
          <span className="font-mono text-cyan-400 font-semibold">{rfCode}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200 font-medium">{currentTabLabel}</span>
        </div>

        {/* Live System Telemetry / Indicators */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-lg bg-slate-900/90 px-3 py-1.5 border border-slate-800/80 text-xs text-slate-300">
            <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-slate-400">Strict Mode:</span>
            <span className="font-mono font-medium text-emerald-400">ON</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/90 px-3 py-1.5 border border-slate-800/80 text-xs">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-400 hidden sm:inline">Header:</span>
            <RenderCounter componentName="H" />
          </div>
        </div>
      </div>
    </header>
  )
}
