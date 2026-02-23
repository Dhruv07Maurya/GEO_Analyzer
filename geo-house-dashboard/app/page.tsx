'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { DashboardHome, GeoHousePage } from '@/components/dashboard/pages'

export default function Home() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardHome />
      case 'geo-house':
        return <div className="text-center text-muted-foreground">GEO-house view - Navigate from Dashboard</div>
      default:
        return <DashboardHome />
    }
  }

  return (
    <DashboardLayout activePage={activePage} onPageChange={setActivePage}>
      {renderPage()}
    </DashboardLayout>
  )
}
