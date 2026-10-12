'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Search, Settings } from 'lucide-react'
import { BrandLogo } from './brand-logo'
import { NAV_LINKS, isActive } from '@/lib/nav'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (pathname.startsWith('/assistir')) return null

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled ? 'bg-background/95 shadow-lg backdrop-blur' : 'bg-gradient-to-b from-background/90 to-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-8 px-4 md:h-20 md:px-10">
        <BrandLogo />
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(pathname, link.href) ? 'page' : undefined}
                  className={cn(
                    'text-sm transition-colors hover:text-foreground',
                    isActive(pathname, link.href) ? 'font-semibold text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/buscar"
            className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
            aria-label="Buscar"
          >
            <Search className="size-5" />
          </Link>
          <Link
            href="/configuracoes"
            className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
            aria-label="Configurações"
          >
            <Settings className="size-5" />
          </Link>
          <Link
            href="/minha-lista"
            className="ml-1 hidden size-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground sm:flex"
            aria-label="Meu perfil e minha lista"
          >
            N
          </Link>
        </div>
      </div>
    </header>
  )
}
