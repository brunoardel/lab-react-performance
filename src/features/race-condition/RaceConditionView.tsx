import { useState, useEffect, useRef } from 'react'
import type { TerrainId, UrbanTerrain, NetworkLogEntry } from './types/terrain'
import { MOCK_TERRAINS, fetchTerrainDetails } from './services/terrainApi'
import { TerrainSelector } from './components/TerrainSelector'
import { TerrainDetailsCard } from './components/TerrainDetailsCard'
import { NetworkActivityTimeline } from './components/NetworkActivityTimeline'
import { ArchitecturalComparison } from './components/ArchitecturalComparison'
import { RenderCounter } from '../../components/common/RenderCounter'
import { Badge } from '../../components/common/Badge'
import { Card } from '../../components/common/Card'
import {
  Flame,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

export function RaceConditionView() {
  // Modo de operação do laboratório: Ingênuo (sem cancelamento) vs Sênior (com AbortController)
  const [mode, setMode] = useState<'naive' | 'senior'>('senior')

  // Terreno selecionado pelo usuário no seletor
  const [selectedTerrainId, setSelectedTerrainId] = useState<TerrainId>('terreno-a')

  // Dados efetivamente recebidos e persistidos no estado do React
  const [renderedData, setRenderedData] = useState<UrbanTerrain | null>(
    MOCK_TERRAINS['terreno-a']
  )

  // Estado de carregamento do terreno
  const [isLoading, setIsLoading] = useState(false)

  // Latências configuráveis por terreno (ms)
  const [latencies, setLatencies] = useState<Record<TerrainId, number>>({
    'terreno-a': 2000, // 2s conforme RF04 do PRD
    'terreno-b': 500,  // 500ms conforme RF04 do PRD
    'terreno-c': 1400,
    'terreno-d': 300,
  })

  // Timeline de rede para inspecionar requisições em voo, concluídas e canceladas
  const [networkLogs, setNetworkLogs] = useState<NetworkLogEntry[]>([])

  // Estado da simulação automática rápida (A ➔ B)
  const [isSimulating, setIsSimulating] = useState(false)

  // Ref para rastrear o terreno selecionado mais recente dentro dos callbacks assíncronos
  const selectedTerrainIdRef = useRef<TerrainId>(selectedTerrainId)
  useEffect(() => {
    selectedTerrainIdRef.current = selectedTerrainId
  }, [selectedTerrainId])

  // Ref para controlar timeouts da simulação
  const simulationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Atualizador de latência individual
  const handleUpdateLatency = (id: TerrainId, latencyMs: number) => {
    setLatencies((prev) => ({ ...prev, [id]: latencyMs }))
  }

  // Restaurar latências originais
  const handleResetLatencies = () => {
    setLatencies({
      'terreno-a': 2000,
      'terreno-b': 500,
      'terreno-c': 1400,
      'terreno-d': 300,
    })
  }

  // Limpar logs de rede
  const handleClearLogs = () => {
    setNetworkLogs([])
  }

  // Simular o caso crítico do PRD: Disparo de A (2000ms) seguido de B (500ms)
  const handleSimulateRaceCondition = () => {
    if (isSimulating) return
    setIsSimulating(true)

    // 1. Seleciona Terreno A (lento)
    setSelectedTerrainId('terreno-a')

    // 2. 150ms depois, troca para o Terreno B (rápido)
    if (simulationTimeoutRef.current) {
      clearTimeout(simulationTimeoutRef.current)
    }

    simulationTimeoutRef.current = setTimeout(() => {
      setSelectedTerrainId('terreno-b')
      setIsSimulating(false)
    }, 150)
  }

  // Cleanup de timeout da simulação ao desmontar
  useEffect(() => {
    return () => {
      if (simulationTimeoutRef.current) {
        clearTimeout(simulationTimeoutRef.current)
      }
    }
  }, [])

  // =========================================================================
  // HOOK CENTRAL: Execução Assíncrona com ou sem AbortController (RF04)
  // =========================================================================
  // eslint-disable-next-line react/set-state-in-effect
  useEffect(() => {
    const currentId = selectedTerrainId
    const terrain = MOCK_TERRAINS[currentId]
    const latency = latencies[currentId]
    const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const startTime = performance.now()

    // 1. Registra a nova requisição na timeline como 'pending'
    const newEntry: NetworkLogEntry = {
      id: requestId,
      terrainId: currentId,
      terrainName: terrain.nome,
      startTime,
      latencyMs: latency,
      status: 'pending',
      mode,
    }

    queueMicrotask(() => {
      setNetworkLogs((prev) => [newEntry, ...prev])
      setIsLoading(true)
    })

    if (mode === 'senior') {
      // ---------------------------------------------------------------------
      // MODO SÊNIOR: Utiliza AbortController no cleanup
      // ---------------------------------------------------------------------
      const controller = new AbortController()

      fetchTerrainDetails(currentId, controller.signal, latency)
        .then((data) => {
          setRenderedData(data)
          setIsLoading(false)

          setNetworkLogs((prev) =>
            prev.map((entry) =>
              entry.id === requestId
                ? {
                    ...entry,
                    status: 'completed',
                    completedAt: performance.now(),
                  }
                : entry
            )
          )
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            // Requisição cancelada com sucesso via cleanup!
            setNetworkLogs((prev) =>
              prev.map((entry) =>
                entry.id === requestId
                  ? {
                      ...entry,
                      status: 'aborted',
                      abortedAt: performance.now(),
                    }
                  : entry
            )
            )
            return
          }

          setIsLoading(false)
        })

      // FUNÇÃO DE CLEANUP OBRIGATÓRIA (RF04)
      return () => {
        controller.abort()
      }
    } else {
      // ---------------------------------------------------------------------
      // MODO INGÊNUO: Sem AbortController (Vulnerável a Race Condition)
      // ---------------------------------------------------------------------
      fetchTerrainDetails(currentId, undefined, latency)
        .then((data) => {
          // A Promise antiga resolve mesmo que o usuário já tenha trocado de terreno!
          const isStale = data.id !== selectedTerrainIdRef.current

          setRenderedData(data)
          setIsLoading(false)

          setNetworkLogs((prev) =>
            prev.map((entry) =>
              entry.id === requestId
                ? {
                    ...entry,
                    status: 'completed',
                    completedAt: performance.now(),
                    causedRaceConditionBug: isStale,
                  }
                : entry
            )
          )
        })
        .catch(() => {
          setIsLoading(false)
        })

      // ❌ SEM CLEANUP: Requisições antigas continuam em voo e sobrescrevem a UI!
      return undefined
    }
  }, [selectedTerrainId, mode, latencies])

  const selectedTerrain = MOCK_TERRAINS[selectedTerrainId]

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Laboratório */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-cyan-400">RF04</span>
            <Badge variant="emerald" size="sm">
              <Sparkles className="h-3 w-3" />
              Tarefa 4 Ativa
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Flame className="h-6 w-6 text-rose-500" />
            <span>Resiliência contra Condições de Corrida</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Mitigação de requisições assíncronas concorrentes de terrenos urbanos via{' '}
            <code className="text-cyan-400 font-mono">AbortController</code> no cleanup do{' '}
            <code className="text-cyan-400 font-mono">useEffect</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RenderCounter componentName="RaceConditionView" variant="pill" />
        </div>
      </div>

      {/* Switcher de Modo: Ingênuo vs Sênior */}
      <Card className="border-slate-800 bg-slate-900/60 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Modo de Execução do Laboratório
              </span>
              <Badge variant={mode === 'senior' ? 'emerald' : 'rose'}>
                {mode === 'senior' ? 'Protegido' : 'Vulnerável'}
              </Badge>
            </div>
            <p className="text-xs text-slate-300">
              {mode === 'senior'
                ? 'Modo Sênior ativo: O hook cancela requisições pendentes com AbortController.abort() antes de iniciar novas.'
                : 'Modo Ingênuo ativo: Sem cleanup. Trocas rápidas farão respostas lentas sobrescreverem seleções mais recentes.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
            <button
              onClick={() => setMode('naive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                mode === 'naive'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-950/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="h-3.5 w-3.5" />
              <span>Modo Ingênuo (Bug)</span>
            </button>

            <button
              onClick={() => setMode('senior')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                mode === 'senior'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Modo Sênior (AbortController)</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Seletor de Terrenos & Disparo Rápido */}
      <TerrainSelector
        selectedId={selectedTerrainId}
        onSelect={setSelectedTerrainId}
        onSimulateRaceCondition={handleSimulateRaceCondition}
        isSimulating={isSimulating}
        latencies={latencies}
        onUpdateLatency={handleUpdateLatency}
        onResetLatencies={handleResetLatencies}
        isPendingRequest={isLoading}
      />

      {/* Grid Principal: Detalhes do Terreno e Timeline de Rede */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <TerrainDetailsCard
            selectedTerrain={selectedTerrain}
            renderedData={renderedData}
            isLoading={isLoading}
            mode={mode}
          />
        </div>

        <div className="lg:col-span-5">
          <NetworkActivityTimeline logs={networkLogs} onClearLogs={handleClearLogs} />
        </div>
      </div>

      {/* Guia Arquitetural & Comparativo de Código */}
      <ArchitecturalComparison />
    </div>
  )
}
