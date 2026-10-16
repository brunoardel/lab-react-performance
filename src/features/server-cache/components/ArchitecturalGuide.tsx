import { Card } from '../../../components/common/Card'
import { Badge } from '../../../components/common/Badge'
import {
  Database,
  Layers,
  Zap,
  Clock,
  CheckCircle2,
} from 'lucide-react'

export function ArchitecturalGuide() {
  return (
    <div className="space-y-6">
      {/* 4 Pilares da Separação de Estados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <Card className="border-cyan-900/40 bg-slate-900/60 space-y-2.5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Database className="h-4 w-4" />
            <span>1. Server State vs. Client State</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Dados do servidor são remotos, assíncronos e compartilhados com outros clientes.
            Armazená-los em <code className="text-cyan-300">useState</code> força sincronizações
            imperativas manuais sujeitas a dados obsoletos e múltiplos spinners repetitivos.
          </p>
        </Card>

        <Card className="border-emerald-900/40 bg-slate-900/60 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Clock className="h-4 w-4" />
            <span>2. staleTime (1 min) vs. gcTime</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            <strong className="text-white">staleTime:</strong> período em que o dado é considerado
            "fresco". Consultas dentro da janela retornam em <strong className="text-emerald-400">0ms</strong> diretamente da memória, sem disparar chamadas de rede.
          </p>
        </Card>

        <Card className="border-indigo-900/40 bg-slate-900/60 space-y-2.5">
          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <Zap className="h-4 w-4" />
            <span>3. Invalidação Declarativa</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Ao salvar uma mutação, chamamos{' '}
            <code className="text-indigo-300">queryClient.invalidateQueries</code>. O TanStack Query
            marca as queries como sujas e dispara a revalidação em background de todos os consumidores ativos.
          </p>
        </Card>
      </div>

      {/* Tabela Comparativa de Ciclo de Vida */}
      <Card className="border-slate-800 bg-slate-900/90 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            Ciclo de Vida do Cache no TanStack Query (Stale-While-Revalidate)
          </h4>
          <Badge variant="cyan">RF05 Conforme PRD</Badge>
        </div>

        <div className="overflow-x-auto pt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400">
                <th className="py-2 px-3">Estado</th>
                <th className="py-2 px-3">Condição</th>
                <th className="py-2 px-3">Comportamento de Renderização</th>
                <th className="py-2 px-3">Impacto na CPU e Rede</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3" />
                    Fresh
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                  Idade &lt; staleTime (1 minuto)
                </td>
                <td className="py-2.5 px-3">
                  Retorno instantâneo do cache sem exibir qualquer spinner de carregamento.
                </td>
                <td className="py-2.5 px-3 text-emerald-400 font-semibold font-mono text-[11px]">
                  0 requisições HTTP disparadas
                </td>
              </tr>

              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Clock className="h-3 w-3" />
                    Stale
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                  Idade &gt; staleTime ou Invalidação
                </td>
                <td className="py-2.5 px-3">
                  Exibe o dado em cache imediatamente (sem tela em branco) enquanto faz fetch em segundo plano.
                </td>
                <td className="py-2.5 px-3 text-cyan-400 font-mono text-[11px]">
                  Revalidação silenciosa em background
                </td>
              </tr>

              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                    Inactive
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                  0 componentes observando a query
                </td>
                <td className="py-2.5 px-3">
                  Permanece na memória RAM pelo período de <code className="text-cyan-300">gcTime</code> (5 minutos).
                </td>
                <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                  Pronto para reativação imediata
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
