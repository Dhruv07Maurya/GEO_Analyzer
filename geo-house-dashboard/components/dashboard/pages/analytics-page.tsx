'use client'

import React from "react"

import { useState } from 'react'
import { 
  X, 
  Globe, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  FileText, 
  Hash, 
  BarChart3,
  Layers,
  Target,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useAnalysis } from '@/hooks/use-analysis'
import { cn } from '@/lib/utils'

interface TabData {
  id: string
  url: string
  label: string
  isBase: boolean
  data?: Record<string, unknown>
}

function ChromeTab({ 
  tab, 
  isActive, 
  onSelect, 
  onClose,
  showClose = true 
}: { 
  tab: TabData
  isActive: boolean
  onSelect: () => void
  onClose: () => void
  showClose?: boolean
}) {
  return (
    <div
      className={cn(
        'group relative flex items-center gap-2 px-4 py-2 min-w-[140px] max-w-[240px] cursor-pointer border-r border-border transition-colors',
        isActive 
          ? 'bg-background border-t-2 border-t-primary' 
          : 'bg-muted/50 hover:bg-muted'
      )}
      onClick={onSelect}
    >
      <div className={cn(
        'flex h-4 w-4 items-center justify-center rounded-sm',
        tab.isBase ? 'bg-primary' : 'bg-muted-foreground/20'
      )}>
        <Globe className="h-2.5 w-2.5 text-primary-foreground" />
      </div>
      <span className="flex-1 truncate text-xs font-medium">
        {tab.label}
      </span>
      {tab.isBase && (
        <Badge variant="secondary" className="h-4 px-1 text-[10px]">
          BASE
        </Badge>
      )}
      {showClose && !tab.isBase && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent rounded-sm p-0.5"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Close tab</span>
        </button>
      )}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-background" />
      )}
    </div>
  )
}

// Score Card with Progress Bar
function ScoreCard({ label, value, maxValue = 100, description }: { label: string; value: number; maxValue?: number; description?: string }) {
  const percentage = Math.min((value / maxValue) * 100, 100)
  const getColor = () => {
    if (percentage >= 70) return { text: 'text-green-600 dark:text-green-400', bg: 'bg-green-500' }
    if (percentage >= 40) return { text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500' }
    return { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-500' }
  }
  const colors = getColor()
  
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{label}</span>
          <span className={cn('text-2xl font-bold', colors.text)}>{value}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full transition-all', colors.bg)} style={{ width: `${percentage}%` }} />
        </div>
        {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
      </CardContent>
    </Card>
  )
}

// Stat Card
function StatCard({ icon: Icon, label, value, subValue }: { icon: React.ElementType; label: string; value: string | number; subValue?: string }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-semibold">{value}</p>
            {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Issue Card
function IssueCard({ severity, title, description, element, type }: { severity: string; title: string; description: string; element?: string; type: string }) {
  const getSeverityConfig = () => {
    switch (severity) {
      case 'critical': return { bg: 'bg-red-50 dark:bg-red-950/50', border: 'border-red-200 dark:border-red-900', icon: AlertTriangle, iconColor: 'text-red-500' }
      case 'warning': return { bg: 'bg-yellow-50 dark:bg-yellow-950/50', border: 'border-yellow-200 dark:border-yellow-900', icon: AlertTriangle, iconColor: 'text-yellow-500' }
      default: return { bg: 'bg-blue-50 dark:bg-blue-950/50', border: 'border-blue-200 dark:border-blue-900', icon: Info, iconColor: 'text-blue-500' }
    }
  }
  const config = getSeverityConfig()
  const Icon = config.icon

  return (
    <div className={cn('p-4 rounded-lg border', config.bg, config.border)}>
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', config.iconColor)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{title}</span>
            <Badge variant="outline" className="text-xs capitalize">{type}</Badge>
            <Badge variant={severity === 'critical' ? 'destructive' : severity === 'warning' ? 'default' : 'secondary'} className="text-xs capitalize">
              {severity}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          {element && (
            <code className="text-xs bg-muted px-2 py-1 rounded font-mono mt-2 inline-block">{element}</code>
          )}
        </div>
      </div>
    </div>
  )
}

// Chunk Card
function ChunkCard({ chunk }: { chunk: { id: string; title: string; content: string; score: number; keywords?: string[] } }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{chunk.title || 'Untitled Chunk'}</CardTitle>
          <Badge variant={chunk.score >= 70 ? 'default' : chunk.score >= 40 ? 'secondary' : 'destructive'}>
            Score: {chunk.score ?? 0}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{chunk.content || 'No content available'}</p>
        {chunk.keywords && chunk.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {chunk.keywords.map((keyword) => (
              <Badge key={keyword} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Heatmap Zone
function HeatmapZone({ zone }: { zone: { id: string; element: string; visibility: number; engagement: number; recommendation: string } }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{zone.element}</code>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Visibility</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${zone.visibility}%` }} />
            </div>
            <span className="text-sm font-medium">{zone.visibility}%</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Engagement</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${zone.engagement}%` }} />
            </div>
            <span className="text-sm font-medium">{zone.engagement}%</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{zone.recommendation}</p>
    </div>
  )
}

// Comparison Table Row
function ComparisonTableRow({ feature, yourValue, competitorValue }: { feature: string; yourValue: string; competitorValue?: string }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b last:border-0 items-center">
      <span className="text-sm font-medium">{feature}</span>
      <span className="text-sm">{yourValue}</span>
      {competitorValue !== undefined && <span className="text-sm text-muted-foreground">{competitorValue}</span>}
    </div>
  )
}

// Base URL Tab Content
function BaseTabContent({ data }: { data: Record<string, unknown> }) {
  const summary = data.summary as { overallScore: number; visibility: number; relevance: number; authority: number; freshness: number } | undefined
  const scores = data.scores as { category: string; value: number }[] | undefined
  const issues = data.issues as { id: string; type: string; severity: string; title: string; description: string; element?: string }[] | undefined
  const chunks = data.chunks as { id: string; title: string; content: string; score: number; keywords: string[] }[] | undefined
  const heatmapZones = data.heatmapZones as { id: string; element: string; visibility: number; engagement: number; recommendation: string }[] | undefined

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      {summary && (
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <ScoreCard label="Overall" value={summary.overallScore} description="Combined score" />
            <ScoreCard label="Visibility" value={summary.visibility} description="Search visibility" />
            <ScoreCard label="Relevance" value={summary.relevance} description="Content relevance" />
            <ScoreCard label="Authority" value={summary.authority} description="Domain authority" />
            <ScoreCard label="Freshness" value={summary.freshness} description="Content freshness" />
          </div>
        </section>
      )}

      {/* Scores Section */}
      {scores && scores.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Category Scores
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {scores.map((score) => (
              <StatCard 
                key={score.category} 
                icon={Zap} 
                label={score.category} 
                value={score.value}
              />
            ))}
          </div>
        </section>
      )}

      {/* Issues Section */}
      {issues && issues.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Issues Found
            <Badge variant="secondary">{issues.length}</Badge>
          </h3>
          <div className="space-y-3">
            {issues.map((issue) => (
              <IssueCard key={issue.id} {...issue} />
            ))}
          </div>
        </section>
      )}

      {/* Chunks Section */}
      {chunks && chunks.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Content Chunks
            <Badge variant="secondary">{chunks.length}</Badge>
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {chunks.map((chunk) => (
              <ChunkCard key={chunk.id} chunk={chunk} />
            ))}
          </div>
        </section>
      )}

      {/* Heatmap Zones Section */}
      {heatmapZones && heatmapZones.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            DOM Heatmap Zones
            <Badge variant="secondary">{heatmapZones.length}</Badge>
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {heatmapZones.map((zone) => (
              <HeatmapZone key={zone.id} zone={zone} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// Competitor Tab Content
function CompetitorTabContent({ data }: { data: Record<string, unknown> }) {
  const competitiveView = data.competitiveView as { feature: string; value: string }[] | undefined
  const competitorIndex = data.competitorIndex as number

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Competitor #{competitorIndex} Analysis
        </h3>
        
        {competitiveView && competitiveView.length > 0 ? (
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 py-2 border-b font-medium text-sm">
                <span>Feature</span>
                <span>Value</span>
              </div>
              {competitiveView.map((row, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 py-3 border-b last:border-0">
                  <span className="text-sm font-medium">{row.feature}</span>
                  <span className="text-sm">{row.value || '-'}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No competitive data available for this URL</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}

function TabContent({ tab }: { tab: TabData }) {
  if (!tab.data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Globe className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-sm">No data available for this URL</p>
        <p className="text-xs mt-1">Run an analysis to see results</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        {/* URL Header */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <a 
            href={tab.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {tab.url}
            <ExternalLink className="h-3 w-3" />
          </a>
          {tab.isBase && <Badge>Your Website</Badge>}
        </div>
        
        {/* Content based on tab type */}
        {tab.isBase ? (
          <BaseTabContent data={tab.data} />
        ) : (
          <CompetitorTabContent data={tab.data} />
        )}
      </div>
    </ScrollArea>
  )
}

export function AnalyticsPage() {
  const { analysis, isLoading } = useAnalysis()
  const [activeTabId, setActiveTabId] = useState<string>('base')
  const [closedTabs, setClosedTabs] = useState<string[]>([])

  const buildTabs = (): TabData[] => {
    if (!analysis?.input) {
      return [{
        id: 'base',
        url: 'No URL provided',
        label: 'Your Website',
        isBase: true,
        data: undefined
      }]
    }

    const tabs: TabData[] = []
    
    if (analysis.input.websiteUrl) {
      tabs.push({
        id: 'base',
        url: analysis.input.websiteUrl,
        label: getDomainLabel(analysis.input.websiteUrl),
        isBase: true,
        data: {
          url: analysis.input.websiteUrl,
          summary: analysis.summary,
          scores: analysis.scores,
          issues: analysis.issues,
          heatmapZones: analysis.heatmapZones,
          chunks: analysis.chunks
        }
      })
    }

    analysis.input.competitorUrls.forEach((url, index) => {
      if (url && !closedTabs.includes(`competitor-${index}`)) {
        tabs.push({
          id: `competitor-${index}`,
          url,
          label: getDomainLabel(url),
          isBase: false,
          data: {
            url,
            competitorIndex: index + 1,
            competitiveView: analysis.competitiveView?.map(row => ({
              feature: row.feature,
              value: index === 0 ? row.competitorA : index === 1 ? row.competitorB : row.competitorC
            }))
          }
        })
      }
    })

    return tabs
  }

  const getDomainLabel = (url: string): string => {
    try {
      const domain = new URL(url).hostname.replace('www.', '')
      return domain.length > 20 ? domain.substring(0, 20) + '...' : domain
    } catch {
      return url.substring(0, 20)
    }
  }

  const tabs = buildTabs()
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0]

  const handleCloseTab = (tabId: string) => {
    setClosedTabs([...closedTabs, tabId])
    if (activeTabId === tabId) {
      const remainingTabs = tabs.filter(t => t.id !== tabId)
      setActiveTabId(remainingTabs[0]?.id || 'base')
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-end bg-muted/30 border-b">
          <Skeleton className="h-10 w-40 m-1" />
          <Skeleton className="h-10 w-40 m-1" />
          <Skeleton className="h-10 w-40 m-1" />
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-end bg-muted/30 border-b overflow-x-auto">
        {tabs.map((tab) => (
          <ChromeTab
            key={tab.id}
            tab={tab}
            isActive={activeTab.id === tab.id}
            onSelect={() => setActiveTabId(tab.id)}
            onClose={() => handleCloseTab(tab.id)}
            showClose={tabs.length > 1}
          />
        ))}
        <div className="flex-1 border-b border-border bg-muted/30" />
      </div>

      <div className="flex-1 bg-background overflow-hidden">
        {activeTab && <TabContent tab={activeTab} />}
      </div>
    </div>
  )
}
