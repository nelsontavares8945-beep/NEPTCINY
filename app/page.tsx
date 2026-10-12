import Link from 'next/link'
import { HeroBanner } from '@/components/hero-banner'
import { TitleRow } from '@/components/title-row'
import { ChannelCard } from '@/components/channel-card'
import { CHANNELS, TITLES, getTitles } from '@/lib/catalog'
import { getMyList, getSettings } from '@/lib/settings'

export default async function HomePage() {
  const [settings, myList] = await Promise.all([getSettings(), getMyList()])
  const titles = getTitles(settings.maxRating)
  const featured = titles.filter((t) => t.featured)
  const trending = titles.filter((t) => t.trending).sort((a, b) => b.match - a.match)
  const movies = titles.filter((t) => t.type === 'filme')
  const series = titles.filter((t) => t.type === 'serie')
  const kids = titles.filter((t) => t.kids)
  const documentaries = titles.filter((t) => t.genres.includes('Documentário'))
  const newest = [...titles].sort((a, b) => b.year - a.year)
  const saved = myList
    .map((id) => TITLES.find((t) => t.id === id))
    .filter((t): t is (typeof titles)[number] => !!t && titles.includes(t))

  return (
    <main>
      <HeroBanner titles={featured.length ? featured : titles.slice(0, 3)} myList={myList} />
      <div className="relative z-10 -mt-20 flex flex-col gap-6 pb-12 md:-mt-28">
        {saved.length > 0 && <TitleRow heading="Minha lista" titles={saved} href="/minha-lista" />}
        <TitleRow heading="Em alta hoje" titles={trending} ranked />
        <TitleRow heading="Filmes para toda família" titles={movies} href="/filmes" />
        <TitleRow heading="Séries imperdíveis" titles={series} href="/series" />

        <section aria-label="TV Aberta ao vivo" className="px-4 md:px-10">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-lg font-semibold md:text-xl">TV Aberta ao vivo</h2>
            <Link href="/tv" className="text-sm text-primary hover:underline">
              Ver todos os canais
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {CHANNELS.map((channel) => (
              <li key={channel.id}>
                <ChannelCard channel={channel} />
              </li>
            ))}
          </ul>
        </section>

        <TitleRow heading="Diversão para as crianças" titles={kids} />
        <TitleRow heading="Documentários" titles={documentaries} />
        <TitleRow heading="Lançamentos" titles={newest} />
      </div>
    </main>
  )
}
