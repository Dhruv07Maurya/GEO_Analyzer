'use client'

import { ThemeToggle } from '@/components/theme-toggle'

interface HeaderProps {
  activePage: string
  lastRun: Date
}

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  'geo-house': 'GEO-house',
}

export function Header({ activePage, lastRun }: HeaderProps) {
  const formatLastRun = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          {pageTitles[activePage] || 'Dashboard'}
        </h1>
        <p className="text-sm text-muted-foreground">
          Last run: {formatLastRun(lastRun)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}
