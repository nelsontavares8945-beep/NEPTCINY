import Link from 'next/link'
import { Radio } from 'lucide-react'
import type { Channel } from '@/lib/catalog'
import { cn } from '@/lib/utils'

export function ChannelCard({ channel, active }: { channel: Channel; active?: boolean }) {
  return (
    <Link
      href={`/tv?canal=${channel.id}`}
      scroll={false}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'group relative flex aspect-video flex-col justify-between overflow-hidden rounded-md bg-gradient-to-br p-3 text-white outline-none ring-offset-2 ring-offset-background transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-primary',
        channel.accent,
        active && 'ring-2 ring-foreground',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="rounded-sm bg-black/30 px-1.5 py-0.5 text-xs font-bold">CH {channel.number}</span>
        <span className="flex items-center gap-1 rounded-sm bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase">
          <Radio className="size-3" aria-hidden="true" />
          Ao vivo
        </span>
      </div>
      <div>
        <p className="font-display text-2xl leading-none tracking-wide md:text-3xl">{channel.name}</p>
        <p className="mt-1 text-xs text-white/85">{channel.category}</p>
      </div>
    </Link>
  )
}
