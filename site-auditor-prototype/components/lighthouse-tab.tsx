'use client';

import { ScoreCard } from './score-card';
import { MetricBadge } from './metric-badge';
import { SuggestionItem } from './suggestion-item';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface LighthouseReport {
  categories: {
    performance: { score: number };
    accessibility: { score: number };
    'best-practices': { score: number };
    seo: { score: number };
  };
  audits: Record<string, any>;
}

interface LighthouseTabProps {
  report: LighthouseReport | null;
}

// Helper to extract numeric value from display strings like "2.5 s" or "45 ms"
function extractMetricValue(displayValue: string): string {
  if (!displayValue) return '0';
  const match = displayValue.match(/^([\d.]+)/);
  return match ? match[1] : displayValue;
}

export function LighthouseTab({ report }: LighthouseTabProps) {
  if (!report) return null;

  const categories = [
    { key: 'performance', label: 'Performance' },
    { key: 'accessibility', label: 'Accessibility' },
    { key: 'best-practices', label: 'Best Practices' },
    { key: 'seo', label: 'SEO' },
  ];

  // Extract opportunities
  const opportunities = Object.entries(report.audits)
    .filter(([_, audit]: [string, any]) => audit.score !== null && audit.score < 1)
    .map(([_, audit]: [string, any]) => ({
      title: audit.title,
      description: audit.description,
      savings: audit.details?.overallSavingsMs
        ? `${(audit.details.overallSavingsMs / 1000).toFixed(1)}s`
        : undefined,
    }))
    .sort((a, b) => {
      const aSavings = a.savings ? parseFloat(a.savings) : 0;
      const bSavings = b.savings ? parseFloat(b.savings) : 0;
      return bSavings - aSavings;
    })
    .slice(0, 8);

  return (
    <div className="space-y-10">
      {/* Score Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          <h2 className="text-2xl font-bold text-foreground">Performance Audit</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map(({ key, label }) => (
            <ScoreCard
              key={key}
              label={label}
              score={(report.categories[key as keyof typeof report.categories].score || 0) * 100}
            />
          ))}
        </div>
      </div>

      {/* Core Metrics */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          <h3 className="text-xl font-semibold text-foreground">Core Web Vitals</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricBadge 
            label="LCP" 
            value={extractMetricValue(report.audits['largest-contentful-paint']?.displayValue || '2.5 s')} 
            unit="s" 
          />
          <MetricBadge 
            label="FID" 
            value={extractMetricValue(report.audits['first-input-delay']?.displayValue || '45 ms')} 
            unit="ms" 
          />
          <MetricBadge 
            label="CLS" 
            value={extractMetricValue(report.audits['cumulative-layout-shift']?.displayValue || '0.08')} 
            unit="" 
          />
          <MetricBadge 
            label="TTFB" 
            value={extractMetricValue(report.audits['time-to-first-byte']?.displayValue || '0.6 s')} 
            unit="s" 
          />
        </div>
      </div>

      {/* Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          <h3 className="text-xl font-semibold text-foreground">Optimization Opportunities</h3>
        </div>
        <Accordion type="single" collapsible className="space-y-2">
          {opportunities.map((opp, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border border-blue-500/20 rounded-lg px-4 hover:border-blue-500/40 transition-colors">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex-1 text-left">
                  <p className="font-semibold text-foreground">{opp.title}</p>
                  {opp.savings && (
                    <p className="text-xs text-green-500 font-medium">
                      Potential savings: {opp.savings}
                    </p>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                {opp.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
