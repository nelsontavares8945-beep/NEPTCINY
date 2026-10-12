import type { Metadata } from 'next'
import { CatalogView } from '@/components/catalog-view'
import { getTitles } from '@/lib/catalog'
import { getSettings } from '@/lib/settings'

export const metadata: Metadata = { title: 'Filmes' }

export default async function FilmesPage({ searchParams }: { searchParams: Promise<{ genero?: string }> }) {
  const [{ genero }, settings] = await Promise.all([searchParams, getSettings()])
  const titles = getTitles(settings.maxRating).filter((t) => t.type === 'filme')

  return (
    <CatalogView
      heading="Filmes"
      description="Aventuras, animações, comédias e documentários para assistir em família."
      titles={titles}
      basePath="/filmes"
      activeGenre={genero}
    />
  )
}
