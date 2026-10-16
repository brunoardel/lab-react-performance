import type {
  UrbanProject,
  UrbanStudy,
  UrbanProjectUpdatePayload,
  NetworkCallLog,
} from '../types/project'

export const INITIAL_PROJECTS: UrbanProject[] = [
  {
    id: 'prj-01',
    name: 'Complexo Cidade Nova (Gleba Sul)',
    code: 'PRJ-SP-2026-01',
    bairro: 'Pinheiros / Marginal',
    zona: 'ZEU - Zona de Estruturação Urbana',
    areaTerrenoM2: 14200,
    coefAproveitamento: 4.0,
    taxaOcupacaoPct: 65,
    gabaritoMaxM: 90,
    recuoFrontalM: 10,
    recuoLateralM: 5,
    vagasObrigatorias: 320,
    unidadesHabitacionais: 480,
    potencialConstrutivoM2: 56800,
    viabilidadeScore: 92,
    status: 'aprovado',
    updatedAt: new Date(Date.now() - 3600000 * 4).toLocaleTimeString('pt-BR'),
    serverTimestamp: Date.now() - 3600000 * 4,
  },
  {
    id: 'prj-02',
    name: 'Torre Mirante Paulista',
    code: 'PRJ-SP-2026-02',
    bairro: 'Bela Vista / Eixo Paulista',
    zona: 'ZCOR-3 - Corredor Comercial e Serviços',
    areaTerrenoM2: 3850,
    coefAproveitamento: 2.8,
    taxaOcupacaoPct: 70,
    gabaritoMaxM: 65,
    recuoFrontalM: 6,
    recuoLateralM: 3.5,
    vagasObrigatorias: 110,
    unidadesHabitacionais: 140,
    potencialConstrutivoM2: 10780,
    viabilidadeScore: 84,
    status: 'em_estudo',
    updatedAt: new Date(Date.now() - 3600000 * 2).toLocaleTimeString('pt-BR'),
    serverTimestamp: Date.now() - 3600000 * 2,
  },
  {
    id: 'prj-03',
    name: 'Hub Inovação Porto Digital',
    code: 'PRJ-SP-2026-03',
    bairro: 'Barra Funda Industrial',
    zona: 'ZPI-1 - Zona Tecnológica e de Alta Densidade',
    areaTerrenoM2: 19800,
    coefAproveitamento: 3.5,
    taxaOcupacaoPct: 60,
    gabaritoMaxM: 52,
    recuoFrontalM: 12,
    recuoLateralM: 6,
    vagasObrigatorias: 450,
    unidadesHabitacionais: 0,
    potencialConstrutivoM2: 69300,
    viabilidadeScore: 78,
    status: 'em_revisao',
    updatedAt: new Date(Date.now() - 3600000 * 6).toLocaleTimeString('pt-BR'),
    serverTimestamp: Date.now() - 3600000 * 6,
  },
  {
    id: 'prj-04',
    name: 'Residencial Parque das Palmeiras',
    code: 'PRJ-SP-2026-04',
    bairro: 'Vila Mariana Jardins',
    zona: 'ZM-2 - Zona Mista Residencial Baixa/Média',
    areaTerrenoM2: 6400,
    coefAproveitamento: 1.8,
    taxaOcupacaoPct: 50,
    gabaritoMaxM: 28,
    recuoFrontalM: 8,
    recuoLateralM: 4,
    vagasObrigatorias: 85,
    unidadesHabitacionais: 96,
    potencialConstrutivoM2: 11520,
    viabilidadeScore: 88,
    status: 'aprovado',
    updatedAt: new Date(Date.now() - 3600000 * 1).toLocaleTimeString('pt-BR'),
    serverTimestamp: Date.now() - 3600000 * 1,
  },
]

export const INITIAL_STUDIES: UrbanStudy[] = [
  {
    id: 'std-101',
    projectId: 'prj-01',
    titulo: 'Relatório de Impacto de Vizinhança e Tráfego',
    tipo: 'Impacto de Vizinhança (RIV)',
    status: 'concluido',
    responsavel: 'Engª. Mariana Cavalcanti',
    protocolo: 'RIV-2026-904',
    dataProtocolo: '12/03/2026',
    parecerTecnico: 'Mitigações de semaforização no cruzamento leste aprovadas pelo órgão municipal.',
  },
  {
    id: 'std-102',
    projectId: 'prj-01',
    titulo: 'Simulação de Conforto Térmico e Ensolaramento',
    tipo: 'Sombra e Conforto Térmico',
    status: 'concluido',
    responsavel: 'Arq. Lucas Albuquerque',
    protocolo: 'SOL-2026-112',
    dataProtocolo: '28/03/2026',
    parecerTecnico: 'Recuos atendem aos 4h mínimos de insolação de inverno nos lotes adjacentes.',
  },
  {
    id: 'std-103',
    projectId: 'prj-02',
    titulo: 'Análise de Capacidade Portante e Drenagem',
    tipo: 'Drenagem e Macrodrenagem Urbana',
    status: 'em_andamento',
    responsavel: 'Dr. Fernando Prado',
    protocolo: 'DRN-2026-443',
    dataProtocolo: '04/04/2026',
    parecerTecnico: 'Necessidade de caixa de retardo de 85m³ para atender a cota máxima de escoamento.',
  },
  {
    id: 'std-104',
    projectId: 'prj-03',
    titulo: 'Estudo de Viabilidade Econômico-Financeira e TIR',
    tipo: 'Viabilidade Econômico-Financeira',
    status: 'em_andamento',
    responsavel: 'Economista Beatriz Reis',
    protocolo: 'VIB-2026-781',
    dataProtocolo: '18/04/2026',
    parecerTecnico: 'TIR calculada em 18.4% com VGV estimado em R$ 340M sob taxa Selic neutra.',
  },
]

// Banco de dados simulado em memória (servidor remoto)
let inMemoryProjects: UrbanProject[] = JSON.parse(JSON.stringify(INITIAL_PROJECTS))
let inMemoryStudies: UrbanStudy[] = JSON.parse(JSON.stringify(INITIAL_STUDIES))

// Controle de latência e telemetria de rede
let simulatedLatencyMs = 650
let networkCallCount = 0
let networkLogs: NetworkCallLog[] = []
const listeners: Array<() => void> = []

function notifyListeners() {
  listeners.forEach((l) => l())
}

export function subscribeNetworkLogs(listener: () => void): () => void {
  listeners.push(listener)
  return () => {
    const idx = listeners.indexOf(listener)
    if (idx !== -1) listeners.splice(idx, 1)
  }
}

export function getSimulatedLatency(): number {
  return simulatedLatencyMs
}

export function setSimulatedLatency(ms: number) {
  simulatedLatencyMs = ms
}

export function getNetworkCallCount(): number {
  return networkCallCount
}

export function getNetworkLogs(): NetworkCallLog[] {
  return [...networkLogs]
}

export function clearNetworkLogs(): void {
  networkLogs = []
  networkCallCount = 0
  notifyListeners()
}

function recordNetworkCall(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH',
  endpoint: string,
  durationMs: number,
  source: 'tanstack-query' | 'naive-fetch'
) {
  networkCallCount += 1
  const log: NetworkCallLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + '.' + String(new Date().getMilliseconds()).padStart(3, '0'),
    method,
    endpoint,
    durationMs,
    status: 200,
    source,
  }
  networkLogs = [log, ...networkLogs.slice(0, 49)]
  notifyListeners()
}

/**
 * Retorna todos os projetos urbanísticos cadastrados
 */
export async function fetchProjects(
  source: 'tanstack-query' | 'naive-fetch' = 'tanstack-query'
): Promise<UrbanProject[]> {
  const startTime = performance.now()
  await new Promise((resolve) => setTimeout(resolve, simulatedLatencyMs))
  const durationMs = Math.round(performance.now() - startTime)
  recordNetworkCall('GET', '/api/v1/urban-projects', durationMs, source)
  return JSON.parse(JSON.stringify(inMemoryProjects))
}

/**
 * Retorna os detalhes de um projeto específico
 */
export async function fetchProjectById(
  id: string,
  source: 'tanstack-query' | 'naive-fetch' = 'tanstack-query'
): Promise<UrbanProject> {
  const startTime = performance.now()
  await new Promise((resolve) => setTimeout(resolve, simulatedLatencyMs))
  const project = inMemoryProjects.find((p) => p.id === id)
  const durationMs = Math.round(performance.now() - startTime)
  recordNetworkCall('GET', `/api/v1/urban-projects/${id}`, durationMs, source)

  if (!project) {
    throw new Error(`Projeto com ID '${id}' não encontrado no servidor.`)
  }
  return JSON.parse(JSON.stringify(project))
}

/**
 * Retorna os estudos técnicos associados a um projeto
 */
export async function fetchStudiesByProjectId(
  projectId: string,
  source: 'tanstack-query' | 'naive-fetch' = 'tanstack-query'
): Promise<UrbanStudy[]> {
  const startTime = performance.now()
  await new Promise((resolve) => setTimeout(resolve, simulatedLatencyMs))
  const studies = inMemoryStudies.filter((s) => s.projectId === projectId)
  const durationMs = Math.round(performance.now() - startTime)
  recordNetworkCall('GET', `/api/v1/urban-projects/${projectId}/studies`, durationMs, source)
  return JSON.parse(JSON.stringify(studies))
}

/**
 * Atualiza parâmetros urbanísticos no servidor (Mutação)
 */
export async function updateProjectParameters(
  id: string,
  updates: UrbanProjectUpdatePayload,
  source: 'tanstack-query' | 'naive-fetch' = 'tanstack-query'
): Promise<UrbanProject> {
  const startTime = performance.now()
  await new Promise((resolve) => setTimeout(resolve, simulatedLatencyMs))

  const index = inMemoryProjects.findIndex((p) => p.id === id)
  if (index === -1) {
    throw new Error(`Projeto com ID '${id}' não existe no servidor.`)
  }

  const existing = inMemoryProjects[index]
  const potencialConstrutivoM2 = Math.round(existing.areaTerrenoM2 * updates.coefAproveitamento)

  // Recalcula score de viabilidade de acordo com parâmetros
  let viabilidadeScore = 80
  if (updates.coefAproveitamento >= 3.5) viabilidadeScore += 10
  if (updates.taxaOcupacaoPct <= 65) viabilidadeScore += 5
  if (updates.status === 'aprovado') viabilidadeScore += 5
  viabilidadeScore = Math.min(100, Math.max(40, viabilidadeScore))

  const updated: UrbanProject = {
    ...existing,
    ...updates,
    potencialConstrutivoM2,
    viabilidadeScore,
    updatedAt: new Date().toLocaleTimeString('pt-BR'),
    serverTimestamp: Date.now(),
  }

  inMemoryProjects[index] = updated
  const durationMs = Math.round(performance.now() - startTime)
  recordNetworkCall('PATCH', `/api/v1/urban-projects/${id}/parameters`, durationMs, source)

  return JSON.parse(JSON.stringify(updated))
}

/**
 * Restaura o banco de dados simulado para o estado inicial
 */
export function resetDatabase(): void {
  inMemoryProjects = JSON.parse(JSON.stringify(INITIAL_PROJECTS))
  inMemoryStudies = JSON.parse(JSON.stringify(INITIAL_STUDIES))
  clearNetworkLogs()
}
