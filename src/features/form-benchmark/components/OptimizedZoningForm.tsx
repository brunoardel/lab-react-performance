import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  zoningSchema,
  ZONING_GROUPS,
  type ZoningFormData,
  type ZoningFieldGroup,
} from '../schema/zoningSchema'
import { RenderCounter } from '../../../components/common/RenderCounter'
import { Badge } from '../../../components/common/Badge'
import { Zap, RotateCcw, Check, ShieldCheck, AlertCircle } from 'lucide-react'

interface OptimizedZoningFormProps {
  initialValues: ZoningFormData
  onDataSubmit: (data: ZoningFormData) => void
  onReset: () => void
}

export function OptimizedZoningForm({
  initialValues,
  onDataSubmit,
  onReset,
}: OptimizedZoningFormProps) {
  const [submitted, setSubmitted] = useState(false)

  // Contador de renders da raiz do Modo B
  const rootRenderCount = useRef(0)
  rootRenderCount.current += 1

  // React Hook Form com modo 'onSubmit' para ZERO re-renders durante a digitação
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ZoningFormData>({
    resolver: zodResolver(zoningSchema),
    defaultValues: initialValues,
    mode: 'onSubmit', // valida apenas no submit/ação sem tocar na reconciliação da digitação
  })

  const onSubmit = (data: ZoningFormData) => {
    setSubmitted(true)
    onDataSubmit(data)
    setTimeout(() => setSubmitted(false), 2500)
  }

  const handleResetForm = () => {
    reset(initialValues)
    onReset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Banner de Diagnóstico do Modo B */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-emerald-300">
                Modo B: Arquitetura Sênior Não-Controlada (React Hook Form + Zod)
              </span>
              <Badge variant="emerald">60 FPS Digitação</Badge>
            </div>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Inputs usam referências diretas no DOM (<code className="text-emerald-300">refs</code>). Digite à vontade: a raiz e os 28 campos vizinhos sofrem <strong>0 re-renders</strong>!
            </p>
          </div>
        </div>

        {/* Telemetria do Modo B */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/50">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="text-[11px] font-mono">0 re-renders/tecla</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/80 border border-emerald-800/60 px-3 py-1.5 rounded-lg">
            <span className="text-xs text-emerald-300 font-mono font-semibold">Raiz:</span>
            <RenderCounter componentName="Raiz" variant="compact" />
          </div>
        </div>
      </div>

      {/* Grid com os 7 Grupos de Parâmetros Urbanísticos */}
      <div className="space-y-6">
        {ZONING_GROUPS.map((group: ZoningFieldGroup) => (
          <div
            key={group.groupId}
            className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-5 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-100">{group.title}</h4>
                <p className="text-xs text-slate-400">{group.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">Grupo:</span>
                <RenderCounter componentName={group.groupId} variant="compact" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {group.fields.map((field) => {
                const error = errors[field.key]
                return (
                  <div
                    key={field.key}
                    className={`flex flex-col justify-between rounded-lg border p-3 transition-colors ${
                      error
                        ? 'border-rose-500/60 bg-rose-950/20'
                        : 'border-slate-800/80 bg-slate-950/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor={`optimized-${field.key}`}
                        className="text-xs font-semibold text-slate-300 truncate"
                        title={field.label}
                      >
                        {field.label}
                      </label>
                      <RenderCounter componentName={field.key.substring(0, 4)} variant="compact" />
                    </div>

                    <div className="relative">
                      <input
                        id={`optimized-${field.key}`}
                        type="number"
                        step={field.step || 1}
                        {...register(field.key, { valueAsNumber: true })}
                        className={`w-full rounded-md border px-3 py-1.5 pr-12 text-sm font-mono text-white placeholder-slate-500 transition-all focus:outline-none ${
                          error
                            ? 'border-rose-500 bg-slate-900 focus:ring-1 focus:ring-rose-500'
                            : 'border-slate-800 bg-slate-900 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                        }`}
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-mono text-slate-500">
                        {field.unit}
                      </span>
                    </div>

                    {error ? (
                      <span className="mt-1.5 text-[10px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {error.message}
                      </span>
                    ) : (
                      <span className="mt-1.5 text-[10px] text-slate-400 truncate">
                        {field.helper}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Ações do Formulário */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={handleResetForm}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Restaurar Valores Padrão
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Validação Zod declarativa</span>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-900/40 hover:bg-emerald-500 transition-colors"
          >
            {submitted ? (
              <>
                <Check className="h-4 w-4" />
                Validado e Salvo com Sucesso!
              </>
            ) : (
              'Validar com Zod & Salvar'
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
