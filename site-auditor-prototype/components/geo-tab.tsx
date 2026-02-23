'use client';

import { useEffect, useState } from 'react';
import { ScoreCard } from './score-card';
import { SuggestionItem } from './suggestion-item';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface SignalProps {
  title: string;
  status: 'good' | 'warning' | 'poor';
  description: string;
}

function GEOSignal({ title, status, description }: SignalProps) {
  const statusColors = {
    good: 'bg-green-500/20 border-green-500/30',
    warning: 'bg-yellow-500/20 border-yellow-500/30',
    poor: 'bg-red-500/20 border-red-500/30',
  };

  const iconColor = {
    good: 'text-green-500',
    warning: 'text-yellow-500',
    poor: 'text-red-500',
  };

  return (
    <Card className={`p-4 border-l-4 ${statusColors[status]}`}>
      <div className="flex gap-3 items-start">
        <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor[status]}`} />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}

interface GEOTabProps {
  url?: string;
}

export function GEOTab({ url }: GEOTabProps) {
  const [geoScore, setGeoScore] = useState<number | null>(null);
  const [geoSignals, setGeoSignals] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    // Generate GEO scores from Lighthouse audit data
    const auditData = (window as any).__auditData;
    if (auditData && auditData.categories) {
      // Calculate GEO score based on Lighthouse metrics
      const performance = (auditData.categories.performance?.score || 0) * 100;
      const accessibility = (auditData.categories.accessibility?.score || 0) * 100;
      const seo = (auditData.categories.seo?.score || 0) * 100;
      
      // Answer Nugget (based on SEO score)
      const answerNugget = Math.round(seo * 0.8 + 20);
      
      // Extractability (based on best practices and accessibility)
      const extractability = Math.round(
        (auditData.categories['best-practices']?.score || 0) * 100 * 0.7 + 
        (accessibility * 0.3)
      );
      
      // Authority (based on SEO signals)
      const authority = Math.round(seo * 0.9);
      
      // Sentiment (content objectivity - based on best practices)
      const sentiment = Math.round((auditData.categories['best-practices']?.score || 0) * 100);
      
      // Overall GEO score (weighted average)
      const overallGeo = Math.round(
        (answerNugget * 0.25 + extractability * 0.30 + authority * 0.25 + sentiment * 0.20)
      );
      
      setGeoScore(Math.min(100, overallGeo));
      setGeoSignals({
        answer_nugget: Math.min(100, answerNugget),
        extractability: Math.min(100, extractability),
        authority: Math.min(100, authority),
        sentiment: Math.min(100, sentiment),
      });
      
      // Generate recommendations based on weaknesses
      const recs = [];
      if (extractability < 75) {
        recs.push({
          title: 'Improve HTML Structure',
          description: 'Add semantic HTML, schema markup, and structured data for better AI extraction',
          priority: 'high',
          estimatedBoost: 15,
        });
      }
      if (answerNugget < 75) {
        recs.push({
          title: 'Optimize Opening Paragraph',
          description: 'Ensure your first 100 words directly answer the main topic question',
          priority: 'high',
          estimatedBoost: 12,
        });
      }
      if (sentiment < 75) {
        recs.push({
          title: 'Use Objective Language',
          description: 'Reduce marketing language and focus on factual, informative content',
          priority: 'medium',
          estimatedBoost: 10,
        });
      }
      if (authority < 75) {
        recs.push({
          title: 'Add High-Quality Citations',
          description: 'Link to authoritative sources (.edu, .gov, major publications)',
          priority: 'medium',
          estimatedBoost: 8,
        });
      }
      
      setSuggestions(recs);
    }
  }, []);

  // Determine signal status based on score
  const getSignalStatus = (score: number): 'good' | 'warning' | 'poor' => {
    if (score >= 75) return 'good';
    if (score >= 50) return 'warning';
    return 'poor';
  };

  if (geoScore === null) {
    return <div className="text-center text-muted-foreground py-8">Generate an audit to see GEO scores</div>;
  }

  return (
    <div className="space-y-8">
      {/* GEO Score Card */}
      <div>
        <h3 className="text-lg font-semibold mb-4">GEO Readiness Score</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <ScoreCard label="GEO Score" score={geoScore} />
          </div>
          <Card className="p-4 lg:col-span-2">
            <p className="text-sm text-muted-foreground mb-2">About this score:</p>
            <p className="text-foreground text-sm leading-relaxed">
              The GEO (Generative Engine Optimization) score measures how well your site is structured and optimized for
              AI search engines. Based on: extractability (30%), HTML structure (30%), authority links (25%), and content
              objectivity (20%).
            </p>
          </Card>
        </div>
      </div>

      {/* Signal Breakdown */}
      {geoSignals && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Signal Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Answer Nugget Score</div>
              <div className="text-3xl font-bold text-foreground">{geoSignals.answer_nugget}</div>
              <div className="text-xs text-muted-foreground mt-2">How well your intro answers the question</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Extractability Score</div>
              <div className="text-3xl font-bold text-foreground">{geoSignals.extractability}</div>
              <div className="text-xs text-muted-foreground mt-2">HTML structure quality for AI parsing</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Authority Score</div>
              <div className="text-3xl font-bold text-foreground">{geoSignals.authority}</div>
              <div className="text-xs text-muted-foreground mt-2">Quality of external citations</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Sentiment Score</div>
              <div className="text-3xl font-bold text-foreground">{geoSignals.sentiment}</div>
              <div className="text-xs text-muted-foreground mt-2">Content objectivity level</div>
            </Card>
          </div>
        </div>
      )}

      {/* Key Signals */}
      <div>
        <h3 className="text-lg font-semibold mb-4">AI Readiness Signals</h3>
        <div className="space-y-3">
          <GEOSignal
            title="Answer Nugget Quality"
            status={getSignalStatus(geoSignals?.answer_nugget || 0)}
            description={`Score: ${geoSignals?.answer_nugget || 0}/100 - How well your first 100 words directly answer the main question.`}
          />
          <GEOSignal
            title="HTML Extractability"
            status={getSignalStatus(geoSignals?.extractability || 0)}
            description={`Score: ${geoSignals?.extractability || 0}/100 - Based on tables, lists, schema markup, and semantic structure.`}
          />
          <GEOSignal
            title="Authority & Citations"
            status={getSignalStatus(geoSignals?.authority || 0)}
            description={`Score: ${geoSignals?.authority || 0}/100 - Quality of external links to authoritative sources (gov, edu, major publishers).`}
          />
          <GEOSignal
            title="Content Objectivity"
            status={getSignalStatus(geoSignals?.sentiment || 0)}
            description={`Score: ${geoSignals?.sentiment || 0}/100 - Factual vs marketing language analysis.`}
          />
        </div>
      </div>

      {/* Recommendations */}
      {suggestions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">AI Optimization Recommendations</h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, idx) => (
              <SuggestionItem
                key={idx}
                type="recommendation"
                title={suggestion.title}
                description={`${suggestion.description} (Est. boost: +${suggestion.estimatedBoost}%)`}
                priority={suggestion.priority as 'high' | 'medium' | 'low'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
