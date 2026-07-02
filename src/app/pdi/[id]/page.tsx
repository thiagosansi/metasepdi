import { PrismaPdiRepository } from '@/modules/pdi/infrastructure/prisma/PrismaPdiRepository'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { addPdiItem, addPdiNote, updatePdiItemStatus } from '@/app/pdi/actions'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const itemStatusOptions = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'COMPLETED', label: 'Concluído' },
  { value: 'DROPPED', label: 'Descartado' },
]

const resourceTypeOptions = [
  { value: 'COURSE', label: 'Curso' },
  { value: 'BOOK', label: 'Livro' },
  { value: 'ARTICLE', label: 'Artigo' },
  { value: 'VIDEO', label: 'Vídeo' },
  { value: 'MENTORING', label: 'Mentoria' },
  { value: 'PROJECT', label: 'Projeto' },
  { value: 'OTHER', label: 'Outro' },
]

export default async function PdiDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const repo = new PrismaPdiRepository()
  const pdi = await repo.findById(id)
  if (!pdi) notFound()

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <Link href={`/profissionais/${pdi.memberId}`} className="text-xs text-slate-400 hover:text-slate-600">
          ← {pdi.member.name}
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900 mt-1">{pdi.title}</h1>
        <p className="text-sm text-slate-500">
          {new Date(pdi.cycleStart).toLocaleDateString('pt-BR')} –{' '}
          {new Date(pdi.cycleEnd).toLocaleDateString('pt-BR')}
        </p>
        {pdi.summary && <p className="text-sm text-slate-600 mt-2">{pdi.summary}</p>}
      </div>

      {/* Ações de desenvolvimento */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-800">Ações de desenvolvimento</h2>

        {pdi.items.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium text-slate-900">{item.title}</p>
                {item.description && <p className="text-sm text-slate-500 mt-0.5">{item.description}</p>}
                <div className="flex gap-3 mt-1 text-xs text-slate-400">
                  {item.skillArea && <span>Área: {item.skillArea}</span>}
                  {item.resourceType && <span>Tipo: {item.resourceType}</span>}
                  {item.targetDate && <span>Prazo: {new Date(item.targetDate).toLocaleDateString('pt-BR')}</span>}
                  {item.resourceUrl && (
                    <a href={item.resourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Recurso
                    </a>
                  )}
                </div>
              </div>
              <form action={updatePdiItemStatus.bind(null, item.id,
                item.status === 'PENDING' ? 'IN_PROGRESS' :
                item.status === 'IN_PROGRESS' ? 'COMPLETED' : 'PENDING', id)}>
                <button
                  type="submit"
                  className="text-xs px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  {item.status === 'PENDING' ? '▷ Iniciar' :
                   item.status === 'IN_PROGRESS' ? '✓ Concluir' : '↩ Reabrir'}
                </button>
              </form>
            </div>
          </div>
        ))}

        {/* Adicionar ação */}
        <details className="bg-slate-50 rounded-xl border border-slate-200">
          <summary className="px-4 py-3 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-100 rounded-xl">
            + Adicionar ação de desenvolvimento
          </summary>
          <form action={addPdiItem} className="px-4 pb-4 space-y-3 mt-2">
            <input type="hidden" name="pdiId" value={id} />
            <div>
              <Label htmlFor="itemTitle">Título da ação</Label>
              <Input id="itemTitle" name="title" placeholder="Ex: Curso de Product Leadership" required className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="skillArea">Área de competência</Label>
                <Input id="skillArea" name="skillArea" placeholder="Ex: Liderança" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="resourceType">Tipo de recurso</Label>
                <select name="resourceType" className="mt-1 w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-white">
                  <option value="">— Selecione —</option>
                  {resourceTypeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="resourceUrl">Link do recurso</Label>
                <Input id="resourceUrl" name="resourceUrl" type="url" placeholder="https://..." className="mt-1" />
              </div>
              <div>
                <Label htmlFor="targetDate">Prazo</Label>
                <Input id="targetDate" name="targetDate" type="date" className="mt-1" />
              </div>
            </div>
            <Button type="submit" size="sm">Adicionar</Button>
          </form>
        </details>
      </section>

      {/* Anotações */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-800">Anotações do gestor</h2>

        {pdi.notes.map((note) => (
          <div key={note.id} className="p-4 bg-amber-50 border-l-3 border-amber-400 rounded-r-xl">
            <p className="text-sm text-slate-700">{note.content}</p>
            <p className="text-xs text-slate-400 mt-1">{new Date(note.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>
        ))}

        <form action={addPdiNote} className="space-y-2">
          <input type="hidden" name="pdiId" value={id} />
          <Textarea name="content" rows={3} placeholder="Adicionar observação..." required />
          <Button type="submit" size="sm" variant="outline">Salvar anotação</Button>
        </form>
      </section>
    </div>
  )
}
