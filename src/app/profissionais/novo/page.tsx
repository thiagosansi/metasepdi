import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createTeamMember } from '../actions'

export default function NovoProfissionalPage() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Novo Profissional</h1>
        <p className="text-sm text-slate-500 mt-1">Cadastre um membro do time</p>
      </div>

      <form action={createTeamMember} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div>
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" name="name" placeholder="Ana Silva" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" placeholder="ana@empresa.com" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="role">Cargo / Função</Label>
          <Input id="role" name="role" placeholder="Designer / QA / Desenvolvedor" className="mt-1" />
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="submit">Cadastrar</Button>
          <LinkButton href="/profissionais" variant="ghost">Cancelar</LinkButton>
        </div>
      </form>
    </div>
  )
}
