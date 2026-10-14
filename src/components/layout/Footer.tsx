export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span>ArqLab Urban Viability Lab &bull; React 19 + TypeScript + Vite + Tailwind CSS</span>
        </div>
        <div className="font-mono text-[11px] text-slate-600">
          Zod &bull; React Hook Form &bull; TanStack Query &bull; TanStack Virtual
        </div>
      </div>
    </footer>
  )
}
