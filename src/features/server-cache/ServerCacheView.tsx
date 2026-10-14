import { RenderCounter } from '../../components/common/RenderCounter'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Database, CheckCircle2, AlertCircle } from 'lucide-react'

export function ServerCacheView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-cyan-400">RF05</span>
            <Badge variant="slate">Aguardando Tarefa 5</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Server State & Ciclo de Cache com TanStack Query
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Gerenciamento assíncrono profissional: `staleTime`, revalidação em background e invalidação declarativa de cache.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RenderCounter componentName="ServerCacheView" variant="pill" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="border-rose-900/40 bg-slate-900/50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-rose-400 text-sm">Abordagem com useState + useEffect</h3>
            <Badge variant="rose">Sem Cache</Badge>
          </div>
          <div className="space-y-3 pt-3 text-xs text-slate-300">
            <p>
              • Cada vez que o usuário navega ou monta o componente, um novo `fetch` é disparado, deixando a tela em branco ou exibindo spinners redundantes.
            </p>
            <p>
              • A sincronização após mutações exige propagação manual de callbacks e risco de dados desatualizados em outras partes da interface.
            </p>
            <div className="rounded bg-rose-950/30 p-2.5 border border-rose-900/40 text-[11px] text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Sintoma: Experiência lenta, excesso de requisições de rede e código repleto de flags booleanas (`isLoading`, `isError`).</span>
            </div>
          </div>
        </Card>

        <Card className="border-emerald-900/40 bg-slate-900/50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-emerald-400 text-sm">Arquitetura TanStack Query</h3>
            <Badge variant="emerald">Stale-While-Revalidate</Badge>
          </div>
          <div className="space-y-3 pt-3 text-xs text-slate-300">
            <p>
              • Configuração de `staleTime` (1 minuto): retornos instantâneos da memória sem bloquear o usuário.
            </p>
            <p>
              • Invalidação declarativa com `queryClient.invalidateQueries` sincronizando automaticamente todos os consumidores ao salvar novos parâmetros urbanísticos.
            </p>
            <div className="rounded bg-emerald-950/30 p-2.5 border border-emerald-900/40 text-[11px] text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Resultado: Carregamento instantâneo percebido pelo usuário e estado do servidor sempre consistente.</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-dashed border-slate-800 bg-slate-900/30 text-center py-10">
        <Database className="h-10 w-10 text-cyan-400/60 mx-auto mb-3" />
        <h4 className="text-base font-semibold text-white">Próximo Passo: Tarefa 5</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          O `QueryClientProvider` já está ativo e configurado na aplicação. Na Tarefa 5, criaremos a API simulada de projetos urbanísticos e a demonstração completa do ciclo de vida do cache.
        </p>
      </Card>
    </div>
  )
}
