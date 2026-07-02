'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { addCheckIn } from '@/app/objetivos/actions'

interface CheckInDialogProps {
  keyResultId: string
  keyResultTitle: string
  currentValue: number
  targetValue: number
  unit: string | null
}

export function CheckInDialog({ keyResultId, keyResultTitle, currentValue, targetValue, unit }: CheckInDialogProps) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    await addCheckIn(formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" size="sm" />}
      >
        Check-in
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar progresso</DialogTitle>
          <p className="text-sm text-slate-500 mt-1">{keyResultTitle}</p>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 mt-2">
          <input type="hidden" name="keyResultId" value={keyResultId} />
          <div>
            <Label htmlFor="value">
              Valor atual {unit ? `(${unit})` : ''}
              <span className="text-slate-400 ml-1 font-normal">Meta: {targetValue}{unit ? ` ${unit}` : ''}</span>
            </Label>
            <Input
              id="value"
              name="value"
              type="number"
              step="any"
              defaultValue={currentValue}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="confidence">Confiança (0–10)</Label>
            <Input id="confidence" name="confidence" type="number" min={0} max={10} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="note">Observação (opcional)</Label>
            <Textarea id="note" name="note" rows={2} className="mt-1" placeholder="O que aconteceu este período?" />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar check-in</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
