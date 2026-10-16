import type { UrbanProject, UrbanStudy } from '../types/project'
import { Card } from '../../../components/common/Card'
import { Badge } from '../../../components/common/Badge'
import { RenderCounter } from '../../../components/common/RenderCounter'
import {
  Sliders,
  RefreshCw,
  FileText,
  Clock,
  CheckCircle2,
  Building,
  Sparkles,
  Radio,
} from 'lucide-react'

interface ProjectDetailsPanelProps {
  project: UrbanProject | null
  studies: UrbanStudy[]
  isLoading: boolean
  isFetching?: boolean
  isStudiesLoading?: boolean
  onEditParameters: () => void
  onRefetch?: () => void
  mode: 'senior' | 'naive'
}

export function ProjectDetailsPanel({
  project,
  studies,
  isLoading,
  isFetching = false,
  isStudiesLoading = false,
  onEditParameters,
  onRefetch,
  mode,
}: ProjectDetailsPanelProps) {
  if (isLoading) {
    return (
      <Card className="p-8 border-slate-800 text-center space-y-4">
        <div className="h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white">Carregando dados do servidor...</h4>
          <p className="text-xs text-slate-400">
            {mode === 'naive'
              ? 'Abordagem ingênua: Sem cache, aguardando latência de rede completa.'
              : 'Recuperando dados da API...'}
          </p>
        </div>
      </Card>
    )
  }

  if (!project) {
    return (
      <Card className="p-8 border-dashed border-slate-800 text-center text-slate-400 text-xs">
        Selecione um projeto na lista para visualizar seus parâmetros urbanísticos detalhados.
      </Card>
    )
  }

  return (
    <Card className="border-slate-800 bg-slate-900/90 shadow-xl space-y-6">
      {/* Header do Painel de Detalhes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-cyan-400">{project.code}</span>
            <Badge variant="indigo">{project.bairro}</Badge>
            {isFetching && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                <Radio className="h-3 w-3 animate-spin" />
                Revalidando em background
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white">{project.name}</h3>
          <p className="text-xs text-slate-400">{project.zona}</p>
        </div>

        <div className="flex items-center gap-2">
          <RenderCounter componentName={`Detail-${project.id}`} variant="pill" />

          {onRefetch && (
            <button
              onClick={onRefetch}
              title="Disparar refetch manual"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={onEditParameters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md shadow-cyan-950/40"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Editar Parâmetros</span>
          </button>
        </div>
      </div>

      {/* Grade de Parâmetros Urbanísticos */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Building className="h-3.5 w-3.5 text-cyan-400" />
          <span>Parâmetros de Zoneamento & Ocupação do Solo</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="block text-[10px] text-slate-500 font-sans">Coef. Aproveitamento</span>
            <span className="text-base font-bold text-cyan-300">
              {project.coefAproveitamento.toFixed(1)}x
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="block text-[10px] text-slate-500 font-sans">Taxa de Ocupação</span>
            <span className="text-base font-bold text-cyan-300">
              {project.taxaOcupacaoPct}%
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="block text-[10px] text-slate-500 font-sans">Gabarito Máximo</span>
            <span className="text-base font-bold text-white">
              {project.gabaritoMaxM} metros
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="block text-[10px] text-slate-500 font-sans">Potencial Construtivo</span>
            <span className="text-base font-bold text-emerald-400">
              {project.potencialConstrutivoM2.toLocaleString('pt-BR')} m²
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="block text-[10px] text-slate-500 font-sans">Recuo Frontal</span>
            <span className="text-sm font-semibold text-slate-200">
              {project.recuoFrontalM} m
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="block text-[10px] text-slate-500 font-sans">Recuo Lateral</span>
            <span className="text-sm font-semibold text-slate-200">
              {project.recuoLateralM} m
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="block text-[10px] text-slate-500 font-sans">Vagas Exigidas</span>
            <span className="text-sm font-semibold text-slate-200">
              {project.vagasObrigatorias} vagas
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="block text-[10px] text-slate-500 font-sans">Unidades Previstas</span>
            <span className="text-sm font-semibold text-slate-200">
              {project.unidadesHabitacionais > 0 ? `${project.unidadesHabitacionais} unids.` : 'Corporativo'}
            </span>
          </div>
        </div>
      </div>

      {/* Lista de Estudos Técnicos Vinculados */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-indigo-400" />
            <span>Estudos Técnicos & Protocolos Urbanísticos</span>
          </h4>
          <span className="text-[11px] text-slate-400">
            {studies.length} estudo(s) associado(s)
          </span>
        </div>

        {isStudiesLoading ? (
          <div className="py-4 text-center text-xs text-slate-400">
            Carregando estudos técnicos...
          </div>
        ) : studies.length === 0 ? (
          <div className="py-4 text-center text-xs text-slate-500 italic">
            Nenhum estudo técnico protocolado para este projeto.
          </div>
        ) : (
          <div className="space-y-2">
            {studies.map((study) => (
              <div
                key={study.id}
                className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-cyan-400 font-semibold">
                      {study.protocolo}
                    </span>
                    <span className="font-semibold text-slate-200">{study.titulo}</span>
                  </div>
                  <Badge
                    variant={study.status === 'concluido' ? 'emerald' : 'amber'}
                    size="sm"
                  >
                    {study.status === 'concluido' ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    {study.status === 'concluido' ? 'Concluído' : 'Em Andamento'}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-400">{study.parecerTecnico}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                  <span>Resp: {study.responsavel}</span>
                  <span>Protocolado em: {study.dataProtocolo}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timestamp de Atualização */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Última sincronização no servidor: {project.updatedAt}</span>
        <span className="flex items-center gap-1 text-emerald-400/80">
          <Sparkles className="h-3 w-3" />
          Dados íntegros no banco de dados remoto
        </span>
      </div>
    </Card>
  )
}
