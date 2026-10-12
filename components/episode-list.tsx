'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Play } from 'lucide-react'
import type { Season } from '@/lib/catalog'
import { cn } from '@/lib/utils'

export function EpisodeList({ titleId, seasons }: { titleId: string; seasons: Season[] }) {
  const [seasonNumber, setSeasonNumber] = useState(seasons[0]?.number ?? 1)
  const season = seasons.find((s) => s.number === seasonNumber) ?? seasons[0]

  return (
    <section aria-labelledby="episodios-heading">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="episodios-heading" className="text-2xl font-semibold">
          Episódios
        </h2>
        <div role="tablist" aria-label="Temporadas" className="flex gap-2">
          {seasons.map((s) => (
            <button
              key={s.number}
              type="button"
              role="tab"
              aria-selected={s.number === seasonNumber}
              onClick={() => setSeasonNumber(s.number)}
              className={cn(
                'h-9 rounded-md px-4 text-sm font-medium transition-colors',
                s.number === seasonNumber ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground',
              )}
            >
              Temporada {s.number}
            </button>
          ))}
        </div>
      </div>
      <ol className="mt-6 divide-y divide-border overflow-hidden rounded-lg border border-border">
        {season.episodes.map((episode) => (
          <li key={episode.id}>
            <Link
              href={`/assistir/${titleId}?ep=${episode.id}`}
              className="group flex items-center gap-4 p-4 transition-colors hover:bg-secondary"
            >
              <span className="w-6 text-center text-2xl font-semibold text-muted-foreground">{episode.number}</span>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary group-hover:bg-primary">
                <Play className="size-4 fill-current" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-4">
                  <span className="font-semibold">{episode.title}</span>
                  <span className="shrink-0 text-sm text-muted-foreground">{episode.duration}</span>
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{episode.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
