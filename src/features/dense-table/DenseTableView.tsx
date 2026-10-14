import { RenderCounter } from '../../components/common/RenderCounter'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Table2, CheckCircle2, AlertCircle } from 'lucide-react'

export function DenseTableView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-cyan-400">RF02 & RF03</span>
            <Badge variant="slate">Aguardando Tarefa 3</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Tabela Densa de Cenários & Concorrência React 18
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            2.500 cenários de implantação: Virtualização de nós no DOM (`@tanstack/react-virtual`) e transições em segundo plano (`useTransition`).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RenderCounter componentName="DenseTableView" variant="pill" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="border-rose-900/40 bg-slate-900/50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-rose-400 text-sm">Modo A: Sem Virtualização</h3>
            <Badge variant="rose">2.500 Nós DOM</Badge>
          </div>
          <div className="space-y-3 pt-3 text-xs text-slate-300">
            <p>
              • Renderização direta de 2.500 linhas completas no DOM, gerando sobrecarga de memória e layout recalculation severo.
            </p>
            <p>
              • A digitação na barra de busca compete diretamente pela thread principal com a re-filtragem de 2.500 itens.
            </p>
            <div className="rounded bg-rose-950/30 p-2.5 border border-rose-900/40 text-[11px] text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Sintoma: Rolagem truncada, input congelando e alto consumo de CPU.</span>
            </div>
          </div>
        </Card>

        <Card className="border-emerald-900/40 bg-slate-900/50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-emerald-400 text-sm">Modo B: Virtualização + useTransition</h3>
            <Badge variant="emerald">React Virtual + Transitions</Badge>
          </div>
          <div className="space-y-3 pt-3 text-xs text-slate-300">
            <p>
              • Renderização virtualizada com `@tanstack/react-virtual`, mantendo apenas os elementos visíveis na viewport ativos no DOM (~30 nós).
            </p>
            <p>
              • Filtragem delegada a `useTransition`: a digitação do input tem prioridade máxima (60 FPS), enquanto a lista computa em segundo plano.
            </p>
            <div className="rounded bg-emerald-950/30 p-2.5 border border-emerald-900/40 text-[11px] text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Resultado: Rolagem fluida com milhares de itens e input instantâneo com indicador `isPending`.</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-dashed border-slate-800 bg-slate-900/30 text-center py-10">
        <Table2 className="h-10 w-10 text-cyan-400/60 mx-auto mb-3" />
        <h4 className="text-base font-semibold text-white">Próximo Passo: Tarefa 3</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          A dependência `@tanstack/react-virtual` já está instalada. O gerador de dados mockados e a tabela de comparação serão desenvolvidos na Tarefa 3.
        </p>
      </Card>
    </div>
  )
}
