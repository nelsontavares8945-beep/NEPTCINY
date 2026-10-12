'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BrandLogo } from './brand-logo'
import { NAV_LINKS, SETTINGS_LINK } from '@/lib/nav'

export function SiteFooter() {
  const pathname = usePathname()
  if (pathname.startsWith('/assistir')) return null

  return (
    <footer className="border-t border-border px-4 py-10 pb-24 md:px-10 md:pb-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <BrandLogo />
        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {[...NAV_LINKS, SETTINGS_LINK].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-[1600px] text-xs text-muted-foreground">
        © {new Date().getFullYear()} NEPTCINY. Conteúdo de demonstração — vídeos de exemplo de domínio aberto.
      </p>
    </footer>
  )
}
