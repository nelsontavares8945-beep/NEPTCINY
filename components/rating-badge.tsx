import { RATING_LABEL, type Rating } from '@/lib/catalog'
import { cn } from '@/lib/utils'

const COLORS: Record<Rating, string> = {
  L: 'bg-emerald-600',
  '10': 'bg-sky-600',
  '12': 'bg-amber-500 text-black',
  '14': 'bg-orange-600',
}

export function RatingBadge({ rating, className }: { rating: Rating; className?: string }) {
  return (
    <span
      title={`Classificação: ${RATING_LABEL[rating]}`}
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-sm px-1 text-[11px] font-bold text-white',
        COLORS[rating],
        className,
      )}
    >
      <span className="sr-only">Classificação </span>
      {rating}
    </span>
  )
}
