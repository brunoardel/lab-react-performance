export type TabId = 'overview' | 'form-benchmark' | 'dense-table' | 'race-condition' | 'server-cache'

export interface TabConfig {
  id: TabId
  label: string
  rfCode: string
  subtitle: string
  iconName: 'LayoutDashboard' | 'FileSpreadsheet' | 'Table2' | 'Flame' | 'Database'
  badge?: string
}

export const TABS: TabConfig[] = [
  {
    id: 'overview',
    label: 'Visão Geral',
    rfCode: 'LAB-OVERVIEW',
    subtitle: 'Painel de Métricas & Arquitetura',
    iconName: 'LayoutDashboard',
    badge: 'Hub',
  },
  {
    id: 'form-benchmark',
    label: 'Formulário Paramétrico',
    rfCode: 'RF01',
    subtitle: 'useState vs. react-hook-form + Zod',
    iconName: 'FileSpreadsheet',
    badge: 'Pronto',
  },
  {
    id: 'dense-table',
    label: 'Tabela Densa & Concorrência',
    rfCode: 'RF02 & RF03',
    subtitle: 'TanStack Virtual + React 18 Transitions',
    iconName: 'Table2',
    badge: 'Pronto',
  },
  {
    id: 'race-condition',
    label: 'Race Conditions',
    rfCode: 'RF04',
    subtitle: 'Resiliência com AbortController',
    iconName: 'Flame',
    badge: 'Tarefa 4',
  },
  {
    id: 'server-cache',
    label: 'Server State & Cache',
    rfCode: 'RF05',
    subtitle: 'TanStack Query & Cache Lifecycle',
    iconName: 'Database',
    badge: 'Tarefa 5',
  },
]
