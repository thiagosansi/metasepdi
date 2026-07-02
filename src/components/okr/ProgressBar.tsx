import { cn } from '@/lib/utils'
import { calculateProgress } from '@/modules/okr/domain/KeyResult'

interface ProgressBarProps {
  startValue: number
  targetValue: number
  currentValue: number
  status?: string
  showLabel?: boolean
}

export function ProgressBar({ startValue, targetValue, currentValue, status, showLabel = true }: ProgressBarProps) {
  const progress = calculateProgress(startValue, targetValue, currentValue)

  const barColor = cn({
    'bg-green-500':  status === 'ON_TRACK' || status === 'COMPLETED',
    'bg-yellow-500': status === 'AT_RISK',
    'bg-red-500':    status === 'BEHIND',
    'bg-slate-400':  !status,
  })

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', barColor)}
          style={{ width: `${progress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs tabular-nums text-slate-600 w-8 text-right">{progress}%</span>
      )}
    </div>
  )
}
