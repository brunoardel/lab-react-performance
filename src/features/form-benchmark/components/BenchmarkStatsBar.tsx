import { Badge } from '../../../components/common/Badge'
import { Card } from '../../../components/common/Card'
import { Cpu, Zap, Activity, Play, Sparkles } from 'lucide-react'

interface BenchmarkStatsBarProps {
  currentMode: 'controlled' | 'optimized'
  onToggleMode: (mode: 'controlled' | 'optimized') => void
  onRunStressTest: () => void
  isStressTesting: boolean
}

export function BenchmarkStatsBar({
  currentMode,
  onToggleMode,
  onRunStressTest,
  isStressTesting,
}: BenchmarkStatsBarProps) {
  return (
    <Card className="border-slate-800 bg-slate-900/80 p-5 space-y-4">
      {/* Top Switcher & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
            Comparativo Arquitetural
          </span>
          <h3 className="text-lg font-bold text-white">
            Seletor de Modo de Renderização
          </h3>
          <p className="text-xs text-slate-400">
            Alterne entre as estratégias para observar o comportamento dos contadores visuais de renderização.
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => onToggleMode('controlled')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                currentMode === 'controlled'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Modo A (useState)</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleMode('optimized')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                currentMode === 'optimized'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Modo B (RHF + Zod)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onRunStressTest}
            disabled={isStressTesting}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all shadow-md ${
              isStressTesting
                ? 'border-amber-500/50 bg-amber-500/20 text-amber-300 animate-pulse'
                : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400'
            }`}
            title="Simula 20 teclas rápidas digitadas para testar a sobrecarga do reconciliador"
          >
            {isStressTesting ? (
              <>
                <Activity className="h-3.5 w-3.5 animate-spin" />
                <span>Simulando digitação...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                <span>Stress Test (20 teclas)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comparison Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="rounded-lg bg-slate-950/70 border border-slate-800/80 p-3">
          <div className="text-slate-400 text-[11px] mb-1">Estratégia de Estado</div>
          <div className="font-semibold text-slate-100 flex items-center gap-1.5">
            {currentMode === 'controlled' ? (
              <>
                <span className="h-2 w-2 rounded-full bg-rose-400"></span>
                <span>Controlado na Raiz</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>Não-Controlado (Refs)</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {currentMode === 'controlled' ? 'useState raiz unificado' : 'react-hook-form registro'}
          </span>
        </div>

        <div className="rounded-lg bg-slate-950/70 border border-slate-800/80 p-3">
          <div className="text-slate-400 text-[11px] mb-1">Custo por Tecla</div>
          <div className="font-semibold font-mono text-slate-100 flex items-center gap-1.5">
            {currentMode === 'controlled' ? (
              <span className="text-rose-400 font-bold">28+ Renders / tecla</span>
            ) : (
              <span className="text-emerald-400 font-bold">0 Renders da Árvore</span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {currentMode === 'controlled' ? 'Toda a árvore recalcula' : 'DOM nativo isolado'}
          </span>
        </div>

        <div className="rounded-lg bg-slate-950/70 border border-slate-800/80 p-3">
          <div className="text-slate-400 text-[11px] mb-1">Validação de Tipos</div>
          <div className="font-semibold text-slate-100 flex items-center gap-1.5">
            {currentMode === 'controlled' ? (
              <span className="text-amber-300">Manual / HTML5</span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Zod Schema Estrito
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {currentMode === 'controlled' ? 'Sem schema estrito' : 'Zod parse em tempo real'}
          </span>
        </div>

        <div className="rounded-lg bg-slate-950/70 border border-slate-800/80 p-3">
          <div className="text-slate-400 text-[11px] mb-1">Fluidez de Digitação</div>
          <div className="font-semibold text-slate-100 flex items-center gap-1.5">
            {currentMode === 'controlled' ? (
              <Badge variant="rose">CPU bound (Queda de FPS)</Badge>
            ) : (
              <Badge variant="emerald">60 FPS constante</Badge>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {currentMode === 'controlled' ? 'Reconciliação excessiva' : 'Sem bloqueio de thread'}
          </span>
        </div>
      </div>
    </Card>
  )
}
