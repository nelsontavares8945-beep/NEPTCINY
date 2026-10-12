import Link from 'next/link'
import type { Title } from '@/lib/catalog'
import { TitleCard } from './title-card'
import { cn } from '@/lib/utils'

export function CatalogView({
  heading,
  description,
  titles,
  basePath,
  activeGenre,
}: {
  heading: string
  description: string
  titles: Title[]
  basePath: string
  activeGenre?: string
}) {
  const genres = Array.from(new Set(titles.flatMap((t) => t.genres))).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  const filtered = activeGenre ? titles.filter((t) => t.genres.includes(activeGenre)) : titles

  return (
    <main className="mx-auto max-w-[1600px] px-4 pb-16 pt-24 md:px-10 md:pt-32">
      <h1 className="font-display text-5xl tracking-wide md:text-6xl">{heading}</h1>
      <p className="mt-2 text-muted-foreground">{description}</p>

      <nav aria-label="Filtrar por gênero" className="mt-6">
        <ul className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
          <li>
            <GenreChip href={basePath} active={!activeGenre}>
              Todos
            </GenreChip>
          </li>
          {genres.map((genre) => (
            <li key={genre}>
              <GenreChip href={`${basePath}?genero=${encodeURIComponent(genre)}`} active={genre === activeGenre}>
                {genre}
              </GenreChip>
            </li>
          ))}
        </ul>
      </nav>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">Nenhum título encontrado para este filtro.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((title) => (
            <li key={title.id}>
              <TitleCard title={title} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

function GenreChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex h-9 items-center whitespace-nowrap rounded-full border px-4 text-sm transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </Link>
  )
}
