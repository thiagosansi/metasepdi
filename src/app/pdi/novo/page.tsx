import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PrismaTeamMemberRepository } from '@/modules/team/infrastructure/prisma/PrismaTeamMemberRepository'
import { createPdi } from '../actions'

export default async function NovoPdiPage({
  searchParams,
}: {
  searchParams: Promise<{ memberId?: string }>
}) {
  const { memberId } = await searchParams
  const memberRepo = new PrismaTeamMemberRepository()
  const members = await memberRepo.findAll()
  const selectedMember = memberId ? members.find((m) => m.id === memberId) : undefined

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Novo PDI</h1>
        <p className="text-sm text-slate-500 mt-1">Plano de Desenvolvimento Individual</p>
      </div>

      <form action={createPdi} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div>
          <Label htmlFor="memberId">Profissional</Label>
          <select name="memberId" id="memberId" className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-white" required>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name} {m.role ? `(${m.role})` : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="title">Título do PDI</Label>
          <Input
            id="title"
            name="title"
            placeholder={selectedMember ? `PDI 2026 — ${selectedMember.name}` : 'PDI 2026'}
            required
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cycleStart">Início do ciclo</Label>
            <Input id="cycleStart" name="cycleStart" type="date" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="cycleEnd">Fim do ciclo</Label>
            <Input id="cycleEnd" name="cycleEnd" type="date" required className="mt-1" />
          </div>
        </div>
        <div>
          <Label htmlFor="summary">Contexto / motivação (opcional)</Label>
          <Textarea id="summary" name="summary" rows={3} placeholder="Descreva o contexto deste PDI..." className="mt-1" />
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="submit">Criar PDI</Button>
          <LinkButton href={memberId ? `/profissionais/${memberId}` : '/profissionais'} variant="ghost">
            Cancelar
          </LinkButton>
        </div>
      </form>
    </div>
  )
}
