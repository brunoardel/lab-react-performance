import { RenderCounter } from '../../components/common/RenderCounter'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Flame, CheckCircle2, AlertCircle } from 'lucide-react'

export function RaceConditionView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-cyan-400">RF04</span>
            <Badge variant="slate">Aguardando Tarefa 4</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Resiliência contra Condições de Corrida
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Requisições assíncronas concorrentes de terrenos urbanos: mitigação com `AbortController` no cleanup.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RenderCounter componentName="RaceConditionView" variant="pill" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="border-rose-900/40 bg-slate-900/50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-rose-400 text-sm">O Bug: Respostas Fora de Ordem</h3>
            <Badge variant="rose">Race Condition</Badge>
          </div>
          <div className="space-y-3 pt-3 text-xs text-slate-300">
            <p>
              • Usuário clica no Terreno A (latência simulada de 2000ms), e logo em seguida clica no Terreno B (latência de 500ms).
            </p>
            <p>
              • Terreno B responde primeiro e renderiza na tela. Porém, 1.5s depois, a resposta do Terreno A chega e sobrescreve indevidamente os dados do Terreno B.
            </p>
            <div className="rounded bg-rose-950/30 p-2.5 border border-rose-900/40 text-[11px] text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Sintoma: O painel exibe Terreno B selecionado no seletor, mas com os dados do Terreno A na tela.</span>
            </div>
          </div>
        </Card>

        <Card className="border-emerald-900/40 bg-slate-900/50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-emerald-400 text-sm">A Solução Sênior: AbortController</h3>
            <Badge variant="emerald">Clean Cancelation</Badge>
          </div>
          <div className="space-y-3 pt-3 text-xs text-slate-300">
            <p>
              • Criação de uma instância de `AbortController` antes de cada chamada e passagem de `controller.signal` para a requisição.
            </p>
            <p>
              • A função de cleanup do hook cancela a requisição antiga antes que a nova inicie, ignorando erros do tipo `AbortError`.
            </p>
            <div className="rounded bg-emerald-950/30 p-2.5 border border-emerald-900/40 text-[11px] text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Resultado: Dados sempre consistentes e sem requisições fantasmas poluindo a memória.</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-dashed border-slate-800 bg-slate-900/30 text-center py-10">
        <Flame className="h-10 w-10 text-cyan-400/60 mx-auto mb-3" />
        <h4 className="text-base font-semibold text-white">Próximo Passo: Tarefa 4</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          O simulador assíncrono com latência controlada e a interface de cancelamento serão implementados na Tarefa 4.
        </p>
      </Card>
    </div>
  )
}
