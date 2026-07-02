import { PrismaTeamMemberRepository } from '@/modules/team/infrastructure/prisma/PrismaTeamMemberRepository'
import { LinkButton } from '@/components/ui/link-button'
import Link from 'next/link'

export default async function ProfissionaisPage() {
  const repo = new PrismaTeamMemberRepository()
  const members = await repo.findAll()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Profissionais</h1>
        <LinkButton href="/profissionais/novo">+ Novo profissional</LinkButton>
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-slate-400">Nenhum profissional cadastrado.</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {members.map((member) => (
            <Link
              key={member.id}
              href={`/profissionais/${member.id}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
            >
              <div>
                <p className="font-medium text-slate-900">{member.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {member.role ?? 'Sem cargo'} · {member.email}
                </p>
              </div>
              <span className="text-xs text-slate-400">Ver perfil →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
