'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Title } from '@/lib/catalog'
import { TitleCard } from './title-card'

export function TitleRow({
  heading,
  titles,
  href,
  ranked,
}: {
  heading: string
  titles: Title[]
  href?: string
  ranked?: boolean
}) {
  const scroller = useRef<HTMLUListElement>(null)

  if (titles.length === 0) return null

  const scroll = (direction: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  return (
    <section className="group/row relative" aria-label={heading}>
      <div className="mb-3 flex items-end justify-between px-4 md:px-10">
        <h2 className="text-lg font-semibold md:text-xl">{heading}</h2>
        {href && (
          <Link href={href} className="text-sm text-primary hover:underline">
            Ver tudo
          </Link>
        )}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label={`Rolar ${heading} para a esquerda`}
          className="absolute inset-y-0 left-0 z-20 hidden w-10 items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
        >
          <ChevronLeft className="size-7" />
        </button>
        <ul
          ref={scroller}
          className="scrollbar-none flex snap-x gap-3 overflow-x-auto scroll-smooth px-4 py-4 md:px-10"
        >
          {titles.map((title, index) => (
            <li key={title.id} className="w-[70vw] shrink-0 snap-start sm:w-[42vw] md:w-[30vw] lg:w-[22vw] xl:w-[18vw]">
              <TitleCard title={title} rank={ranked ? index + 1 : undefined} />
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label={`Rolar ${heading} para a direita`}
          className="absolute inset-y-0 right-0 z-20 hidden w-10 items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
        >
          <ChevronRight className="size-7" />
        </button>
      </div>
    </section>
  )
}
