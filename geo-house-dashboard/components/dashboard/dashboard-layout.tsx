'use client'

import React from "react"

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'

interface DashboardLayoutProps {
  children: React.ReactNode
  activePage: string
  onPageChange: (page: string) => void
}

export function DashboardLayout({ children, activePage, onPageChange }: DashboardLayoutProps) {
  const [lastRun] = useState<Date>(new Date())

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activePage={activePage} onPageChange={onPageChange} />
      <div className="flex flex-1 flex-col overflow-hidden ml-[300px]">
        <Header activePage={activePage} lastRun={lastRun} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
