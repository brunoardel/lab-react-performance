import { RenderCounter } from '../../components/common/RenderCounter'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react'

export function FormBenchmarkView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-cyan-400">RF01</span>
            <Badge variant="amber">Aguardando Tarefa 2</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Formulário Paramétrico de Zoneamento
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Comparativo de performance: Estado Controlado (`useState` raiz) vs. Não-Controlado (`react-hook-form` + `Zod`).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RenderCounter componentName="FormBenchmarkView" variant="pill" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="border-rose-900/40 bg-slate-900/50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-rose-400 text-sm">Modo A: Estado Controlado Ingênuo</h3>
            <Badge variant="rose">useState Raiz</Badge>
          </div>
          <div className="space-y-3 pt-3 text-xs text-slate-300">
            <p>
              • Mais de 25 campos de parâmetros urbanísticos vinculados a um único estado no topo da árvore.
            </p>
            <p>
              • A cada caractere digitado em um input (e.g. recuo frontal, gabarito), toda a árvore de 25+ componentes de formulário é recalculada e re-renderizada.
            </p>
            <div className="rounded bg-rose-950/30 p-2.5 border border-rose-900/40 text-[11px] text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Sintoma: Queda de taxa de quadros e engasgos visíveis ao digitar rapidamente.</span>
            </div>
          </div>
        </Card>

        <Card className="border-emerald-900/40 bg-slate-900/50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-emerald-400 text-sm">Modo B: Arquitetura Sênior Não-Controlada</h3>
            <Badge variant="emerald">RHF + Zod</Badge>
          </div>
          <div className="space-y-3 pt-3 text-xs text-slate-300">
            <p>
              • Formulário não-controlado gerenciado por referências (`react-hook-form`).
            </p>
            <p>
              • Integração com schema estrito em tempo de execução via <strong>Zod</strong> (`@hookform/resolvers/zod`).
            </p>
            <div className="rounded bg-emerald-950/30 p-2.5 border border-emerald-900/40 text-[11px] text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Resultado: Digitação a 60 FPS ininterruptos com isolamento granular de renders.</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-dashed border-slate-800 bg-slate-900/30 text-center py-10">
        <FileSpreadsheet className="h-10 w-10 text-cyan-400/60 mx-auto mb-3" />
        <h4 className="text-base font-semibold text-white">Próximo Passo: Tarefa 2</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          A estrutura base, schema e bibliotecas necessárias já estão prontas. Na Tarefa 2, os 25+ campos e o switch de benchmark serão implementados.
        </p>
      </Card>
    </div>
  )
}
