import type { Metadata } from 'next'
import { SearchClient } from '@/components/search-client'
import { CHANNELS, getTitles } from '@/lib/catalog'
import { getSettings } from '@/lib/settings'

export const metadata: Metadata = { title: 'Buscar' }

export default async function BuscarPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const [{ q }, settings] = await Promise.all([searchParams, getSettings()])
  return <SearchClient titles={getTitles(settings.maxRating)} channels={CHANNELS} initialQuery={q ?? ''} />
}
