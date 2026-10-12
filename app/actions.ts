'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getTitle } from '@/lib/catalog'
import {
  DEFAULT_SETTINGS,
  MY_LIST_COOKIE,
  SETTINGS_COOKIE,
  getMyList,
  sanitizeSettings,
  type Settings,
} from '@/lib/settings'

const ONE_YEAR = 60 * 60 * 24 * 365

const cookieOptions = {
  maxAge: ONE_YEAR,
  path: '/',
  httpOnly: true,
  sameSite: 'none' as const,
  secure: true,
}

export async function saveSettings(input: Partial<Settings>) {
  const settings = sanitizeSettings(input)
  const store = await cookies()
  store.set(SETTINGS_COOKIE, JSON.stringify(settings), cookieOptions)
  revalidatePath('/', 'layout')
  return settings
}

export async function resetSettings() {
  const store = await cookies()
  store.set(SETTINGS_COOKIE, JSON.stringify(DEFAULT_SETTINGS), cookieOptions)
  revalidatePath('/', 'layout')
  return DEFAULT_SETTINGS
}

export async function toggleMyList(titleId: string) {
  if (!getTitle(titleId)) return { inList: false }
  const list = await getMyList()
  const inList = list.includes(titleId)
  const next = inList ? list.filter((id) => id !== titleId) : [titleId, ...list].slice(0, 100)
  const store = await cookies()
  store.set(MY_LIST_COOKIE, JSON.stringify(next), cookieOptions)
  revalidatePath('/', 'layout')
  return { inList: !inList }
}
