import { useRef } from 'react'
import type { UrbanScenario, SortField, SortDirection } from '../types/scenario'
import { TableHeader } from './TableHeader'
import { ScenarioRow } from './ScenarioRow'
import { RenderCounter } from '../../../components/common/RenderCounter'
import { AlertCircle } from 'lucide-react'

interface UnvirtualizedTableProps {
  scenarios: UrbanScenario[]
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}

export function UnvirtualizedTable({
  scenarios,
  sortField,
  sortDirection,
  onSort,
}: UnvirtualizedTableProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="rounded-xl border border-rose-900/40 bg-slate-900/60 overflow-hidden shadow-lg">
      {/* Banner de Aviso de Sobrecarga do DOM */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-950/30 border-b border-rose-900/40 px-4 py-2.5 text-xs text-rose-300">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>
            <strong>Modo A (Sem Virtualização):</strong> Renderizando todas as{' '}
            <span className="font-mono font-bold text-white">{scenarios.length}</span> linhas simultaneamente no DOM (~
            {scenarios.length * 10} nós DOM ativos).
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-rose-400">Tabela Render:</span>
          <RenderCounter componentName="UnvirtTable" variant="compact" />
        </div>
      </div>

      {/* Container de Rolagem com 2.500 linhas completas */}
      <div
        ref={containerRef}
        className="h-[560px] overflow-auto overflow-x-auto relative divide-y divide-slate-800/60"
      >
        <div className="min-w-[1050px]">
          <TableHeader
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          />

          {scenarios.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              Nenhum cenário urbanístico encontrado para os filtros selecionados.
            </div>
          ) : (
            scenarios.map((scenario, index) => (
              <ScenarioRow
                key={scenario.id}
                scenario={scenario}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
