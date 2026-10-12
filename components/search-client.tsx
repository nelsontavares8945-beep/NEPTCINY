'use client'

import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import type { Channel, Title } from '@/lib/catalog'
import { TitleCard } from './title-card'
import { ChannelCard } from './channel-card'
import { cn } from '@/lib/utils'

type Filter = 'todos' | 'filme' | 'serie' | 'tv'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'filme', label: 'Filmes' },
  { value: 'serie', label: 'Séries' },
  { value: 'tv', label: 'TV Aberta' },
]

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

export function SearchClient({
  titles,
  channels,
  initialQuery,
}: {
  titles: Title[]
  channels: Channel[]
  initialQuery: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState(initialQuery)
  const [filter, setFilter] = useState<Filter>('todos')
  const deferred = useDeferredValue(query)

  useEffect(() => {
    const id = setTimeout(() => {
      const q = query.trim()
      router.replace(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname, { scroll: false })
    }, 400)
    return () => clearTimeout(id)
  }, [query, pathname, router])

  const genres = useMemo(() => Array.from(new Set(titles.flatMap((t) => t.genres))).sort(), [titles])

  const term = normalize(deferred)

  const matchedTitles = useMemo(() => {
    if (filter === 'tv') return []
    return titles.filter((t) => {
      if (filter !== 'todos' && t.type !== filter) return false
      if (!term) return true
      const haystack = normalize([t.title, t.description, t.director, ...t.genres, ...t.cast].join(' '))
      return haystack.includes(term)
    })
  }, [titles, term, filter])

  const matchedChannels = useMemo(() => {
    if (filter !== 'todos' && filter !== 'tv') return []
    if (!term) return filter === 'tv' ? channels : []
    return channels.filter((c) =>
      normalize([c.name, c.category, c.description, ...c.schedule.map((s) => s.program)].join(' ')).includes(term),
    )
  }, [channels, term, filter])

  const total = matchedTitles.length + matchedChannels.length

  return (
    <main className="mx-auto max-w-[1600px] px-4 pb-16 pt-24 md:px-10 md:pt-32">
      <h1 className="sr-only">Buscar</h1>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="busca" className="sr-only">
          Buscar filmes, séries, canais, atores ou gêneros
        </label>
        <input
          id="busca"
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filmes, séries, canais, atores, gêneros..."
          className="h-14 w-full rounded-lg border border-input bg-secondary pl-12 pr-12 text-base outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Limpar busca"
            className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full hover:bg-accent"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div role="tablist" aria-label="Tipo de conteúdo" className="scrollbar-none mt-4 flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'h-9 whitespace-nowrap rounded-full px-4 text-sm transition-colors',
              filter === f.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!term && filter !== 'tv' && (
        <div className="mt-6">
          <p className="text-sm text-muted-foreground">Gêneros populares</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {genres.map((genre) => (
              <li key={genre}>
                <button
                  type="button"
                  onClick={() => setQuery(genre)}
                  className="h-8 rounded-md border border-border px-3 text-sm text-muted-foreground hover:border-primary hover:text-foreground"
                >
                  {genre}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-8 text-sm text-muted-foreground" aria-live="polite">
        {term ? `${total} resultado${total === 1 ? '' : 's'} para "${deferred.trim()}"` : 'Explore o catálogo'}
      </p>

      {matchedChannels.length > 0 && (
        <section aria-label="Canais" className="mt-4">
          <h2 className="mb-3 text-lg font-semibold">Canais de TV</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {matchedChannels.map((channel) => (
              <li key={channel.id}>
                <ChannelCard channel={channel} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {matchedTitles.length > 0 && (
        <section aria-label="Filmes e séries" className="mt-6">
          {matchedChannels.length > 0 && <h2 className="mb-3 text-lg font-semibold">Filmes e séries</h2>}
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {matchedTitles.map((title) => (
              <li key={title.id}>
                <TitleCard title={title} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {term && total === 0 && (
        <p className="mt-16 text-center text-muted-foreground">
          Nada encontrado. Tente outro nome, ator ou gênero.
        </p>
      )}
    </main>
  )
}
