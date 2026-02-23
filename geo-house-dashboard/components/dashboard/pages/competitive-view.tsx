'use client'

import { Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useCompetitiveView } from '@/hooks/use-analysis'
import { TableSkeleton } from '../loading-skeletons'

function renderCellValue(value: boolean | number | string) {
  if (typeof value === 'boolean') {
    return value ? (
      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
        <Check className="h-3 w-3" />
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-700">
        <X className="h-3 w-3" />
      </Badge>
    )
  }
  return <span className="font-medium">{value}</span>
}

export function CompetitiveView() {
  const { competitiveData, isLoading, isError } = useCompetitiveView()

  if (isLoading) {
    return <TableSkeleton rows={7} />
  }

  if (isError || !competitiveData) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Failed to load competitive data. Please try again.
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Comparison</CardTitle>
        <CardDescription>
          See how your website compares against competitors across key GEO factors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Feature</TableHead>
              <TableHead className="text-center">You</TableHead>
              <TableHead className="text-center">Competitor A</TableHead>
              <TableHead className="text-center">Competitor B</TableHead>
              <TableHead className="text-center">Competitor C</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitiveData.map((row) => (
              <TableRow key={row.feature}>
                <TableCell className="font-medium">{row.feature}</TableCell>
                <TableCell className="text-center">{renderCellValue(row.you)}</TableCell>
                <TableCell className="text-center">{renderCellValue(row.competitorA)}</TableCell>
                <TableCell className="text-center">{renderCellValue(row.competitorB)}</TableCell>
                <TableCell className="text-center">{renderCellValue(row.competitorC)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
