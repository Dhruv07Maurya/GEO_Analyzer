'use client'

import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { GeoHousePage } from '@/components/dashboard/pages'
import { useState } from 'react'

interface PageProps {
  params: Promise<{
    url: string
  }>
}

export default async function GeoPage({ params }: PageProps) {
  const resolvedParams = await params
  const [activePage] = useState('geo-house')

  return (
    <DashboardLayout activePage={activePage} onPageChange={() => {}}>
      <GeoHousePage url={resolvedParams.url} />
    </DashboardLayout>
  )
}
