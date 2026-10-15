import type { UrbanScenario } from '../types/scenario'
import { Card } from '../../../components/common/Card'
import { Badge } from '../../../components/common/Badge'
import { Layers, Activity, DollarSign, Building } from 'lucide-react'

interface TableTelemetryBannerProps {
  isVirtualized: boolean
  useTransitionsEnabled: boolean
  filteredScenarios: UrbanScenario[]
  totalCount: number
}

export function TableTelemetryBanner({
  isVirtualized,
  useTransitionsEnabled,
  filteredScenarios,
  totalCount,
}: TableTelemetryBannerProps) {
  const activeDomRows = isVirtualized ? Math.min(25, filteredScenarios.length) : filteredScenarios.length
  const estimatedDomNodes = activeDomRows * 10

  const totalVgv = filteredScenarios.reduce((acc, curr) => acc + curr.potencialVGV, 0)
  const totalUnidades = filteredScenarios.reduce((acc, curr) => acc + curr.unidades, 0)
  const viaveisCount = filteredScenarios.filter((s) => s.statusViabilidade === 'Viavel').length

  const formatVGV = (val: number) => {
    if (val >= 1_000_000_000) {
      return (val / 1_000_000_000).toLocaleString('pt-BR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      }) + ' B'
    }
    return (val / 1_000_000).toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + ' M'
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Métrica 1: Nós no DOM */}
      <Card className="border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-slate-400 text-xs">Carga no DOM</span>
          <Layers className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold font-mono text-white">
            {estimatedDomNodes.toLocaleString('pt-BR')}
          </span>
          <span className="text-xs text-slate-400">nós ativos</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          {isVirtualized ? (
            <Badge variant="emerald" size="sm">
              -99% Memória DOM
            </Badge>
          ) : (
            <Badge variant="rose" size="sm">
              Estouro de nós (DOM Thrashing)
            </Badge>
          )}
        </div>
      </Card>

      {/* Métrica 2: Modo de Concorrência */}
      <Card className="border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-slate-400 text-xs">Thread de Execução</span>
          <Activity className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-base font-bold text-white truncate">
          {useTransitionsEnabled ? 'React 18 Transitions' : 'Síncrono Bloqueante'}
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          {useTransitionsEnabled ? (
            <span className="text-[11px] text-cyan-400 font-mono">Digitação priorizada (60 FPS)</span>
          ) : (
            <span className="text-[11px] text-rose-400 font-mono">Possível congelamento do input</span>
          )}
        </div>
      </Card>

      {/* Métrica 3: VGV Total Filtrado */}
      <Card className="border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-slate-400 text-xs">VGV Potencial Acumulado</span>
          <DollarSign className="h-4 w-4 text-amber-400" />
        </div>
        <div className="text-xl font-extrabold font-mono text-amber-300">
          R$ {formatVGV(totalVgv)}
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          {filteredScenarios.length} de {totalCount.toLocaleString('pt-BR')} estudos urbanísticos
        </span>
      </Card>

      {/* Métrica 4: Unidades & Viabilidade */}
      <Card className="border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-slate-400 text-xs">Viabilidade Urbanística</span>
          <Building className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold font-mono text-white">
            {viaveisCount.toLocaleString('pt-BR')}
          </span>
          <span className="text-xs text-slate-400">viáveis</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          {totalUnidades.toLocaleString('pt-BR')} unidades residenciais
        </span>
      </Card>
    </div>
  )
}
