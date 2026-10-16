import { useState } from 'react'
import { RenderCounter } from '../../components/common/RenderCounter'
import { Badge } from '../../components/common/Badge'
import { CacheLiveInspector } from './components/CacheLiveInspector'
import { SeniorCacheDemo } from './components/SeniorCacheDemo'
import { NaiveCacheDemo } from './components/NaiveCacheDemo'
import { ArchitecturalGuide } from './components/ArchitecturalGuide'
import {
  Flame,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react'

export function ServerCacheView() {
  const [activeTab, setActiveTab] = useState<'senior' | 'naive' | 'guide'>('senior')

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Laboratório */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-cyan-400">RF05</span>
            <Badge variant="emerald">
              <CheckCircle2 className="h-3 w-3" />
              Concluído (Tarefa 5)
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Server State & Ciclo de Cache com TanStack Query
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Gerenciamento assíncrono de alto nível: <code className="text-cyan-300 font-mono">staleTime: 1min</code>,
            revalidação em segundo plano e invalidação declarativa (<code className="text-cyan-300 font-mono">queryClient.invalidateQueries</code>).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RenderCounter componentName="ServerCacheView" variant="pill" />
        </div>
      </div>

      {/* Seletor de Modo de Laboratório */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs">
          <button
            onClick={() => setActiveTab('senior')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'senior'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Modo Sênior (TanStack Query)</span>
          </button>

          <button
            onClick={() => setActiveTab('naive')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'naive'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="h-4 w-4 text-rose-400" />
            <span>Modo Ingênuo (useState + useEffect)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'guide'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-4 w-4 text-cyan-400" />
            <span>Guia Arquitetural & Ciclo de Vida</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Zap className="h-3.5 w-3.5 text-cyan-400" />
          <span>Alterne entre os modos para comparar a experiência do usuário e consumo de rede.</span>
        </div>
      </div>

      {/* Inspetor de Cache TanStack Query em Tempo Real */}
      <CacheLiveInspector />

      {/* Visualização Ativa Conforme Modo */}
      {activeTab === 'senior' && <SeniorCacheDemo />}
      {activeTab === 'naive' && <NaiveCacheDemo />}
      {activeTab === 'guide' && <ArchitecturalGuide />}
    </div>
  )
}
