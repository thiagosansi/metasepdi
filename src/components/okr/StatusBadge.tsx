import { cn } from '@/lib/utils'

type Status = 'ON_TRACK' | 'AT_RISK' | 'BEHIND' | 'COMPLETED' | 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'CANCELLED'

const statusConfig: Record<Status, { label: string; classes: string }> = {
  ON_TRACK:  { label: 'Em dia',     classes: 'bg-green-100 text-green-800 border-green-200' },
  AT_RISK:   { label: 'Em risco',   classes: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  BEHIND:    { label: 'Atrasado',   classes: 'bg-red-100 text-red-800 border-red-200' },
  COMPLETED: { label: 'Concluído',  classes: 'bg-blue-100 text-blue-800 border-blue-200' },
  DRAFT:     { label: 'Rascunho',   classes: 'bg-slate-100 text-slate-600 border-slate-200' },
  ACTIVE:    { label: 'Ativo',      classes: 'bg-green-100 text-green-800 border-green-200' },
  CLOSED:    { label: 'Encerrado',  classes: 'bg-slate-100 text-slate-600 border-slate-200' },
  CANCELLED: { label: 'Cancelado',  classes: 'bg-slate-100 text-slate-500 border-slate-200' },
}

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] ?? { label: status, classes: 'bg-slate-100 text-slate-600 border-slate-200' }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', config.classes)}>
      {config.label}
    </span>
  )
}
