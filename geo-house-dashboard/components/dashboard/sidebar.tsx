'use client'

import { BarChart3, Globe, LineChart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  activePage: string
  onPageChange: (page: string) => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
]

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[300px] border-r border-border bg-card flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Globe className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold">GeoLens</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col p-4">
        <p className="text-xs font-medium text-muted-foreground mb-4 px-2">Navigation</p>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  activePage === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                suppressHydrationWarning
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
