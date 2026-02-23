'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { useScoresData } from '@/hooks/use-analysis'
import { ScoresPageSkeleton } from '../loading-skeletons'

const radarChartConfig = {
  value: {
    label: 'Score',
    color: 'hsl(var(--chart-1))',
  },
} as const

const barChartConfig = {
  score: {
    label: 'Score',
    color: 'hsl(var(--chart-2))',
  },
} as const

export function ScoresPage() {
  const { scoresData, isLoading, isError } = useScoresData()

  if (isLoading) {
    return <ScoresPageSkeleton />
  }

  if (isError || !scoresData) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Failed to load scores data. Please try again.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Radar</CardTitle>
            <CardDescription>Multi-dimensional score overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={radarChartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={scoresData.radar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="var(--color-value)"
                    fill="var(--color-value)"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Factor Scores</CardTitle>
            <CardDescription>Individual scoring factors</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoresData.barChart} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 'dataMax']} />
                  <YAxis dataKey="factor" type="category" tick={{ fontSize: 11 }} width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Score Breakdown</CardTitle>
          <CardDescription>Detailed scoring weights and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scoresData.breakdown.map((item) => {
              const percentage = (item.score / item.weight) * 100
              return (
                <div key={item.factor} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.factor}</span>
                    <span className="text-muted-foreground">
                      {item.score} / {item.weight} pts
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
