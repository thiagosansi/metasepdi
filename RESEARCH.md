# Research: OKR & PDI Management Tool

## Key Insights

1. OKR has a strict 3-level cascade: **Company → Squad → Individual**. Alignment is the core value — every individual KR should trace back to a company objective.
2. **Check-in ritual** (weekly progress update on each KR) is the #1 adoption driver. Tools that require >2 clicks to log progress die within 2 weeks.
3. **Cycle** is a first-class entity (not just a date field) — enables archiving, comparison, and filtering across periods.
4. **PDI** in Brazilian context is not just a goal list — it has: competency assessment, development actions (with 5W2H), resource type (course/mentoring/book), timeline, and periodic manager notes.
5. **Work fronts (frentes de trabalho)** are cross-product dimensions: Tech, UX, Quality, Data, Product/Business — they group effort by nature, not by product.
6. `currentValue` on KeyResult should be denormalized (updated transactionally with each CheckIn) for performance on list views.
7. Server Actions (not API Routes) are preferred for internal tools — eliminate API client boilerplate and give end-to-end type safety.
8. shadcn/ui + TanStack Table is the standard pattern for data-heavy dashboards in Next.js.
9. Status-based color coding (green=on track, yellow=at risk, red=behind) is universal across all OKR tools.
10. Microsoft Viva Goals was discontinued in 2025 — the market gap favors simpler, focused internal tools.

## Business & Market Analysis

### Top OKR Tools Compared
| Tool | Strength | Weakness |
|------|----------|----------|
| Perdoo | Strategy maps, 15+ integrations, AI coach | Outdated UI, weak 1:1s |
| Lattice | Full HR suite | OKR module is secondary, expensive |
| 15Five | Weekly check-ins, coaching | More people-focused than strategy |
| Tability | Lightweight, AI goals, Slack nudges | No custom properties, limited scale |
| Weekdone | 4-level hierarchy, TV dashboard | Slow with many OKRs, stagnated since 2023 |

### Must-Have Features (MVP)
- Quarterly/semester cycles with start/end dates
- Objectives at company and squad level
- Key Results with: owner, current value, target value, unit, auto-calculated %
- Cascade view: Company Obj → Squad Obj → Individual KR
- Weekly check-in per KR (progress + confidence + optional note)
- PDI per person: competencies, actions, deadline, status
- Manager observations per person (with date)
- Status dashboard per cycle (green/yellow/red)
- Filters by product, person, work front
- Historical cycles

### Nice-to-Have (V2)
- Weekly nudge (email/Slack)
- Clone OKRs from previous cycle
- Alignment tree visualization
- PDF export of PDI
- Link PDI actions to KRs
- AI key result suggestions

## Architecture & Backend Patterns

### Recommended Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL via Prisma ORM
- **UI**: Tailwind CSS + shadcn/ui + TanStack Table
- **Architecture**: Hexagonal within App Router
- **Mutations**: Server Actions (internal tool, no external consumers)
- **Testing**: Jest (unit) + Cucumber (BDD) + Cypress (E2E)

### Hexagonal Layer Mapping
```
src/modules/[module]/
  domain/          ← pure entities + port interfaces (no framework imports)
  application/     ← use cases (inject ports via constructor)
  infrastructure/  ← Prisma repositories implementing ports

app/               ← Next.js App Router (primary adapter)
  [route]/
    page.tsx       ← Server Component (calls use case directly)
    actions.ts     ← Server Actions (primary port for mutations)
```

### Prisma Schema (decided)
See PLAN.md — schema finalized based on research.

### Key Architectural Decisions
1. **Auto-referential parentId** for Objective hierarchy (sufficient for 2-3 levels, no ltree needed)
2. **Denormalized currentValue** on KeyResult, updated transactionally with CheckIn creation
3. **Server Actions** for all CRUD — no API routes needed for internal tool
4. **Cycle as entity** — not a date field — enables archiving and multi-cycle comparison

## Domain Rules & Terminology

### OKR Rules
- **Objective**: qualitative, inspirational, time-bound to a cycle. Max 4 per level.
- **Key Result**: quantitative, measurable, specific. 2-5 per Objective. Must have: owner, start value, target value, unit.
- **Check-in**: progress update on a KR. Contains: current value, confidence score (0-10), optional note.
- **Progress %**: `(currentValue - startValue) / (targetValue - startValue) * 100`
- **Status logic**: ≥70% = ON_TRACK (green), 40-69% = AT_RISK (yellow), <40% = BEHIND (red)
- **Cycle status**: DRAFT → ACTIVE → CLOSED

### PDI Rules (Brazilian Context)
- PDI is co-created by manager and professional
- Required fields: professional, cycle period, development goals
- Each PDI Item needs: title, skill area, resource type, target date, status
- Manager can add periodic notes (timestamped observations)
- PDI status: ACTIVE → COMPLETED | ON_HOLD

### Terminology Map
| Portuguese (UI) | English (code) |
|-----------------|----------------|
| Ciclo | Cycle |
| Objetivo | Objective |
| Resultado-chave | KeyResult |
| Check-in | CheckIn |
| Frente de trabalho | WorkFront |
| Profissional | TeamMember |
| PDI | Pdi |
| Ação de desenvolvimento | PdiItem |
| Anotação | PdiNote |
| Cargo | Role |
| Squad | Squad |
| Produto | Product |
| Empresa | Company (level enum) |
| Confiança | ConfidenceScore |
| Em dia | ON_TRACK |
| Em risco | AT_RISK |
| Atrasado | BEHIND |

### Squad Model (Brazilian Context)
- Squad = multidisciplinary, autonomous, goal-oriented team
- Roles: Product Lead (PL), Designer, QA, Developer(s)
- Squad owns one or more products
- Squads connect to strategy via OKRs that cascade from company objectives
- Work fronts (frentes) are cross-product: Tech, UX/Design, Quality, Product/Business, Data

## Pitfalls & Lessons Learned
- Never store only current KR value — always maintain CheckIn history for trend analysis
- Progress bar must show color status, not just percentage — cognitive load reduction
- Inline editing for check-ins is critical for adoption — modal/dialog acceptable if < 3 fields
- Keep PDI separate from performance review — different cadence and purpose
- Cycle must be closeable/archivable — "always active" becomes noise

## Autonomous Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Stack | Next.js 15 + Postgres + Prisma + shadcn/ui | Industry standard for full-stack TypeScript internal tools |
| Architecture | Hexagonal inside App Router | Testable domain logic, clear boundaries |
| Mutations | Server Actions only | Internal tool, no external consumers needed |
| KR hierarchy | Company → Squad → Individual via parentId | 3 levels max, auto-reference is sufficient |
| Progress calculation | (current - start) / (target - start) × 100 | Industry standard formula |
| Status thresholds | ≥70% green, 40-69% yellow, <40% red | Matches Perdoo/Tability defaults |
| PDI model | 1 PDI per member per period, with Items + Notes | Brazilian corporate standard |

## References
- [27 Best OKR Software in 2026 — mooncamp.com](https://mooncamp.com/blog/best-okr-software)
- [OKR Dashboard Best Practices — mooncamp.com](https://mooncamp.com/blog/okr-dashboard)
- [Guia PDI — Vanzolini](https://vanzolini.org.br/blog/guia-pratico-plano-de-desenvolvimento-individual/)
- [PDI Completo — GPTW](https://gptw.com.br/conteudo/artigos/plano-de-desenvolvimento-individual/)
- [Hexagonal Architecture in Next.js — Matias Suez](https://matias-suez.com/blog/hexagonal-architecture-nextjs)
- [Next.js Server Actions vs API Routes — peal.dev](https://www.peal.dev/blog/nextjs-api-routes-server-actions-when-to-use-which)
- [Como funcionam os Squads no Nubank — Medium](https://medium.com/mulheres-de-produto/como-funcionam-os-squads-no-nubank-e1194a6f2a9e)
- [A Data Model for OKRs — LinkedIn](https://www.linkedin.com/pulse/data-model-okrs-rock-mukom-tamon)
