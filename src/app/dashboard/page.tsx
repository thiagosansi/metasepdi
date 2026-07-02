import { PrismaCycleRepository } from '@/modules/okr/infrastructure/prisma/PrismaCycleRepository'
import { PrismaObjectiveRepository } from '@/modules/okr/infrastructure/prisma/PrismaObjectiveRepository'
import { GetCycleOverviewUseCase } from '@/modules/okr/application/get-cycle-overview/GetCycleOverviewUseCase'
import { ObjectiveCard } from '@/components/okr/ObjectiveCard'
import { OkrTreeView } from '@/components/okr/OkrTreeView'
import { StatusBadge } from '@/components/okr/StatusBadge'
import { LinkButton } from '@/components/ui/link-button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ cycleId?: string; view?: string }>
}) {
  const cycleRepo = new PrismaCycleRepository()
  const objectiveRepo = new PrismaObjectiveRepository()

  const cycles = await cycleRepo.findAll()
  const activeCycles = cycles.filter((c) => c.status === 'ACTIVE')

  const resolvedParams = await searchParams
  const selectedCycleId = resolvedParams.cycleId ?? activeCycles[0]?.id
  const view = resolvedParams.view === 'tree' ? 'tree' : 'cards'

  if (!selectedCycleId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
        <p className="text-slate-500">Nenhum ciclo ativo. Crie um ciclo para começar.</p>
        <LinkButton href="/ciclos/novo">Criar ciclo</LinkButton>
      </div>
    )
  }

  const useCase = new GetCycleOverviewUseCase(cycleRepo, objectiveRepo)
  const { cycle, objectives, stats } = await useCase.execute(selectedCycleId)

  const topLevelObjectives = objectives.filter((o) => !o.parentId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-slate-500 text-sm">{cycle.name}</span>
            <StatusBadge status={cycle.status} />
          </div>
        </div>
        <div className="flex gap-2">
          <LinkButton href="/objetivos/novo" variant="outline" size="sm">+ Objetivo</LinkButton>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Progresso médio', value: `${stats.avgProgress}%` },
          { label: 'Em dia',    value: stats.onTrack,   color: 'text-green-600' },
          { label: 'Em risco',  value: stats.atRisk,    color: 'text-yellow-600' },
          { label: 'Atrasados', value: stats.behind,    color: 'text-red-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className={`text-2xl font-semibold ${color ?? 'text-slate-900'}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {[
          { label: 'Cards', value: 'cards' },
          { label: 'Árvore', value: 'tree' },
        ].map((tab) => (
          <Link
            key={tab.value}
            href={`?${selectedCycleId ? `cycleId=${selectedCycleId}&` : ''}view=${tab.value}`}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              view === tab.value
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Objectives — Cards view */}
      {view === 'cards' && (
        <div className="space-y-4">
          {topLevelObjectives.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center gap-3 bg-white border border-slate-200 rounded-xl">
              <p className="text-slate-500 text-sm">Nenhum objetivo cadastrado neste ciclo.</p>
              <LinkButton href="/objetivos/novo" size="sm">Criar objetivo</LinkButton>
            </div>
          ) : (
            topLevelObjectives.map((obj) => (
              <ObjectiveCard key={obj.id} objective={obj} />
            ))
          )}
        </div>
      )}

      {/* Objectives — Tree view */}
      {view === 'tree' && (
        <OkrTreeView objectives={objectives} />
      )}
    </div>
  )
}
