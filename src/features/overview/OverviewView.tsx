import type { TabId } from '../../types/navigation'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { RenderCounter } from '../../components/common/RenderCounter'
import {
  FileSpreadsheet,
  Table2,
  Flame,
  Database,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Gauge,
} from 'lucide-react'


interface OverviewViewProps {
  onNavigate: (tabId: TabId) => void
}

export function OverviewView({ onNavigate }: OverviewViewProps) {
  const experiments = [
    {
      id: 'form-benchmark' as TabId,
      rf: 'RF01',
      title: 'Formulário Paramétrico de Zoneamento',
      subtitle: 'Controlado (useState) vs. Não-Controlado (react-hook-form + Zod)',
      status: 'Concluído (Tarefa 2)',
      statusVariant: 'emerald' as const,
      icon: FileSpreadsheet,
      naive: 'useState único na raiz com 25+ campos: re-renderiza toda a árvore a cada tecla.',
      senior: 'Ref-based não-controlado + validação Zod sob demanda: digitação a 60 FPS com 0 re-renders da árvore.',
      metrics: 'FPS constante / Queda drástica de renders',
    },
    {
      id: 'dense-table' as TabId,
      rf: 'RF02 & RF03',
      title: 'Tabela Densa & Concorrência React 18',
      subtitle: 'Renderização Completa vs. TanStack Virtual + useTransition',
      status: 'Concluído (Tarefa 3)',
      statusVariant: 'emerald' as const,
      icon: Table2,
      naive: '2.500 nós renderizados simultaneamente: travamento no scroll e bloqueio do input de busca.',
      senior: 'Virtualização mantendo apenas nós visíveis no DOM + useTransition mantendo digitação fluida em background.',
      metrics: '~30 nós no DOM vs. 2.500 nós',
    },
    {
      id: 'race-condition' as TabId,
      rf: 'RF04',
      title: 'Resiliência contra Condições de Corrida',
      subtitle: 'Requisições Fora de Ordem vs. AbortController no Cleanup',
      status: 'Aguardando Tarefa 4',
      statusVariant: 'slate' as const,
      icon: Flame,
      naive: 'Troca rápida entre Terreno A (2s) e Terreno B (500ms): resposta antiga sobrescreve a mais recente.',
      senior: 'AbortController cancela requisição pendente no cleanup do useEffect antes de disparar nova.',
      metrics: 'Consistência estrita de dados',
    },
    {
      id: 'server-cache' as TabId,
      rf: 'RF05',
      title: 'Server State & Ciclo de Cache',
      subtitle: 'TanStack Query com staleTime e Invalidação Declarativa',
      status: 'Aguardando Tarefa 5',
      statusVariant: 'slate' as const,
      icon: Database,
      naive: 'Disparo repetitivo de fetch em cada montagem de componente e sincronização manual via useEffect.',
      senior: 'Cache inteligente com staleTime de 1min, revalidação em background e queryClient.invalidateQueries.',
      metrics: 'Eliminação de network waterfalls',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/30 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="cyan" size="md">
                <Sparkles className="h-3 w-3" />
                Laboratório de Engenharia Frontend
              </Badge>
              <Badge variant="emerald" size="md">
                <CheckCircle2 className="h-3 w-3" />
                Setup Base Concluído (Tarefa 1)
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Painel de Viabilidade Urbanística do ArqLab
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Demonstração empírica e mensurável das diferenças entre soluções ingênuas (gargalos
              de CPU, re-renders em cascata e race conditions) e soluções arquiteturais de nível sênior
              com React 19, TypeScript e ecossistema moderno.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[220px]">
            <div className="flex items-center justify-between rounded-lg bg-slate-950/70 border border-slate-800 px-4 py-2.5">
              <span className="text-xs text-slate-400">Render Overview:</span>
              <RenderCounter componentName="Overview" variant="pill" />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-950/70 border border-slate-800 px-4 py-2.5">
              <span className="text-xs text-slate-400">Total de Labs:</span>
              <span className="text-xs font-mono font-semibold text-cyan-400">4 Experimentos</span>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Tech Stack Pillars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3 py-3 px-4 border-slate-800/80 bg-slate-900/50">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Formulários</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-200">React Hook Form + Zod</div>
          </div>
        </Card>

        <Card className="flex items-center gap-3 py-3 px-4 border-slate-800/80 bg-slate-900/50">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Virtualização</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-200">@tanstack/react-virtual</div>
          </div>
        </Card>

        <Card className="flex items-center gap-3 py-3 px-4 border-slate-800/80 bg-slate-900/50">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Concorrência</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-200">React 18/19 Transitions</div>
          </div>
        </Card>

        <Card className="flex items-center gap-3 py-3 px-4 border-slate-800/80 bg-slate-900/50">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Server State</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-200">TanStack Query</div>
          </div>
        </Card>
      </div>

      {/* Experiment Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Experimentos de Performance Urbanística</span>
            <span className="text-xs text-slate-400 font-normal">(PRD & Tasks)</span>
          </h2>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Clique em qualquer laboratório para navegar
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {experiments.map((exp) => {
            const Icon = exp.icon
            return (
              <Card
                key={exp.id}
                className="flex flex-col justify-between hover:border-slate-700 transition-all duration-200 group hover:shadow-xl hover:shadow-black/40"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700/60 text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-cyan-400">
                            {exp.rf}
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <Badge variant={exp.statusVariant} size="sm">
                            {exp.status}
                          </Badge>
                        </div>
                        <h3 className="text-base font-bold text-slate-100 group-hover:text-white transition-colors">
                          {exp.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">{exp.subtitle}</p>

                  {/* Contrast Pill Naive vs Senior */}
                  <div className="space-y-2 pt-1">
                    <div className="rounded-lg bg-rose-950/20 border border-rose-900/30 p-2.5 text-xs">
                      <span className="font-semibold text-rose-400">Abordagem Ingênua: </span>
                      <span className="text-slate-300">{exp.naive}</span>
                    </div>

                    <div className="rounded-lg bg-emerald-950/20 border border-emerald-900/30 p-2.5 text-xs">
                      <span className="font-semibold text-emerald-400">Solução Sênior: </span>
                      <span className="text-slate-300">{exp.senior}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500">Métrica: </span>
                    <span className="text-slate-300">{exp.metrics}</span>
                  </div>

                  <button
                    onClick={() => onNavigate(exp.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group-hover:translate-x-0.5 duration-150"
                  >
                    <span>Abrir Lab</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
