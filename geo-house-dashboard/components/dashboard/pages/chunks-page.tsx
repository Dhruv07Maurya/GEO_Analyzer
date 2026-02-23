'use client'

import { Sparkles, Hash } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useChunks } from '@/hooks/use-analysis'
import { ChunksPageSkeleton } from '../loading-skeletons'
import { cn } from '@/lib/utils'

export function ChunksPage() {
  const { chunks, isLoading, isError } = useChunks()

  if (isLoading) {
    return <ChunksPageSkeleton />
  }

  if (isError || !chunks) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Failed to load chunk data. Please try again.
      </div>
    )
  }

  const aiUsedChunks = chunks.filter(c => c.aiUsesThis).length

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Content Chunking Analysis</h3>
              <p className="text-sm text-muted-foreground">
                How AI systems break down your content for retrieval
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{chunks.length}</p>
                <p className="text-xs text-muted-foreground">Total Chunks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{aiUsedChunks}</p>
                <p className="text-xs text-muted-foreground">AI Likely Uses</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {chunks.reduce((sum, c) => sum + c.tokenCount, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Tokens</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chunks List */}
      <div className="space-y-4">
        {chunks.map((chunk) => (
          <Card 
            key={chunk.id}
            className={cn(
              'transition-all',
              chunk.aiUsesThis && 'border-emerald-200 bg-emerald-50/30'
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    Chunk {chunk.index}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {chunk.tokenCount} tokens
                  </Badge>
                </div>
                {chunk.aiUsesThis && (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI likely uses this
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {chunk.preview}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
