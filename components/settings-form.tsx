'use client'

import { useState, useTransition } from 'react'
import { Check, RotateCcw, ShieldCheck } from 'lucide-react'
import { resetSettings, saveSettings } from '@/app/actions'
import { RATING_LABEL, RATING_ORDER } from '@/lib/catalog'
import type { Settings } from '@/lib/settings'
import { RatingBadge } from './rating-badge'
import { cn } from '@/lib/utils'

type Option<T extends string> = { value: T; label: string }

const SUBTITLE_LANGS: Option<Settings['subtitleLanguage']>[] = [
  { value: 'off', label: 'Desativadas' },
  { value: 'pt', label: 'Português' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
]
const SIZES: Option<Settings['subtitleSize']>[] = [
  { value: 'small', label: 'Pequena' },
  { value: 'medium', label: 'Média' },
  { value: 'large', label: 'Grande' },
]
const COLORS: Option<Settings['subtitleColor']>[] = [
  { value: 'white', label: 'Branca' },
  { value: 'yellow', label: 'Amarela' },
  { value: 'cyan', label: 'Ciano' },
]
const BACKGROUNDS: Option<Settings['subtitleBackground']>[] = [
  { value: 'none', label: 'Sem fundo' },
  { value: 'semi', label: 'Translúcido' },
  { value: 'solid', label: 'Sólido' },
]
const AUDIO: Option<Settings['audioLanguage']>[] = [
  { value: 'pt', label: 'Português (dublado)' },
  { value: 'en', label: 'English (original)' },
]
const QUALITY: Option<Settings['quality']>[] = [
  { value: 'auto', label: 'Automática' },
  { value: '1080p', label: 'Full HD 1080p' },
  { value: '720p', label: 'HD 720p' },
  { value: '480p', label: 'Economia 480p' },
]

const PREVIEW_SIZE = { small: 'text-sm', medium: 'text-lg', large: 'text-2xl' }
const PREVIEW_COLOR = { white: 'text-white', yellow: 'text-yellow-300', cyan: 'text-cyan-300' }
const PREVIEW_BG = { none: '[text-shadow:0_2px_4px_#000]', semi: 'bg-black/60', solid: 'bg-black' }

export function SettingsForm({ initial }: { initial: Settings }) {
  const [settings, setSettings] = useState(initial)
  const [status, setStatus] = useState<'idle' | 'saved'>('idle')
  const [pending, startTransition] = useTransition()

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }))
    setStatus('idle')
  }

  const save = () =>
    startTransition(async () => {
      setSettings(await saveSettings(settings))
      setStatus('saved')
    })

  const reset = () =>
    startTransition(async () => {
      setSettings(await resetSettings())
      setStatus('saved')
    })

  return (
    <form
      className="mt-8 flex flex-col gap-8"
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
    >
      <Section id="legendas" title="Legendas" description="Escolha o idioma e a aparência das legendas no player.">
        <div className="relative flex aspect-[21/9] items-end justify-center overflow-hidden rounded-lg bg-[url('/titles/ultimo-farol.jpg')] bg-cover bg-center p-6">
          <div className="absolute inset-0 bg-black/30" />
          {settings.subtitleLanguage === 'off' ? (
            <p className="relative text-sm text-white/80">Legendas desativadas</p>
          ) : (
            <p
              className={cn(
                'relative rounded px-3 py-1 text-center font-semibold',
                PREVIEW_SIZE[settings.subtitleSize],
                PREVIEW_COLOR[settings.subtitleColor],
                PREVIEW_BG[settings.subtitleBackground],
              )}
            >
              {settings.subtitleLanguage === 'en'
                ? 'This is how your subtitles will look.'
                : settings.subtitleLanguage === 'es'
                  ? 'Así se verán tus subtítulos.'
                  : 'É assim que suas legendas vão aparecer.'}
            </p>
          )}
        </div>
        <ChoiceGroup label="Idioma" name="subtitleLanguage" options={SUBTITLE_LANGS} value={settings.subtitleLanguage} onChange={(v) => update('subtitleLanguage', v)} />
        <ChoiceGroup label="Tamanho" name="subtitleSize" options={SIZES} value={settings.subtitleSize} onChange={(v) => update('subtitleSize', v)} />
        <ChoiceGroup label="Cor do texto" name="subtitleColor" options={COLORS} value={settings.subtitleColor} onChange={(v) => update('subtitleColor', v)} />
        <ChoiceGroup label="Fundo" name="subtitleBackground" options={BACKGROUNDS} value={settings.subtitleBackground} onChange={(v) => update('subtitleBackground', v)} />
      </Section>

      <Section id="reproducao" title="Áudio e reprodução" description="Preferências aplicadas a todos os filmes e séries.">
        <ChoiceGroup label="Idioma do áudio" name="audioLanguage" options={AUDIO} value={settings.audioLanguage} onChange={(v) => update('audioLanguage', v)} />
        <ChoiceGroup label="Qualidade de vídeo" name="quality" options={QUALITY} value={settings.quality} onChange={(v) => update('quality', v)} />
        <Toggle
          label="Reproduzir próximo episódio automaticamente"
          checked={settings.autoplayNext}
          onChange={(v) => update('autoplayNext', v)}
        />
        <Toggle
          label="Reproduzir prévias ao navegar"
          checked={settings.autoplayPreviews}
          onChange={(v) => update('autoplayPreviews', v)}
        />
      </Section>

      <Section
        id="controle-parental"
        title="Controle parental"
        description="Mostre somente títulos até a classificação escolhida. Ideal para perfis infantis."
        icon={<ShieldCheck className="size-5 text-primary" aria-hidden="true" />}
      >
        <fieldset>
          <legend className="sr-only">Classificação máxima</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {RATING_ORDER.map((rating) => (
              <label
                key={rating}
                className={cn(
                  'flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary',
                  settings.maxRating === rating ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground',
                )}
              >
                <input
                  type="radio"
                  name="maxRating"
                  value={rating}
                  checked={settings.maxRating === rating}
                  onChange={() => update('maxRating', rating)}
                  className="sr-only"
                />
                <RatingBadge rating={rating} />
                <span>{rating === 'L' ? 'Só livre' : `Até ${RATING_LABEL[rating]}`}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </Section>

      <div className="sticky bottom-20 z-20 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card/95 p-4 backdrop-blur md:bottom-6">
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-md bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {pending ? 'Salvando...' : 'Salvar configurações'}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={pending}
          className="flex h-11 items-center gap-2 rounded-md bg-secondary px-4 text-sm hover:bg-accent disabled:opacity-60"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Restaurar padrão
        </button>
        <p role="status" className="flex items-center gap-1 text-sm text-emerald-400">
          {status === 'saved' && !pending && (
            <>
              <Check className="size-4" aria-hidden="true" /> Configurações salvas
            </>
          )}
        </p>
      </div>
    </form>
  )
}

function Section({
  id,
  title,
  description,
  icon,
  children,
}: {
  id: string
  title: string
  description: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 rounded-xl border border-border bg-card p-5 md:p-6">
      <h2 id={`${id}-title`} className="flex items-center gap-2 text-xl font-semibold">
        {icon}
        {title}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  )
}

function ChoiceGroup<T extends string>({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string
  name: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'cursor-pointer rounded-md border px-3 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary',
              value === option.value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm" aria-hidden="true">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-primary' : 'bg-muted')}
      >
        <span
          className={cn(
            'absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}
