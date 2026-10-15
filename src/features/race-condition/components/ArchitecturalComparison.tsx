import { useState } from 'react'
import { Card } from '../../../components/common/Card'
import { Badge } from '../../../components/common/Badge'
import {
  Code2,
  AlertCircle,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Flame,
  Cpu,
} from 'lucide-react'

export function ArchitecturalComparison() {
  const [activeTab, setActiveTab] = useState<'naive' | 'senior'>('senior')

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Code2 className="h-4 w-4 text-cyan-400" />
          <span>Guia Arquitetural: Anatomia de uma Race Condition no React</span>
        </h3>

        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('naive')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'naive'
                ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-rose-400" />
            <span>Abordagem Ingênua</span>
          </button>

          <button
            onClick={() => setActiveTab('senior')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'senior'
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Solução Sênior</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Bloco de Código */}
        <div className="lg:col-span-7">
          <Card className="border-slate-800 bg-slate-950/90 p-0 overflow-hidden font-mono text-xs">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-cyan-400" />
                <span className="font-semibold text-slate-300">
                  {activeTab === 'naive'
                    ? 'useNaiveTerrainDetails.ts (Vulnerável)'
                    : 'useSeniorTerrainDetails.ts (AbortController)'}
                </span>
              </div>
              <Badge variant={activeTab === 'naive' ? 'rose' : 'emerald'} size="sm">
                {activeTab === 'naive' ? 'Sem Cleanup' : 'Cleanup com Signal'}
              </Badge>
            </div>

            <pre className="p-4 text-[12px] leading-relaxed overflow-x-auto text-slate-200">
              {activeTab === 'naive' ? (
                <code>{`// ❌ MODO INGÊNUO: Vulnerável a respostas fora de ordem
useEffect(() => {
  setIsLoading(true)

  // Dispara a requisição assíncrona
  fetchTerrainDetails(selectedTerrainId)
    .then((data) => {
      // ⚠️ GARGALO CRÍTICO:
      // Se uma requisição mais rápida (Terreno B, 500ms) já concluiu,
      // esta chamada antiga (Terreno A, 2000ms) ainda resolverá no futuro
      // e chamará setTerrainData(), sobrescrevendo o estado com dados defasados!
      setTerrainData(data)
      setIsLoading(false)
    })
    .catch((err) => {
      setError(err)
      setIsLoading(false)
    })

  // ❌ NENHUMA FUNÇÃO DE CLEANUP RETORNADA!
  // O React não tem como cancelar a Promise ou abortar a requisição HTTP.
}, [selectedTerrainId])`}</code>
              ) : (
                <code>{`// ✅ MODO SÊNIOR: Cancelamento determinístico via AbortController
useEffect(() => {
  // 1. Cria nova instância de AbortController a cada invocação do effect
  const controller = new AbortController()
  setIsLoading(true)

  // 2. Conecta o signal nativo na camada de rede
  fetchTerrainDetails(selectedTerrainId, controller.signal)
    .then((data) => {
      setTerrainData(data)
      setIsLoading(false)
    })
    .catch((err) => {
      // 3. Descarta silenciosamente erros provocados por abort intencional
      if (err.name === 'AbortError') {
        return // Cancelado com sucesso, não altera estado nem dispara erro
      }
      setError(err)
      setIsLoading(false)
    })

  // 4. CLEANUP FUNCTION: O React executa este retorno antes do próximo effect
  // ou quando o componente é desmontado da árvore.
  return () => {
    controller.abort() // Encerra imediatamente a requisição em voo!
  }
}, [selectedTerrainId])`}</code>
              )}
            </pre>
          </Card>
        </div>

        {/* Bloco Explicativo Conceitual */}
        <div className="lg:col-span-5 space-y-3">
          {activeTab === 'naive' ? (
            <div className="space-y-3">
              <Card className="border-rose-900/40 bg-rose-950/20 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>Por que a Condição de Corrida Ocorre?</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Requisições assíncronas não são serializadas pelo navegador. A ordem de{' '}
                  <strong className="text-white">disparo</strong> não garante a ordem de{' '}
                  <strong className="text-white">resolução</strong>.
                </p>
                <div className="rounded bg-rose-900/30 p-2.5 text-[11px] text-rose-200 border border-rose-800/40 space-y-1">
                  <div>1. T=0ms: Terreno A requisitado (demorará 2000ms).</div>
                  <div>2. T=150ms: Terreno B requisitado (demorará 500ms).</div>
                  <div>3. T=650ms: Terreno B conclui! UI renderiza Terreno B.</div>
                  <div>4. T=2000ms: Terreno A conclui! UI é corrompida com dados de A.</div>
                </div>
              </Card>

              <Card className="border-slate-800 bg-slate-900/50 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <Cpu className="h-4 w-4 text-rose-400" />
                  <span>Consequências em Produção</span>
                </div>
                <ul className="list-disc list-inside text-slate-400 space-y-1">
                  <li>Decisões de negócios tomadas com base em dados do cliente errado.</li>
                  <li>Memory leaks e warnings de atualização em componentes desmontados.</li>
                  <li>Desperdício de banda móvel e processamento de serialização JSON inútil.</li>
                </ul>
              </Card>
            </div>
          ) : (
            <div className="space-y-3">
              <Card className="border-emerald-900/40 bg-emerald-950/20 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>O Poder do AbortController no Cleanup</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  O padrão de cancelamento com <code className="text-emerald-300 font-mono">AbortController</code> é a solução nativa da plataforma Web recomendada pela equipe do React:
                </p>
                <div className="rounded bg-emerald-900/30 p-2.5 text-[11px] text-emerald-200 border border-emerald-800/40 space-y-1">
                  <div>• O socket HTTP da requisição anterior é fechado no navegador.</div>
                  <div>• O tratamento de <code className="font-mono">err.name === 'AbortError'</code> previne flashes visuais.</div>
                  <div>• Zero vazamento de memória e consistência estrita da interface.</div>
                </div>
              </Card>

              <Card className="border-slate-800 bg-slate-900/50 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Garantia de Single Source of Truth</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Quando o usuário clica rapidamente em múltiplos itens, apenas a última intenção do usuário sobrevive. Todas as requisições em trânsito são interceptadas e descartadas antes que possam tocar no estado da aplicação.
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
