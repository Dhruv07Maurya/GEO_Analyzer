import { NextRequest, NextResponse } from 'next/server';

// Mock Lighthouse response for demonstration
// In production, you would use: import lighthouse from 'lighthouse'; import chromeLauncher from 'chrome-launcher';
// But those require a real server with Chrome installed

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url || (!url.startsWith('https://') && !url.startsWith('http://'))) {
    return NextResponse.json(
      { error: 'Valid HTTPS URL required (e.g., https://example.com)' },
      { status: 400 }
    );
  }

  // Block private/internal URLs (security)
  const privateRegex = /(localhost|127\.0\.0\.1|192\.168|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|\.local)/i;
  if (privateRegex.test(url)) {
    return NextResponse.json(
      { error: 'Private or internal URLs are not allowed' },
      { status: 403 }
    );
  }

  try {
    // Call Python backend for real audit
    try {
      const backendResponse = await fetch('http://127.0.0.1:5000/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!backendResponse.ok) {
        throw new Error(`Backend error: ${backendResponse.statusText}`);
      }

      const backendData = await backendResponse.json();

      // If backend returns error
      if (backendData.error) {
        throw new Error(backendData.error);
      }

      // Return real data from backend
      return NextResponse.json(backendData.lighthouse);

    } catch (backendError) {
      console.error('Backend connection error:', backendError);
      // Fallback to mock if backend is offline? 
      // Ideally we should tell the user, but for now let's just return error
      return NextResponse.json(
        { error: 'Failed to connect to audit backend. Is Python server running on port 5000?' },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Audit error:', error);
    return NextResponse.json(
      { error: 'Audit failed. Please try again.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || (!url.startsWith('https://') && !url.startsWith('http://'))) {
      return NextResponse.json(
        { error: 'Valid HTTPS URL required' },
        { status: 400 }
      );
    }

    const privateRegex = /(localhost|127\.0\.0\.1|192\.168|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|\.local)/i;
    if (privateRegex.test(url)) {
      return NextResponse.json(
        { error: 'Private or internal URLs are not allowed' },
        { status: 403 }
      );
    }

    const mockResult = generateMockLighthouseReport(url);
    return NextResponse.json(mockResult);
  } catch (error) {
    console.error('Audit error:', error);
    return NextResponse.json(
      { error: 'Audit failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Generate realistic mock Lighthouse report
function generateMockLighthouseReport(url: string) {
  // Score variations based on domain for demo purposes
  const domain = new URL(url).hostname;
  const seed = domain.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

  const performanceScore = Math.floor((seed % 40) + 60) / 100; // 60-99 range
  const accessibilityScore = Math.floor((seed % 30) + 70) / 100; // 70-99 range
  const bestPracticesScore = Math.floor((seed % 35) + 65) / 100; // 65-99 range
  const seoScore = Math.floor((seed % 25) + 75) / 100; // 75-99 range

  return {
    categories: {
      performance: {
        id: 'performance',
        title: 'Performance',
        description: 'These metrics affect how users perceive the speed of your web app.',
        score: performanceScore,
        auditRefs: [],
      },
      accessibility: {
        id: 'accessibility',
        title: 'Accessibility',
        description: 'These checks ensure your app is accessible to all users.',
        score: accessibilityScore,
        auditRefs: [],
      },
      'best-practices': {
        id: 'best-practices',
        title: 'Best Practices',
        description: 'We recommend these practices to improve the quality of your web app.',
        score: bestPracticesScore,
        auditRefs: [],
      },
      seo: {
        id: 'seo',
        title: 'SEO',
        description: 'These checks ensure your app is optimized for search engines.',
        score: seoScore,
        auditRefs: [],
      },
    },
    audits: {
      'largest-contentful-paint': {
        id: 'largest-contentful-paint',
        title: 'Largest Contentful Paint',
        description: 'Largest Contentful Paint marks the time at which the largest text or image is painted.',
        score: Math.random() > 0.3 ? 0.9 : 0.6,
        displayValue: Math.random() > 0.3 ? '2.5 s' : '3.8 s',
        details: {
          type: 'numeric',
          value: Math.random() > 0.3 ? 2500 : 3800,
        },
      },
      'first-input-delay': {
        id: 'first-input-delay',
        title: 'First Input Delay',
        description: 'First Input Delay measures the response time when a user tries to interact with your page.',
        score: Math.random() > 0.2 ? 0.9 : 0.5,
        displayValue: Math.random() > 0.2 ? '45 ms' : '120 ms',
        details: {
          type: 'numeric',
          value: Math.random() > 0.2 ? 45 : 120,
        },
      },
      'cumulative-layout-shift': {
        id: 'cumulative-layout-shift',
        title: 'Cumulative Layout Shift',
        description: 'Cumulative Layout Shift measures the movement of visible elements within the viewport.',
        score: Math.random() > 0.4 ? 0.9 : 0.6,
        displayValue: Math.random() > 0.4 ? '0.08' : '0.15',
        details: {
          type: 'numeric',
          value: Math.random() > 0.4 ? 0.08 : 0.15,
        },
      },
      'time-to-first-byte': {
        id: 'time-to-first-byte',
        title: 'Time to First Byte',
        description: 'Time to First Byte identifies the time at which the page started being delivered.',
        score: Math.random() > 0.3 ? 0.9 : 0.7,
        displayValue: Math.random() > 0.3 ? '0.6 s' : '1.2 s',
        details: {
          type: 'numeric',
          value: Math.random() > 0.3 ? 600 : 1200,
        },
      },
      'render-blocking-resources': {
        id: 'render-blocking-resources',
        title: 'Eliminate render-blocking resources',
        description: 'Resources are blocking the first paint of your page.',
        score: Math.random() > 0.4 ? null : 0.4,
        details: {
          overallSavingsMs: Math.random() * 2000 + 1000,
        },
      },
      'unused-css': {
        id: 'unused-css',
        title: 'Remove unused CSS',
        description: 'Eliminate unused CSS to reduce file size and improve load times.',
        score: Math.random() > 0.5 ? null : 0.5,
        details: {
          overallSavingsMs: Math.random() * 1200 + 400,
        },
      },
      'unused-javascript': {
        id: 'unused-javascript',
        title: 'Remove unused JavaScript',
        description: 'Reduce the impact of unneeded JavaScript with code-splitting, lazy-loading.',
        score: Math.random() > 0.3 ? null : 0.3,
        details: {
          overallSavingsMs: Math.random() * 1500 + 800,
        },
      },
      'modern-image-formats': {
        id: 'modern-image-formats',
        title: 'Serve images in modern formats',
        description: 'Image formats like JPEG 2000 and WEBP often provide better compression than PNG or JPEG.',
        score: Math.random() > 0.4 ? null : 0.6,
        details: {
          overallSavingsMs: Math.random() * 800 + 200,
        },
      },
      'offscreen-images': {
        id: 'offscreen-images',
        title: 'Defer offscreen images',
        description: 'Defer loading images that are off-screen until the user scrolls near them.',
        score: Math.random() > 0.5 ? null : 0.5,
        details: {
          overallSavingsMs: Math.random() * 1000 + 300,
        },
      },
      'image-aspect-ratio': {
        id: 'image-aspect-ratio',
        title: 'Image elements have explicit width and height',
        description: 'Specify explicit dimensions for images to reduce layout shift.',
        score: Math.random() > 0.4 ? 0.9 : 0.4,
      },
      'meta-description': {
        id: 'meta-description',
        title: 'Document has a meta description',
        description: 'Meta descriptions may be used as snippets in search results to concisely summarize page content.',
        score: Math.random() > 0.2 ? 0.9 : 0.0,
      },
      'crawlable-anchors': {
        id: 'crawlable-anchors',
        title: 'Links are crawlable',
        description: 'Search engines may not crawl or follow links without an href attribute.',
        score: Math.random() > 0.3 ? 0.9 : 0.0,
      },
    },
    lighthouseVersion: '11.0.0',
    fetchTime: new Date().toISOString(),
  };
}
