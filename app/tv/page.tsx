import type { Metadata } from 'next'
import { VideoPlayer } from '@/components/video-player'
import { ChannelCard } from '@/components/channel-card'
import { CHANNELS, getChannel } from '@/lib/catalog'
import { getSettings } from '@/lib/settings'

export const metadata: Metadata = { title: 'TV Aberta' }

export default async function TvPage({ searchParams }: { searchParams: Promise<{ canal?: string }> }) {
  const [{ canal }, settings] = await Promise.all([searchParams, getSettings()])
  const channel = (canal && getChannel(canal)) || CHANNELS[0]

  return (
    <main className="mx-auto max-w-[1600px] px-4 pb-16 pt-24 md:px-10 md:pt-28">
      <h1 className="font-display text-5xl tracking-wide md:text-6xl">TV Aberta</h1>
      <p className="mt-2 text-muted-foreground">Canais ao vivo, de graça, para toda a família.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <VideoPlayer
            key={channel.id}
            src={channel.video}
            heading={`${channel.number} · ${channel.name}`}
            subheading={channel.schedule[0]?.program}
            backHref="/"
            settings={settings}
            live
            embedded
          />
          <div className="mt-4">
            <h2 className="text-xl font-semibold">{channel.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{channel.description}</p>
          </div>
        </div>

        <section aria-labelledby="programacao" className="rounded-lg border border-border bg-card p-4">
          <h2 id="programacao" className="text-lg font-semibold">
            Programação de hoje
          </h2>
          <ol className="mt-3 divide-y divide-border">
            {channel.schedule.map((slot, i) => (
              <li key={slot.time} className="flex items-center gap-4 py-3">
                <span className="w-12 text-sm tabular-nums text-muted-foreground">{slot.time}</span>
                <span className="flex-1 text-sm font-medium">{slot.program}</span>
                {i === 0 && (
                  <span className="rounded-sm bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">Agora</span>
                )}
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section aria-labelledby="canais" className="mt-10">
        <h2 id="canais" className="mb-3 text-lg font-semibold">
          Todos os canais
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CHANNELS.map((c) => (
            <li key={c.id}>
              <ChannelCard channel={c} active={c.id === channel.id} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
