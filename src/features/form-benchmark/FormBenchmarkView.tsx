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

  // Rastreamento de renders na visualização do laboratório
  const labRenders = useRef(0)
  labRenders.current += 1

  const handleControlledChange = useCallback((newData: ZoningFormData) => {
    setZoningData(newData)
  }, [])

  const handleOptimizedSubmit = useCallback((newData: ZoningFormData) => {
    setZoningData(newData)
  }, [])

  const handleReset = useCallback(() => {
    setZoningData(DEFAULT_ZONING_VALUES)
    setFormKey((k) => k + 1)
  }, [])

  // Stress test: simula 20 digitações rápidas em um input
  const runStressTest = () => {
    if (isStressTesting) return
    setIsStressTesting(true)

    // Se estiver no modo controlado, disparar sucessivos updates no state
    if (currentMode === 'controlled') {
      let step = 0
      const baseArea = zoningData.areaTerreno
      const interval = setInterval(() => {
        step += 1
        setZoningData((prev) => ({
          ...prev,
          areaTerreno: baseArea + step * 10,
        }))
        if (step >= 20) {
          clearInterval(interval)
          setIsStressTesting(false)
        }
      }, 50)
    } else {
      // No modo B, selecionar o input nativo no DOM e despachar eventos reais de input
      const inputEl = document.getElementById('optimized-areaTerreno') as HTMLInputElement | null
      if (inputEl) {
        let step = 0
        const baseArea = Number(inputEl.value) || 1500
        const interval = setInterval(() => {
          step += 1
          inputEl.value = String(baseArea + step * 10)
          inputEl.dispatchEvent(new Event('input', { bubbles: true }))
          if (step >= 20) {
            clearInterval(interval)
            setIsStressTesting(false)
          }
        }, 50)
      } else {
        setTimeout(() => setIsStressTesting(false), 1000)
      }
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
              Tarefa 2 Ativa
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
              <span>Por que a abordagem sênior é superior?</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              No <strong className="text-rose-400">Modo A</strong>, cada tecla digitada altera o estado do React,
              forçando uma reconciliação síncrona completa do VDOM com 28 nós folha e sub-árvores. Em dispositivos com CPU restrita ou formulários com centenas de regras, isso gera congelamento perceptível.
            </p>
            <p className="text-slate-400 leading-relaxed">
              No <strong className="text-emerald-400">Modo B</strong>, o React delega a digitação ao DOM do navegador
              por meio de referências. A validação estrita com <strong className="text-cyan-400">Zod</strong> ocorre
              de forma declarativa, eliminando até 98% dos ciclos desnecessários de CPU.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
