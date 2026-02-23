'use client'

import { useState } from 'react'
import { Loader2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface URLResponse {
  url: string
  response: string
  score?: number
}

interface GeoRecommendation {
  recommendation: string
  why_it_helps_ai_generation: string
}

interface GeoAnalysis {
  overall_alignment?: {
    most_aligned_url: string
    reason: string
  }
  url_analysis?: {
    user_url?: {
      relevance_percent: number
      topics_covered: string[]
      topics_missing: string[]
      structural_strengths: string[]
      structural_gaps: string[]
      geo_recommendations: GeoRecommendation[]
      comparison_with_competitors?: {
        advantages: string[]
        disadvantages: string[]
      }
    }
    competitors?: Array<{
      url: string
      relevance_percent: number
      topics_covered: string[]
      topics_missing: string[]
      geo_recommendations: string[]
    }>
  }
}

interface ComparisonResult {
  question: string
  userUrl: string
  responses: URLResponse[]
  summary?: string
  geoAnalysis?: GeoAnalysis
}

export function DashboardHome() {
  const [userUrl, setUserUrl] = useState('')
  const [competitor1, setCompetitor1] = useState('')
  const [competitor2, setCompetitor2] = useState('')
  const [competitor3, setCompetitor3] = useState('')
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null)
  const [error, setError] = useState('')
  const [showInput, setShowInput] = useState(true)

  const handleAnalyze = async () => {
    setError('')
    setIsLoading(true)

    try {
      const urls = [userUrl, competitor1, competitor2, competitor3].filter(Boolean)

      // Step 1: Generate summaries
      const summaryRes = await fetch('http://localhost:8000/generate/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_url: userUrl,
          urls: [competitor1, competitor2, competitor3].filter(Boolean),
          query: question,
        }),
      })

      const summaryData = await summaryRes.json()

      // Check for backend errors
      if (summaryData.error) {
        throw new Error(summaryData.error)
      }

      if (!summaryRes.ok) throw new Error('Failed to generate summaries')

      // Step 2: Generate LLM responses for the question
      const llmRes = await fetch('http://localhost:8000/generate_llm_response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question || 'Provide comprehensive information and resources' }),
      })

      if (!llmRes.ok) throw new Error('Failed to generate LLM response')
      const llmData = await llmRes.json()

      if (llmData.error) {
        throw new Error(llmData.error)
      }

      // Step 3: Compare URLs
      const compareRes = await fetch('http://localhost:8000/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!compareRes.ok) throw new Error('Failed to compare URLs')
      const compareData = await compareRes.json()

      if (compareData.error) {
        throw new Error(compareData.error)
      }

      // Parse the geo_analysis JSON if it's a string
      let geoAnalysis
      try {
        let jsonString = typeof compareData.geo_analysis === 'string'
          ? compareData.geo_analysis
          : JSON.stringify(compareData.geo_analysis)

        // Clean markdown code blocks if present
        jsonString = jsonString.replace(/```json\n?|\n?```/g, '').trim()

        geoAnalysis = JSON.parse(jsonString)
      } catch (e) {
        console.error("JSON Parse Error:", e)
        geoAnalysis = null
      }

      // Build responses array with actual summaries and analysis
      const responses: URLResponse[] = [
        {
          url: userUrl,
          response: summaryData.user_summary || 'No summary available',
          score: geoAnalysis?.url_analysis?.user_url?.relevance_percent || 60,
        },
        ...(summaryData.competitor_summaries || []).map((comp: any, idx: number) => ({
          url: comp.url,
          response: comp.summary || 'No summary available',
          score: geoAnalysis?.url_analysis?.competitors?.[idx]?.relevance_percent || 60,
        }))
      ]

      setComparisonResult({
        question,
        userUrl,
        responses,
        summary: geoAnalysis?.overall_alignment?.reason || compareData.geo_analysis || 'Analysis complete',
        geoAnalysis: geoAnalysis,
      })

      setShowInput(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      console.error('[v0] Analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenGeoHouse = () => {
    if (userUrl) {
      const encodedUrl = encodeURIComponent(userUrl)
      window.open(`http://localhost:4000/geo/${encodedUrl}`, '_blank')
    }
  }

  if (!comparisonResult) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex gap-2 mb-4">
          {userUrl && (
            <Button
              onClick={handleOpenGeoHouse}
              className="ml-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
              size="lg"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open GEO-house
            </Button>
          )}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>URL Comparison Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-url">Your Website URL</Label>
              <Input
                id="user-url"
                placeholder="https://yoursite.com"
                value={userUrl}
                onChange={(e) => setUserUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comp1">Competitor URL 1</Label>
              <Input
                id="comp1"
                placeholder="https://competitor1.com"
                value={competitor1}
                onChange={(e) => setCompetitor1(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comp2">Competitor URL 2</Label>
              <Input
                id="comp2"
                placeholder="https://competitor2.com"
                value={competitor2}
                onChange={(e) => setCompetitor2(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comp3">Competitor URL 3</Label>
              <Input
                id="comp3"
                placeholder="https://competitor3.com"
                value={competitor3}
                onChange={(e) => setCompetitor3(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Question/Topic to Compare</Label>
              <Input
                id="question"
                placeholder="What is your main offering?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={isLoading || !userUrl}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Run Comparison'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex gap-2 mb-4">
        <Button
          onClick={() => {
            setComparisonResult(null)
            setUserUrl('')
            setCompetitor1('')
            setCompetitor2('')
            setCompetitor3('')
            setQuestion('')
            setShowInput(true)
          }}
          variant="outline"
        >
          New Analysis
        </Button>
        <Button
          onClick={handleOpenGeoHouse}
          className="ml-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
          size="lg"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open GEO-house
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">📊 GEO Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-2">Question: {comparisonResult.question}</p>
            <p className="text-sm text-blue-800">{comparisonResult.summary}</p>
          </div>

          {comparisonResult.geoAnalysis?.overall_alignment && (
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-xs font-semibold text-gray-600 mb-1">Most Aligned URL</p>
              <p className="text-sm font-medium text-blue-900 break-all">{comparisonResult.geoAnalysis.overall_alignment.most_aligned_url}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GEO Recommendations for Your URL */}
      {comparisonResult.geoAnalysis?.url_analysis?.user_url && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">💡 Recommendations for Your Website</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Topics Covered */}
              {comparisonResult.geoAnalysis.url_analysis.user_url.topics_covered?.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h3 className="text-sm font-semibold text-green-900 mb-2">✅ Topics Covered</h3>
                  <ul className="space-y-1">
                    {comparisonResult.geoAnalysis.url_analysis.user_url.topics_covered.map((topic, idx) => (
                      <li key={idx} className="text-xs text-gray-700">• {topic}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Topics Missing */}
              {comparisonResult.geoAnalysis.url_analysis.user_url.topics_missing?.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-orange-200">
                  <h3 className="text-sm font-semibold text-orange-900 mb-2">⚠️ Topics Missing</h3>
                  <ul className="space-y-1">
                    {comparisonResult.geoAnalysis.url_analysis.user_url.topics_missing.map((topic, idx) => (
                      <li key={idx} className="text-xs text-gray-700">• {topic}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Structural Strengths */}
              {comparisonResult.geoAnalysis.url_analysis.user_url.structural_strengths?.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">💪 Structural Strengths</h3>
                  <ul className="space-y-1">
                    {comparisonResult.geoAnalysis.url_analysis.user_url.structural_strengths.map((strength, idx) => (
                      <li key={idx} className="text-xs text-gray-700">• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Structural Gaps */}
              {comparisonResult.geoAnalysis.url_analysis.user_url.structural_gaps?.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h3 className="text-sm font-semibold text-red-900 mb-2">🔧 Structural Gaps</h3>
                  <ul className="space-y-1">
                    {comparisonResult.geoAnalysis.url_analysis.user_url.structural_gaps.map((gap, idx) => (
                      <li key={idx} className="text-xs text-gray-700">• {gap}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Comparison with Competitors */}
            {comparisonResult.geoAnalysis.url_analysis.user_url.comparison_with_competitors && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {comparisonResult.geoAnalysis.url_analysis.user_url.comparison_with_competitors.advantages?.length > 0 && (
                  <div className="bg-white rounded-lg p-4 border border-green-300">
                    <h3 className="text-sm font-semibold text-green-900 mb-2">✨ Your Advantages</h3>
                    <ul className="space-y-1">
                      {comparisonResult.geoAnalysis.url_analysis.user_url.comparison_with_competitors.advantages.map((adv, idx) => (
                        <li key={idx} className="text-xs text-gray-700">• {adv}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {comparisonResult.geoAnalysis.url_analysis.user_url.comparison_with_competitors.disadvantages?.length > 0 && (
                  <div className="bg-white rounded-lg p-4 border border-red-300">
                    <h3 className="text-sm font-semibold text-red-900 mb-2">⚡ Areas to Improve</h3>
                    <ul className="space-y-1">
                      {comparisonResult.geoAnalysis.url_analysis.user_url.comparison_with_competitors.disadvantages.map((dis, idx) => (
                        <li key={idx} className="text-xs text-gray-700">• {dis}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Actionable Recommendations */}
            {comparisonResult.geoAnalysis.url_analysis.user_url.geo_recommendations?.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-green-300 mt-4">
                <h3 className="text-sm font-semibold text-green-900 mb-3">🎯 Actionable Recommendations</h3>
                <div className="space-y-3">
                  {comparisonResult.geoAnalysis.url_analysis.user_url.geo_recommendations.map((rec, idx) => (
                    <div key={idx} className="border-l-4 border-green-500 pl-3 py-2">
                      <p className="text-sm font-medium text-gray-900 mb-1">{rec.recommendation}</p>
                      <p className="text-xs text-gray-600 italic">Why: {rec.why_it_helps_ai_generation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">Response Comparison</h2>
        <Tabs defaultValue="tab1" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tab1">Tab 1: Your URL</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2: Competitor 1</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3: Competitor 2</TabsTrigger>
            <TabsTrigger value="tab4">Tab 4: Competitor 3</TabsTrigger>
          </TabsList>

          {comparisonResult.responses.map((response, idx) => (
            <TabsContent key={idx} value={`tab${idx + 1}`} className="space-y-4">
              <Card>
                <CardHeader className={cn(
                  'pb-3',
                  idx === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  <CardTitle className="text-sm">{response.url}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Relevance Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={cn(
                            'h-2 rounded-full',
                            response.score! >= 80 ? 'bg-green-600' :
                              response.score! >= 60 ? 'bg-yellow-600' :
                                'bg-red-600'
                          )}
                          style={{ width: `${response.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold min-w-12">{response.score}%</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Response</p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{response.response}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
