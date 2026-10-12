import type { Metadata } from 'next'
import { CatalogView } from '@/components/catalog-view'
import { getTitles } from '@/lib/catalog'
import { getSettings } from '@/lib/settings'

export const metadata: Metadata = { title: 'Séries' }

export default async function SeriesPage({ searchParams }: { searchParams: Promise<{ genero?: string }> }) {
  const [{ genero }, settings] = await Promise.all([searchParams, getSettings()])
  const titles = getTitles(settings.maxRating).filter((t) => t.type === 'serie')

  return (
    <CatalogView
      heading="Séries"
      description="Temporadas completas para maratonar com quem você ama."
      titles={titles}
      basePath="/series"
      activeGenre={genero}
    />
  )
}
