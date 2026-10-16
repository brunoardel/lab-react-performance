import type { UrbanProject } from '../types/project'
import { Card } from '../../../components/common/Card'
import { Badge } from '../../../components/common/Badge'
import { RenderCounter } from '../../../components/common/RenderCounter'
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
} from 'lucide-react'

interface ProjectCardProps {
  project: UrbanProject
  isSelected: boolean
  isFetching?: boolean
  onSelect: () => void
}

export function ProjectCard({
  project,
  isSelected,
  isFetching = false,
  onSelect,
}: ProjectCardProps) {
  const getStatusBadge = () => {
    switch (project.status) {
      case 'aprovado':
        return (
          <Badge variant="emerald" size="sm">
            <CheckCircle2 className="h-3 w-3" />
            Aprovado
          </Badge>
        )
      case 'em_estudo':
        return (
          <Badge variant="cyan" size="sm">
            <Clock className="h-3 w-3" />
            Em Estudo
          </Badge>
        )
      case 'em_revisao':
        return (
          <Badge variant="amber" size="sm">
            <AlertCircle className="h-3 w-3" />
            Em Revisão
          </Badge>
        )
      case 'reprovado':
        return (
          <Badge variant="rose" size="sm">
            <AlertCircle className="h-3 w-3" />
            Reprovado
          </Badge>
        )
    }
  }

  return (
    <Card
      className={`cursor-pointer transition-all duration-150 p-4 relative ${
        isSelected
          ? 'border-cyan-500/80 bg-slate-900 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-950/40'
          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
      }`}
    >
      <div onClick={onSelect} className="space-y-3">
        {/* Header do Card */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] font-bold text-cyan-400">
                {project.code}
              </span>
              {getStatusBadge()}
              {isFetching && (
                <span className="inline-flex items-center gap-1 text-[10px] text-cyan-300 font-mono animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  syncing
                </span>
              )}
            </div>
            <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
              {project.name}
            </h4>
            <p className="text-[11px] text-slate-400">{project.zona}</p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <RenderCounter componentName={`Card-${project.id}`} variant="compact" />
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">Score Viabilidade</span>
              <span className="font-mono text-xs font-bold text-emerald-400">
                {project.viabilidadeScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center font-mono">
          <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800/60">
            <span className="block text-[10px] text-slate-500 font-sans">Área Terreno</span>
            <span className="text-xs font-semibold text-slate-200">
              {project.areaTerrenoM2.toLocaleString('pt-BR')} m²
            </span>
          </div>

          <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800/60">
            <span className="block text-[10px] text-slate-500 font-sans">C.A. / T.O.</span>
            <span className="text-xs font-semibold text-cyan-300">
              {project.coefAproveitamento.toFixed(1)}x / {project.taxaOcupacaoPct}%
            </span>
          </div>

          <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800/60">
            <span className="block text-[10px] text-slate-500 font-sans">Potencial Constr.</span>
            <span className="text-xs font-bold text-emerald-400">
              {project.potencialConstrutivoM2.toLocaleString('pt-BR')} m²
            </span>
          </div>
        </div>

        {/* Footer do Card */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Building2 className="h-3 w-3 text-slate-500" />
            {project.unidadesHabitacionais > 0
              ? `${project.unidadesHabitacionais} unids. • ${project.vagasObrigatorias} vagas`
              : `Uso Corporativo • ${project.vagasObrigatorias} vagas`}
          </span>

          <span className="inline-flex items-center gap-0.5 text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform text-xs">
            <span>Detalhes</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Card>
  )
}
