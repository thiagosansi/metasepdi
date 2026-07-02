import { PrismaTeamMemberRepository } from '@/modules/team/infrastructure/prisma/PrismaTeamMemberRepository'
import { PrismaPdiRepository } from '@/modules/pdi/infrastructure/prisma/PrismaPdiRepository'
import { LinkButton } from '@/components/ui/link-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const pdiStatusLabel: Record<string, string> = {
  ACTIVE: 'Ativo', COMPLETED: 'Concluído', ON_HOLD: 'Em pausa',
}
const pdiItemStatusLabel: Record<string, string> = {
  PENDING: 'Pendente', IN_PROGRESS: 'Em andamento', COMPLETED: 'Concluído', DROPPED: 'Descartado',
}

export default async function ProfissionalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const memberRepo = new PrismaTeamMemberRepository()
  const pdiRepo = new PrismaPdiRepository()

  const member = await memberRepo.findById(id)
  if (!member) notFound()

  const pdis = await pdiRepo.findByMember(id)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/profissionais" className="text-xs text-slate-400 hover:text-slate-600">← Profissionais</Link>
          <h1 className="text-2xl font-semibold text-slate-900 mt-1">{member.name}</h1>
          <p className="text-sm text-slate-500">{member.role ?? 'Sem cargo'} · {member.email}</p>
        </div>
      </div>

      <Tabs defaultValue="pdi">
        <TabsList>
          <TabsTrigger value="pdi">PDI ({pdis.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pdi" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <LinkButton href={`/pdi/novo?memberId=${id}`} size="sm">+ Novo PDI</LinkButton>
          </div>

          {pdis.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">Nenhum PDI cadastrado para este profissional.</p>
          ) : (
            pdis.map((pdi) => (
              <div key={pdi.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900">{pdi.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(pdi.cycleStart).toLocaleDateString('pt-BR')} –{' '}
                      {new Date(pdi.cycleEnd).toLocaleDateString('pt-BR')}
                    </p>
                    {pdi.summary && <p className="text-sm text-slate-600 mt-2">{pdi.summary}</p>}
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">
                    {pdiStatusLabel[pdi.status] ?? pdi.status}
                  </span>
                </div>

                {pdi.items.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ações de desenvolvimento</p>
                    {pdi.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800">{item.title}</p>
                          {item.skillArea && <p className="text-xs text-slate-500">Área: {item.skillArea}</p>}
                          {item.targetDate && (
                            <p className="text-xs text-slate-400">
                              Prazo: {new Date(item.targetDate).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 shrink-0">{pdiItemStatusLabel[item.status] ?? item.status}</span>
                      </div>
                    ))}
                  </div>
                )}

                {pdi.notes.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Anotações</p>
                    {pdi.notes.map((note) => (
                      <div key={note.id} className="p-3 bg-amber-50 border-l-2 border-amber-300 rounded-r-lg">
                        <p className="text-sm text-slate-700">{note.content}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(note.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                    ))}
                  </div>
                )}

                <LinkButton href={`/pdi/${pdi.id}`} variant="outline" size="sm">Gerenciar PDI</LinkButton>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
