import type { ZoningFormData } from '../schema/zoningSchema'
import { Card } from '../../../components/common/Card'
import { RenderCounter } from '../../../components/common/RenderCounter'
import { Building2, Layers, Car, Trees, Compass } from 'lucide-react'

interface ViabilitySummaryCardProps {
  data: ZoningFormData
  mode: 'controlled' | 'optimized'
}

export function ViabilitySummaryCard({ data, mode }: ViabilitySummaryCardProps) {
  const areaTerreno = Number(data.areaTerreno) || 0
  const cab = Number(data.coeficienteAproveitamentoBasico) || 0
  const cam = Number(data.coeficienteAproveitamentoMaximo) || 0
  const to = Number(data.taxaOcupacaoMaxima) || 0
  const permeabilidade = Number(data.taxaPermeabilidadeMinima) || 0

  const potConstrutivoBasico = Math.round(areaTerreno * cab)
  const potConstrutivoMaximo = Math.round(areaTerreno * cam)
  const projecaoOcupacao = Math.round(areaTerreno * (to / 100))
  const areaPermeavel = Math.round(areaTerreno * (permeabilidade / 100))
  const totalVagas =
    Number(data.vagasAutoPrivativas || 0) +
    Number(data.vagasAutoVisitantes || 0) +
    Number(data.vagasPCD || 0)

  return (
    <Card className="border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-5 sticky top-20 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Viabilidade Urbanística</h3>
            <span className="text-[10px] text-slate-400 font-mono">Cálculo Paramétrico em Tempo Real</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <RenderCounter componentName="ViabSummary" variant="pill" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Building2 className="h-3.5 w-3.5 text-cyan-400" />
            <span>Potencial Básico (CAB)</span>
          </div>
          <div className="text-base font-bold font-mono text-cyan-300">
            {potConstrutivoBasico.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-400">m²</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Sem outorga onerosa</span>
        </div>

        <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Layers className="h-3.5 w-3.5 text-emerald-400" />
            <span>Potencial Máximo (CAM)</span>
          </div>
          <div className="text-base font-bold font-mono text-emerald-300">
            {potConstrutivoMaximo.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-400">m²</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Com outorga máxima</span>
        </div>

        <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Compass className="h-3.5 w-3.5 text-amber-400" />
            <span>Projeção Máx. (TO)</span>
          </div>
          <div className="text-base font-bold font-mono text-amber-300">
            {projecaoOcupacao.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-400">m²</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{to}% do lote</span>
        </div>

        <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Trees className="h-3.5 w-3.5 text-emerald-400" />
            <span>Área Permeável Mín.</span>
          </div>
          <div className="text-base font-bold font-mono text-emerald-300">
            {areaPermeavel.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-400">m²</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{permeabilidade}% do lote</span>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-slate-950/60 border border-slate-800/80 p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-cyan-400" />
          <span className="text-slate-300">Total de Vagas Exigidas:</span>
        </div>
        <span className="font-mono font-bold text-white text-sm">{totalVagas} vagas</span>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
        {mode === 'controlled' ? (
          <p className="text-rose-400/90 leading-tight">
            ⚠️ <strong>Modo A ativo:</strong> Este card re-calcula e re-renderiza junto com toda a árvore a cada tecla digitada nos 28 campos.
          </p>
        ) : (
          <p className="text-emerald-400/90 leading-tight">
            ⚡ <strong>Modo B ativo:</strong> Digitação isolada nos inputs não-controlados. Este card atualiza sob submissão ou sincronização explícita sem congelar a UI.
          </p>
        )}
      </div>
    </Card>
  )
}
