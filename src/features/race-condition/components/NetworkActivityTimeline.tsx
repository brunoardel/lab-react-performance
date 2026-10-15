import { useEffect, useState } from 'react'
import type { NetworkLogEntry } from '../types/terrain'
import { Card } from '../../../components/common/Card'
import { Badge } from '../../../components/common/Badge'
import {
  Activity,
  CheckCircle2,
  XCircle,
  Trash2,
  AlertTriangle,
  Radio,
} from 'lucide-react'

interface NetworkActivityTimelineProps {
  logs: NetworkLogEntry[]
  onClearLogs: () => void
}

export function NetworkActivityTimeline({
  logs,
  onClearLogs,
}: NetworkActivityTimelineProps) {
  // Estado para atualizar o tempo decorrido dos pedidos em voo
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const hasPending = logs.some((l) => l.status === 'pending')
    if (!hasPending) return

    const interval = setInterval(() => {
      setNow(Date.now())
    }, 100)
    return () => clearInterval(interval)
  }, [logs])

  const totalDispatched = logs.length
  const totalCompleted = logs.filter((l) => l.status === 'completed').length
  const totalAborted = logs.filter((l) => l.status === 'aborted').length
  const totalCorrupted = logs.filter((l) => l.causedRaceConditionBug).length

  return (
    <Card className="border-slate-800 bg-slate-900/60 p-5 space-y-4">
      {/* Cabeçalho da Telemetria de Rede */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <span>Timeline de Atividade de Rede & Requisições</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspetor em tempo real de chamadas assíncronas, cancelamentos e detecção de respostas fora de ordem.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {logs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="h-3 w-3 text-slate-400" />
              <span>Limpar Histórico</span>
            </button>
          )}
        </div>
      </div>

      {/* Resumo de Métricas de Rede */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-[11px] text-slate-400">Total Disparadas</div>
          <div className="text-base font-bold font-mono text-white">{totalDispatched}</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-[11px] text-slate-400">Concluídas (200 OK)</div>
          <div className="text-base font-bold font-mono text-emerald-400">{totalCompleted}</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-[11px] text-slate-400">Abortadas (Signal)</div>
          <div className="text-base font-bold font-mono text-cyan-400">{totalAborted}</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-[11px] text-slate-400">Colisões de Corrida</div>
          <div
            className={`text-base font-bold font-mono ${
              totalCorrupted > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-400'
            }`}
          >
            {totalCorrupted}
          </div>
        </div>
      </div>

      {/* Lista de Requisições */}
      {logs.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          Nenhuma requisição disparada ainda. Clique em um terreno acima ou execute o disparo rápido.
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {logs.map((log) => {
            const elapsed = log.completedAt
              ? Math.round(log.completedAt - log.startTime)
              : log.abortedAt
              ? Math.round(log.abortedAt - log.startTime)
              : Math.round(now - log.startTime)

            return (
              <div
                key={log.id}
                className={`p-3 rounded-lg border text-xs transition-all ${
                  log.causedRaceConditionBug
                    ? 'border-rose-700/80 bg-rose-950/30'
                    : log.status === 'aborted'
                    ? 'border-slate-800/80 bg-slate-900/40 opacity-75'
                    : log.status === 'pending'
                    ? 'border-cyan-800/60 bg-cyan-950/20'
                    : 'border-slate-800 bg-slate-950/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {log.status === 'pending' && (
                      <Radio className="h-4 w-4 text-cyan-400 animate-pulse shrink-0" />
                    )}
                    {log.status === 'completed' && !log.causedRaceConditionBug && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    )}
                    {log.status === 'aborted' && (
                      <XCircle className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    {log.causedRaceConditionBug && (
                      <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 animate-bounce" />
                    )}

                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{log.terrainName.split('—')[0].trim()}</span>
                        <Badge
                          variant={log.mode === 'senior' ? 'emerald' : 'rose'}
                          size="sm"
                        >
                          {log.mode === 'senior' ? 'Sênior' : 'Ingênuo'}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-cyan-300">
                          Latência configurada: {log.latencyMs}ms
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {log.status === 'pending' && (
                      <Badge variant="cyan" size="sm">
                        Em voo ({elapsed}ms...)
                      </Badge>
                    )}
                    {log.status === 'completed' && (
                      <Badge
                        variant={log.causedRaceConditionBug ? 'rose' : 'emerald'}
                        size="sm"
                      >
                        {log.causedRaceConditionBug
                          ? 'Sobrescreveu a UI (Bug!)'
                          : `200 OK (${elapsed}ms)`}
                      </Badge>
                    )}
                    {log.status === 'aborted' && (
                      <Badge variant="slate" size="sm">
                        Cancelada via AbortController ({elapsed}ms)
                      </Badge>
                    )}
                  </div>
                </div>

                {log.causedRaceConditionBug && (
                  <div className="mt-2 pt-2 border-t border-rose-900/50 text-[11px] text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      Esta resposta chegou atrasada e sobrescreveu a interface mesmo após o usuário já ter selecionado outro terreno!
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
