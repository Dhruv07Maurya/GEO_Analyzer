'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

export function LoadingState() {
  const [displayTime, setDisplayTime] = useState<string>('');

  useEffect(() => {
    // Calculate random duration between 5-10 seconds
    const duration = Math.random() * 5000 + 5000;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      // Cap at 90% until actually finished
      const progress = Math.min((elapsed / duration) * 100, 90);
      setDisplayTime(`${Math.round(progress)}%`);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Main Loading Card */}
        <Card className="p-12 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <div className="space-y-8">
            {/* Animated Loader */}
            <div className="flex justify-center">
              <div className="relative w-24 h-24">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-spin" style={{ animationDuration: '3s' }} />
                {/* Middle ring */}
                <div
                  className="absolute inset-2 rounded-full border-2 border-transparent border-t-primary animate-spin"
                  style={{ animationDuration: '2s', animationDirection: 'reverse' }}
                />
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              </div>
            </div>

            {/* Text and Progress */}
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-foreground animate-pulse">
                Analyzing your website
              </h3>
              <p className="text-sm text-muted-foreground">
                Running Lighthouse audit and GEO analysis
              </p>
              <div className="pt-4">
                <div className="text-3xl font-bold text-primary">{displayTime}</div>
                <p className="text-xs text-muted-foreground mt-2">Processing (30-60 seconds)</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-primary/10 rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: displayTime ? parseInt(displayTime) + '%' : '0%' }}
              />
            </div>
          </div>
        </Card>

        {/* Loading Steps */}
        <div className="space-y-3">
          <div className="flex gap-3 items-start animate-slide-up" style={{ animationDelay: '0s' }}>
            <div className="w-2 h-2 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">Fetching website content</p>
          </div>
          <div className="flex gap-3 items-start animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-2 h-2 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">Running Lighthouse audit</p>
          </div>
          <div className="flex gap-3 items-start animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-2 h-2 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">Analyzing with AI (Groq)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
