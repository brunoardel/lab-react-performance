import { useState } from 'react'
import {
  ZONING_GROUPS,
  type ZoningFormData,
  type ZoningFieldGroup,
} from '../schema/zoningSchema'
import { RenderCounter } from '../../../components/common/RenderCounter'
import { Badge } from '../../../components/common/Badge'
import { AlertCircle, RotateCcw, Check } from 'lucide-react'

interface ControlledZoningFormProps {
  initialValues: ZoningFormData
  onDataChange: (data: ZoningFormData) => void
  onReset: () => void
}

export function ControlledZoningForm({
  initialValues,
  onDataChange,
  onReset,
}: ControlledZoningFormProps) {
  // Estado único na raiz para todos os 28 campos (Abordagem Ingênua)
  const [formData, setFormData] = useState<ZoningFormData>(initialValues)
  const [submitted, setSubmitted] = useState(false)

  const handleFieldChange = (key: keyof ZoningFormData, value: string) => {
    const numValue = Number(value)
    const updated = {
      ...formData,
      [key]: isNaN(numValue) ? value : numValue,
    }
    setFormData(updated)
    onDataChange(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2500)
  }

  const handleResetForm = () => {
    setFormData(initialValues)
    onReset()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Banner de Status do Modo A */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-rose-900/40 bg-rose-950/20 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-rose-300">
                Modo A: Estado Controlado na Raiz (useState)
              </span>
              <Badge variant="rose">28+ Campos</Badge>
            </div>
            <p className="text-xs text-rose-200/80">
              Cada caractere digitado dispara `setFormData`, provocando o re-render síncrono de todos os 28 campos e da raiz.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <span className="text-xs text-rose-300 font-mono">Raiz Form:</span>
          <RenderCounter componentName="RaizForm" variant="pill" className="bg-rose-950/80 border-rose-800" />
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
                const val = formData[field.key]
                return (
                  <div
                    key={field.key}
                    className="flex flex-col justify-between rounded-lg border border-slate-800/80 bg-slate-950/50 p-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor={`controlled-${field.key}`}
                        className="text-xs font-semibold text-slate-300 truncate"
                        title={field.label}
                      >
                        {field.label}
                      </label>
                      <RenderCounter componentName={field.key.substring(0, 4)} variant="compact" />
                    </div>

                    <div className="relative">
                      <input
                        id={`controlled-${field.key}`}
                        type="number"
                        step={field.step || 1}
                        value={val !== undefined ? val : ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 pr-12 text-sm font-mono text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all"
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-mono text-slate-500">
                        {field.unit}
                      </span>
                    </div>

                    <span className="mt-1.5 text-[10px] text-slate-400 truncate">
                      {field.helper}
                    </span>
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

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-rose-900/40 hover:bg-rose-500 transition-colors"
        >
          {submitted ? (
            <>
              <Check className="h-4 w-4" />
              Parâmetros Salvos!
            </>
          ) : (
            'Salvar Parâmetros (useState)'
          )}
        </button>
      </div>
    </form>
  )
}
