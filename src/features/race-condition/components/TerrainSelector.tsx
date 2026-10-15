import { useState } from 'react'
import type { TerrainId } from '../types/terrain'
import { TERRAIN_LIST } from '../services/terrainApi'
import { Card } from '../../../components/common/Card'
import { Badge } from '../../../components/common/Badge'
import { Zap, Clock, RotateCcw, Play, Check } from 'lucide-react'

interface TerrainSelectorProps {
  selectedId: TerrainId
  onSelect: (id: TerrainId) => void
  onSimulateRaceCondition: () => void
  isSimulating: boolean
  latencies: Record<TerrainId, number>
  onUpdateLatency: (id: TerrainId, latencyMs: number) => void
  onResetLatencies: () => void
  isPendingRequest: boolean
}

export function TerrainSelector({
  selectedId,
  onSelect,
  onSimulateRaceCondition,
  isSimulating,
  latencies,
  onUpdateLatency,
  onResetLatencies,
  isPendingRequest,
}: TerrainSelectorProps) {
  const [showLatencyControls, setShowLatencyControls] = useState(false)

  return (
    <Card className="border-slate-800 bg-slate-900/60 p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Seletor de Terrenos Urbanísticos</span>
            <Badge variant="cyan" size="sm">
              API Mock
            </Badge>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Clique nos terrenos para requisitar seus parâmetros ou dispare o teste automatizado de colisão.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isPendingRequest && (
            <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Rede Ocupada
            </span>
          )}
          <button
            onClick={() => setShowLatencyControls(!showLatencyControls)}
            className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Ajustar latências simuladas da rede"
          >
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>{showLatencyControls ? 'Ocultar Latências' : 'Ajustar Latências'}</span>
          </button>
        </div>
      </div>

      {/* Botão de Disparo Rápido do PRD */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/20 rounded-xl p-3.5 border border-cyan-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-400 animate-pulse" />
              Cenário Crítico do PRD (RF04)
            </span>
            <Badge variant="amber" size="sm">
              A (2.0s) ➔ B (0.5s)
            </Badge>
          </div>
          <p className="text-xs text-slate-300">
            Dispara Terreno A (lento) e imediatamente (150ms) Terreno B (rápido).
          </p>
        </div>

        <button
          onClick={onSimulateRaceCondition}
          disabled={isSimulating}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-[0.98] shadow-md shadow-cyan-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {isSimulating ? (
            <>
              <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Disparando Requisições...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Simular Disparo Rápido (A ➔ B)</span>
            </>
          )}
        </button>
      </div>

      {/* Grid de Terrenos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TERRAIN_LIST.map((terrain) => {
          const isSelected = selectedId === terrain.id
          const currentLatency = latencies[terrain.id] ?? terrain.defaultLatencyMs

          return (
            <button
              key={terrain.id}
              onClick={() => onSelect(terrain.id)}
              className={`relative text-left p-3.5 rounded-lg border transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-950/30 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-500/40'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] font-bold text-cyan-400">
                    {terrain.codigo}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      currentLatency >= 1500
                        ? 'bg-rose-950/50 text-rose-300 border border-rose-900/40'
                        : currentLatency >= 800
                        ? 'bg-amber-950/50 text-amber-300 border border-amber-900/40'
                        : 'bg-emerald-950/50 text-emerald-300 border border-emerald-900/40'
                    }`}
                  >
                    <Clock className="h-2.5 w-2.5" />
                    {currentLatency}ms
                  </span>
                </div>

                <div className="font-semibold text-xs text-white line-clamp-1">
                  {terrain.nome.split('—')[0].trim()}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {terrain.bairro}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{terrain.areaM2.toLocaleString('pt-BR')} m²</span>
                {isSelected && (
                  <span className="text-cyan-400 font-semibold flex items-center gap-0.5">
                    <Check className="h-3 w-3" /> Selecionado
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Controles de Latência (Gaveta Expansível) */}
      {showLatencyControls && (
        <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              Configuração Fina de Latência por Terreno
            </span>
            <button
              onClick={onResetLatencies}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Restaurar Padrões (A: 2000ms / B: 500ms)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {TERRAIN_LIST.map((t) => (
              <div key={t.id} className="space-y-1 bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-300">{t.codigo}</span>
                  <span className="font-mono font-bold text-cyan-400">{latencies[t.id]}ms</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={3500}
                  step={100}
                  value={latencies[t.id]}
                  onChange={(e) => onUpdateLatency(t.id, Number(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
