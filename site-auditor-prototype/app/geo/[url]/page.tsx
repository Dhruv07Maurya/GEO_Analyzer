'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { LighthouseTab } from '@/components/lighthouse-tab';
import { GEOAnalysisTab } from '@/components/geo-analysis-tab';
import { LoadingState } from '@/components/loading-state';

interface AuditReport {
  categories: {
    performance: { score: number };
    accessibility: { score: number };
    'best-practices': { score: number };
    seo: { score: number };
  };
  audits: Record<string, any>;
}

interface GEOResult {
  answer_nugget: { score: number; explanation: string };
  extractability: { score: number; explanation: string };
  authority: { score: number; explanation: string };
  sentiment: { score: number; explanation: string };
  key_findings: string[];
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimatedBoost: number;
  }>;
  overall_analysis: string;
}

export default function GEOPage() {
  const params = useParams();
  const encodedUrl = params.url as string;
  const decodedUrl = decodeURIComponent(encodedUrl as string);

  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [geoResult, setGeoResult] = useState<GEOResult | null>(null);
  const [error, setError] = useState<string>('');
  const [pageContent, setPageContent] = useState<string>('');

  useEffect(() => {
    // Set random loading duration between 5-10 seconds
    const loadingDuration = Math.random() * 5000 + 5000;

    const runAudit = async () => {
      try {
        // Fetch Lighthouse audit
        const auditResponse = await fetch(
          `/api/audit?url=${encodeURIComponent(decodedUrl)}`
        );
        if (!auditResponse.ok) throw new Error('Failed to fetch Lighthouse data');

        const auditData = await auditResponse.json();
        setReport(auditData);

        // Fetch page content
        try {
          const contentResponse = await fetch(
            `/api/fetch-content?url=${encodeURIComponent(decodedUrl)}`
          );
          if (contentResponse.ok) {
            const contentData = await contentResponse.json();
            setPageContent(contentData.content);

            // Run GEO analysis
            const geoResponse = await fetch('/api/geo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                url: decodedUrl,
                content: contentData.content,
              }),
            });

            if (geoResponse.ok) {
              const geoData = await geoResponse.json();
              setGeoResult(geoData);
            }
          }
        } catch (e) {
          console.error('Content/GEO analysis error:', e);
        }

      } catch (err) {
        setError('Failed to run audit. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    runAudit();
  }, [decodedUrl]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Card className="p-6 border-red-500/20 bg-red-500/5">
            <p className="text-red-500">{error}</p>
          </Card>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* URL Display */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Audit results for:</p>
          <p className="text-xl font-semibold text-foreground break-all">{decodedUrl}</p>
        </div>

        {/* Tabs */}
        {report && (
          <Tabs defaultValue="lighthouse" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lighthouse">Lighthouse Performance</TabsTrigger>
              <TabsTrigger value="geo">GEO Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="lighthouse" className="space-y-6 mt-6">
              <LighthouseTab report={report} />
            </TabsContent>

            <TabsContent value="geo" className="space-y-6 mt-6">
              {geoResult ? (
                <GEOAnalysisTab result={geoResult} />
              ) : (
                <Card className="p-6 text-center text-muted-foreground">
                  <p>GEO analysis not available</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}

        {!report && (
          <Card className="p-6 text-center text-muted-foreground">
            <p>No audit data available</p>
          </Card>
        )}
      </main>
    </div>
  );
}
