import type { UrbanScenario, ViabilityStatus } from '../types/scenario'

const ZONAS = ['ZUC-1', 'ZM-3a', 'ZPR-2', 'ZEIS-1', 'ZCOR-2', 'ZEU', 'ZDE-1']
const BAIRROS = [
  'Pinheiros',
  'Vila Mariana',
  'Brooklin',
  'Moema',
  'Itaim Bibi',
  'Perdizes',
  'Bela Vista',
  'Santana',
  'Tatuapé',
  'Santo Amaro',
  'Jardins',
  'Lapa',
  'Vila Madalena',
  'Mooca',
  'Consolação',
]

const PREFIXOS = [
  'Residencial Torre',
  'Complexo Mixed-Use',
  'Studio Urbano',
  'Implantação EcoVila',
  'Condomínio Parque',
  'Edifício Skyline',
  'Habitação Alpha',
  'Plaza Boulevard',
  'Vanguard Lofts',
  'Infinity Tower',
  'Jardins Urban Lab',
  'Nexus Corporate & Living',
]

const SUFIXOS = [
  'Horizonte',
  'Aurora',
  'Metrópole',
  'das Águas',
  'Prime',
  'Verde',
  'Central',
  'Sustentável',
  'Nova Era',
  'Parque',
  'Boutique',
  'Mirante',
]

/**
 * Gerador determinístico baseado em semente (PRNG pseudo-aleatório)
 * para garantir consistência perfeita entre re-renders e sessões.
 */
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

export function generateUrbanScenarios(count = 2500): UrbanScenario[] {
  const scenarios: UrbanScenario[] = []

  for (let i = 0; i < count; i++) {
    const seed = i + 42
    const r1 = pseudoRandom(seed)
    const r2 = pseudoRandom(seed + 1)
    const r3 = pseudoRandom(seed + 2)
    const r4 = pseudoRandom(seed + 3)
    const r5 = pseudoRandom(seed + 4)
    const r6 = pseudoRandom(seed + 5)

    const zona = ZONAS[Math.floor(r1 * ZONAS.length)]
    const bairro = BAIRROS[Math.floor(r2 * BAIRROS.length)]
    const prefixo = PREFIXOS[Math.floor(r3 * PREFIXOS.length)]
    const sufixo = SUFIXOS[Math.floor(r4 * SUFIXOS.length)]

    const codigo = `CEN-${String(i + 1).padStart(4, '0')}`
    const nome = `${prefixo} ${sufixo} #${i + 1}`

    const areaTerreno = Math.round(500 + r1 * 9500) // 500m² a 10.000m²
    const ca = Number((1.2 + r2 * 3.3).toFixed(2)) // 1.2 a 4.5
    const areaConstruida = Math.round(areaTerreno * ca)
    const taxaOcupacao = Math.round(40 + r3 * 30) // 40% a 70%
    const gabaritoPavimentos = Math.round(4 + r4 * 28) // 4 a 32 pavimentos
    const unidades = Math.max(12, Math.round(areaConstruida / (45 + r5 * 55)))
    const vagas = Math.round(unidades * (0.8 + r6 * 0.7))
    const m2PrecoVenda = 9500 + r1 * 12500 // R$ 9.500 a R$ 22.000/m²
    const potencialVGV = Math.round((areaConstruida * 0.78) * m2PrecoVenda)
    const eficienciaPlanta = Math.round(74 + r5 * 14) // 74% a 88%

    let statusViabilidade: ViabilityStatus = 'Viavel'
    if (ca > 3.8 || taxaOcupacao > 65 || gabaritoPavimentos > 28) {
      statusViabilidade = r3 > 0.4 ? 'Atencao' : 'Inviavel'
    } else if (r2 < 0.15) {
      statusViabilidade = 'Inviavel'
    }

    scenarios.push({
      id: `scen-${i + 1}`,
      codigo,
      nome,
      zona,
      bairro,
      areaTerreno,
      areaConstruida,
      coeficienteAproveitamento: ca,
      taxaOcupacao,
      gabaritoPavimentos,
      unidades,
      vagas,
      potencialVGV,
      eficienciaPlanta,
      statusViabilidade,
    })
  }

  return scenarios
}
