import type { TerrainId, UrbanTerrain } from '../types/terrain'

export const MOCK_TERRAINS: Record<TerrainId, UrbanTerrain> = {
  'terreno-a': {
    id: 'terreno-a',
    nome: 'Terreno A — Gleba Alphaville (Setor Norte)',
    codigo: 'TRN-ALPHA-01',
    bairro: 'Alphaville Planalto',
    zona: 'ZDU-1 (Zona de Desenvolvimento Urbano)',
    areaM2: 12500,
    recuoFrontalM: 10,
    recuoLateralM: 5,
    gabaritoMaxM: 72,
    coefAproveitamento: 4.0,
    taxaOcupacaoPct: 65,
    vagasObrigatorias: 180,
    potencialConstrutivoM2: 50000,
    riscoAmbiental: 'Baixo',
    descricao: 'Gleba de grande escala para empreendimento de uso misto corporativo e residencial de alto padrão.',
    defaultLatencyMs: 2000, // 2s conforme RF04 do PRD
  },
  'terreno-b': {
    id: 'terreno-b',
    nome: 'Terreno B — Loteamento Bela Vista (Centro Histórico)',
    codigo: 'TRN-BELAVISTA-02',
    bairro: 'Bela Vista Central',
    zona: 'ZPR-2 (Zona de Preservação e Requalificação)',
    areaM2: 3800,
    recuoFrontalM: 4,
    recuoLateralM: 2.5,
    gabaritoMaxM: 28,
    coefAproveitamento: 2.2,
    taxaOcupacaoPct: 70,
    vagasObrigatorias: 45,
    potencialConstrutivoM2: 8360,
    riscoAmbiental: 'Médio',
    descricao: 'Lote central com restrições de patrimônio histórico e gabarito moderado para habitação compacta.',
    defaultLatencyMs: 500, // 500ms conforme RF04 do PRD
  },
  'terreno-c': {
    id: 'terreno-c',
    nome: 'Terreno C — Polígono Tecnológico (Eixo Sul)',
    codigo: 'TRN-TECH-03',
    bairro: 'Parque Tecnológico',
    zona: 'ZPI-1 (Zona Predominantemente Industrial)',
    areaM2: 18400,
    recuoFrontalM: 12,
    recuoLateralM: 6,
    gabaritoMaxM: 45,
    coefAproveitamento: 3.5,
    taxaOcupacaoPct: 60,
    vagasObrigatorias: 240,
    potencialConstrutivoM2: 64400,
    riscoAmbiental: 'Médio',
    descricao: 'Área ampla para data centers, centros de P&D ou hubs logísticos de alta conectividade.',
    defaultLatencyMs: 1400,
  },
  'terreno-d': {
    id: 'terreno-d',
    nome: 'Terreno D — Reserva Parque dos Lagos (Borda Leste)',
    codigo: 'TRN-ECO-04',
    bairro: 'Jardim das Águas',
    zona: 'ZPA-3 (Zona de Proteção Ambiental)',
    areaM2: 9200,
    recuoFrontalM: 15,
    recuoLateralM: 8,
    gabaritoMaxM: 12,
    coefAproveitamento: 0.8,
    taxaOcupacaoPct: 30,
    vagasObrigatorias: 20,
    potencialConstrutivoM2: 7360,
    riscoAmbiental: 'Crítico',
    descricao: 'Área com restrição ambiental severa, permitindo apenas ocupação sustentável de baixíssimo impacto.',
    defaultLatencyMs: 300,
  },
}

export const TERRAIN_LIST = Object.values(MOCK_TERRAINS)

/**
 * Simula chamada de API assíncrona com latência configurável e suporte nativo a AbortSignal.
 * Caso o sinal seja abortado durante o voo, a Promise rejeita imediatamente com AbortError.
 */
export function fetchTerrainDetails(
  terrainId: TerrainId,
  signal?: AbortSignal,
  customLatencyMs?: number
): Promise<UrbanTerrain> {
  const terrain = MOCK_TERRAINS[terrainId]
  if (!terrain) {
    return Promise.reject(new Error(`Terreno com id '${terrainId}' não encontrado.`))
  }

  const latency = customLatencyMs !== undefined ? customLatencyMs : terrain.defaultLatencyMs

  return new Promise((resolve, reject) => {
    // 1. Checagem prévia se o sinal já foi abortado antes de iniciar
    if (signal?.aborted) {
      reject(new DOMException('A requisição foi abortada pelo chamador.', 'AbortError'))
      return
    }

    const startTime = performance.now()

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    // 2. Manipulador de cancelamento acionado quando o controller.abort() é chamado
    const abortHandler = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
      if (signal) {
        signal.removeEventListener('abort', abortHandler)
      }
      reject(new DOMException('A requisição foi cancelada com sucesso via AbortController.', 'AbortError'))
    }

    if (signal) {
      signal.addEventListener('abort', abortHandler)
    }

    // 3. Conclusão normal da requisição após a latência simulada
    timeoutId = setTimeout(() => {
      if (signal) {
        signal.removeEventListener('abort', abortHandler)
      }

      const durationMs = Math.round(performance.now() - startTime)
      const now = new Date()
      const timeFormatted = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) + '.' + String(now.getMilliseconds()).padStart(3, '0')

      resolve({
        ...terrain,
        fetchedAt: timeFormatted,
        responseDurationMs: durationMs,
      })
    }, latency)
  })
}
