import { useState, useMemo, useTransition } from 'react'
import { generateUrbanScenarios } from './mock/scenarioGenerator'
import type { SortField, SortDirection, ViabilityStatus } from './types/scenario'
import { VirtualizedTable } from './components/VirtualizedTable'
import { UnvirtualizedTable } from './components/UnvirtualizedTable'
import { TableControls } from './components/TableControls'
import { TableTelemetryBanner } from './components/TableTelemetryBanner'
import { Badge } from '../../components/common/Badge'
import { Card } from '../../components/common/Card'
import { RenderCounter } from '../../components/common/RenderCounter'
import { Table2, Sparkles, Layers } from 'lucide-react'

export function DenseTableView() {
  // Mock inicial determinístico de 2.500 cenários urbanísticos
  const allScenarios = useMemo(() => generateUrbanScenarios(2500), [])

  // Estado da barra de busca imediata (para resposta visual fluida de digitação)
  const [searchInput, setSearchInput] = useState('')
  // Estado diferido para filtragem computacionalmente pesada
  const [deferredSearch, setDeferredSearch] = useState('')

  // React 18 Concurrency Hook
  const [isPending, startTransition] = useTransition()

  // Switches do laboratório
  const [useTransitionsEnabled, setUseTransitionsEnabled] = useState(true)
  const [isVirtualized, setIsVirtualized] = useState(true)
  const [heavyFilterEnabled, setHeavyFilterEnabled] = useState(false)
  const [statusFilter, setStatusFilter] = useState<ViabilityStatus | 'Todos'>('Todos')

  // Estado de ordenação
  const [sortField, setSortField] = useState<SortField>('codigo')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Tratamento da digitação de busca: Concorrente vs Síncrono Bloqueante
  const handleSearchChange = (value: string) => {
    setSearchInput(value)

    if (useTransitionsEnabled) {
      // Modo Sênior: Atualiza o filtro com baixa prioridade em segundo plano
      startTransition(() => {
        setDeferredSearch(value)
      })
    } else {
      // Modo Ingênuo: Bloqueia a thread principal com cálculo síncrono
      setDeferredSearch(value)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filtragem e ordenação dos 2.500 cenários
  const filteredScenarios = useMemo(() => {
    const term = (useTransitionsEnabled ? deferredSearch : searchInput).toLowerCase().trim()

    return allScenarios
      .filter((scenario) => {
        // Carga sintética para simular cálculo urbanístico pesado se ativado
        if (heavyFilterEnabled) {
          let dummy = 0
          for (let i = 0; i < 4000; i++) {
            dummy += Math.sqrt(scenario.areaTerreno) * Math.sin(i)
          }
          if (dummy === 9999999) return false
        }

        // Filtro por Status
        if (statusFilter !== 'Todos' && scenario.statusViabilidade !== statusFilter) {
          return false
        }

        // Filtro por Texto
        if (!term) return true
        return (
          scenario.codigo.toLowerCase().includes(term) ||
          scenario.nome.toLowerCase().includes(term) ||
          scenario.bairro.toLowerCase().includes(term) ||
          scenario.zona.toLowerCase().includes(term)
        )
      })
      .sort((a, b) => {
        const factor = sortDirection === 'asc' ? 1 : -1
        const valA = a[sortField]
        const valB = b[sortField]

        if (typeof valA === 'string' && typeof valB === 'string') {
          return valA.localeCompare(valB) * factor
        }
        return ((valA as number) - (valB as number)) * factor
      })
  }, [
    allScenarios,
    useTransitionsEnabled,
    deferredSearch,
    searchInput,
    statusFilter,
    heavyFilterEnabled,
    sortField,
    sortDirection,
  ])

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Laboratório */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-cyan-400">RF02 & RF03</span>
            <Badge variant="emerald" size="sm">
              <Sparkles className="h-3 w-3" />
              Tarefa 3 Ativa
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Table2 className="h-6 w-6 text-cyan-400" />
            <span>Tabela Densa & Concorrência React 18</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            2.500 cenários urbanísticos: Comparação de Virtualização com `@tanstack/react-virtual` e Filtragem Concorrente com `useTransition`.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RenderCounter componentName="DenseTableView" variant="pill" />
        </div>
      </div>

      {/* Banner de Telemetria de Nós DOM e Métricas Urbanísticas */}
      <TableTelemetryBanner
        isVirtualized={isVirtualized}
        useTransitionsEnabled={useTransitionsEnabled}
        filteredScenarios={filteredScenarios}
        totalCount={allScenarios.length}
      />

      {/* Controles de Busca, Modo Concorrente e Switches */}
      <TableControls
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        isPending={isPending}
        useTransitionsEnabled={useTransitionsEnabled}
        onToggleUseTransitions={setUseTransitionsEnabled}
        isVirtualized={isVirtualized}
        onToggleVirtualized={setIsVirtualized}
        heavyFilterEnabled={heavyFilterEnabled}
        onToggleHeavyFilter={setHeavyFilterEnabled}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalCount={allScenarios.length}
        filteredCount={filteredScenarios.length}
      />

      {/* Tabela de Cenários (Virtualizada vs Não-Virtualizada) */}
      {isVirtualized ? (
        <VirtualizedTable
          scenarios={filteredScenarios}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      ) : (
        <UnvirtualizedTable
          scenarios={filteredScenarios}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}

      {/* Card Pedagógico / Guia Arquitetural */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-slate-800 bg-slate-900/50 p-4 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>RF02: Virtualização com @tanstack/react-virtual</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Sem virtualização, o navegador precisa criar e gerenciar <strong className="text-rose-400">25.000 nós no DOM</strong> simultaneamente, causando travamento durante o scroll (jank) e alta pressão no coletor de lixo (GC).
            Com <strong className="text-emerald-400">@tanstack/react-virtual</strong>, apenas as ~25 linhas visíveis na viewport ficam ativas no DOM, reduzindo a pegada de memória em mais de 99%.
          </p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50 p-4 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>RF03: Concorrência com useTransition</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            No modelo síncrono clássico, a digitação de cada tecla compete com o filtro de 2.500 registros pela thread principal do JavaScript, congelando o cursor de texto.
            Com <strong className="text-cyan-400">useTransition</strong>, o input tem prioridade de alta frequência (60 FPS), enquanto a ordenação e filtragem pesada são computadas de forma não-bloqueante em segundo plano.
          </p>
        </Card>
      </div>
    </div>
  )
}
