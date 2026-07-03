import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PrismaCycleRepository } from '@/modules/okr/infrastructure/prisma/PrismaCycleRepository'
import { PrismaObjectiveRepository } from '@/modules/okr/infrastructure/prisma/PrismaObjectiveRepository'
import { PrismaTeamMemberRepository } from '@/modules/team/infrastructure/prisma/PrismaTeamMemberRepository'
import { updateObjective } from '../../actions'

export default async function EditarObjetivoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const cycleRepo = new PrismaCycleRepository()
  const objectiveRepo = new PrismaObjectiveRepository()
  const memberRepo = new PrismaTeamMemberRepository()

  const [objective, cycles, members] = await Promise.all([
    objectiveRepo.findById(id),
    cycleRepo.findAll(),
    memberRepo.findAll(),
  ])

  if (!objective) notFound()

  const openCycles = cycles.filter((c) => c.status !== 'CLOSED')

  // Pais disponíveis do mesmo ciclo (excluindo o próprio objetivo)
  const allInCycle = await objectiveRepo.findByCycle(objective.cycleId)
  const parentOptions = allInCycle.filter((o) => o.id !== id)
  const companyParents = parentOptions.filter((o) => o.level === 'COMPANY')
  const squadParents   = parentOptions.filter((o) => o.level === 'SQUAD')

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Editar Objetivo</h1>
        <p className="text-sm text-slate-500 mt-1">Altere os campos desejados e salve</p>
      </div>

      <form action={updateObjective} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <input type="hidden" name="id" value={objective.id} />

        <div>
          <Label htmlFor="title">Título do objetivo</Label>
          <Input id="title" name="title" defaultValue={objective.title} required className="mt-1" />
        </div>

        <div>
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Textarea id="description" name="description" rows={2} defaultValue={objective.description ?? ''} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="level">Nível</Label>
          <select name="level" id="level" defaultValue={objective.level} className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-white" required>
            <option value="COMPANY">Empresa</option>
            <option value="SQUAD">Squad</option>
            <option value="INDIVIDUAL">Individual</option>
          </select>
        </div>

        <div>
          <Label htmlFor="cycleId">Ciclo</Label>
          <select name="cycleId" id="cycleId" defaultValue={objective.cycleId} className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-white" required>
            {openCycles.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="parentId">Objetivo pai (cascade)</Label>
          <select name="parentId" id="parentId" defaultValue={objective.parentId ?? ''} className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-white">
            <option value="">— Nenhum (objetivo raiz) —</option>
            {companyParents.length > 0 && (
              <optgroup label="Empresa">
                {companyParents.map((o) => (
                  <option key={o.id} value={o.id}>{o.title}</option>
                ))}
              </optgroup>
            )}
            {squadParents.length > 0 && (
              <optgroup label="Squad">
                {squadParents.map((o) => (
                  <option key={o.id} value={o.id}>{o.title}</option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        {members.length > 0 && (
          <div>
            <Label htmlFor="ownerId">Responsável (opcional)</Label>
            <select name="ownerId" id="ownerId" defaultValue={objective.owner?.id ?? ''} className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-white">
              <option value="">— Sem responsável —</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}{m.role ? ` (${m.role})` : ''}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button type="submit">Salvar alterações</Button>
          <LinkButton href="/objetivos" variant="ghost">Cancelar</LinkButton>
        </div>
      </form>
    </div>
  )
}
