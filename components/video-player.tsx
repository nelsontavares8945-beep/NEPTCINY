'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import {
  ArrowLeft,
  Captions,
  Check,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Settings2,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { SUBTITLE_TRACKS } from '@/lib/catalog'
import type { Settings } from '@/lib/settings'
import { saveSettings } from '@/app/actions'
import { cn } from '@/lib/utils'

const SIZE_CLASS = { small: 'text-base md:text-lg', medium: 'text-lg md:text-2xl', large: 'text-2xl md:text-4xl' }
const COLOR_CLASS = { white: 'text-white', yellow: 'text-yellow-300', cyan: 'text-cyan-300' }
const BG_CLASS = { none: 'bg-transparent [text-shadow:0_2px_4px_#000]', semi: 'bg-black/60', solid: 'bg-black' }
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2]
const QUALITIES: Settings['quality'][] = ['auto', '1080p', '720p', '480p']

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s}` : `${m}:${s}`
}

export interface VideoPlayerProps {
  src: string
  heading: string
  subheading?: string
  backHref: string
  settings: Settings
  nextHref?: string
  nextLabel?: string
  live?: boolean
  embedded?: boolean
}

export function VideoPlayer({
  src,
  heading,
  subheading,
  backHref,
  settings,
  nextHref,
  nextLabel,
  live,
  embedded,
}: VideoPlayerProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [, startTransition] = useTransition()

  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [menu, setMenu] = useState<'none' | 'subtitles' | 'settings'>('none')
  const [subtitle, setSubtitle] = useState<Settings['subtitleLanguage']>(settings.subtitleLanguage)
  const [quality, setQuality] = useState<Settings['quality']>(settings.quality)
  const [speed, setSpeed] = useState(1)
  const [cueText, setCueText] = useState('')
  const [ended, setEnded] = useState(false)
  const [countdown, setCountdown] = useState(8)

  const revealControls = useCallback(() => {
    setShowControls(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false)
    }, 3000)
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play().catch(() => {})
    else video.pause()
  }, [])

  const seekBy = useCallback((delta: number) => {
    const video = videoRef.current
    if (!video || live) return
    video.currentTime = Math.min(Math.max(video.currentTime + delta, 0), video.duration || 0)
  }, [live])

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void el.requestFullscreen?.().catch(() => {})
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
  }, [])

  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    for (const track of Array.from(video.textTracks)) {
      track.mode = track.language === subtitle ? 'hidden' : 'disabled'
      track.oncuechange = () => {
        if (track.mode !== 'hidden') return
        const cues = Array.from(track.activeCues ?? []) as VTTCue[]
        setCueText(cues.map((cue) => cue.text).join('\n'))
      }
    }
    if (subtitle === 'off') setCueText('')
  }, [subtitle, src])

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed
  }, [speed])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' && (target as HTMLInputElement).type !== 'range') return
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'arrowright':
        case 'l':
          seekBy(10)
          break
        case 'arrowleft':
        case 'j':
          seekBy(-10)
          break
        case 'f':
          toggleFullscreen()
          break
        case 'm':
          toggleMute()
          break
        case 'c':
          setSubtitle((s) => (s === 'off' ? 'pt' : 'off'))
          break
        default:
          return
      }
      revealControls()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [togglePlay, seekBy, toggleFullscreen, toggleMute, revealControls])

  useEffect(() => {
    if (!ended || !nextHref || !settings.autoplayNext) return
    if (countdown <= 0) {
      router.push(nextHref)
      return
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [ended, countdown, nextHref, settings.autoplayNext, router])

  const persist = (patch: Partial<Settings>) => {
    startTransition(async () => {
      await saveSettings({ ...settings, subtitleLanguage: subtitle, quality, ...patch })
    })
  }

  const chooseSubtitle = (code: Settings['subtitleLanguage']) => {
    setSubtitle(code)
    setMenu('none')
    persist({ subtitleLanguage: code })
  }

  const chooseQuality = (value: Settings['quality']) => {
    setQuality(value)
    persist({ quality: value })
  }

  const progress = duration ? (current / duration) * 100 : 0
  const bufferedPct = duration ? (buffered / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative w-full overflow-hidden bg-black text-white',
        embedded ? 'aspect-video rounded-lg' : 'h-dvh',
        !showControls && playing && 'cursor-none',
      )}
      onMouseMove={revealControls}
      onTouchStart={revealControls}
    >
      <video
        key={src}
        ref={videoRef}
        src={src}
        autoPlay
        playsInline
        loop={live}
        className="absolute inset-0 size-full object-contain"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onPlay={() => {
          setPlaying(true)
          setEnded(false)
          revealControls()
        }}
        onPause={() => {
          setPlaying(false)
          setShowControls(true)
        }}
        onTimeUpdate={(e) => {
          const video = e.currentTarget
          setCurrent(video.currentTime)
          // Metadata and autoplay events can fire before hydration, so resync from the element.
          if (Number.isFinite(video.duration)) setDuration(video.duration)
          setPlaying(!video.paused)
        }}
        onDurationChange={(e) => {
          if (Number.isFinite(e.currentTarget.duration)) setDuration(e.currentTarget.duration)
        }}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration)
          e.currentTarget.playbackRate = speed
        }}
        onProgress={(e) => {
          const b = e.currentTarget.buffered
          if (b.length) setBuffered(b.end(b.length - 1))
        }}
        onVolumeChange={(e) => {
          setVolume(e.currentTarget.volume)
          setMuted(e.currentTarget.muted)
        }}
        onEnded={() => {
          setEnded(true)
          setCountdown(8)
        }}
      >
        {SUBTITLE_TRACKS.map((track) => (
          <track key={track.code} kind="subtitles" src={track.src} srcLang={track.code} label={track.label} />
        ))}
      </video>

      {cueText && subtitle !== 'off' && (
        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 flex justify-center px-6 transition-all',
            showControls ? 'bottom-28' : 'bottom-10',
          )}
          aria-live="polite"
        >
          <p
            className={cn(
              'whitespace-pre-line rounded px-3 py-1 text-center font-semibold leading-snug',
              SIZE_CLASS[settings.subtitleSize],
              COLOR_CLASS[settings.subtitleColor],
              BG_CLASS[settings.subtitleBackground],
            )}
          >
            {cueText}
          </p>
        </div>
      )}

      {ended && nextHref && (
        <div className="absolute bottom-28 right-6 z-30 rounded-lg bg-black/85 p-4 shadow-xl">
          <p className="text-xs uppercase tracking-wider text-white/70">Próximo episódio</p>
          <p className="mt-1 font-semibold">{nextLabel}</p>
          <div className="mt-3 flex gap-2">
            <Link href={nextHref} className="rounded-md bg-white px-4 py-2 text-sm font-bold text-black">
              {settings.autoplayNext ? `Assistir em ${countdown}s` : 'Assistir agora'}
            </Link>
            <button type="button" onClick={() => setEnded(false)} className="rounded-md bg-white/15 px-4 py-2 text-sm">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div
        className={cn(
          'absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/70 via-transparent to-black/80 transition-opacity duration-300',
          showControls ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className="flex items-center gap-4 p-4 md:p-6">
          <Link
            href={backHref}
            aria-label="Voltar"
            className="flex size-10 items-center justify-center rounded-full hover:bg-white/15"
          >
            <ArrowLeft className="size-6" />
          </Link>
          <div className="min-w-0">
            <p className="truncate font-semibold md:text-lg">{heading}</p>
            {subheading && <p className="truncate text-sm text-white/70">{subheading}</p>}
          </div>
          {live && (
            <span className="ml-auto flex items-center gap-1.5 rounded-sm bg-red-600 px-2 py-1 text-xs font-bold uppercase">
              <span className="size-2 animate-pulse rounded-full bg-white" />
              Ao vivo
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? 'Pausar' : 'Reproduzir'}
          className={cn(
            'mx-auto flex size-20 items-center justify-center rounded-full bg-black/50 transition-transform hover:scale-110',
            playing && 'opacity-0 focus-visible:opacity-100',
          )}
        >
          {playing ? <Pause className="size-9 fill-current" /> : <Play className="ml-1 size-9 fill-current" />}
        </button>

        <div className="p-4 md:p-6">
          {!live && (
            <div className="flex items-center gap-3">
              <div className="relative h-1.5 flex-1">
                <div className="absolute inset-0 rounded-full bg-white/25" />
                <div className="absolute inset-y-0 left-0 rounded-full bg-white/40" style={{ width: `${bufferedPct}%` }} />
                <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${progress}%` }} />
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={current}
                  onChange={(e) => {
                    if (videoRef.current) videoRef.current.currentTime = Number(e.target.value)
                  }}
                  aria-label="Progresso do vídeo"
                  aria-valuetext={`${formatTime(current)} de ${formatTime(duration)}`}
                  className="absolute -inset-y-2 inset-x-0 w-full cursor-pointer opacity-0"
                />
              </div>
              <span className="w-24 text-right text-xs tabular-nums text-white/80">
                {formatTime(current)} / {formatTime(duration)}
              </span>
            </div>
          )}

          <div className="mt-3 flex items-center gap-1 md:gap-2">
            <ControlButton label={playing ? 'Pausar (K)' : 'Reproduzir (K)'} onClick={togglePlay}>
              {playing ? <Pause className="size-6 fill-current" /> : <Play className="size-6 fill-current" />}
            </ControlButton>
            {!live && (
              <>
                <ControlButton label="Voltar 10 segundos" onClick={() => seekBy(-10)}>
                  <RotateCcw className="size-6" />
                </ControlButton>
                <ControlButton label="Avançar 10 segundos" onClick={() => seekBy(10)}>
                  <RotateCw className="size-6" />
                </ControlButton>
              </>
            )}
            <div className="group/vol flex items-center">
              <ControlButton label={muted ? 'Ativar som (M)' : 'Silenciar (M)'} onClick={toggleMute}>
                {muted || volume === 0 ? <VolumeX className="size-6" /> : <Volume2 className="size-6" />}
              </ControlButton>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const video = videoRef.current
                  if (!video) return
                  video.volume = Number(e.target.value)
                  video.muted = Number(e.target.value) === 0
                }}
                aria-label="Volume"
                className="hidden w-24 accent-primary md:block"
              />
            </div>

            <div className="ml-auto flex items-center gap-1 md:gap-2">
              {nextHref && (
                <Link
                  href={nextHref}
                  className="hidden h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold hover:bg-white/15 sm:flex"
                >
                  <SkipForward className="size-5" aria-hidden="true" />
                  Próximo
                </Link>
              )}
              <div className="relative">
                <ControlButton
                  label="Legendas (C)"
                  active={subtitle !== 'off'}
                  onClick={() => setMenu((m) => (m === 'subtitles' ? 'none' : 'subtitles'))}
                  expanded={menu === 'subtitles'}
                >
                  <Captions className="size-6" />
                </ControlButton>
                {menu === 'subtitles' && (
                  <PlayerMenu title="Legendas">
                    <MenuOption selected={subtitle === 'off'} onClick={() => chooseSubtitle('off')}>
                      Desativadas
                    </MenuOption>
                    {SUBTITLE_TRACKS.map((track) => (
                      <MenuOption key={track.code} selected={subtitle === track.code} onClick={() => chooseSubtitle(track.code)}>
                        {track.label}
                      </MenuOption>
                    ))}
                    <Link href="/configuracoes#legendas" className="mt-1 block border-t border-white/10 px-3 pt-2 text-xs text-primary hover:underline">
                      Personalizar aparência
                    </Link>
                  </PlayerMenu>
                )}
              </div>
              <div className="relative">
                <ControlButton
                  label="Configurações de reprodução"
                  onClick={() => setMenu((m) => (m === 'settings' ? 'none' : 'settings'))}
                  expanded={menu === 'settings'}
                >
                  <Settings2 className="size-6" />
                </ControlButton>
                {menu === 'settings' && (
                  <PlayerMenu title="Reprodução">
                    <p className="px-3 pb-1 text-xs uppercase tracking-wider text-white/50">Qualidade</p>
                    {QUALITIES.map((q) => (
                      <MenuOption key={q} selected={quality === q} onClick={() => chooseQuality(q)}>
                        {q === 'auto' ? 'Automática' : q}
                      </MenuOption>
                    ))}
                    {!live && (
                      <>
                        <p className="mt-2 border-t border-white/10 px-3 pb-1 pt-2 text-xs uppercase tracking-wider text-white/50">
                          Velocidade
                        </p>
                        <div className="flex flex-wrap gap-1 px-2">
                          {SPEEDS.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setSpeed(s)}
                              aria-pressed={speed === s}
                              className={cn(
                                'rounded px-2 py-1 text-xs',
                                speed === s ? 'bg-primary text-primary-foreground' : 'bg-white/10 hover:bg-white/20',
                              )}
                            >
                              {s === 1 ? 'Normal' : `${s}x`}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </PlayerMenu>
                )}
              </div>
              <ControlButton label={fullscreen ? 'Sair da tela cheia (F)' : 'Tela cheia (F)'} onClick={toggleFullscreen}>
                {fullscreen ? <Minimize className="size-6" /> : <Maximize className="size-6" />}
              </ControlButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ControlButton({
  label,
  onClick,
  children,
  active,
  expanded,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
  active?: boolean
  expanded?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-expanded={expanded}
      className={cn(
        'flex size-10 items-center justify-center rounded-full transition-colors hover:bg-white/15',
        active && 'text-primary',
      )}
    >
      {children}
    </button>
  )
}

function PlayerMenu({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="absolute bottom-12 right-0 z-40 w-56 rounded-lg bg-black/95 py-2 shadow-2xl ring-1 ring-white/10">
      <p className="px-3 pb-2 text-sm font-semibold">{title}</p>
      {children}
    </div>
  )
}

function MenuOption({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-white/10"
    >
      <Check className={cn('size-4', selected ? 'opacity-100 text-primary' : 'opacity-0')} aria-hidden="true" />
      {children}
    </button>
  )
}
