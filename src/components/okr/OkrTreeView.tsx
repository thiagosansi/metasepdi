import { calculateProgress } from '@/modules/okr/domain/KeyResult'
import type { ObjectiveWithKeyResults } from '@/modules/okr/domain/ports/ObjectiveRepository'
import { cn } from '@/lib/utils'

// ─── Config por nível ─────────────────────────────────────────────────────────

const levelCfg = {
  COMPANY: {
    card:       'bg-slate-800 shadow-md',
    title:      'text-white',
    subtitle:   'text-slate-400',
    badge:      'bg-white/10 text-slate-200',
    krText:     'text-slate-300',
    dot:        'bg-white/30',
    bar:        'bg-white/70',
    barBg:      'bg-white/15',
    connector:  'bg-slate-400',
    label:      'Empresa',
  },
  SQUAD: {
    card:       'bg-violet-50 border border-violet-200 shadow-sm',
    title:      'text-slate-800',
    subtitle:   'text-slate-500',
    badge:      'bg-violet-600 text-white',
    krText:     'text-slate-600',
    dot:        'bg-violet-300',
    bar:        'bg-violet-500',
    barBg:      'bg-violet-100',
    connector:  'bg-violet-300',
    label:      'Squad',
  },
  INDIVIDUAL: {
    card:       'bg-amber-50 border border-amber-200 shadow-sm',
    title:      'text-slate-800',
    subtitle:   'text-slate-500',
    badge:      'bg-amber-400 text-white',
    krText:     'text-slate-600',
    dot:        'bg-amber-300',
    bar:        'bg-amber-400',
    barBg:      'bg-amber-100',
    connector:  'bg-amber-300',
    label:      'Individual',
  },
} as const

const statusDot: Record<string, string> = {
  ON_TRACK:  'bg-green-500',
  AT_RISK:   'bg-yellow-400',
  BEHIND:    'bg-red-500',
  COMPLETED: 'bg-blue-500',
}

// ─── Card do nó ───────────────────────────────────────────────────────────────

function NodeCard({ objective }: { objective: ObjectiveWithKeyResults }) {
  const level  = (objective.level in levelCfg ? objective.level : 'INDIVIDUAL') as keyof typeof levelCfg
  const cfg    = levelCfg[level]
  const krs    = objective.keyResults

  const overallProgress =
    krs.length > 0
      ? Math.round(
          krs.reduce(
            (sum, kr) => sum + calculateProgress(kr.startValue, kr.targetValue, kr.currentValue),
            0
          ) / krs.length
        )
      : 0

  return (
    <div className={cn('rounded-xl p-4 w-[230px]', cfg.card)}>
      {/* Badge de nível + owner */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className={cn('text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full', cfg.badge)}>
          {cfg.label}
        </span>
        {objective.owner && (
          <span className={cn('text-[10px] truncate', cfg.subtitle)}>
            {objective.owner.name}
          </span>
        )}
      </div>

      {/* Título do objetivo */}
      <p className={cn('text-sm font-semibold leading-snug mb-3', cfg.title)}>
        {objective.title}
      </p>

      {/* Barra de progresso geral */}
      {krs.length > 0 && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className={cn('text-[10px]', cfg.subtitle)}>Progresso</span>
            <span className={cn('text-[10px] font-bold tabular-nums', cfg.title)}>{overallProgress}%</span>
          </div>
          <div className={cn('h-1.5 rounded-full overflow-hidden', cfg.barBg)}>
            <div className={cn('h-full rounded-full transition-all', cfg.bar)} style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      )}

      {/* Key Results */}
      {krs.length > 0 && (
        <div>
          <span className={cn('text-[10px] font-semibold uppercase tracking-wide', cfg.subtitle)}>
            Key Results
          </span>
          <ul className="mt-1.5 space-y-1">
            {krs.map((kr) => (
              <li key={kr.id} className="flex items-start gap-1.5">
                <span className={cn('mt-[3px] w-1.5 h-1.5 rounded-full shrink-0', statusDot[kr.status] ?? cfg.dot)} />
                <span className={cn('text-[11px] leading-snug', cfg.krText)}>{kr.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ─── Árvore recursiva ─────────────────────────────────────────────────────────

function TreeNode({ objective }: { objective: ObjectiveWithKeyResults }) {
  const children = objective.children ?? []
  const level    = (objective.level in levelCfg ? objective.level : 'INDIVIDUAL') as keyof typeof levelCfg
  const connector = levelCfg[level].connector
  const single    = children.length === 1

  return (
    <div className="flex flex-col items-center">
      <NodeCard objective={objective} />

      {children.length > 0 && (
        <>
          {/* Linha vertical descendente do card */}
          <div className={cn('w-px h-8', connector)} />

          {/* Linha horizontal + linhas ascendentes de cada filho */}
          <div className="flex">
            {children.map((child, i) => {
              const isFirst = i === 0
              const isLast  = i === children.length - 1

              return (
                <div key={child.id} className="flex flex-col items-center min-w-[260px]">
                  {single ? (
                    /* Filho único: só linha vertical */
                    <div className={cn('w-px h-8', connector)} />
                  ) : (
                    /* Múltiplos filhos: segmento horizontal + vertical */
                    <div className="relative w-full h-8">
                      {/* Metade esquerda da barra horizontal */}
                      {!isFirst && (
                        <div className={cn('absolute top-0 left-0 right-1/2 h-px', connector)} />
                      )}
                      {/* Metade direita da barra horizontal */}
                      {!isLast && (
                        <div className={cn('absolute top-0 left-1/2 right-0 h-px', connector)} />
                      )}
                      {/* Linha vertical descendo até o card filho */}
                      <div className={cn('absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px', connector)} />
                    </div>
                  )}

                  {/* Filho (recursivo) */}
                  <TreeNode objective={child} />
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Export público ───────────────────────────────────────────────────────────

export function OkrTreeView({ objectives }: { objectives: ObjectiveWithKeyResults[] }) {
  const roots = objectives.filter((o) => !o.parentId)

  if (roots.length === 0) {
    return (
      <p className="text-sm text-slate-400 py-10 text-center">
        Nenhum objetivo cadastrado neste ciclo.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto pb-8">
      <div className="inline-flex flex-col items-center min-w-full pt-4 gap-8">
        {roots.map((obj) => (
          <TreeNode key={obj.id} objective={obj} />
        ))}
      </div>
    </div>
  )
}
