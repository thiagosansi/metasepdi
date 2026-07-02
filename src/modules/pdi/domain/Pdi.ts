export type PdiStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD'
export type PdiItemStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED'
export type ResourceType = 'COURSE' | 'BOOK' | 'ARTICLE' | 'VIDEO' | 'MENTORING' | 'PROJECT' | 'OTHER'

export interface Pdi {
  id: string
  title: string
  cycleStart: Date
  cycleEnd: Date
  status: PdiStatus
  summary: string | null
  memberId: string
  createdAt: Date
  updatedAt: Date
}

export interface PdiItem {
  id: string
  title: string
  description: string | null
  skillArea: string | null
  resourceUrl: string | null
  resourceType: ResourceType | null
  targetDate: Date | null
  completedDate: Date | null
  status: PdiItemStatus
  priority: number
  pdiId: string
  createdAt: Date
  updatedAt: Date
}

export interface PdiNote {
  id: string
  content: string
  pdiId: string
  createdAt: Date
}

export interface CreatePdiInput {
  title: string
  cycleStart: Date
  cycleEnd: Date
  summary?: string
  memberId: string
}

export interface AddPdiItemInput {
  title: string
  description?: string
  skillArea?: string
  resourceUrl?: string
  resourceType?: ResourceType
  targetDate?: Date
  priority?: number
  pdiId: string
}

export interface AddPdiNoteInput {
  content: string
  pdiId: string
}
