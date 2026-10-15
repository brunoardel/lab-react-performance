export type TerrainId = 'terreno-a' | 'terreno-b' | 'terreno-c' | 'terreno-d'

export interface UrbanTerrain {
  id: TerrainId
  nome: string
  codigo: string
  bairro: string
  zona: string
  areaM2: number
  recuoFrontalM: number
  recuoLateralM: number
  gabaritoMaxM: number
  coefAproveitamento: number
  taxaOcupacaoPct: number
  vagasObrigatorias: number
  potencialConstrutivoM2: number
  riscoAmbiental: 'Baixo' | 'Médio' | 'Alto' | 'Crítico'
  descricao: string
  defaultLatencyMs: number
  fetchedAt?: string
  responseDurationMs?: number
}

export interface NetworkLogEntry {
  id: string
  terrainId: TerrainId
  terrainName: string
  startTime: number
  latencyMs: number
  status: 'pending' | 'completed' | 'aborted'
  completedAt?: number
  abortedAt?: number
  mode: 'naive' | 'senior'
  causedRaceConditionBug?: boolean
}
