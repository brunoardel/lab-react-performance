import { useState, useRef, useCallback } from 'react'
import {
  DEFAULT_ZONING_VALUES,
  type ZoningFormData,
} from './schema/zoningSchema'
import { ControlledZoningForm } from './components/ControlledZoningForm'
import { OptimizedZoningForm } from './components/OptimizedZoningForm'
import { ViabilitySummaryCard } from './components/ViabilitySummaryCard'
import { BenchmarkStatsBar } from './components/BenchmarkStatsBar'
import { RenderCounter } from '../../components/common/RenderCounter'
import { Badge } from '../../components/common/Badge'
import { Card } from '../../components/common/Card'
import { Sparkles, HelpCircle } from 'lucide-react'

export function FormBenchmarkView() {
  const [currentMode, setCurrentMode] = useState<'controlled' | 'optimized'>('controlled')
  const [zoningData, setZoningData] = useState<ZoningFormData>(DEFAULT_ZONING_VALUES)
  const [formKey, setFormKey] = useState(0)
  const [isStressTesting, setIsStressTesting] = useState(false)

  // Contador de renders da página do laboratório
  const labRenders = useRef(0)
  labRenders.current += 1

  const handleControlledChange = useCallback((newData: ZoningFormData) => {
    // Mantém sincronizado quando submetido
    setZoningData(newData)
  }, [])

  const handleOptimizedSubmit = useCallback((newData: ZoningFormData) => {
    setZoningData(newData)
  }, [])

  const handleReset = useCallback(() => {
    setZoningData(DEFAULT_ZONING_VALUES)
    setFormKey((k) => k + 1)
  }, [])

  const handleResetCounters = useCallback(() => {
    setFormKey((k) => k + 1)
  }, [])

  // Stress test simulando 20 digitações reais consecutivas
  const runStressTest = () => {
    if (isStressTesting) return
    setIsStressTesting(true)

    const inputId = currentMode === 'controlled' ? 'controlled-areaTerreno' : 'optimized-areaTerreno'
    const inputEl = document.getElementById(inputId) as HTMLInputElement | null

    if (inputEl) {
      let step = 0
      const baseArea = Number(inputEl.value) || 1500
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set

      const interval = setInterval(() => {
        step += 1
        const nextVal = String(baseArea + step * 10)

        if (nativeSetter) {
          nativeSetter.call(inputEl, nextVal)
        } else {
          inputEl.value = nextVal
        }

        inputEl.dispatchEvent(new Event('input', { bubbles: true }))
        inputEl.dispatchEvent(new Event('change', { bubbles: true }))

        if (step >= 20) {
          clearInterval(interval)
          setIsStressTesting(false)
        }
      }, 60)
    } else {
      setTimeout(() => setIsStressTesting(false), 500)
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Laboratório */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-cyan-400">RF01</span>
            <Badge variant="emerald" size="sm">
              <Sparkles className="h-3 w-3" />
              Laboratório Ativo
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            O Desafio do Formulário Pesado (28+ Parâmetros Urbanísticos)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Comparação prática entre o gargalo de re-render com `useState` único na raiz e a arquitetura sênior com `react-hook-form` + schema estrito em `Zod`.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RenderCounter componentName="LabView" variant="pill" />
        </div>
      </div>

      {/* Barra de Controle de Benchmark & Alternador de Modo */}
      <BenchmarkStatsBar
        currentMode={currentMode}
        onToggleMode={setCurrentMode}
        onRunStressTest={runStressTest}
        onResetCounters={handleResetCounters}
        isStressTesting={isStressTesting}
      />

      {/* Grid Principal: Formulário + Resumo de Viabilidade */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Coluna do Formulário (2 colunas no desktop) */}
        <div className="lg:col-span-2">
          {currentMode === 'controlled' ? (
            <ControlledZoningForm
              key={`ctrl-${formKey}`}
              initialValues={zoningData}
              onDataChange={handleControlledChange}
              onReset={handleReset}
            />
          ) : (
            <OptimizedZoningForm
              key={`opt-${formKey}`}
              initialValues={zoningData}
              onDataSubmit={handleOptimizedSubmit}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Coluna Lateral: Resumo de Viabilidade Paramétrica */}
        <div className="space-y-5">
          <ViabilitySummaryCard data={zoningData} mode={currentMode} />

          {/* Card Pedagógico / Explicação Técnica */}
          <Card className="border-slate-800 bg-slate-900/50 p-4 text-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <HelpCircle className="h-4 w-4 text-cyan-400" />
              <span>Diagnóstico de Re-renders</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              No <strong className="text-rose-400">Modo A</strong>, cada tecla digitada altera o estado do React (<code className="text-rose-300">useState</code>),
              forçando uma reconciliação síncrona completa do VDOM com 28 nós folha e sub-árvores. Observe os contadores <span className="text-rose-300 font-mono font-bold">R:</span> subindo sem parar em todos os campos.
            </p>
            <p className="text-slate-400 leading-relaxed">
              No <strong className="text-emerald-400">Modo B</strong>, o React delega a digitação ao DOM do navegador
              por meio de referências (<code className="text-emerald-300">register</code>). A raiz e os 27 campos vizinhos
              permanecem com <span className="text-emerald-300 font-mono font-bold">R: 1</span> (apenas o render de montagem inicial).
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
