import { PrismaCycleRepository } from '@/modules/okr/infrastructure/prisma/PrismaCycleRepository'
import { PrismaObjectiveRepository } from '@/modules/okr/infrastructure/prisma/PrismaObjectiveRepository'
import { ObjectiveCard } from '@/components/okr/ObjectiveCard'
import { LinkButton } from '@/components/ui/link-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ObjectiveWithKeyResults } from '@/modules/okr/domain/ports/ObjectiveRepository'

export default async function ObjetivosPage({
  searchParams,
}: {
  searchParams: Promise<{ cycleId?: string }>
}) {
  const cycleRepo = new PrismaCycleRepository()
  const objectiveRepo = new PrismaObjectiveRepository()

  const cycles = await cycleRepo.findAll()
  const resolvedParams = await searchParams
  const activeCycles = cycles.filter((c) => c.status === 'ACTIVE')
  const selectedCycleId = resolvedParams.cycleId ?? activeCycles[0]?.id

  let objectives: ObjectiveWithKeyResults[] = []
  if (selectedCycleId) {
    objectives = await objectiveRepo.findByCycle(selectedCycleId)
  }

  const byLevel = {
    COMPANY: objectives.filter((o) => o.level === 'COMPANY'),
    SQUAD: objectives.filter((o) => o.level === 'SQUAD'),
    INDIVIDUAL: objectives.filter((o) => o.level === 'INDIVIDUAL'),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Objetivos</h1>
        <LinkButton href="/objetivos/novo">+ Novo objetivo</LinkButton>
      </div>

      <Tabs defaultValue="COMPANY">
        <TabsList>
          <TabsTrigger value="COMPANY">Empresa ({byLevel.COMPANY.length})</TabsTrigger>
          <TabsTrigger value="SQUAD">Squad ({byLevel.SQUAD.length})</TabsTrigger>
          <TabsTrigger value="INDIVIDUAL">Individual ({byLevel.INDIVIDUAL.length})</TabsTrigger>
        </TabsList>

        {(['COMPANY', 'SQUAD', 'INDIVIDUAL'] as const).map((level) => (
          <TabsContent key={level} value={level} className="space-y-4 mt-4">
            {byLevel[level].length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center">
                Nenhum objetivo de nível {level.toLowerCase()} para este ciclo.
              </p>
            ) : (
              byLevel[level].map((obj) => <ObjectiveCard key={obj.id} objective={obj} />)
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
