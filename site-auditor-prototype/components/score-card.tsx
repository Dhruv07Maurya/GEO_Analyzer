'use client';

import { Card } from '@/components/ui/card';

interface ScoreCardProps {
  label: string;
  score: number;
  maxScore?: number;
}

export function ScoreCard({ label, score, maxScore = 100 }: ScoreCardProps) {
  const percentage = (score / maxScore) * 100;
  let color = 'text-red-500';
  let bgColor = 'bg-red-500/20';

  if (percentage >= 90) {
    color = 'text-green-500';
    bgColor = 'bg-green-500/20';
  } else if (percentage >= 50) {
    color = 'text-yellow-500';
    bgColor = 'bg-yellow-500/20';
  }

  return (
    <Card className="flex flex-col items-center justify-center p-6 text-center">
      <p className="text-sm font-medium text-muted-foreground mb-4">{label}</p>
      <div className={`relative w-24 h-24 rounded-full ${bgColor} flex items-center justify-center`}>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground/20"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${(percentage / 100) * 282.6} 282.6`}
            strokeLinecap="round"
            className={`${color} transition-all duration-500`}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <span className={`absolute text-3xl font-bold ${color}`}>{Math.round(score)}</span>
      </div>
    </Card>
  );
}
