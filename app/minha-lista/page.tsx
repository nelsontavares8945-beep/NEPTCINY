import type { Metadata } from 'next'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { TitleCard } from '@/components/title-card'
import { getTitle, isAllowed } from '@/lib/catalog'
import { getMyList, getSettings } from '@/lib/settings'

export const metadata: Metadata = { title: 'Minha lista' }

export default async function MinhaListaPage() {
  const [ids, settings] = await Promise.all([getMyList(), getSettings()])
  const titles = ids
    .map(getTitle)
    .filter((t): t is NonNullable<typeof t> => !!t && isAllowed(t.rating, settings.maxRating))

  return (
    <main className="mx-auto max-w-[1600px] px-4 pb-16 pt-24 md:px-10 md:pt-32">
      <h1 className="font-display text-5xl tracking-wide md:text-6xl">Minha lista</h1>
      <p className="mt-2 text-muted-foreground">Os títulos que você salvou para assistir depois.</p>

      {titles.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-secondary">
            <Heart className="size-7 text-primary" aria-hidden="true" />
          </span>
          <p className="max-w-sm text-muted-foreground">
            Sua lista está vazia. Toque em &quot;Minha lista&quot; em qualquer filme ou série para salvar aqui.
          </p>
          <Link href="/" className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {titles.map((title) => (
            <li key={title.id}>
              <TitleCard title={title} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
