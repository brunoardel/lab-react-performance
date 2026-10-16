export type ProjectStatus = 'em_estudo' | 'aprovado' | 'reprovado' | 'em_revisao'

export interface UrbanProject {
  id: string
  name: string
  code: string
  bairro: string
  zona: string
  areaTerrenoM2: number
  coefAproveitamento: number
  taxaOcupacaoPct: number
  gabaritoMaxM: number
  recuoFrontalM: number
  recuoLateralM: number
  vagasObrigatorias: number
  unidadesHabitacionais: number
  potencialConstrutivoM2: number
  viabilidadeScore: number // 0 a 100
  status: ProjectStatus
  updatedAt: string
  serverTimestamp: number
}

export type StudyType =
  | 'Impacto de Vizinhança (RIV)'
  | 'Sombra e Conforto Térmico'
  | 'Viabilidade Econômico-Financeira'
  | 'Drenagem e Macrodrenagem Urbana'

export interface UrbanStudy {
  id: string
  projectId: string
  titulo: string
  tipo: StudyType
  status: 'concluido' | 'em_andamento' | 'pendente'
  responsavel: string
  protocolo: string
  dataProtocolo: string
  parecerTecnico: string
}

export interface UrbanProjectUpdatePayload {
  coefAproveitamento: number
  taxaOcupacaoPct: number
  gabaritoMaxM: number
  recuoFrontalM: number
  recuoLateralM: number
  unidadesHabitacionais: number
  status: ProjectStatus
}

export interface NetworkCallLog {
  id: string
  timestamp: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH'
  endpoint: string
  durationMs: number
  status: number
  source: 'tanstack-query' | 'naive-fetch'
}
