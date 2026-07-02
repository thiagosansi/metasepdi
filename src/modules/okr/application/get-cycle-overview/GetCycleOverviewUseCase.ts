import type { CycleRepository } from '../../domain/ports/CycleRepository'
import type { ObjectiveRepository, ObjectiveWithKeyResults } from '../../domain/ports/ObjectiveRepository'
import type { Cycle } from '../../domain/Cycle'
import { calculateProgress } from '../../domain/KeyResult'

export interface CycleOverview {
  cycle: Cycle
  objectives: ObjectiveWithKeyResults[]
  stats: {
    totalObjectives: number
    totalKeyResults: number
    avgProgress: number
    onTrack: number
    atRisk: number
    behind: number
    completed: number
  }
}

export class GetCycleOverviewUseCase {
  constructor(
    private readonly cycleRepo: CycleRepository,
    private readonly objectiveRepo: ObjectiveRepository
  ) {}

  async execute(cycleId: string): Promise<CycleOverview> {
    const cycle = await this.cycleRepo.findById(cycleId)
    if (!cycle) throw new Error('Ciclo não encontrado.')

    const objectives = await this.objectiveRepo.findByCycle(cycleId)

    const allKrs = objectives.flatMap((o) => o.keyResults)
    const totalKeyResults = allKrs.length

    const progresses = allKrs.map((kr) =>
      calculateProgress(kr.startValue, kr.targetValue, kr.currentValue)
    )
    const avgProgress =
      totalKeyResults > 0 ? Math.round(progresses.reduce((a, b) => a + b, 0) / totalKeyResults) : 0

    const stats = {
      totalObjectives: objectives.length,
      totalKeyResults,
      avgProgress,
      onTrack: allKrs.filter((kr) => kr.status === 'ON_TRACK').length,
      atRisk: allKrs.filter((kr) => kr.status === 'AT_RISK').length,
      behind: allKrs.filter((kr) => kr.status === 'BEHIND').length,
      completed: allKrs.filter((kr) => kr.status === 'COMPLETED').length,
    }

    return { cycle, objectives, stats }
  }
}
