import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { UrbanScenario, SortField, SortDirection } from '../types/scenario'
import { TableHeader } from './TableHeader'
import { ScenarioRow } from './ScenarioRow'
import { RenderCounter } from '../../../components/common/RenderCounter'
import { Zap } from 'lucide-react'

interface VirtualizedTableProps {
  scenarios: UrbanScenario[]
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}

export function VirtualizedTable({
  scenarios,
  sortField,
  sortDirection,
  onSort,
}: VirtualizedTableProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: scenarios.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 10,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()

  return (
    <div className="rounded-xl border border-emerald-900/40 bg-slate-900/60 overflow-hidden shadow-lg">
      {/* Banner de Eficiência da Virtualização */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950/30 border-b border-emerald-900/40 px-4 py-2.5 text-xs text-emerald-300">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>
            <strong>Modo B (@tanstack/react-virtual):</strong> Apenas{' '}
            <span className="font-mono font-bold text-white">{virtualItems.length}</span> linhas ativas no DOM (~
            {virtualItems.length * 10} nós) de um total de{' '}
            <span className="font-mono text-slate-200">{scenarios.length.toLocaleString('pt-BR')}</span> registros.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-emerald-400">Virtualizer:</span>
          <RenderCounter componentName="VirtTable" variant="compact" />
        </div>
      </div>

      {/* Container de Rolagem Virtualizado */}
      <div
        ref={parentRef}
        className="h-[560px] overflow-auto overflow-x-auto relative"
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
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualItems.map((virtualRow) => {
                const scenario = scenarios[virtualRow.index]
                if (!scenario) return null
                return (
                  <ScenarioRow
                    key={scenario.id}
                    scenario={scenario}
                    index={virtualRow.index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
