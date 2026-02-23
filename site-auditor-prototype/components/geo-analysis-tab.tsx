'use client';

import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { ScoreCard } from './score-card';
import { SuggestionItem } from './suggestion-item';

interface Signal {
  score: number;
  explanation: string;
}

interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedBoost: number;
}

interface GEOResult {
  answer_nugget: Signal;
  extractability: Signal;
  authority: Signal;
  sentiment: Signal;
  key_findings: string[];
  recommendations: Recommendation[];
  overall_analysis: string;
}

interface GEOAnalysisTabProps {
  result: GEOResult;
}

function SignalCard({
  title,
  score,
  explanation,
}: {
  title: string;
  score: number;
  explanation: string;
}) {
  const getColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getBgColor = (score: number) => {
    if (score >= 75) return 'bg-green-500/8 border-green-500/30 hover:border-green-500/50';
    if (score >= 50) return 'bg-amber-500/8 border-amber-500/30 hover:border-amber-500/50';
    return 'bg-red-500/8 border-red-500/30 hover:border-red-500/50';
  };

  const getProgressColor = (score: number) => {
    if (score >= 75) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (score >= 50) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-rose-500';
  };

  return (
    <Card className={`p-5 border transition-all hover:shadow-md ${getBgColor(score)}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground/90">{explanation}</p>
        </div>
        <div className={`text-4xl font-bold ${getColor(score)} flex-shrink-0`}>
          {score}
        </div>
      </div>
      <div className="w-full bg-background/30 rounded-full h-1 overflow-hidden">
        <div
          className={`h-full rounded-full ${getProgressColor(score)} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </Card>
  );
}

export function GEOAnalysisTab({ result }: GEOAnalysisTabProps) {
  // Calculate overall GEO score
  const overallScore = Math.round(
    (result.answer_nugget.score +
      result.extractability.score +
      result.authority.score +
      result.sentiment.score) /
      4
  );

  return (
    <div className="space-y-10">
      {/* Overall Score and Analysis */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          <h2 className="text-2xl font-bold text-foreground">GEO Readiness Analysis</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ScoreCard label="Overall GEO Score" score={overallScore} />
          </div>
          <Card className="p-6 lg:col-span-2 bg-gradient-to-br from-primary/5 to-transparent border-primary/20 hover:border-primary/40 transition-colors">
            <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">Analysis Summary</p>
            <p className="text-foreground text-sm leading-relaxed text-pretty">
              {result.overall_analysis}
            </p>
          </Card>
        </div>
      </div>

      {/* Signal Scores */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          <h3 className="text-xl font-semibold text-foreground">Performance Signals</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SignalCard
            title="Answer Nugget"
            score={result.answer_nugget.score}
            explanation={result.answer_nugget.explanation}
          />
          <SignalCard
            title="Extractability"
            score={result.extractability.score}
            explanation={result.extractability.explanation}
          />
          <SignalCard
            title="Authority"
            score={result.authority.score}
            explanation={result.authority.explanation}
          />
          <SignalCard
            title="Sentiment"
            score={result.sentiment.score}
            explanation={result.sentiment.explanation}
          />
        </div>
      </div>

      {/* Key Findings */}
      {result.key_findings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            <h3 className="text-xl font-semibold text-foreground">Key Findings</h3>
          </div>
          <div className="space-y-3">
            {result.key_findings.map((finding, idx) => (
              <Card key={idx} className="p-4 flex gap-4 items-start bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">{finding}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            <h3 className="text-xl font-semibold text-foreground">Optimization Recommendations</h3>
          </div>
          <div className="space-y-3">
            {result.recommendations.map((rec, idx) => (
              <SuggestionItem
                key={idx}
                type="recommendation"
                title={rec.title}
                description={`${rec.description} (Est. impact: +${rec.estimatedBoost}%)`}
                priority={rec.priority}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
