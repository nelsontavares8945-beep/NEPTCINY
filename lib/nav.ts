import { Clapperboard, Heart, Home, Search, Settings, Tv, MonitorPlay } from 'lucide-react'

export const NAV_LINKS = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/filmes', label: 'Filmes', icon: Clapperboard },
  { href: '/series', label: 'Séries', icon: MonitorPlay },
  { href: '/tv', label: 'TV Aberta', icon: Tv },
  { href: '/minha-lista', label: 'Minha lista', icon: Heart },
] as const

export const MOBILE_LINKS = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/filmes', label: 'Filmes', icon: Clapperboard },
  { href: '/series', label: 'Séries', icon: MonitorPlay },
  { href: '/tv', label: 'TV', icon: Tv },
  { href: '/buscar', label: 'Buscar', icon: Search },
] as const

export const SETTINGS_LINK = { href: '/configuracoes', label: 'Configurações', icon: Settings }

export function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}
