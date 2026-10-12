import Link from 'next/link'
import { cn } from '@/lib/utils'

export function BrandLogo({ className, size = 'md' }: { className?: string; size?: 'md' | 'lg' }) {
  return (
    <Link href="/" className={cn('flex flex-col leading-none', className)} aria-label="NEPTCINY — página inicial">
      <span
        className={cn(
          'font-display tracking-wider text-primary',
          size === 'lg' ? 'text-5xl' : 'text-3xl md:text-4xl',
        )}
      >
        NEPTCINY
      </span>
      <span
        className={cn(
          'font-medium uppercase tracking-[0.25em] text-muted-foreground',
          size === 'lg' ? 'text-xs' : 'text-[9px] md:text-[10px]',
        )}
      >
        Para toda família
      </span>
    </Link>
  )
}
