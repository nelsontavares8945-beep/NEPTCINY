import { cookies } from 'next/headers'
import { RATING_ORDER, type Rating } from './catalog'

export interface Settings {
  subtitleLanguage: 'off' | 'pt' | 'en' | 'es'
  subtitleSize: 'small' | 'medium' | 'large'
  subtitleColor: 'white' | 'yellow' | 'cyan'
  subtitleBackground: 'none' | 'semi' | 'solid'
  audioLanguage: 'pt' | 'en'
  quality: 'auto' | '480p' | '720p' | '1080p'
  autoplayNext: boolean
  autoplayPreviews: boolean
  maxRating: Rating
}

export const DEFAULT_SETTINGS: Settings = {
  subtitleLanguage: 'pt',
  subtitleSize: 'medium',
  subtitleColor: 'white',
  subtitleBackground: 'semi',
  audioLanguage: 'pt',
  quality: 'auto',
  autoplayNext: true,
  autoplayPreviews: true,
  maxRating: '14',
}

export const SETTINGS_COOKIE = 'neptciny-settings'
export const MY_LIST_COOKIE = 'neptciny-my-list'

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback
}

export function sanitizeSettings(input: Partial<Record<keyof Settings, unknown>>): Settings {
  const d = DEFAULT_SETTINGS
  return {
    subtitleLanguage: pick(input.subtitleLanguage, ['off', 'pt', 'en', 'es'] as const, d.subtitleLanguage),
    subtitleSize: pick(input.subtitleSize, ['small', 'medium', 'large'] as const, d.subtitleSize),
    subtitleColor: pick(input.subtitleColor, ['white', 'yellow', 'cyan'] as const, d.subtitleColor),
    subtitleBackground: pick(input.subtitleBackground, ['none', 'semi', 'solid'] as const, d.subtitleBackground),
    audioLanguage: pick(input.audioLanguage, ['pt', 'en'] as const, d.audioLanguage),
    quality: pick(input.quality, ['auto', '480p', '720p', '1080p'] as const, d.quality),
    autoplayNext: typeof input.autoplayNext === 'boolean' ? input.autoplayNext : d.autoplayNext,
    autoplayPreviews: typeof input.autoplayPreviews === 'boolean' ? input.autoplayPreviews : d.autoplayPreviews,
    maxRating: pick(input.maxRating, RATING_ORDER, d.maxRating),
  }
}

export async function getSettings(): Promise<Settings> {
  const store = await cookies()
  const raw = store.get(SETTINGS_COOKIE)?.value
  if (!raw) return DEFAULT_SETTINGS
  try {
    return sanitizeSettings(JSON.parse(raw))
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function getMyList(): Promise<string[]> {
  const store = await cookies()
  const raw = store.get(MY_LIST_COOKIE)?.value
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}
