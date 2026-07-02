import { PrismaCycleRepository } from '@/modules/okr/infrastructure/prisma/PrismaCycleRepository'
import { StatusBadge } from '@/components/okr/StatusBadge'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { updateCycleStatus } from './actions'

export default async function CiclosPage() {
  const repo = new PrismaCycleRepository()
  const cycles = await repo.findAll()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Ciclos OKR</h1>
        <LinkButton href="/ciclos/novo">+ Novo ciclo</LinkButton>
      </div>

      {cycles.length === 0 ? (
        <p className="text-slate-500 text-sm">Nenhum ciclo cadastrado ainda.</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {cycles.map((cycle) => (
            <div key={cycle.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium text-slate-900">{cycle.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(cycle.startDate).toLocaleDateString('pt-BR')} –{' '}
                  {new Date(cycle.endDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={cycle.status} />
                {cycle.status === 'ACTIVE' && (
                  <form action={updateCycleStatus.bind(null, cycle.id, 'CLOSED')}>
                    <Button variant="outline" size="sm" type="submit">Encerrar</Button>
                  </form>
                )}
                {cycle.status === 'DRAFT' && (
                  <form action={updateCycleStatus.bind(null, cycle.id, 'ACTIVE')}>
                    <Button size="sm" type="submit">Ativar</Button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
