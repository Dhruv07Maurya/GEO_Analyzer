'use client'

import { useState } from 'react'
import { Copy, Check, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useIssues } from '@/hooks/use-analysis'
import { RecommendationsPageSkeleton } from '../loading-skeletons'
import { cn } from '@/lib/utils'
import type { Issue } from '@/lib/types'

const severityConfig = {
  high: { icon: AlertCircle, color: 'bg-red-100 text-red-700', borderColor: 'border-l-red-500' },
  medium: { icon: AlertTriangle, color: 'bg-amber-100 text-amber-700', borderColor: 'border-l-amber-500' },
  low: { icon: Info, color: 'bg-blue-100 text-blue-700', borderColor: 'border-l-blue-500' },
}

interface IssueCardProps {
  issue: Issue
  isSelected: boolean
  onSelect: () => void
}

function IssueCard({ issue, isSelected, onSelect }: IssueCardProps) {
  const [copied, setCopied] = useState(false)
  const config = severityConfig[issue.severity]
  const Icon = config.icon

  const handleCopy = () => {
    if (issue.codeSnippet) {
      navigator.clipboard.writeText(issue.codeSnippet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card 
      className={cn(
        'cursor-pointer border-l-4 transition-all',
        config.borderColor,
        isSelected && 'ring-2 ring-primary'
      )}
      onClick={onSelect}
    >
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-semibold text-sm">{issue.title}</h3>
          <Badge variant="secondary" className={cn('text-xs shrink-0', config.color)}>
            <Icon className="h-3 w-3 mr-1" />
            {issue.severity}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
        <div className="bg-muted/50 rounded-lg p-3 mb-3">
          <p className="text-xs font-medium text-foreground mb-1">Suggested Fix:</p>
          <p className="text-xs text-muted-foreground">{issue.suggestion}</p>
        </div>
        {issue.codeSnippet && (
          <div className="relative">
            <pre className="bg-foreground text-background rounded-lg p-3 text-xs overflow-x-auto">
              <code>{issue.codeSnippet}</code>
            </pre>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 h-7 w-7 p-0 bg-background/10 hover:bg-background/20"
              onClick={(e) => {
                e.stopPropagation()
                handleCopy()
              }}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function RecommendationsPage() {
  const { issues, isLoading, isError } = useIssues()
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)

  if (isLoading) {
    return <RecommendationsPageSkeleton />
  }

  if (isError || !issues) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Failed to load recommendations. Please try again.
      </div>
    )
  }

  const selected = issues.find(i => i.id === selectedIssue)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Website Preview Mock */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Website Preview</CardTitle>
          <CardDescription className="text-xs">
            {selected ? `Highlighting: ${selected.selector}` : 'Select an issue to highlight'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-muted/30 h-[500px] relative">
            {/* Mock website structure */}
            <div className="p-4 space-y-4">
              <div className={cn(
                'h-16 bg-muted rounded transition-all',
                selected?.selector === 'header' && 'ring-2 ring-emerald-500'
              )} />
              <div className={cn(
                'h-32 bg-muted rounded transition-all',
                selected?.selector === '.hero' && 'ring-2 ring-emerald-500',
                selected?.selector === '.intro-section' && 'ring-2 ring-red-500'
              )} />
              <div className={cn(
                'h-24 bg-muted rounded transition-all',
                selected?.selector === '#faq-section' && 'ring-2 ring-red-500'
              )} />
              <div className={cn(
                'h-40 bg-muted rounded transition-all',
                selected?.selector === '.content-body p' && 'ring-2 ring-amber-500'
              )} />
              <div className={cn(
                'grid grid-cols-3 gap-2',
                selected?.selector === 'img[alt=""]' && 'ring-2 ring-amber-500 rounded'
              )}>
                <div className="h-16 bg-muted rounded" />
                <div className="h-16 bg-muted rounded" />
                <div className="h-16 bg-muted rounded" />
              </div>
              <div className={cn(
                'h-20 bg-muted rounded transition-all',
                selected?.selector === '.tutorial-steps' && 'ring-2 ring-blue-500'
              )} />
            </div>
            {!selected && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <p className="text-sm text-muted-foreground">Select an issue to highlight</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium">Issues ({issues.length})</h2>
          <div className="flex gap-2">
            {(['high', 'medium', 'low'] as const).map(severity => {
              const count = issues.filter(i => i.severity === severity).length
              const config = severityConfig[severity]
              return (
                <Badge key={severity} variant="secondary" className={cn('text-xs', config.color)}>
                  {count} {severity}
                </Badge>
              )
            })}
          </div>
        </div>
        <ScrollArea className="h-[550px] pr-4">
          <div className="space-y-3">
            {issues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                isSelected={selectedIssue === issue.id}
                onSelect={() => setSelectedIssue(issue.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
