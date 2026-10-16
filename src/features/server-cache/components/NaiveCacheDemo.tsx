import { useState } from 'react'
import { useNaiveUrbanProjects } from '../hooks/useNaiveUrbanProjects'
import type { UrbanProjectUpdatePayload } from '../types/project'
import { ProjectCard } from './ProjectCard'
import { ProjectDetailsPanel } from './ProjectDetailsPanel'
import { ProjectParametersModal } from './ProjectParametersModal'
import { Badge } from '../../../components/common/Badge'
import { AlertCircle, RotateCcw, AlertTriangle, Layers } from 'lucide-react'

export function NaiveCacheDemo() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('prj-01')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [syncWarning, setSyncWarning] = useState<string | null>(null)

  const {
    projects,
    projectDetail,
    studies,
    isLoadingList,
    isLoadingDetail,
    isLoadingStudies,
    isMutating,
    fetchCount,
    reloadList,
    mutateParameters,
  } = useNaiveUrbanProjects(selectedProjectId)

  const handleSaveParameters = async (params: UrbanProjectUpdatePayload) => {
    if (!selectedProjectId) return

    await mutateParameters(selectedProjectId, params)
    setIsModalOpen(false)
    setSyncWarning(
      'Aviso de Dessincronização: Os parâmetros foram alterados no servidor e no detalhe, mas o card na lista à esquerda continua com os dados antigos! É necessário recarregar manualmente a lista.'
    )
  }

  return (
    <div className="space-y-6">
      {/* Banner Informativo do Modo Ingênuo */}
      <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-4 text-xs text-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">
              Abordagem Ingênua: useState + useEffect (Zero Cache)
            </h4>
            <p className="text-slate-300 text-[11px]">
              Alterne entre os projetos. Cada clique dispara novos fetches bloqueantes, gerando
              spinners repetitivos. Além disso, mutações não sincronizam listas sem recargas manuais.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="rose" size="md">
            {fetchCount} fetches disparados
          </Badge>
        </div>
      </div>

      {syncWarning && (
        <div className="rounded-xl border border-amber-900/40 bg-amber-950/30 p-4 text-xs text-amber-300 flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <span>{syncWarning}</span>
          </div>
          <button
            onClick={() => {
              reloadList()
              setSyncWarning(null)
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold text-xs transition-colors shrink-0"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Recarregar Lista Manualmente</span>
          </button>
        </div>
      )}

      {/* Grade Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-rose-400" />
              <span>Projetos Urbanísticos ({projects.length})</span>
            </h3>
            <button
              onClick={() => reloadList()}
              disabled={isLoadingList}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 underline"
            >
              <RotateCcw className="h-3 w-3" />
              Recarregar Lista
            </button>
          </div>

          {isLoadingList ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <div className="h-6 w-6 border-2 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Carregando lista sem cache...
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                  isSelected={proj.id === selectedProjectId}
                  onSelect={() => setSelectedProjectId(proj.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <ProjectDetailsPanel
            project={projectDetail}
            studies={studies}
            isLoading={isLoadingDetail}
            isStudiesLoading={isLoadingStudies}
            mode="naive"
            onEditParameters={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      {projectDetail && (
        <ProjectParametersModal
          project={projectDetail}
          isOpen={isModalOpen}
          isPending={isMutating}
          mode="naive"
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveParameters}
        />
      )}
    </div>
  )
}
