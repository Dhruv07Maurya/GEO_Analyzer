'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface GEOAnalysis {
  overall_alignment: {
    most_aligned_url: string
    reason: string
  }
  url_analysis: {
    user_url: {
      relevance_percent: number
      topics_covered: string[]
      geo_recommendations: Array<{
        recommendation: string
        why_it_helps_ai_generation: string
      }>
    }
    competitors: Array<{
      url: string
      relevance_percent: number
      topics_covered: string[]
    }>
  }
}

interface GeoHousePageProps {
  url: string
}

export function GeoHousePage({ url }: GeoHousePageProps) {
  const router = useRouter()
  const [data, setData] = useState<GEOAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const decodedUrl = decodeURIComponent(url)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        console.log('[v0] Fetching GEO analysis for:', decodedUrl)

        // In a real app, you'd fetch from an endpoint that returns the stored analysis
        // For now, we'll try to get it from the backend
        const res = await fetch('http://localhost:8000/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!res.ok) throw new Error('Failed to fetch analysis data')
        const result = await res.json()
        setData(result.geo_analysis)
        console.log('[v0] GEO analysis loaded:', result)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load analysis'
        setError(message)
        console.error('[v0] Error fetching data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [decodedUrl])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          {error || 'No analysis data available'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GEO-house Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1 break-all">{decodedUrl}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Overall Alignment */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Alignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Most Aligned URL</p>
            <p className="text-lg font-semibold break-all">{data.overall_alignment.most_aligned_url}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Why</p>
            <p className="text-sm">{data.overall_alignment.reason}</p>
          </div>
        </CardContent>
      </Card>

      {/* Your URL Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Your URL Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Relevance Score</p>
              <p className={cn(
                'text-4xl font-bold mt-2',
                data.url_analysis.user_url.relevance_percent >= 80 ? 'text-green-600' :
                data.url_analysis.user_url.relevance_percent >= 60 ? 'text-yellow-600' :
                'text-red-600'
              )}>
                {data.url_analysis.user_url.relevance_percent}%
              </p>
            </div>
            <Badge variant="secondary" className="mb-2">
              {data.url_analysis.user_url.relevance_percent >= 80 ? 'Excellent' :
               data.url_analysis.user_url.relevance_percent >= 60 ? 'Good' :
               'Needs Work'}
            </Badge>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">Topics Covered</p>
            <div className="flex flex-wrap gap-2">
              {data.url_analysis.user_url.topics_covered.map((topic, idx) => (
                <Badge key={idx} variant="outline">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GEO Recommendations */}
      <div>
        <h2 className="text-2xl font-bold mb-4">GEO Recommendations</h2>
        <div className="grid gap-4">
          {data.url_analysis.user_url.geo_recommendations.map((rec, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-lg">{rec.recommendation}</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-2">Why it helps AI generation:</p>
                  <p className="text-sm">{rec.why_it_helps_ai_generation}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Competitor Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Competitor Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.url_analysis.competitors.map((comp, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Competitor {idx + 1}</p>
                    <p className="font-semibold text-sm break-all">{comp.url}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      comp.relevance_percent >= 80 ? 'bg-green-100 text-green-800' :
                      comp.relevance_percent >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    )}
                  >
                    {comp.relevance_percent}%
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Topics Covered</p>
                  <div className="flex flex-wrap gap-2">
                    {comp.topics_covered.map((topic, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
