import { useState, useEffect, useCallback } from 'react'
import {
  fetchProjects,
  fetchProjectById,
  fetchStudiesByProjectId,
  updateProjectParameters,
} from '../services/projectsApi'
import type {
  UrbanProject,
  UrbanStudy,
  UrbanProjectUpdatePayload,
} from '../types/project'

export function useNaiveUrbanProjects(selectedProjectId: string | null) {
  const [projects, setProjects] = useState<UrbanProject[]>([])
  const [projectDetail, setProjectDetail] = useState<UrbanProject | null>(null)
  const [studies, setStudies] = useState<UrbanStudy[]>([])

  const [isLoadingList, setIsLoadingList] = useState(false)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [isLoadingStudies, setIsLoadingStudies] = useState(false)
  const [isMutating, setIsMutating] = useState(false)

  const [fetchCount, setFetchCount] = useState(0)

  // 1. Carregar lista de projetos toda vez que o componente monta
  const loadProjects = useCallback(async () => {
    setIsLoadingList(true)
    try {
      const data = await fetchProjects('naive-fetch')
      setProjects(data)
      setFetchCount((prev) => prev + 1)
    } finally {
      setIsLoadingList(false)
    }
  }, [])

  // eslint-disable-next-line react/set-state-in-effect
  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  // 2. Carregar detalhes do projeto toda vez que a seleção muda (sem cache em memória)
  // eslint-disable-next-line react/set-state-in-effect
  useEffect(() => {
    if (!selectedProjectId) {
      setProjectDetail(null)
      setStudies([])
      return
    }

    let isMounted = true
    setIsLoadingDetail(true)
    setIsLoadingStudies(true)

    // Dispara chamadas repetitivas mesmo se já visitado antes (Zero Cache)
    fetchProjectById(selectedProjectId, 'naive-fetch')
      .then((data) => {
        if (isMounted) {
          setProjectDetail(data)
          setFetchCount((prev) => prev + 1)
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingDetail(false)
      })

    fetchStudiesByProjectId(selectedProjectId, 'naive-fetch')
      .then((data) => {
        if (isMounted) {
          setStudies(data)
          setFetchCount((prev) => prev + 1)
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingStudies(false)
      })

    return () => {
      isMounted = false
    }
  }, [selectedProjectId])

  // 3. Atualizar parâmetros (sem invalidação declarativa de cache)
  const mutateParameters = async (
    id: string,
    params: UrbanProjectUpdatePayload
  ) => {
    setIsMutating(true)
    try {
      const updated = await updateProjectParameters(id, params, 'naive-fetch')
      setProjectDetail(updated)
      // Nota didática: No modo ingênuo sem React Query, a lista geral `projects` NÃO
      // se atualiza automaticamente a menos que haja um refetch manual ou sincronização imperativa.
      return updated
    } finally {
      setIsMutating(false)
    }
  }

  return {
    projects,
    projectDetail,
    studies,
    isLoadingList,
    isLoadingDetail,
    isLoadingStudies,
    isMutating,
    fetchCount,
    reloadList: loadProjects,
    mutateParameters,
  }
}
