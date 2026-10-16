import { useState } from 'react'
import {
  useUrbanProjectsList,
  useUrbanProjectDetail,
  useUrbanProjectStudies,
  useUpdateProjectParameters,
} from '../hooks/useUrbanProjects'
import type { UrbanProjectUpdatePayload } from '../types/project'
import { ProjectCard } from './ProjectCard'
import { ProjectDetailsPanel } from './ProjectDetailsPanel'
import { ProjectParametersModal } from './ProjectParametersModal'
import { CheckCircle2, Zap, Database } from 'lucide-react'

export function SeniorCacheDemo() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('prj-01')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [lastInvalidatedTime, setLastInvalidatedTime] = useState<string | null>(null)

  // 1. Queries gerenciadas via TanStack Query com staleTime de 1 minuto (RF05)
  const {
    data: projects = [],
    isLoading: isListLoading,
    isFetching: isListFetching,
    refetch: refetchList,
  } = useUrbanProjectsList()

  const {
    data: selectedProject = null,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
    refetch: refetchDetail,
  } = useUrbanProjectDetail(selectedProjectId)

  const {
    data: studies = [],
    isLoading: isStudiesLoading,
  } = useUrbanProjectStudies(selectedProjectId)

  // 2. Mutação com Invalidação Declarativa de Cache (RF05)
  const updateMutation = useUpdateProjectParameters()

  const handleSaveParameters = (params: UrbanProjectUpdatePayload) => {
    if (!selectedProjectId) return

    updateMutation.mutate(
      { id: selectedProjectId, params },
      {
        onSuccess: () => {
          setIsModalOpen(false)
          setLastInvalidatedTime(
            new Date().toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          )
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Banner Informativo do Modo Sênior */}
      <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4 text-xs text-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">
              Arquitetura Sênior Ativa: TanStack Query + Invalidação Declarativa
            </h4>
            <p className="text-slate-300 text-[11px]">
              Alterne entre os projetos abaixo. Se o dado foi consultado nos últimos 60 segundos (<code className="text-emerald-400 font-mono">staleTime: 1min</code>),
              a resposta é instantânea (0ms de latência percebida) sem disparar requisições repetitivas de rede.
            </p>
          </div>
        </div>

        {lastInvalidatedTime && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-[11px] text-emerald-300 font-mono">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
            <span>Última invalidação: {lastInvalidatedTime}</span>
          </div>
        )}
      </div>

      {/* Grade Principal: Projetos Urbanísticos (Master) + Detalhes (Detail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Lista de Projetos Urbanísticos */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="h-4 w-4 text-cyan-400" />
              <span>Projetos Urbanísticos ({projects.length})</span>
            </h3>
            {isListFetching && !isListLoading && (
              <span className="text-[10px] text-cyan-300 font-mono animate-pulse">
                Revalidando lista...
              </span>
            )}
          </div>

          {isListLoading ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <div className="h-6 w-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Carregando projetos urbanísticos...
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                  isSelected={proj.id === selectedProjectId}
                  isFetching={proj.id === selectedProjectId && isDetailFetching}
                  onSelect={() => setSelectedProjectId(proj.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Coluna Direita: Painel de Detalhes do Projeto Selecionado */}
        <div className="lg:col-span-7">
          <ProjectDetailsPanel
            project={selectedProject}
            studies={studies}
            isLoading={isDetailLoading}
            isFetching={isDetailFetching}
            isStudiesLoading={isStudiesLoading}
            mode="senior"
            onEditParameters={() => setIsModalOpen(true)}
            onRefetch={() => {
              refetchList()
              refetchDetail()
            }}
          />
        </div>
      </div>

      {/* Modal de Edição de Parâmetros com Mutação Declarativa */}
      {selectedProject && (
        <ProjectParametersModal
          project={selectedProject}
          isOpen={isModalOpen}
          isPending={updateMutation.isPending}
          mode="senior"
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveParameters}
        />
      )}
    </div>
  )
}
