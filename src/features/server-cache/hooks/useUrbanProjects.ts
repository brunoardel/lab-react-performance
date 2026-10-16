import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import {
  fetchProjects,
  fetchProjectById,
  fetchStudiesByProjectId,
  updateProjectParameters,
} from '../services/projectsApi'
import type { UrbanProjectUpdatePayload } from '../types/project'

export const URBAN_QUERY_KEYS = {
  all: ['urban-projects'] as const,
  list: ['urban-projects', 'list'] as const,
  detail: (id: string) => ['urban-projects', 'detail', id] as const,
  studies: (id: string) => ['urban-projects', 'studies', id] as const,
}

// Stale time padrão: 1 minuto (60.000 ms), conforme requisito RF05 do PRD
export const STALE_TIME_MS = 60 * 1000

/**
 * Hook para obter a lista de projetos urbanísticos com cache inteligente e staleTime de 1 minuto.
 */
export function useUrbanProjectsList() {
  return useQuery({
    queryKey: URBAN_QUERY_KEYS.list,
    queryFn: () => fetchProjects('tanstack-query'),
    staleTime: STALE_TIME_MS,
  })
}

/**
 * Hook para obter os detalhes completos de um projeto urbanístico específico.
 */
export function useUrbanProjectDetail(id: string | null) {
  return useQuery({
    queryKey: URBAN_QUERY_KEYS.detail(id ?? ''),
    queryFn: () => fetchProjectById(id!, 'tanstack-query'),
    enabled: Boolean(id),
    staleTime: STALE_TIME_MS,
  })
}

/**
 * Hook para obter os estudos técnicos urbanísticos de um projeto.
 */
export function useUrbanProjectStudies(projectId: string | null) {
  return useQuery({
    queryKey: URBAN_QUERY_KEYS.studies(projectId ?? ''),
    queryFn: () => fetchStudiesByProjectId(projectId!, 'tanstack-query'),
    enabled: Boolean(projectId),
    staleTime: STALE_TIME_MS,
  })
}

/**
 * Hook de mutação para salvar novos parâmetros urbanísticos.
 * Ao concluir com sucesso, executa a Invalidação Declarativa de Cache via queryClient.invalidateQueries.
 */
export function useUpdateProjectParameters() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      params,
    }: {
      id: string
      params: UrbanProjectUpdatePayload
    }) => updateProjectParameters(id, params, 'tanstack-query'),

    onSuccess: (_, variables) => {
      // Invalidação declarativa (RF05 do PRD):
      // 1. Invalida a lista geral para atualizar indicadores e potenciais construtivos
      queryClient.invalidateQueries({ queryKey: URBAN_QUERY_KEYS.list })

      // 2. Invalida o detalhe específico do projeto editado
      queryClient.invalidateQueries({
        queryKey: URBAN_QUERY_KEYS.detail(variables.id),
      })
    },
  })
}

export interface QueryCacheItemInfo {
  queryKeyString: string
  queryKey: readonly unknown[]
  status: 'fresh' | 'stale' | 'fetching' | 'inactive'
  dataUpdatedAt: number
  dataUpdatedFormatted: string
  secondsRemainingToStale: number
  isFetching: boolean
  fetchFailureCount: number
}

/**
 * Hook de telemetria e inspeção em tempo real das Query Keys ativas no QueryClient.
 * Atualiza o contador de segundos restantes para stale a cada segundo.
 */
export function useQueryCacheInspector() {
  const queryClient = useQueryClient()
  const [now, setNow] = useState(() => Date.now())

  // Atualização periódica a cada segundo para o contador de staleTime
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    // Inscrever no QueryCache para reagir instantaneamente a qualquer evento de fetch/invalidação
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      setNow(Date.now())
    })

    return () => {
      clearInterval(timer)
      unsubscribe()
    }
  }, [queryClient])

  const queries = queryClient
    .getQueryCache()
    .findAll({ queryKey: URBAN_QUERY_KEYS.all })

  const inspectedQueries: QueryCacheItemInfo[] = queries.map((query) => {
    const isFetching = query.state.fetchStatus === 'fetching'
    const isStale = query.isStale()
    const updatedAt = query.state.dataUpdatedAt
    const staleTime =
      (query.options as { staleTime?: number }).staleTime ?? STALE_TIME_MS
    const elapsedSinceUpdate = updatedAt > 0 ? now - updatedAt : Infinity
    const secondsRemaining = Math.max(
      0,
      Math.ceil((staleTime - elapsedSinceUpdate) / 1000)
    )

    let status: 'fresh' | 'stale' | 'fetching' | 'inactive' = 'fresh'
    if (isFetching) {
      status = 'fetching'
    } else if (query.getObserversCount() === 0) {
      status = 'inactive'
    } else if (isStale || secondsRemaining <= 0) {
      status = 'stale'
    } else {
      status = 'fresh'
    }

    return {
      queryKeyString: JSON.stringify(query.queryKey),
      queryKey: query.queryKey,
      status,
      dataUpdatedAt: updatedAt,
      dataUpdatedFormatted:
        updatedAt > 0
          ? new Date(updatedAt).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          : '—',
      secondsRemainingToStale: secondsRemaining,
      isFetching,
      fetchFailureCount: query.state.fetchFailureCount,
    }
  })

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: URBAN_QUERY_KEYS.all })
  }

  const invalidateQueryKey = (queryKey: readonly unknown[]) => {
    queryClient.invalidateQueries({ queryKey, exact: true })
  }

  const invalidateList = () => {
    queryClient.invalidateQueries({ queryKey: URBAN_QUERY_KEYS.list })
  }

  const invalidateDetail = (id: string) => {
    queryClient.invalidateQueries({ queryKey: URBAN_QUERY_KEYS.detail(id) })
  }

  const refetchAll = () => {
    queryClient.refetchQueries({ queryKey: URBAN_QUERY_KEYS.all })
  }

  const clearCache = () => {
    queryClient.removeQueries({ queryKey: URBAN_QUERY_KEYS.all })
    setNow(Date.now())
  }

  return {
    inspectedQueries,
    totalCachedQueries: inspectedQueries.length,
    invalidateAll,
    invalidateQueryKey,
    invalidateList,
    invalidateDetail,
    refetchAll,
    clearCache,
  }
}
