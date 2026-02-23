'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useHeatmapZones } from '@/hooks/use-analysis'
import { HeatmapPageSkeleton } from '../loading-skeletons'
import { cn } from '@/lib/utils'
import type { HeatmapZone } from '@/lib/types'

const statusConfig = {
  good: { color: 'bg-emerald-500', badgeColor: 'bg-emerald-100 text-emerald-700', label: 'Good' },
  weak: { color: 'bg-amber-500', badgeColor: 'bg-amber-100 text-amber-700', label: 'Weak' },
  bad: { color: 'bg-red-500', badgeColor: 'bg-red-100 text-red-700', label: 'Bad' },
}

interface ZoneOverlayProps {
  zones: HeatmapZone[]
  hoveredZone: string | null
  onHover: (id: string | null) => void
}

function ZoneOverlay({ zones, hoveredZone, onHover }: ZoneOverlayProps) {
  // Mock layout positions for zones
  const zonePositions: Record<string, { top: string; height: string }> = {
    'zone-1': { top: '0', height: '60px' },
    'zone-2': { top: '70px', height: '100px' },
    'zone-3': { top: '180px', height: '80px' },
    'zone-4': { top: '270px', height: '120px' },
    'zone-5': { top: '400px', height: '70px' },
    'zone-6': { top: '480px', height: '100px' },
    'zone-7': { top: '590px', height: '50px' },
  }

  return (
    <div className="relative h-[650px] bg-muted/30 rounded-lg overflow-hidden">
      {zones.map((zone) => {
        const config = statusConfig[zone.status]
        const pos = zonePositions[zone.id] || { top: '0', height: '50px' }
        const isHovered = hoveredZone === zone.id

        return (
          <div
            key={zone.id}
            className={cn(
              'absolute left-4 right-4 rounded transition-all cursor-pointer',
              config.color,
              isHovered ? 'opacity-60 scale-[1.02]' : 'opacity-30'
            )}
            style={{ top: pos.top, height: pos.height }}
            onMouseEnter={() => onHover(zone.id)}
            onMouseLeave={() => onHover(null)}
          >
            {isHovered && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background rounded-lg p-3 shadow-lg max-w-xs">
                  <p className="font-medium text-sm">{zone.label}</p>
                  <p className="text-xs text-muted-foreground">{zone.description}</p>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function HeatmapPage() {
  const { zones, isLoading, isError } = useHeatmapZones()
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)

  if (isLoading) {
    return <HeatmapPageSkeleton />
  }

  if (isError || !zones) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Failed to load heatmap data. Please try again.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-6">
        <span className="text-sm font-medium">Legend:</span>
        {(['good', 'weak', 'bad'] as const).map((status) => {
          const config = statusConfig[status]
          return (
            <div key={status} className="flex items-center gap-2">
              <div className={cn('w-4 h-4 rounded', config.color)} />
              <span className="text-sm">{config.label}</span>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Heatmap Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>DOM Structure Analysis</CardTitle>
              <CardDescription>
                Hover over sections to see details about AI readability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ZoneOverlay 
                zones={zones} 
                hoveredZone={hoveredZone} 
                onHover={setHoveredZone} 
              />
            </CardContent>
          </Card>
        </div>

        {/* Zones List */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Section Details</CardTitle>
              <CardDescription>All analyzed page sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {zones.map((zone) => {
                const config = statusConfig[zone.status]
                return (
                  <div
                    key={zone.id}
                    className={cn(
                      'p-3 rounded-lg border transition-all cursor-pointer',
                      hoveredZone === zone.id && 'bg-muted'
                    )}
                    onMouseEnter={() => setHoveredZone(zone.id)}
                    onMouseLeave={() => setHoveredZone(null)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{zone.label}</span>
                      <Badge variant="secondary" className={cn('text-xs', config.badgeColor)}>
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{zone.description}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1 font-mono">
                      {zone.selector}
                    </p>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
