import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import type { Title } from '@/lib/catalog'
import { RatingBadge } from './rating-badge'
import { cn } from '@/lib/utils'

export function TitleCard({ title, rank, className }: { title: Title; rank?: number; className?: string }) {
  return (
    <Link
      href={`/titulo/${title.id}`}
      className={cn(
        'group relative block overflow-hidden rounded-md bg-card outline-none ring-primary transition-transform duration-300 hover:z-10 hover:scale-105 focus-visible:ring-2',
        className,
      )}
    >
      <div className="relative aspect-video">
        <Image
          src={title.image || '/placeholder.svg'}
          alt={title.title}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 60vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        {title.type === 'serie' && (
          <span className="absolute left-2 top-2 rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            Série
          </span>
        )}
        {rank && (
          <span className="absolute right-2 top-2 rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-gold">
            TOP {rank}
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground">
            <Play className="size-5 fill-current" aria-hidden="true" />
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3 className="text-balance text-sm font-semibold leading-tight md:text-base">{title.title}</h3>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="font-semibold text-emerald-400">{title.match}%</span>
            <RatingBadge rating={title.rating} />
            <span>{title.year}</span>
            <span className="truncate">{title.genres[0]}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
