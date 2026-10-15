export type ViabilityStatus = 'Viavel' | 'Atencao' | 'Inviavel'

export interface UrbanScenario {
  id: string
  codigo: string
  nome: string
  zona: string
  bairro: string
  areaTerreno: number // m²
  areaConstruida: number // m²
  coeficienteAproveitamento: number // x
  taxaOcupacao: number // %
  gabaritoPavimentos: number // pavimentos
  unidades: number
  vagas: number
  potencialVGV: number // R$
  eficienciaPlanta: number // %
  statusViabilidade: ViabilityStatus
}

export type SortField = 'codigo' | 'nome' | 'areaTerreno' | 'areaConstruida' | 'potencialVGV' | 'unidades' | 'statusViabilidade'
export type SortDirection = 'asc' | 'desc'
