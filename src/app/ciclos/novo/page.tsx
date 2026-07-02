import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCycle } from '../actions'

export default function NovoCicloPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Novo Ciclo OKR</h1>
        <p className="text-sm text-slate-500 mt-1">Defina o período do ciclo (ex: Q3 2026)</p>
      </div>

      <form action={createCycle} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div>
          <Label htmlFor="name">Nome do ciclo</Label>
          <Input id="name" name="name" placeholder="Q3 2026" required className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Início</Label>
            <Input id="startDate" name="startDate" type="date" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="endDate">Fim</Label>
            <Input id="endDate" name="endDate" type="date" required className="mt-1" />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="submit">Criar ciclo</Button>
          <LinkButton href="/ciclos" variant="ghost">Cancelar</LinkButton>
        </div>
      </form>
    </div>
  )
}
