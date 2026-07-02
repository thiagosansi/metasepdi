import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { StatusBadge } from './StatusBadge'
import { ProgressBar } from './ProgressBar'
import { CheckInDialog } from './CheckInDialog'
import type { ObjectiveWithKeyResults } from '@/modules/okr/domain/ports/ObjectiveRepository'
import { calculateProgress } from '@/modules/okr/domain/KeyResult'

const levelLabel: Record<string, string> = {
  COMPANY: 'Empresa',
  SQUAD: 'Squad',
  INDIVIDUAL: 'Individual',
}

interface ObjectiveCardProps {
  objective: ObjectiveWithKeyResults
}

export function ObjectiveCard({ objective }: ObjectiveCardProps) {
  const overallProgress =
    objective.keyResults.length > 0
      ? Math.round(
          objective.keyResults.reduce(
            (sum, kr) => sum + calculateProgress(kr.startValue, kr.targetValue, kr.currentValue),
            0
          ) / objective.keyResults.length
        )
      : 0

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                {levelLabel[objective.level] ?? objective.level}
              </span>
              {objective.owner && (
                <span className="text-xs text-slate-400">· {objective.owner.name}</span>
              )}
            </div>
            <h3 className="font-medium text-slate-900 leading-snug">{objective.title}</h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-semibold text-slate-700">{overallProgress}%</span>
            <StatusBadge status={objective.status as 'DRAFT' | 'ACTIVE' | 'AT_RISK' | 'COMPLETED' | 'CANCELLED'} />
          </div>
        </div>
        {objective.description && (
          <p className="text-sm text-slate-500 mt-1">{objective.description}</p>
        )}
      </CardHeader>

      {objective.keyResults.length > 0 && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {objective.keyResults.map((kr) => (
              <div key={kr.id} className="p-3 bg-slate-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-slate-700 flex-1 min-w-0">{kr.title}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={kr.status as 'ON_TRACK' | 'AT_RISK' | 'BEHIND' | 'COMPLETED'} />
                    <CheckInDialog
                      keyResultId={kr.id}
                      keyResultTitle={kr.title}
                      currentValue={kr.currentValue}
                      targetValue={kr.targetValue}
                      unit={kr.unit}
                    />
                  </div>
                </div>
                <ProgressBar
                  startValue={kr.startValue}
                  targetValue={kr.targetValue}
                  currentValue={kr.currentValue}
                  status={kr.status}
                />
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    {kr.currentValue}{kr.unit ? ` ${kr.unit}` : ''} / {kr.targetValue}{kr.unit ? ` ${kr.unit}` : ''}
                  </span>
                  {kr.confidenceScore !== null && (
                    <span>Confiança: {kr.confidenceScore}/10</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
