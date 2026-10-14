import { z } from 'zod'

export const zoningSchema = z.object({
  // Dimensões do Terreno
  areaTerreno: z.number().min(50, 'Área mínima de 50 m²').max(100000, 'Área máxima de 100.000 m²'),
  testadaPrincipal: z.number().min(5, 'Testada mínima de 5 m').max(500, 'Máximo 500 m'),
  profundidadeLote: z.number().min(10, 'Profundidade mínima 10 m').max(1000, 'Máximo 1.000 m'),

  // Coeficientes & Índices Urbanísticos
  coeficienteAproveitamentoBasico: z.number().min(0.1, 'Mínimo 0.1').max(6.0, 'Máximo 6.0'),
  coeficienteAproveitamentoMaximo: z.number().min(0.5, 'Mínimo 0.5').max(8.0, 'Máximo 8.0'),
  taxaOcupacaoMaxima: z.number().min(10, 'Mínimo 10%').max(90, 'Máximo 90%'),
  taxaPermeabilidadeMinima: z.number().min(5, 'Mínimo 5%').max(50, 'Máximo 50%'),
  cotaIdealPorUnidade: z.number().min(10, 'Mínimo 10 m²').max(500, 'Máximo 500 m²'),

  // Recuos Obrigatórios (m)
  recuoFrontal: z.number().min(0, 'Não pode ser negativo').max(30, 'Máximo 30 m'),
  recuoLateralEsquerdo: z.number().min(0, 'Não pode ser negativo').max(20, 'Máximo 20 m'),
  recuoLateralDireito: z.number().min(0, 'Não pode ser negativo').max(20, 'Máximo 20 m'),
  recuoFundos: z.number().min(0, 'Não pode ser negativo').max(30, 'Máximo 30 m'),
  recuoEntreBlocos: z.number().min(2, 'Mínimo 2 m').max(40, 'Máximo 40 m'),

  // Gabarito & Alturas
  gabaritoMaximo: z.number().min(3, 'Mínimo 3 m').max(250, 'Máximo 250 m'),
  numeroMaximoPavimentos: z.number().int('Deve ser inteiro').min(1, 'Mínimo 1').max(80, 'Máximo 80'),
  alturaPeDireitoPadrao: z.number().min(2.4, 'Mínimo 2.4 m').max(5.0, 'Máximo 5.0 m'),
  alturaPeDireitoTerreo: z.number().min(2.8, 'Mínimo 2.8 m').max(8.0, 'Máximo 8.0 m'),

  // Tipologias & Ocupação
  unidadesResidenciais: z.number().int('Deve ser inteiro').min(1, 'Mínimo 1').max(2000, 'Máximo 2.000'),
  unidadesNaoResidenciais: z.number().int('Deve ser inteiro').min(0, 'Mínimo 0').max(200, 'Máximo 200'),
  areaMediaUnidade: z.number().min(15, 'Mínimo 15 m²').max(500, 'Máximo 500 m²'),

  // Vagas de Garagem
  vagasAutoPrivativas: z.number().int('Deve ser inteiro').min(0, 'Mínimo 0').max(3000, 'Máximo 3.000'),
  vagasAutoVisitantes: z.number().int('Deve ser inteiro').min(0, 'Mínimo 0').max(500, 'Máximo 500'),
  vagasBicicletas: z.number().int('Deve ser inteiro').min(0, 'Mínimo 0').max(1000, 'Máximo 1.000'),
  vagasCargaDescarga: z.number().int('Deve ser inteiro').min(0, 'Mínimo 0').max(50, 'Máximo 50'),
  vagasPCD: z.number().int('Deve ser inteiro').min(0, 'Mínimo 0').max(100, 'Máximo 100'),

  // Sustentabilidade & Impacto Urbano
  taxaVegetacaoArborea: z.number().min(0, 'Mínimo 0%').max(60, 'Máximo 60%'),
  capacidadeRetencaoAguasPluviais: z.number().min(5, 'Mínimo 5 m³').max(1000, 'Máximo 1.000 m³'),
  distanciaTransportePublico: z.number().min(10, 'Mínimo 10 m').max(5000, 'Máximo 5.000 m'),
})

export type ZoningFormData = z.infer<typeof zoningSchema>

export const DEFAULT_ZONING_VALUES: ZoningFormData = {
  // Dimensões do Terreno
  areaTerreno: 1500,
  testadaPrincipal: 30,
  profundidadeLote: 50,

  // Coeficientes & Índices Urbanísticos
  coeficienteAproveitamentoBasico: 2.0,
  coeficienteAproveitamentoMaximo: 4.0,
  taxaOcupacaoMaxima: 70,
  taxaPermeabilidadeMinima: 15,
  cotaIdealPorUnidade: 25,

  // Recuos Obrigatórios
  recuoFrontal: 5.0,
  recuoLateralEsquerdo: 3.0,
  recuoLateralDireito: 3.0,
  recuoFundos: 4.0,
  recuoEntreBlocos: 6.0,

  // Gabarito & Alturas
  gabaritoMaximo: 48,
  numeroMaximoPavimentos: 16,
  alturaPeDireitoPadrao: 2.8,
  alturaPeDireitoTerreo: 3.8,

  // Tipologias & Ocupação
  unidadesResidenciais: 60,
  unidadesNaoResidenciais: 4,
  areaMediaUnidade: 65,

  // Vagas
  vagasAutoPrivativas: 64,
  vagasAutoVisitantes: 6,
  vagasBicicletas: 70,
  vagasCargaDescarga: 2,
  vagasPCD: 4,

  // Sustentabilidade
  taxaVegetacaoArborea: 10,
  capacidadeRetencaoAguasPluviais: 45,
  distanciaTransportePublico: 350,
}

export interface ZoningFieldGroup {
  groupId: string
  title: string
  description: string
  fields: {
    key: keyof ZoningFormData
    label: string
    unit: string
    helper: string
    step?: number
  }[]
}

export const ZONING_GROUPS: ZoningFieldGroup[] = [
  {
    groupId: 'dimensoes',
    title: '1. Geometria & Dimensões do Lote',
    description: 'Parâmetros físicos e testadas de implantação',
    fields: [
      { key: 'areaTerreno', label: 'Área do Terreno', unit: 'm²', helper: 'Área total escriturada', step: 10 },
      { key: 'testadaPrincipal', label: 'Testada Principal', unit: 'm', helper: 'Frente voltada para logradouro público', step: 1 },
      { key: 'profundidadeLote', label: 'Profundidade do Lote', unit: 'm', helper: 'Extensão média entre alinhamento e fundos', step: 1 },
    ],
  },
  {
    groupId: 'coeficientes',
    title: '2. Índices Urbanísticos & Coeficientes',
    description: 'Aproveitamento, ocupação e permeabilidade do solo',
    fields: [
      { key: 'coeficienteAproveitamentoBasico', label: 'CA Básico (CAB)', unit: 'x', helper: 'Direito de construir sem outorga onerosa', step: 0.1 },
      { key: 'coeficienteAproveitamentoMaximo', label: 'CA Máximo (CAM)', unit: 'x', helper: 'Limite construtivo com outorga onerosa', step: 0.1 },
      { key: 'taxaOcupacaoMaxima', label: 'Taxa de Ocupação (TO)', unit: '%', helper: 'Percentual máximo da projeção horizontal', step: 1 },
      { key: 'taxaPermeabilidadeMinima', label: 'Taxa de Permeabilidade', unit: '%', helper: 'Solo natural sem pavimentação impermeável', step: 1 },
      { key: 'cotaIdealPorUnidade', label: 'Cota Ideal / Unidade', unit: 'm²', helper: 'Densidade populacional por área de terreno', step: 1 },
    ],
  },
  {
    groupId: 'recuos',
    title: '3. Afastamentos & Recuos Obrigatórios',
    description: 'Distâncias mínimas entre os limites do lote e a edificação',
    fields: [
      { key: 'recuoFrontal', label: 'Recuo Frontal', unit: 'm', helper: 'Distância mínima ao alinhamento da via', step: 0.5 },
      { key: 'recuoLateralEsquerdo', label: 'Recuo Lateral Esquerdo', unit: 'm', helper: 'Afastamento da divisa esquerda', step: 0.5 },
      { key: 'recuoLateralDireito', label: 'Recuo Lateral Direito', unit: 'm', helper: 'Afastamento da divisa direita', step: 0.5 },
      { key: 'recuoFundos', label: 'Recuo de Fundos', unit: 'm', helper: 'Afastamento da divisa posterior', step: 0.5 },
      { key: 'recuoEntreBlocos', label: 'Recuo Entre Blocos', unit: 'm', helper: 'Distância mínima entre torres ou blocos', step: 0.5 },
    ],
  },
  {
    groupId: 'gabarito',
    title: '4. Gabarito, Alturas & Pavimentos',
    description: 'Limites verticais e volumetria da implantação',
    fields: [
      { key: 'gabaritoMaximo', label: 'Gabarito Máximo', unit: 'm', helper: 'Altura máxima permitida pela legislação', step: 1 },
      { key: 'numeroMaximoPavimentos', label: 'Máx. Pavimentos', unit: 'pav.', helper: 'Número total de lajes habitáveis', step: 1 },
      { key: 'alturaPeDireitoPadrao', label: 'Pé-Direito Tipo', unit: 'm', helper: 'Distância piso a piso dos pavimentos tipo', step: 0.1 },
      { key: 'alturaPeDireitoTerreo', label: 'Pé-Direito Térreo', unit: 'm', helper: 'Altura livre do pavimento térreo/lobby', step: 0.1 },
    ],
  },
  {
    groupId: 'tipologias',
    title: '5. Tipologias & Programa de Necessidades',
    description: 'Unidades habitacionais e áreas privativas projetadas',
    fields: [
      { key: 'unidadesResidenciais', label: 'Unidades Residenciais', unit: 'unid.', helper: 'Total de apartamentos ou flats', step: 1 },
      { key: 'unidadesNaoResidenciais', label: 'Lojas / Salas Comerciais', unit: 'unid.', helper: 'Fachada ativa ou serviços', step: 1 },
      { key: 'areaMediaUnidade', label: 'Área Média por Unidade', unit: 'm²', helper: 'Área privativa média das tipologias', step: 1 },
    ],
  },
  {
    groupId: 'vagas',
    title: '6. Estacionamento & Mobilidade',
    description: 'Vagas obrigatórias por legislação e tipologia',
    fields: [
      { key: 'vagasAutoPrivativas', label: 'Vagas Automóvel (Privativas)', unit: 'vagas', helper: 'Vagas destinadas aos moradores', step: 1 },
      { key: 'vagasAutoVisitantes', label: 'Vagas de Visitantes', unit: 'vagas', helper: 'Vagas de uso comum/rotativo', step: 1 },
      { key: 'vagasBicicletas', label: 'Vagas de Bicicleta', unit: 'vagas', helper: 'Bicicletário coberto obrigatório', step: 1 },
      { key: 'vagasCargaDescarga', label: 'Vagas Carga & Descarga', unit: 'vagas', helper: 'Operações de carga e mudanças', step: 1 },
      { key: 'vagasPCD', label: 'Vagas Acessíveis (PCD)', unit: 'vagas', helper: 'Reserva legal de vagas PCD', step: 1 },
    ],
  },
  {
    groupId: 'sustentabilidade',
    title: '7. Sustentabilidade & Impacto Urbano',
    description: 'Compensações ambientais e drenagem pluvial',
    fields: [
      { key: 'taxaVegetacaoArborea', label: 'Vegetação Arbórea', unit: '%', helper: 'Percentual com espécies nativas adultas', step: 1 },
      { key: 'capacidadeRetencaoAguasPluviais', label: 'Reservatório de Retenção', unit: 'm³', helper: 'Retardo de pico em temporais urbanos', step: 5 },
      { key: 'distanciaTransportePublico', label: 'Distância ao Transporte', unit: 'm', helper: 'Distância a pé até metrô/BRT/corredor', step: 25 },
    ],
  },
]
