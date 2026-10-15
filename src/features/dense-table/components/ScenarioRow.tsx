import React from 'react'
import type { UrbanScenario } from '../types/scenario'
import { Badge } from '../../../components/common/Badge'

interface ScenarioRowProps {
  scenario: UrbanScenario
  index: number
  style?: React.CSSProperties
}

export const ScenarioRow = React.memo(function ScenarioRow({
  scenario,
  index,
  style,
}: ScenarioRowProps) {
  const formatCurrency = (val: number) => {
    return (val / 1_000_000).toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + ' M'
  }

  const getStatusBadge = (status: UrbanScenario['statusViabilidade']) => {
    switch (status) {
      case 'Viavel':
        return <Badge variant="emerald" size="sm">Viável</Badge>
      case 'Atencao':
        return <Badge variant="amber" size="sm">Atenção</Badge>
      case 'Inviavel':
        return <Badge variant="rose" size="sm">Inviável</Badge>
    }
  }

  return (
    <div
      style={style}
      className={`flex items-center text-xs px-4 py-2 border-b border-slate-800/80 transition-colors ${
        index % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-950/40'
      } hover:bg-cyan-950/20`}
    >
      {/* Código */}
      <div className="w-24 shrink-0 font-mono text-cyan-400 font-semibold">
        {scenario.codigo}
      </div>

      {/* Nome & Bairro */}
      <div className="w-64 shrink-0 pr-3">
        <div className="font-semibold text-slate-100 truncate" title={scenario.nome}>
          {scenario.nome}
        </div>
        <div className="text-[11px] text-slate-400 truncate">
          {scenario.bairro}
        </div>
      </div>

      {/* Zona */}
      <div className="w-20 shrink-0 font-mono text-[11px] text-slate-300">
        <span className="rounded bg-slate-800/90 px-1.5 py-0.5 border border-slate-700/60 font-semibold">
          {scenario.zona}
        </span>
      </div>

      {/* Área Terreno */}
      <div className="w-24 shrink-0 font-mono text-right text-slate-200 pr-3">
        {scenario.areaTerreno.toLocaleString('pt-BR')} <span className="text-[10px] text-slate-500">m²</span>
      </div>

      {/* Área Construída */}
      <div className="w-28 shrink-0 font-mono text-right text-slate-200 pr-3">
        {scenario.areaConstruida.toLocaleString('pt-BR')} <span className="text-[10px] text-slate-500">m²</span>
      </div>

      {/* CA / TO */}
      <div className="w-24 shrink-0 font-mono text-right text-slate-300 pr-3">
        <span>{scenario.coeficienteAproveitamento}x</span>
        <span className="text-slate-500 mx-1">/</span>
        <span className="text-[11px] text-slate-400">{scenario.taxaOcupacao}%</span>
      </div>

      {/* Pavimentos */}
      <div className="w-20 shrink-0 font-mono text-center text-slate-300">
        {scenario.gabaritoPavimentos} <span className="text-[10px] text-slate-500">pav.</span>
      </div>

      {/* Unid. / Vagas */}
      <div className="w-24 shrink-0 font-mono text-right text-slate-300 pr-3">
        <span>{scenario.unidades} u.</span>
        <span className="text-slate-500 mx-1">/</span>
        <span className="text-[11px] text-slate-400">{scenario.vagas} v.</span>
      </div>

      {/* VGV */}
      <div className="w-28 shrink-0 font-mono text-right font-semibold text-emerald-400 pr-4">
        R$ {formatCurrency(scenario.potencialVGV)}
      </div>

      {/* Status */}
      <div className="w-24 shrink-0">
        {getStatusBadge(scenario.statusViabilidade)}
      </div>
    </div>
  )
})
