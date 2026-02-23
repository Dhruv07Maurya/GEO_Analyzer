'use client';

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SuggestionItemProps {
  title: string;
  description: string;
  savings?: string;
  priority?: 'high' | 'medium' | 'low';
  type?: 'opportunity' | 'recommendation';
}

export function SuggestionItem({
  title,
  description,
  savings,
  priority = 'medium',
  type = 'opportunity',
}: SuggestionItemProps) {
  const priorityColor =
    priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-yellow-500' : 'text-blue-500';

  const icon = type === 'recommendation' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />;

  return (
    <Card className="p-4 border-l-4 border-l-primary/50">
      <div className="flex gap-3 items-start">
        <div className={`mt-1 flex-shrink-0 ${priorityColor}`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          {savings && (
            <p className={`text-xs font-medium ${priorityColor}`}>
              Potential savings: <span className="font-bold">{savings}</span>
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
