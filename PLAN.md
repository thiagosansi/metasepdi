# PLAN: OKR & PDI Management Tool

**Mode:** Autonomous  
**Stack:** Next.js 15 (App Router) + PostgreSQL + Prisma + Tailwind CSS + shadcn/ui  
**Architecture:** Hexagonal within App Router  
**Branch:** feature/okr-pdi-tool  

---

## Feature Set

| # | Feature | Type | Priority |
|---|---------|------|----------|
| F1 | Team Members — cadastro de profissionais | Full-stack | MVP |
| F2 | Cycles — gestão de ciclos OKR | Full-stack | MVP |
| F3 | Company Objectives — objetivos da empresa | Full-stack | MVP |
| F4 | Squad Objectives — objetivos do squad com cascade | Full-stack | MVP |
| F5 | Key Results — com progresso e check-in | Full-stack | MVP |
| F6 | PDI — plano individual por profissional | Full-stack | MVP |
| F7 | Dashboard — visão consolidada por ciclo | Full-stack | MVP |

---

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Cycle {
  id         String      @id @default(cuid())
  name       String
  startDate  DateTime
  endDate    DateTime
  status     CycleStatus @default(ACTIVE)
  objectives Objective[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  @@index([status])
}

enum CycleStatus { DRAFT ACTIVE CLOSED }

model TeamMember {
  id         String      @id @default(cuid())
  name       String
  role       String?
  email      String      @unique
  objectives Objective[]
  pdis       Pdi[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}

model Objective {
  id          String          @id @default(cuid())
  title       String
  description String?
  level       ObjectiveLevel
  status      ObjectiveStatus @default(DRAFT)
  parentId    String?
  parent      Objective?      @relation("ObjectiveChildren", fields: [parentId], references: [id])
  children    Objective[]     @relation("ObjectiveChildren")
  ownerId     String?
  owner       TeamMember?     @relation(fields: [ownerId], references: [id])
  cycleId     String
  cycle       Cycle           @relation(fields: [cycleId], references: [id])
  keyResults  KeyResult[]
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  @@index([cycleId])
  @@index([parentId])
  @@index([level, status])
}

enum ObjectiveLevel  { COMPANY SQUAD INDIVIDUAL }
enum ObjectiveStatus { DRAFT ACTIVE AT_RISK COMPLETED CANCELLED }

model KeyResult {
  id             String     @id @default(cuid())
  title          String
  metricType     MetricType @default(PERCENTAGE)
  startValue     Float      @default(0)
  targetValue    Float
  currentValue   Float      @default(0)
  unit           String?
  status         KrStatus   @default(ON_TRACK)
  confidenceScore Int?
  objectiveId    String
  objective      Objective  @relation(fields: [objectiveId], references: [id], onDelete: Cascade)
  checkIns       CheckIn[]
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  @@index([objectiveId])
}

enum MetricType { PERCENTAGE NUMBER CURRENCY BOOLEAN }
enum KrStatus   { ON_TRACK AT_RISK BEHIND COMPLETED }

model CheckIn {
  id          String    @id @default(cuid())
  value       Float
  note        String?
  confidence  Int?
  keyResultId String
  keyResult   KeyResult @relation(fields: [keyResultId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  @@index([keyResultId, createdAt])
}

model Pdi {
  id         String    @id @default(cuid())
  title      String
  cycleStart DateTime
  cycleEnd   DateTime
  status     PdiStatus @default(ACTIVE)
  summary    String?
  memberId   String
  member     TeamMember @relation(fields: [memberId], references: [id])
  items      PdiItem[]
  notes      PdiNote[]
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  @@index([memberId])
}

enum PdiStatus { ACTIVE COMPLETED ON_HOLD }

model PdiItem {
  id            String        @id @default(cuid())
  title         String
  description   String?
  skillArea     String?
  resourceUrl   String?
  resourceType  ResourceType?
  targetDate    DateTime?
  completedDate DateTime?
  status        PdiItemStatus @default(PENDING)
  priority      Int           @default(1)
  pdiId         String
  pdi           Pdi           @relation(fields: [pdiId], references: [id], onDelete: Cascade)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  @@index([pdiId])
}

enum PdiItemStatus { PENDING IN_PROGRESS COMPLETED DROPPED }
enum ResourceType  { COURSE BOOK ARTICLE VIDEO MENTORING PROJECT OTHER }

model PdiNote {
  id        String   @id @default(cuid())
  content   String
  pdiId     String
  pdi       Pdi      @relation(fields: [pdiId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  @@index([pdiId])
}
```

---

## Architecture Map (Next.js App Router + Hexagonal)

```
src/
├── modules/
│   ├── okr/
│   │   ├── domain/
│   │   │   ├── Cycle.ts
│   │   │   ├── Objective.ts
│   │   │   ├── KeyResult.ts
│   │   │   └── ports/
│   │   │       ├── CycleRepository.ts
│   │   │       ├── ObjectiveRepository.ts
│   │   │       └── KeyResultRepository.ts
│   │   ├── application/
│   │   │   ├── create-cycle/CreateCycleUseCase.ts
│   │   │   ├── create-objective/CreateObjectiveUseCase.ts
│   │   │   ├── create-key-result/CreateKeyResultUseCase.ts
│   │   │   ├── add-check-in/AddCheckInUseCase.ts
│   │   │   └── get-cycle-overview/GetCycleOverviewUseCase.ts
│   │   └── infrastructure/
│   │       └── prisma/
│   │           ├── PrismaCycleRepository.ts
│   │           ├── PrismaObjectiveRepository.ts
│   │           └── PrismaKeyResultRepository.ts
│   ├── pdi/
│   │   ├── domain/
│   │   │   ├── Pdi.ts
│   │   │   └── ports/PdiRepository.ts
│   │   ├── application/
│   │   │   ├── create-pdi/CreatePdiUseCase.ts
│   │   │   ├── add-pdi-item/AddPdiItemUseCase.ts
│   │   │   └── add-pdi-note/AddPdiNoteUseCase.ts
│   │   └── infrastructure/
│   │       └── prisma/PrismaPdiRepository.ts
│   └── team/
│       ├── domain/
│       │   ├── TeamMember.ts
│       │   └── ports/TeamMemberRepository.ts
│       ├── application/
│       │   └── create-team-member/CreateTeamMemberUseCase.ts
│       └── infrastructure/
│           └── prisma/PrismaTeamMemberRepository.ts
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    ← redirect to /dashboard
│   ├── dashboard/
│   │   └── page.tsx                ← OKR overview by active cycle
│   ├── ciclos/
│   │   ├── page.tsx
│   │   ├── novo/page.tsx
│   │   └── actions.ts
│   ├── objetivos/
│   │   ├── page.tsx
│   │   ├── novo/page.tsx
│   │   └── actions.ts
│   ├── profissionais/
│   │   ├── page.tsx
│   │   ├── novo/page.tsx
│   │   ├── [id]/page.tsx           ← member detail + PDI
│   │   └── actions.ts
│   └── pdi/
│       ├── [id]/page.tsx
│       └── actions.ts
│
├── components/
│   ├── ui/                         ← shadcn primitives
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── okr/
│   │   ├── CycleSwitcher.tsx
│   │   ├── ObjectiveCard.tsx
│   │   ├── KeyResultsTable.tsx
│   │   └── CheckInDialog.tsx
│   └── pdi/
│       ├── PdiCard.tsx
│       ├── PdiItemList.tsx
│       └── PdiNoteTimeline.tsx
│
└── lib/
    └── prisma.ts
```

---

## BDD Scenarios (Gherkin)

### Feature: OKR Management
```gherkin
Feature: OKR Cycle Management
  Scenario: Create a new OKR cycle
    Given I am on the cycles page
    When I create a cycle named "Q3 2026" starting "2026-07-01" ending "2026-09-30"
    Then I see the cycle listed with status "ACTIVE"

  Scenario: Add a company objective to a cycle
    Given there is an active cycle "Q3 2026"
    When I create objective "Aumentar a retenção de usuários" at COMPANY level
    Then the objective appears under "Q3 2026" with status "DRAFT"

  Scenario: Add a key result to an objective
    Given objective "Aumentar a retenção" exists
    When I add key result "Reduzir churn para 5%" with target 5 unit "%"
    Then the key result shows 0% progress (on track)

  Scenario: Log a check-in on a key result
    Given key result "Reduzir churn" exists with target 5
    When I log a check-in with value 3 and note "Progresso no Q2"
    Then the key result shows 40% progress with status AT_RISK
```

### Feature: PDI Management
```gherkin
Feature: Individual Development Plan
  Scenario: Create a PDI for a team member
    Given team member "Ana Silva" exists
    When I create a PDI titled "PDI 2026 — Liderança" for Ana
    Then the PDI appears on Ana's profile

  Scenario: Add a development action to a PDI
    Given PDI "PDI 2026" exists for Ana Silva
    When I add item "Curso de Product Leadership" with resourceType COURSE
    Then the item appears with status PENDING

  Scenario: Add a manager observation
    Given PDI "PDI 2026" exists for Ana Silva
    When I add note "Ótima evolução em comunicação com stakeholders"
    Then the note appears in the timeline with today's date
```

---

## UI Inventory

### /dashboard
- CycleSwitcher (Select) → filters all cards by cycle
- ObjectiveCard[] (Company level) → shows title, progress bar, status badge
  - KeyResultRow[] (collapsible) → title, progress %, confidence, status badge
  - Button "Check-in" → opens CheckInDialog
- Empty state: "Nenhum objetivo cadastrado neste ciclo"

### /ciclos
- Table: Name, Period, Status, Actions (Edit, Close, Archive)
- Button "Novo Ciclo" → /ciclos/novo
- Form: name, startDate, endDate

### /objetivos
- Tabs: Empresa | Squad | Individual
- List of objectives per tab with cascade arrows
- Button "Novo Objetivo" → form with level selector, parentId selector, cycle selector

### /profissionais
- Table: Name, Role, Active PDIs, Active OKRs
- Button "Novo Profissional" → form (name, role, email)
- Click row → /profissionais/[id] (detail page)

### /profissionais/[id]
- Header: name, role, email, avatar placeholder
- Tabs: OKRs | PDI | Anotações
- OKRs tab: KRs owned by this member across active cycle
- PDI tab: PdiCard with PdiItemList + PdiNoteTimeline
- Button "Novo PDI" → creates a new PDI for this cycle

---

## Implementation Sequence (TDD — Next.js App Router + Hexagonal)

```
Wave 1: Foundation
  [F0] Scaffold: Next.js 15 + Prisma + shadcn/ui + Docker + Vitest + Cypress

Wave 2: OKR Core (sequential — each builds on previous)
  [F1] TeamMember: domain → repo port → Prisma adapter → Server Action → /profissionais page
  [F2] Cycle: domain → repo port → Prisma adapter → Server Action → /ciclos page
  [F3] Objective (Company): domain → cascade rules → use cases → /objetivos page
  [F4] KeyResult + CheckIn: domain → AddCheckIn use case (transactional) → CheckInDialog
  [F5] Dashboard: GetCycleOverview use case → /dashboard with progress bars

Wave 3: PDI
  [F6] Pdi + PdiItem + PdiNote: domain → use cases → /profissionais/[id] PDI tab

Wave 4: Polish
  [F7] Filters (by product/person/work front)
  [F8] Status auto-calculation (ON_TRACK/AT_RISK/BEHIND based on progress %)
```

---

## Git Strategy

```
Branch: feature/okr-pdi-tool
Commits:
  feat(scaffold): init Next.js 15 + Prisma + shadcn/ui + Docker
  feat(team): add TeamMember domain, repository, and CRUD pages
  feat(cycle): add Cycle entity and cycle management pages
  feat(okr): add Objective and KeyResult with cascade
  feat(check-in): add CheckIn use case with transactional currentValue update
  feat(dashboard): add cycle overview dashboard
  feat(pdi): add PDI, PdiItem, PdiNote with member profile integration
```

---

## Definition of Done

- [ ] All BDD scenarios pass (Cucumber)
- [ ] Unit tests for all use cases (Vitest)
- [ ] E2E: navigate all pages, fill all forms, verify data persists (Cypress)
- [ ] Docker: `docker compose up -d` → app accessible at localhost:3000
- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] All UI elements in UI Inventory are implemented (no stubs)
- [ ] Progress % calculated correctly for each KR
- [ ] Status badge reflects ON_TRACK/AT_RISK/BEHIND thresholds

---

**Plan auto-approved (autonomous mode)**
