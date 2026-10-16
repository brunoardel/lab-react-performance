import { useState } from 'react'
import type { UrbanProject, UrbanProjectUpdatePayload, ProjectStatus } from '../types/project'
import { Card } from '../../../components/common/Card'
import { Badge } from '../../../components/common/Badge'
import { X, Sparkles, Sliders, CheckCircle2 } from 'lucide-react'

interface ProjectParametersModalProps {
  project: UrbanProject
  isOpen: boolean
  isPending: boolean
  mode: 'senior' | 'naive'
  onClose: () => void
  onSave: (payload: UrbanProjectUpdatePayload) => void
}

export function ProjectParametersModal({
  project,
  isOpen,
  isPending,
  mode,
  onClose,
  onSave,
}: ProjectParametersModalProps) {
  const [coefAproveitamento, setCoefAproveitamento] = useState(project.coefAproveitamento)
  const [taxaOcupacaoPct, setTaxaOcupacaoPct] = useState(project.taxaOcupacaoPct)
  const [gabaritoMaxM, setGabaritoMaxM] = useState(project.gabaritoMaxM)
  const [recuoFrontalM, setRecuoFrontalM] = useState(project.recuoFrontalM)
  const [recuoLateralM, setRecuoLateralM] = useState(project.recuoLateralM)
  const [unidadesHabitacionais, setUnidadesHabitacionais] = useState(project.unidadesHabitacionais)
  const [status, setStatus] = useState<ProjectStatus>(project.status)

  if (!isOpen) return null

  const potencialCalculado = Math.round(project.areaTerrenoM2 * coefAproveitamento)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      coefAproveitamento,
      taxaOcupacaoPct,
      gabaritoMaxM,
      recuoFrontalM,
      recuoLateralM,
      unidadesHabitacionais,
      status,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl">
        <Card className="border-slate-700 bg-slate-900 shadow-2xl relative overflow-hidden">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-cyan-400 font-bold">{project.code}</span>
                <Badge variant={mode === 'senior' ? 'emerald' : 'rose'}>
                  {mode === 'senior' ? 'TanStack Query (Mutação + Invalidação)' : 'Modo Ingênuo (useState)'}
                </Badge>
              </div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-cyan-400" />
                Editar Parâmetros Urbanísticos
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{project.name}</p>
            </div>

            <button
              onClick={onClose}
              disabled={isPending}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {/* Projeção de Potencial Construtivo em Tempo Real */}
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Área do Terreno: </span>
                <span className="font-mono font-semibold text-slate-200">
                  {project.areaTerrenoM2.toLocaleString('pt-BR')} m²
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Novo Potencial Construtivo: </span>
                <span className="font-mono font-bold text-cyan-300">
                  {potencialCalculado.toLocaleString('pt-BR')} m²
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Coeficiente de Aproveitamento (C.A.)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1.0"
                    max="6.0"
                    step="0.1"
                    value={coefAproveitamento}
                    onChange={(e) => setCoefAproveitamento(parseFloat(e.target.value))}
                    className="flex-1 accent-cyan-400 cursor-pointer"
                  />
                  <span className="font-mono text-xs font-bold text-cyan-400 w-10 text-right">
                    {coefAproveitamento.toFixed(1)}x
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Taxa de Ocupação Máxima (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="30"
                    max="85"
                    step="5"
                    value={taxaOcupacaoPct}
                    onChange={(e) => setTaxaOcupacaoPct(parseInt(e.target.value))}
                    className="flex-1 accent-cyan-400 cursor-pointer"
                  />
                  <span className="font-mono text-xs font-bold text-cyan-400 w-10 text-right">
                    {taxaOcupacaoPct}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Gabarito Máx (m)
                </label>
                <input
                  type="number"
                  min="10"
                  max="150"
                  value={gabaritoMaxM}
                  onChange={(e) => setGabaritoMaxM(parseInt(e.target.value) || 0)}
                  className="w-full rounded bg-slate-950 border border-slate-700 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Recuo Frontal (m)
                </label>
                <input
                  type="number"
                  min="3"
                  max="25"
                  value={recuoFrontalM}
                  onChange={(e) => setRecuoFrontalM(parseInt(e.target.value) || 0)}
                  className="w-full rounded bg-slate-950 border border-slate-700 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Recuo Lateral (m)
                </label>
                <input
                  type="number"
                  min="2"
                  max="15"
                  value={recuoLateralM}
                  onChange={(e) => setRecuoLateralM(parseInt(e.target.value) || 0)}
                  className="w-full rounded bg-slate-950 border border-slate-700 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Unidades Habitacionais
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={unidadesHabitacionais}
                  onChange={(e) => setUnidadesHabitacionais(parseInt(e.target.value) || 0)}
                  className="w-full rounded bg-slate-950 border border-slate-700 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Status de Viabilidade
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full rounded bg-slate-950 border border-slate-700 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="em_estudo">Em Estudo</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="em_revisao">Em Revisão</option>
                  <option value="reprovado">Reprovado</option>
                </select>
              </div>
            </div>

            {/* Explicação de arquitetura contextual */}
            <div
              className={`p-3 rounded-lg border text-xs ${
                mode === 'senior'
                  ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-900/40 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold mb-1">
                {mode === 'senior' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Sparkles className="h-4 w-4 text-rose-400" />
                )}
                <span>
                  {mode === 'senior'
                    ? 'Comportamento TanStack Query:'
                    : 'Comportamento Ingênuo (useState):'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                {mode === 'senior'
                  ? 'Ao salvar, a mutação dispara queryClient.invalidateQueries({ queryKey: ["urban-projects"] }). A lista principal e os detalhes são sincronizados em background automaticamente, mantendo a consistência global sem prop-drilling.'
                  : 'Ao salvar, apenas o estado local do modal/detalhe é atualizado. A lista geral de projetos permanecerá com valores desatualizados até que alguém force uma recarga manual completa.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isPending}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-lg ${
                  mode === 'senior'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/40'
                } ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isPending ? (
                  <>
                    <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Salvando no Servidor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Salvar e Disparar Invalidação</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
