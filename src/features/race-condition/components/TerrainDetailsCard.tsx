import type { UrbanTerrain } from '../types/terrain'
import { Card } from '../../../components/common/Card'
import { Badge } from '../../../components/common/Badge'
import { RenderCounter } from '../../../components/common/RenderCounter'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Building2,
  ShieldAlert,
  Compass,
  Maximize2,
  FileText,
  Loader2,
} from 'lucide-react'

interface TerrainDetailsCardProps {
  selectedTerrain: UrbanTerrain
  renderedData: UrbanTerrain | null
  isLoading: boolean
  isAborted?: boolean
  mode: 'naive' | 'senior'
}

export function TerrainDetailsCard({
  selectedTerrain,
  renderedData,
  isLoading,
  mode,
}: TerrainDetailsCardProps) {
  // Verificação de inconsistência de estado (Race Condition)
  const isCorrupted =
    !isLoading && renderedData !== null && renderedData.id !== selectedTerrain.id

  const isConsistent =
    !isLoading && renderedData !== null && renderedData.id === selectedTerrain.id

  return (
    <Card className="border-slate-800 bg-slate-900/70 p-5 space-y-5">
      {/* Cabeçalho do Card com Contadores */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-cyan-400">
              Painel de Parâmetros Urbanísticos
            </span>
            <Badge variant={mode === 'senior' ? 'emerald' : 'rose'} size="sm">
              {mode === 'senior' ? 'Modo Sênior (Protegido)' : 'Modo Ingênuo (Vulnerável)'}
            </Badge>
          </div>
          <h2 className="text-lg font-extrabold text-white">
            {renderedData ? renderedData.nome : selectedTerrain.nome}
          </h2>
          <p className="text-xs text-slate-400">
            {renderedData ? renderedData.bairro : selectedTerrain.bairro} —{' '}
            <span className="font-mono text-cyan-300">
              {renderedData ? renderedData.codigo : selectedTerrain.codigo}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <RenderCounter componentName="TerrainDetailsCard" variant="pill" />
        </div>
      </div>

      {/* Banner de Diagnóstico de Integridade de Estado */}
      {isLoading && (
        <div className="rounded-xl p-4 bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 flex items-center gap-3 animate-pulse">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400 shrink-0" />
          <div>
            <div className="font-bold text-white">Carregando dados na rede...</div>
            <div className="text-cyan-300/80">
              Aguardando resposta assíncrona do terreno selecionado (
              <span className="font-mono font-semibold">{selectedTerrain.codigo}</span>).
            </div>
          </div>
        </div>
      )}

      {isCorrupted && (
        <div className="rounded-xl p-4 bg-rose-950/40 border-2 border-rose-600/80 text-xs text-rose-200 shadow-lg shadow-rose-950/50 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 animate-bounce" />
            <span>🚨 RACE CONDITION DETECTADA: ESTADO CORROMPIDO NA UI!</span>
          </div>

          <p className="text-rose-100 leading-relaxed">
            O usuário clicou e selecionou o{' '}
            <strong className="text-white underline">{selectedTerrain.nome}</strong> (
            <span className="font-mono">{selectedTerrain.codigo}</span>), mas a resposta assíncrona mais lenta de{' '}
            <strong className="text-white underline">{renderedData.nome}</strong> (
            <span className="font-mono">{renderedData.codigo}</span>) terminou por último e{' '}
            <strong className="text-rose-300">sobrescreveu indevidamente</strong> o estado do React!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
            <div className="bg-rose-900/30 p-2 rounded border border-rose-800/50">
              <span className="text-rose-400">Seleção Ativa (Esperado):</span>
              <div className="text-white font-bold">{selectedTerrain.codigo} ({selectedTerrain.nome.split('—')[0].trim()})</div>
            </div>
            <div className="bg-rose-900/30 p-2 rounded border border-rose-800/50">
              <span className="text-rose-400">Dados Renderizados (Real na Tela):</span>
              <div className="text-rose-300 font-bold">{renderedData.codigo} ({renderedData.nome.split('—')[0].trim()})</div>
            </div>
          </div>
        </div>
      )}

      {isConsistent && (
        <div className="rounded-xl p-3.5 bg-emerald-950/30 border border-emerald-800/50 text-xs text-emerald-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-emerald-300">Estado Íntegro e Sincronizado</span>
              <span className="text-slate-300 ml-1.5 hidden sm:inline">
                Os dados em tela correspondem exatamente ao terreno selecionado.
              </span>
            </div>
          </div>

          {renderedData.fetchedAt && (
            <div className="font-mono text-[11px] text-emerald-400 flex items-center gap-1 shrink-0">
              <Clock className="h-3 w-3" />
              <span>{renderedData.responseDurationMs}ms</span>
            </div>
          )}
        </div>
      )}

      {/* Grid de Métricas Urbanísticas */}
      {renderedData ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Maximize2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>Área do Terreno</span>
              </div>
              <div className="text-base font-bold font-mono text-white">
                {renderedData.areaM2.toLocaleString('pt-BR')} <span className="text-xs text-slate-400">m²</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                <span>Potencial Construtivo</span>
              </div>
              <div className="text-base font-bold font-mono text-cyan-300">
                {renderedData.potencialConstrutivoM2.toLocaleString('pt-BR')} <span className="text-xs text-slate-400">m²</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-amber-400" />
                <span>Coef. Aproveitamento</span>
              </div>
              <div className="text-base font-bold font-mono text-white">
                {renderedData.coefAproveitamento}x
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-emerald-400" />
                <span>Gabarito Máximo</span>
              </div>
              <div className="text-base font-bold font-mono text-white">
                {renderedData.gabaritoMaxM} <span className="text-xs text-slate-400">m</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-slate-400">Taxa de Ocupação</div>
              <div className="text-sm font-bold font-mono text-white">
                {renderedData.taxaOcupacaoPct}%
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-slate-400">Recuo Frontal / Lateral</div>
              <div className="text-sm font-bold font-mono text-white">
                {renderedData.recuoFrontalM}m / {renderedData.recuoLateralM}m
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-slate-400">Vagas Obrigatórias</div>
              <div className="text-sm font-bold font-mono text-white">
                {renderedData.vagasObrigatorias} veículos
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-slate-400 flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                <span>Risco Ambiental</span>
              </div>
              <div>
                <Badge
                  variant={
                    renderedData.riscoAmbiental === 'Baixo'
                      ? 'emerald'
                      : renderedData.riscoAmbiental === 'Médio'
                      ? 'amber'
                      : 'rose'
                  }
                  size="sm"
                >
                  {renderedData.riscoAmbiental}
                </Badge>
              </div>
            </div>
          </div>

          {/* Descrição e Zoneamento */}
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <FileText className="h-3.5 w-3.5 text-cyan-400" />
              <span>Zoneamento Urbanístico: {renderedData.zona}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {renderedData.descricao}
            </p>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-500 text-xs">
          Nenhum dado de terreno carregado no momento.
        </div>
      )}
    </Card>
  )
}
