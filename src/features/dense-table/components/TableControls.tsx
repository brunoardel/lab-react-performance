import { Search, Sparkles, AlertCircle, Cpu, Zap, Activity } from 'lucide-react'
import type { ViabilityStatus } from '../types/scenario'
import { Badge } from '../../../components/common/Badge'
import { RenderCounter } from '../../../components/common/RenderCounter'

interface TableControlsProps {
  searchInput: string
  onSearchChange: (value: string) => void
  isPending: boolean
  useTransitionsEnabled: boolean
  onToggleUseTransitions: (enabled: boolean) => void
  isVirtualized: boolean
  onToggleVirtualized: (virtualized: boolean) => void
  heavyFilterEnabled: boolean
  onToggleHeavyFilter: (enabled: boolean) => void
  statusFilter: ViabilityStatus | 'Todos'
  onStatusFilterChange: (status: ViabilityStatus | 'Todos') => void
  totalCount: number
  filteredCount: number
}

export function TableControls({
  searchInput,
  onSearchChange,
  isPending,
  useTransitionsEnabled,
  onToggleUseTransitions,
  isVirtualized,
  onToggleVirtualized,
  heavyFilterEnabled,
  onToggleHeavyFilter,
  statusFilter,
  onStatusFilterChange,
  totalCount,
  filteredCount,
}: TableControlsProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 backdrop-blur-sm shadow-md">
      {/* Linha Superior: Barra de Busca com Concorrência e Feedback isPending */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Input de Busca com indicador de prioridade */}
        <div className="relative flex-1 max-w-lg">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome, código (ex: CEN-0042), zona ou bairro..."
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 pl-10 pr-24 py-2.5 text-xs sm:text-sm font-sans text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
          />

          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <RenderCounter componentName="Search" variant="compact" />
          </div>
        </div>

        {/* Indicador de Processamento em Background (useTransition isPending) */}
        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="flex items-center gap-2 rounded-lg bg-cyan-950/80 border border-cyan-800 px-3 py-1.5 text-xs text-cyan-300 shadow-sm animate-pulse">
              <Activity className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
              <span className="font-mono text-[11px] font-semibold">
                isPending: filtrando 2.500 registros em background...
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>Input responsivo a 60 FPS</span>
            </div>
          )}

          <div className="text-xs font-mono text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-cyan-400 font-bold">{filteredCount.toLocaleString('pt-BR')}</span>
            <span className="text-slate-500"> / </span>
            <span className="text-slate-400">{totalCount.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* Linha Intermediária: Switches Arquiteturais (Virtualização e useTransition) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          {/* Switch de Virtualização (RF02) */}
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => onToggleVirtualized(false)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                !isVirtualized
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
              <span>Sem Virtualização (2.500 no DOM)</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleVirtualized(true)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isVirtualized
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              <span>TanStack Virtual (Otimizado)</span>
            </button>
          </div>

          {/* Switch de Concorrência useTransition (RF03) */}
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => onToggleUseTransitions(false)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                !useTransitionsEnabled
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="h-3.5 w-3.5 text-rose-400" />
              <span>Síncrono (Bloqueante)</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleUseTransitions(true)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                useTransitionsEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>useTransition (Concorrente)</span>
            </button>
          </div>
        </div>

        {/* Toggle de Carga Computacional Adicional */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700">
            <input
              type="checkbox"
              checked={heavyFilterEnabled}
              onChange={(e) => onToggleHeavyFilter(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 h-3.5 w-3.5"
            />
            <span>Cálculo Paramétrico Pesado</span>
            {heavyFilterEnabled ? (
              <Badge variant="amber" size="sm">CPU Intensivo</Badge>
            ) : (
              <Badge variant="slate" size="sm">Padrão</Badge>
            )}
          </label>
        </div>
      </div>

      {/* Linha Inferior: Filtros Rápidos por Status de Viabilidade */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 overflow-x-auto text-xs">
        <span className="text-slate-400 text-[11px] font-mono mr-1">Status:</span>
        {(['Todos', 'Viavel', 'Atencao', 'Inviavel'] as const).map((status) => {
          const isSelected = statusFilter === status
          return (
            <button
              key={status}
              onClick={() => onStatusFilterChange(status)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'bg-slate-950/70 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {status === 'Todos' && 'Todos os Cenários'}
              {status === 'Viavel' && 'Apenas Viáveis'}
              {status === 'Atencao' && 'Com Atenção'}
              {status === 'Inviavel' && 'Inviáveis'}
            </button>
          )
        })}
      </div>
    </div>
  )
}
