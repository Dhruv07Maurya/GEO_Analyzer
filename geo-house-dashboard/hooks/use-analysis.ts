'use client'

import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import type { AnalysisResult, AnalysisInput, AnalysisStatus, ScoreSummary, CompetitorRow, Issue, HeatmapZone, Chunk, ScoreBreakdown, RadarDataPoint, BarChartData } from '@/lib/types'
import { mockAnalysisResult, mockAnalysisStatus } from '@/lib/mock-data'

// Simulated API delay for realistic loading states
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Fetcher functions with simulated API calls
async function fetchAnalysis(): Promise<AnalysisResult> {
  await delay(1500)
  return mockAnalysisResult
}

async function fetchAnalysisStatus(): Promise<AnalysisStatus> {
  await delay(500)
  return mockAnalysisStatus
}

const API_BASE_URL = 'https://88165e4238c8.ngrok-free.app'

async function runAnalysis(url: string, { arg }: { arg: AnalysisInput }): Promise<AnalysisResult> {
  console.log('[v0] Running analysis with input:', arg)
  
  const response = await fetch(`${API_BASE_URL}/generate/summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify({
      user_url: arg.websiteUrl,
      urls: arg.competitorUrls.filter(Boolean),
    }),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  console.log('[v0] API response:', data)
  
  // Map API response to our AnalysisResult format
  // Adapt this based on actual API response structure
  return {
    ...mockAnalysisResult,
    input: arg,
    createdAt: new Date().toISOString(),
    // Override with real data if available from API
    ...(data.summary && { summary: data.summary }),
    ...(data.competitiveView && { competitiveView: data.competitiveView }),
    ...(data.scores && { scores: data.scores }),
    ...(data.issues && { issues: data.issues }),
    ...(data.heatmapZones && { heatmapZones: data.heatmapZones }),
    ...(data.chunks && { chunks: data.chunks }),
  }
}

// Main analysis hook
export function useAnalysis() {
  const { data, error, isLoading, mutate } = useSWR<AnalysisResult>(
    'analysis',
    fetchAnalysis,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  return {
    analysis: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  }
}

// Analysis status hook
export function useAnalysisStatus() {
  const { data, error, isLoading } = useSWR<AnalysisStatus>(
    'analysis-status',
    fetchAnalysisStatus,
    {
      refreshInterval: 2000,
    }
  )

  return {
    status: data,
    isLoading,
    isError: !!error,
  }
}

// Run analysis mutation hook
export function useRunAnalysis() {
  const { trigger, isMutating, error } = useSWRMutation(
    'analysis',
    runAnalysis
  )

  return {
    runAnalysis: trigger,
    isRunning: isMutating,
    error,
  }
}

// Summary scores hook
export function useSummaryScores() {
  const { data, error, isLoading } = useSWR<ScoreSummary>(
    'summary-scores',
    async () => {
      await delay(1200)
      return mockAnalysisResult.summary
    },
    { revalidateOnFocus: false }
  )

  return {
    summary: data,
    isLoading,
    isError: !!error,
  }
}

// Competitive view hook
export function useCompetitiveView() {
  const { data, error, isLoading } = useSWR<CompetitorRow[]>(
    'competitive-view',
    async () => {
      await delay(1800)
      return mockAnalysisResult.competitiveView
    },
    { revalidateOnFocus: false }
  )

  return {
    competitiveData: data,
    isLoading,
    isError: !!error,
  }
}

// Scores breakdown hook
export function useScoresData() {
  const { data, error, isLoading } = useSWR<{
    radar: RadarDataPoint[]
    barChart: BarChartData[]
    breakdown: ScoreBreakdown[]
  }>(
    'scores-data',
    async () => {
      await delay(1600)
      return mockAnalysisResult.scores
    },
    { revalidateOnFocus: false }
  )

  return {
    scoresData: data,
    isLoading,
    isError: !!error,
  }
}

// Issues hook
export function useIssues() {
  const { data, error, isLoading } = useSWR<Issue[]>(
    'issues',
    async () => {
      await delay(1400)
      return mockAnalysisResult.issues
    },
    { revalidateOnFocus: false }
  )

  return {
    issues: data,
    isLoading,
    isError: !!error,
  }
}

// Heatmap zones hook
export function useHeatmapZones() {
  const { data, error, isLoading } = useSWR<HeatmapZone[]>(
    'heatmap-zones',
    async () => {
      await delay(2000)
      return mockAnalysisResult.heatmapZones
    },
    { revalidateOnFocus: false }
  )

  return {
    zones: data,
    isLoading,
    isError: !!error,
  }
}

// Chunks hook
export function useChunks() {
  const { data, error, isLoading } = useSWR<Chunk[]>(
    'chunks',
    async () => {
      await delay(1300)
      return mockAnalysisResult.chunks
    },
    { revalidateOnFocus: false }
  )

  return {
    chunks: data,
    isLoading,
    isError: !!error,
  }
}
