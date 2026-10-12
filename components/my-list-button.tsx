'use client'

import { useOptimistic, useTransition } from 'react'
import { Check, Plus } from 'lucide-react'
import { toggleMyList } from '@/app/actions'
import { cn } from '@/lib/utils'

export function MyListButton({
  titleId,
  inList,
  variant = 'full',
}: {
  titleId: string
  inList: boolean
  variant?: 'full' | 'icon'
}) {
  const [optimistic, setOptimistic] = useOptimistic(inList)
  const [pending, startTransition] = useTransition()

  const onClick = () => {
    startTransition(async () => {
      setOptimistic(!optimistic)
      await toggleMyList(titleId)
    })
  }

  const Icon = optimistic ? Check : Plus
  const label = optimistic ? 'Na minha lista' : 'Minha lista'

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-pressed={optimistic}
        aria-label={optimistic ? 'Remover da minha lista' : 'Adicionar à minha lista'}
        className="flex size-11 items-center justify-center rounded-full border-2 border-foreground/60 bg-black/40 transition-colors hover:border-foreground"
      >
        <Icon className="size-5" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={optimistic}
      className={cn(
        'inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-semibold transition-colors',
        optimistic ? 'bg-secondary text-foreground' : 'bg-white/15 text-foreground hover:bg-white/25',
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
      {label}
    </button>
  )
}
