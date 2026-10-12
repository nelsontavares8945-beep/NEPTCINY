import type { Metadata } from 'next'
import { SettingsForm } from '@/components/settings-form'
import { getSettings } from '@/lib/settings'

export const metadata: Metadata = { title: 'Configurações' }

export default async function ConfiguracoesPage() {
  const settings = await getSettings()
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-24 md:pt-32">
      <h1 className="font-display text-5xl tracking-wide md:text-6xl">Configurações</h1>
      <p className="mt-2 text-muted-foreground">Ajuste legendas, reprodução e o controle parental da sua família.</p>
      <SettingsForm initial={settings} />
    </main>
  )
}
