import type { Pdi, PdiItem, PdiNote, CreatePdiInput, AddPdiItemInput, AddPdiNoteInput } from '../Pdi'

export interface PdiWithDetails extends Pdi {
  items: PdiItem[]
  notes: PdiNote[]
  member: { id: string; name: string; role: string | null }
}

export interface PdiRepository {
  findByMember(memberId: string): Promise<PdiWithDetails[]>
  findById(id: string): Promise<PdiWithDetails | null>
  create(input: CreatePdiInput): Promise<Pdi>
  addItem(input: AddPdiItemInput): Promise<PdiItem>
  updateItem(itemId: string, data: Partial<AddPdiItemInput & { status: string; completedDate: Date }>): Promise<PdiItem>
  addNote(input: AddPdiNoteInput): Promise<PdiNote>
}
