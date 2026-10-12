import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Lock, Play } from 'lucide-react'
import { MyListButton } from '@/components/my-list-button'
import { RatingBadge } from '@/components/rating-badge'
import { EpisodeList } from '@/components/episode-list'
import { TitleRow } from '@/components/title-row'
import { RATING_LABEL, getTitle, getTitles, isAllowed } from '@/lib/catalog'
import { getMyList, getSettings } from '@/lib/settings'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const title = getTitle(id)
  return title ? { title: title.title, description: title.description } : { title: 'Título não encontrado' }
}

export default async function TitlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const title = getTitle(id)
  if (!title) notFound()

  const [settings, myList] = await Promise.all([getSettings(), getMyList()])
  const blocked = !isAllowed(title.rating, settings.maxRating)
  const similar = getTitles(settings.maxRating).filter(
    (t) => t.id !== title.id && t.genres.some((g) => title.genres.includes(g)),
  )

  return (
    <main className="pb-12">
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <Image src={title.image || '/placeholder.svg'} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-10 md:px-10">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              {title.type === 'serie' ? 'Série' : 'Filme'}
            </p>
            <h1 className="text-balance font-display text-6xl leading-none tracking-wide md:text-8xl">{title.title}</h1>
            <p className="mt-3 text-lg font-medium text-foreground/90">{title.tagline}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="font-semibold text-emerald-400">{title.match}% relevante</span>
              <span>{title.year}</span>
              <RatingBadge rating={title.rating} />
              <span>{title.duration}</span>
              <span className="rounded-sm border border-muted-foreground/50 px-1 text-[10px] font-bold">HD</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {blocked ? (
                <Link
                  href="/configuracoes#controle-parental"
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-secondary px-6 text-sm font-bold"
                >
                  <Lock className="size-5" aria-hidden="true" />
                  Bloqueado pelo controle parental
                </Link>
              ) : (
                <Link
                  href={`/assistir/${title.id}`}
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-6 text-sm font-bold text-background hover:bg-foreground/85"
                >
                  <Play className="size-5 fill-current" aria-hidden="true" />
                  {title.type === 'serie' ? 'Assistir T1:E1' : 'Assistir'}
                </Link>
              )}
              <MyListButton titleId={title.id} inList={myList.includes(title.id)} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 md:grid-cols-[2fr_1fr] md:px-10">
        <div>
          <h2 className="sr-only">Sinopse</h2>
          <p className="text-pretty leading-relaxed text-foreground/90 md:text-lg">{title.description}</p>
        </div>
        <dl className="grid gap-3 text-sm">
          <Detail label="Elenco" value={title.cast.join(', ')} />
          <Detail label="Direção" value={title.director} />
          <Detail label="Gêneros" value={title.genres.join(', ')} />
          <Detail label="Classificação" value={RATING_LABEL[title.rating]} />
          <Detail label="Áudio" value={title.audio.join(', ')} />
          <Detail label="Legendas" value={title.subtitles.join(', ')} />
        </dl>
      </div>

      {title.seasons && !blocked && (
        <div className="mx-auto mt-12 max-w-[1600px] px-4 md:px-10">
          <EpisodeList titleId={title.id} seasons={title.seasons} />
        </div>
      )}

      <div className="mt-12">
        <TitleRow heading="Títulos semelhantes" titles={similar} />
      </div>
    </main>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="inline text-muted-foreground">{label}: </dt>
      <dd className="inline">{value}</dd>
    </div>
  )
}
