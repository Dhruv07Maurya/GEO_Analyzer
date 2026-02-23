# Visual Guide - Site Auditor v2

## 🎨 User Experience Flow

```
┌─────────────────────────────────────────────────────────┐
│ localhost:4000 (Home Page)                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Analyze Your Website                                   │
│  Get comprehensive insights...                          │
│                                                         │
│  [https://example.com] [Analyze]                        │
│                                                         │
│  ✨ Animations:                                        │
│  • Title fades in (0.5s)                               │
│  • Description slides up (0.6s, 0.1s delay)            │
│  • Card slides up (0.6s, 0.2s delay)                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
           User clicks Analyze Button
                      ↓
┌─────────────────────────────────────────────────────────┐
│ URL Validation                                          │
├─────────────────────────────────────────────────────────┤
│ ✓ Format check (http/https)                            │
│ ✓ Private IP check (blocks localhost, 192.168.*)       │
│ ✓ Redirect to /geo/[encodedURL]                        │
└─────────────────────────────────────────────────────────┘
           Browser navigates to /geo/[url]
                      ↓
┌─────────────────────────────────────────────────────────┐
│ localhost:4000/geo/[url] (Loading Screen)               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│        ╱─────────╲                                       │
│       │     ●     │  ← Animated spinning rings          │
│        ╲─────────╱                                       │
│                                                         │
│      Analyzing your website                             │
│      Running Lighthouse audit and GEO analysis          │
│                                                         │
│            75%                                          │
│      ████████░░░░░ (Progress bar)                       │
│      Processing (5-10 seconds)                          │
│                                                         │
│      ✓ Fetching website content                         │
│      ✓ Running Lighthouse audit                         │
│      ✓ Analyzing with AI (Groq)                         │
│                                                         │
│  Animation Details:                                     │
│  • Outer ring: 3s rotation                             │
│  • Middle ring: 2s reverse rotation                     │
│  • Center dot: Pulse animation                         │
│  • Progress bar: Smooth transition                     │
│  • Steps: Slide up with stagger                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
      Backend processing (5-10 seconds random)
              ↓
   ┌─────────────────────────┐
   │ 1. Lighthouse Audit     │
   │    (30-90s)            │
   │    • Performance       │
   │    • Accessibility     │
   │    • Best Practices    │
   │    • SEO               │
   └─────────────────────────┘
              ↓
   ┌─────────────────────────┐
   │ 2. Fetch Content        │
   │    (2-5s)              │
   │    • Strip HTML         │
   │    • Clean text         │
   │    • Extract meta       │
   └─────────────────────────┘
              ↓
   ┌─────────────────────────┐
   │ 3. Groq GEO Analysis    │
   │    (2-5s)              │
   │    • Analyze signals    │
   │    • Generate scores    │
   │    • Create recs        │
   └─────────────────────────┘
              ↓
        Results Ready
          (Timer ends)
                      ↓
┌─────────────────────────────────────────────────────────┐
│ localhost:4000/geo/[url] (Results Page)                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Audit results for:                    [Run New Audit]   │
│ https://example.com                                     │
│                                                         │
│ ┌──────────────┬──────────────┐                         │
│ │ Lighthouse   │ GEO Analysis │  ← Tab switching        │
│ │ Performance  │              │                         │
│ └──────────────┴──────────────┘                         │
│                                                         │
│ ═══════════════════════════════════════════════════     │
│                                                         │
│ LIGHTHOUSE TAB:                                        │
│                                                         │
│ Category Scores:                                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ 89      │ │ 92      │ │ 88      │ │ 95      │      │
│  │Performance│Accessibility│Best    │SEO          │      │
│  └─────────┘ └─────────┘ │Practices│ └─────────┘      │
│                           └─────────┘                  │
│                                                         │
│ Core Web Vitals:                                       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                   │
│  │ 2.5s │ │ 45ms │ │ 0.08 │ │ 0.6s │                   │
│  │ LCP  │ │ FID  │ │ CLS  │ │ TTFB │                   │
│  └──────┘ └──────┘ └──────┘ └──────┘                   │
│                                                         │
│ Top Opportunities:                                     │
│  ▼ Eliminate render-blocking resources                 │
│    Potential savings: 2.3s                             │
│  ▼ Reduce Largest Contentful Paint latency             │
│    Potential savings: 2.0s                             │
│                                                         │
│ ═══════════════════════════════════════════════════     │
│                                                         │
│ GEO ANALYSIS TAB:                                      │
│                                                         │
│ Overall GEO Score:        Analysis Summary:            │
│     ┌───────┐             Page is well-optimized...    │
│     │  78   │                                          │
│     └───────┘             GEO Signals:                 │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │ Answer Nugget              Score: 85         │      │
│  │ First paragraph clearly answers the topic    │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │ Extractability              Score: 72         │      │
│  │ HTML structure good for AI parsing           │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │ Authority                   Score: 90         │      │
│  │ Multiple authoritative citations             │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │ Sentiment                   Score: 88         │      │
│  │ Objective, factual tone                      │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
│ Key Findings:                                          │
│  ✓ Clear article structure with semantic HTML         │
│  ✓ Good use of structured data                        │
│  ✓ Multiple authoritative citations                   │
│                                                         │
│ Recommendations:                                       │
│  • Add Schema Markup (High priority, +15%)            │
│  • Improve Mobile Layout (Medium, +8%)                │
│  • More Objective Language (Medium, +10%)             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Data Processing Pipeline

```
Frontend                    Backend                  External APIs
──────────                  ───────                  ──────────────

1. User Input
   [URL Input] ────────────→ Validation
                            (Format + Private IP)
                                  ↓
2. Navigation
   [Redirect] ────────────→ /geo/[url]
                            Route Handler
                                  ↓
3. Load Audits        ┌─────────────────────┐
   (In Parallel)      │ 1. Lighthouse API   │──→ Google Lighthouse
                      │ /api/audit          │
                      └─────────────────────┘
                                  ↓
4. Fetch Content      ┌─────────────────────┐
                      │ 2. Content Fetch    │──→ Target Website
                      │ /api/fetch-content  │
                      └─────────────────────┘
                                  ↓
5. Analyze with AI    ┌─────────────────────┐
                      │ 3. GEO Analysis     │──→ Groq API
                      │ /api/geo            │    (mixtral-8x7b)
                      └─────────────────────┘
                                  ↓
6. Display Results
   [Loading complete]
   [Fetch results from window.__auditData]
   [Render Lighthouse Tab]
   [Render GEO Tab]
```

## 📊 GEO Score Calculation

```
Answer Nugget Score (0-100)
    │
    ├─ Analyzes first 100 words
    ├─ Checks if it directly answers topic
    └─ Color code: Red (0-50) Yellow (50-75) Green (75-100)

Extractability Score (0-100)
    │
    ├─ Evaluates HTML structure
    ├─ Checks for tables, lists, semantic HTML
    ├─ Analyzes for schema markup
    └─ Color code: Red Yellow Green

Authority Score (0-100)
    │
    ├─ Counts external links
    ├─ Checks for .edu, .gov, major publishers
    ├─ Verifies source quality
    └─ Color code: Red Yellow Green

Sentiment Score (0-100)
    │
    ├─ Analyzes tone (objective vs marketing)
    ├─ Checks for factual language
    ├─ Evaluates credibility signals
    └─ Color code: Red Yellow Green
                  ↓
            Overall GEO Score
        = (Sum of all scores) / 4
```

## 🎬 Animation Timeline

```
Timeline (seconds)
0.0s    │ [User clicks Analyze]
        │
0.1s    │ ↓ Title fades in
        │ .animate-fade-in (0.5s)
        │
0.2s    │ ↓ Description slides up
0.5s    │ .animate-slide-up-delay-1 (0.6s, 0.1s delay)
        │
0.3s    │ ↓ Card slides up
0.8s    │ .animate-slide-up-delay-2 (0.6s, 0.2s delay)
        │
        │ [User enters URL, clicks Analyze]
        │
1.0s    │ [Navigation to /geo/[url]]
        │ [Loading page appears]
        │
1.5s    │ ↓ Loading screen fades in
        │ .animate-fade-in (0.5s)
        │
2.0s    │ ↓ Rings start rotating
        │ Outer: 3s rotation
        │ Middle: 2s reverse rotation
        │ Center: Pulse animation
        │
2.5s    │ ↓ Steps slide in (staggered)
        │ Step 1: 0.0s delay
        │ Step 2: 0.1s delay
        │ Step 3: 0.2s delay
        │
5-10s   │ [Random loading duration]
        │ [Progress bar fills]
        │
10-15s  │ [Results ready]
        │ [Content fades in]
        │ [Tabs available for interaction]
```

## 🎯 Color Coding System

### Score Colors (GEO Signals)

```
Green  (75-100) ✓ Good / Strong signal
├─ Text: text-green-500
├─ BG: bg-green-500/10
└─ Example: 92 score

Yellow (50-75)  ⚠ Warning / Moderate
├─ Text: text-yellow-500
├─ BG: bg-yellow-500/10
└─ Example: 68 score

Red    (0-50)   ✗ Poor / Weak signal
├─ Text: text-red-500
├─ BG: bg-red-500/10
└─ Example: 38 score
```

### Priority Colors (Recommendations)

```
High    → Red accent    + urgent styling
Medium  → Yellow accent + standard styling
Low     → Gray accent   + low priority styling
```

## 📱 Responsive Breakpoints

```
Mobile (<640px)
├─ Single column layout
├─ Full-width input field
├─ Stacked score cards
└─ Bottom button

Tablet (640-1024px)
├─ 2-column grid for scores
├─ Side-by-side input
└─ Optimized spacing

Desktop (1024px+)
├─ Full layout
├─ 4-column score grid
└─ Max-width container
```

## 🔐 Security Flow

```
User Input
    ↓
URL Validation (Frontend + Backend)
├─ Format check: must be http/https
├─ Localhost block: ❌ 127.0.0.1, localhost
├─ Private IP block: ❌ 192.168.*, 10.*
├─ Local network block: ❌ *.local
└─ Pass: ✓ Public URLs only
    ↓
Content Fetch (Backend)
├─ 10-second timeout (prevent DoS)
├─ User-Agent header (bot identification)
├─ HTML cleaning (remove malicious scripts)
└─ Text extraction (safe output)
    ↓
API Key Protection
├─ Stored in .env.local (not in code)
├─ Never exposed to frontend
├─ Only used server-side
└─ Secure transmission to Groq
    ↓
Response Processing
├─ JSON validation
├─ Error handling
└─ Safe output rendering
```

---

**Visual Guide Complete** ✨

This guide shows the complete user experience, data flow, animations, and visual design of Site Auditor v2.
