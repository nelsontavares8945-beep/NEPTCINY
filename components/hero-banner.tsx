'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Info, Play } from 'lucide-react'
import type { Title } from '@/lib/catalog'
import { RatingBadge } from './rating-badge'
import { MyListButton } from './my-list-button'
import { cn } from '@/lib/utils'

export function HeroBanner({ titles, myList }: { titles: Title[]; myList: string[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || titles.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % titles.length), 8000)
    return () => clearInterval(id)
  }, [paused, titles.length])

  if (titles.length === 0) return null
  const title = titles[index]

  return (
    <section
      className="relative h-[78vh] min-h-[520px] w-full overflow-hidden md:h-[88vh]"
      aria-roledescription="carrossel"
      aria-label="Destaques"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {titles.map((item, i) => (
        <Image
          key={item.id}
          src={item.image || '/placeholder.svg'}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={cn('object-cover transition-opacity duration-1000', i === index ? 'opacity-100' : 'opacity-0')}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />

      <div className="relative z-10 flex h-full max-w-[1600px] flex-col justify-end px-4 pb-24 md:px-10 md:pb-32">
        <div key={title.id} className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
            {title.type === 'serie' ? 'Série NEPTCINY' : 'Filme NEPTCINY'}
          </p>
          <h1 className="text-balance font-display text-6xl leading-none tracking-wide md:text-8xl">{title.title}</h1>
          <p className="mt-3 text-lg font-medium text-foreground/90">{title.tagline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="font-semibold text-emerald-400">{title.match}% relevante</span>
            <span>{title.year}</span>
            <RatingBadge rating={title.rating} />
            <span>{title.duration}</span>
            <span className="rounded-sm border border-muted-foreground/50 px-1 text-[10px] font-bold">HD</span>
            <span className="rounded-sm border border-muted-foreground/50 px-1 text-[10px] font-bold">CC</span>
          </div>
          <p className="mt-4 line-clamp-3 text-pretty text-sm leading-relaxed text-foreground/80 md:text-base">
            {title.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/assistir/${title.id}`}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-6 text-sm font-bold text-background transition-colors hover:bg-foreground/85"
            >
              <Play className="size-5 fill-current" aria-hidden="true" />
              Assistir
            </Link>
            <Link
              href={`/titulo/${title.id}`}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-white/15 px-5 text-sm font-semibold transition-colors hover:bg-white/25"
            >
              <Info className="size-5" aria-hidden="true" />
              Mais informações
            </Link>
            <MyListButton key={title.id} titleId={title.id} inList={myList.includes(title.id)} variant="icon" />
          </div>
        </div>

        <div className="mt-8 flex gap-2" role="tablist" aria-label="Escolher destaque">
          {titles.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={item.title}
              onClick={() => setIndex(i)}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === index ? 'w-8 bg-primary' : 'w-4 bg-foreground/30 hover:bg-foreground/60',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
