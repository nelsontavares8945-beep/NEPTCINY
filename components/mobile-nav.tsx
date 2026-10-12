'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MOBILE_LINKS, isActive } from '@/lib/nav'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const pathname = usePathname()
  if (pathname.startsWith('/assistir')) return null

  return (
    <nav
      aria-label="Navegação móvel"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur md:hidden"
    >
      <ul className="grid h-16 grid-cols-5">
        {MOBILE_LINKS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-full flex-col items-center justify-center gap-1 text-[11px]',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
