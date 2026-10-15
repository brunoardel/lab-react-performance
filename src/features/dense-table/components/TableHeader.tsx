import type { SortField, SortDirection } from '../types/scenario'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface TableHeaderProps {
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}

export function TableHeader({
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 opacity-40 group-hover:opacity-100 transition-opacity" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-cyan-400" />
    ) : (
      <ArrowDown className="h-3 w-3 text-cyan-400" />
    )
  }

  return (
    <div className="flex items-center text-xs font-semibold text-slate-300 bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 select-none sticky top-0 z-20 backdrop-blur-md">
      {/* Código */}
      <button
        onClick={() => onSort('codigo')}
        className="w-24 shrink-0 flex items-center gap-1.5 hover:text-white transition-colors group text-left"
      >
        <span>Código</span>
        {renderSortIcon('codigo')}
      </button>

      {/* Nome */}
      <button
        onClick={() => onSort('nome')}
        className="w-64 shrink-0 flex items-center gap-1.5 hover:text-white transition-colors group text-left pr-3"
      >
        <span>Cenário / Bairro</span>
        {renderSortIcon('nome')}
      </button>

      {/* Zona */}
      <div className="w-20 shrink-0">
        <span>Zona</span>
      </div>

      {/* Área Terreno */}
      <button
        onClick={() => onSort('areaTerreno')}
        className="w-24 shrink-0 flex items-center justify-end gap-1.5 hover:text-white transition-colors group pr-3"
      >
        <span>Terreno</span>
        {renderSortIcon('areaTerreno')}
      </button>

      {/* Área Construída */}
      <button
        onClick={() => onSort('areaConstruida')}
        className="w-28 shrink-0 flex items-center justify-end gap-1.5 hover:text-white transition-colors group pr-3"
      >
        <span>Área Constr.</span>
        {renderSortIcon('areaConstruida')}
      </button>

      {/* CA / TO */}
      <div className="w-24 shrink-0 text-right pr-3">
        <span>CA / TO</span>
      </div>

      {/* Pavimentos */}
      <div className="w-20 shrink-0 text-center">
        <span>Pav.</span>
      </div>

      {/* Unid. / Vagas */}
      <button
        onClick={() => onSort('unidades')}
        className="w-24 shrink-0 flex items-center justify-end gap-1.5 hover:text-white transition-colors group pr-3"
      >
        <span>Unid. / Vagas</span>
        {renderSortIcon('unidades')}
      </button>

      {/* VGV Estimado */}
      <button
        onClick={() => onSort('potencialVGV')}
        className="w-28 shrink-0 flex items-center justify-end gap-1.5 hover:text-white transition-colors group pr-4"
      >
        <span>Potencial VGV</span>
        {renderSortIcon('potencialVGV')}
      </button>

      {/* Status */}
      <button
        onClick={() => onSort('statusViabilidade')}
        className="w-24 shrink-0 flex items-center gap-1.5 hover:text-white transition-colors group"
      >
        <span>Viabilidade</span>
        {renderSortIcon('statusViabilidade')}
      </button>
    </div>
  )
}
