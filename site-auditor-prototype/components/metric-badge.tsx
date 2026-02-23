'use client';

import { Card } from '@/components/ui/card';

interface MetricBadgeProps {
  label: string;
  value: string;
  unit?: string;
}

export function MetricBadge({ label, value, unit }: MetricBadgeProps) {
  return (
    <Card className="p-4 text-center">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <p className="text-2xl font-bold text-foreground">
        {value}
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </p>
    </Card>
  );
}
