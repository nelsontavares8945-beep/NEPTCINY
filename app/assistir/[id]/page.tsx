import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { VideoPlayer } from '@/components/video-player'
import { findEpisode, getTitle, isAllowed } from '@/lib/catalog'
import { getSettings } from '@/lib/settings'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const title = getTitle(id)
  return { title: title ? `Assistindo ${title.title}` : 'Assistir' }
}

export default async function AssistirPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ ep?: string }>
}) {
  const [{ id }, { ep }, settings] = await Promise.all([params, searchParams, getSettings()])
  const title = getTitle(id)
  if (!title) notFound()
  if (!isAllowed(title.rating, settings.maxRating)) redirect(`/titulo/${title.id}`)

  const episode = findEpisode(title, ep)

  return (
    <main>
      <h1 className="sr-only">Assistindo {title.title}</h1>
      <VideoPlayer
        src={episode?.video ?? title.video}
        heading={title.title}
        subheading={episode ? `T${episode.season}:E${episode.number} · ${episode.title}` : title.tagline}
        backHref={`/titulo/${title.id}`}
        settings={settings}
        nextHref={episode?.next ? `/assistir/${title.id}?ep=${episode.next.id}` : undefined}
        nextLabel={episode?.next ? `T${episode.next.season}:E${episode.next.number} · ${episode.next.title}` : undefined}
      />
    </main>
  )
}
