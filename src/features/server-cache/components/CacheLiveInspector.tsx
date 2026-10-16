import { useState, useEffect } from 'react'
import {
  useQueryCacheInspector,
  STALE_TIME_MS,
} from '../hooks/useUrbanProjects'
import {
  getSimulatedLatency,
  setSimulatedLatency,
  getNetworkLogs,
  clearNetworkLogs,
  subscribeNetworkLogs,
  resetDatabase,
} from '../services/projectsApi'
import type { NetworkCallLog } from '../types/project'
import { Card } from '../../../components/common/Card'
import { Badge } from '../../../components/common/Badge'
import {
  Activity,
  Zap,
  RefreshCw,
  Trash2,
  Clock,
  RotateCcw,
  Gauge,
  Radio,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

interface CacheLiveInspectorProps {
  onRefreshData?: () => void
}

export function CacheLiveInspector({ onRefreshData }: CacheLiveInspectorProps) {
  const {
    inspectedQueries,
    totalCachedQueries,
    invalidateAll,
    invalidateQueryKey,
    refetchAll,
    clearCache,
  } = useQueryCacheInspector()

  const [currentLatency, setCurrentLatency] = useState(getSimulatedLatency())
  const [logs, setLogs] = useState<NetworkCallLog[]>(getNetworkLogs())
  const [activeTab, setActiveTab] = useState<'queries' | 'network'>('queries')

  useEffect(() => {
    const unsubscribe = subscribeNetworkLogs(() => {
      setLogs(getNetworkLogs())
    })
    return () => unsubscribe()
  }, [])

  const handleLatencyChange = (ms: number) => {
    setSimulatedLatency(ms)
    setCurrentLatency(ms)
  }

  const handleResetDb = () => {
    resetDatabase()
    clearCache()
    if (onRefreshData) onRefreshData()
  }

  return (
    <Card className="border-cyan-900/40 bg-slate-900/90 shadow-xl overflow-hidden">
      {/* Header do Inspetor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Activity className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">TanStack Query Cache Inspector</h3>
              <Badge variant="cyan" size="sm">
                staleTime: {STALE_TIME_MS / 1000}s (1 min)
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400">
              Telemetria de chaves de consulta, ciclo de vida do cache e requisições HTTP em tempo real.
            </p>
          </div>
        </div>

        {/* Abas internas do Inspetor: Chaves em Cache vs Logs de Rede */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('queries')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'queries'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Chaves no Cache ({totalCachedQueries})
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'network'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tráfego de Rede ({logs.length})
          </button>
        </div>
      </div>

      {/* Barra de Ações Rápidas de Cache */}
      <div className="py-3 px-1 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5 text-cyan-400" />
            Latência do Servidor:
          </span>
          <div className="inline-flex rounded-lg bg-slate-950 border border-slate-800 p-0.5">
            {[
              { label: '200ms (5G)', value: 200 },
              { label: '650ms (4G)', value: 650 },
              { label: '1500ms (3G)', value: 1500 },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleLatencyChange(opt.value)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  currentLatency === opt.value
                    ? 'bg-cyan-500/30 text-cyan-200 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={invalidateAll}
            title="Invoca queryClient.invalidateQueries({ queryKey: ['urban-projects'] })"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-colors"
          >
            <Zap className="h-3 w-3" />
            <span>Invalidar Cache</span>
          </button>

          <button
            onClick={refetchAll}
            title="Força refetch silencioso de todas as queries ativas"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Refetch Silencioso</span>
          </button>

          <button
            onClick={clearCache}
            title="Remove queries da memória para simular primeiro acesso limpo"
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            <span>Limpar Cache</span>
          </button>

          <button
            onClick={handleResetDb}
            title="Restaura dados iniciais do banco simulado"
            className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Conteúdo da Aba Ativa */}
      {activeTab === 'queries' ? (
        <div className="pt-3 space-y-2">
          {inspectedQueries.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500 italic">
              Nenhuma query de projetos urbanísticos ativa no momento. Clique em um projeto para popular o cache.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400">
                    <th className="py-2 px-3">Query Key</th>
                    <th className="py-2 px-3">Status do Cache</th>
                    <th className="py-2 px-3">Tempo para Stale</th>
                    <th className="py-2 px-3">Última Atualização</th>
                    <th className="py-2 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {inspectedQueries.map((q) => {
                    const isFetching = q.status === 'fetching'
                    const isFresh = q.status === 'fresh'
                    const isStale = q.status === 'stale'

                    return (
                      <tr key={q.queryKeyString} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2 px-3 font-semibold text-cyan-300">
                          {q.queryKeyString}
                        </td>
                        <td className="py-2 px-3">
                          {isFetching ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                              <Radio className="h-3 w-3 animate-spin" />
                              FETCHING (REDE)
                            </span>
                          ) : isFresh ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <CheckCircle2 className="h-3 w-3" />
                              FRESH (MEMÓRIA)
                            </span>
                          ) : isStale ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              <AlertTriangle className="h-3 w-3" />
                              STALE (EXPIRADO)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                              INACTIVE
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {isFresh ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                              <Clock className="h-3 w-3" />
                              {q.secondsRemainingToStale}s restantes
                            </span>
                          ) : (
                            <span className="text-amber-400/80 text-[11px]">
                              Revalidação no próximo uso
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-slate-400 text-[11px]">
                          {q.dataUpdatedFormatted}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => {
                              invalidateQueryKey(q.queryKey)
                            }}
                            className="text-[11px] text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2"
                            title={`Invalidar exclusivamente ${q.queryKeyString}`}
                          >
                            Invalidar
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="pt-3 space-y-2">
          {logs.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500 italic">
              Nenhuma requisição disparada ainda.
            </div>
          ) : (
            <div className="overflow-x-auto max-h-60 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 text-[11px] text-slate-400 border-b border-slate-800 px-2">
                <span>Total de chamadas registradas no servidor: <strong className="text-cyan-400">{logs.length}</strong></span>
                <button
                  onClick={clearNetworkLogs}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  Limpar Logs
                </button>
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400">
                    <th className="py-1.5 px-2">Horário</th>
                    <th className="py-1.5 px-2">Método</th>
                    <th className="py-1.5 px-2">Endpoint</th>
                    <th className="py-1.5 px-2">Duração</th>
                    <th className="py-1.5 px-2">Origem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="py-1.5 px-2 text-slate-400">{log.timestamp}</td>
                      <td className="py-1.5 px-2">
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                            log.method === 'GET'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {log.method}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-slate-300 font-mono">{log.endpoint}</td>
                      <td className="py-1.5 px-2 text-slate-400">{log.durationMs}ms</td>
                      <td className="py-1.5 px-2">
                        <Badge
                          variant={log.source === 'tanstack-query' ? 'emerald' : 'rose'}
                          size="sm"
                        >
                          {log.source === 'tanstack-query' ? 'TanStack Query' : 'Naive useState'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
