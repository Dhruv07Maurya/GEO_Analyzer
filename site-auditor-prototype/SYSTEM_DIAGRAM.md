# Site Auditor - System Architecture Diagrams

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                                │
│                     http://localhost:3000                            │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │              FRONTEND (Next.js + React)                        │ │
│  │                                                                │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │  Page Component (/app/page.tsx)                          │ │ │
│  │  │  - Input form for URL                                   │ │ │
│  │  │  - Calls backend API                                    │ │ │
│  │  │  - Manages loading state                                │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  │                            ↕ HTTP                             │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │  Lighthouse Tab              GEO Tab                      │ │ │
│  │  │  - Shows real scores         - Shows GEO breakdown       │ │ │
│  │  │  - Core Web Vitals           - Suggestions               │ │ │
│  │  │  - Performance audit         - AI Signals                │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                          ↕ POST /api/audit
                    JSON with URL parameter
                                 │
                  ┌──────────────┴──────────────┐
                  ▼                             ▼
         ┌─────────────────┐         ┌──────────────────┐
         │  HTTP Request   │         │  Validation      │
         │  (Fetch API)    │         │  - Public URL?   │
         │                 │         │  - HTTPS/HTTP?   │
         │  {url: "..."}   │         │  - Not private?  │
         └─────────────────┘         └──────────────────┘
                  │                         │
                  └──────────────┬──────────┘
                                 ▼
    ┌────────────────────────────────────────────────────────────────┐
    │                  BACKEND (Python Flask)                        │
    │              http://localhost:5000                             │
    │                                                                │
    │  ┌──────────────────────────────────────────────────────────┐ │
    │  │  API Route Handler: POST /api/audit                      │ │
    │  │                                                          │ │
    │  │  Input: {url: "https://example.com"}                   │ │
    │  └──────────────────────────────────────────────────────────┘ │
    │                          ↓                                     │
    │  ┌──────────────────────────────────────────────────────────┐ │
    │  │  STEP 1: Fetch Page Content                             │ │
    │  │  ────────────────────────────────────────────────────── │ │
    │  │  requests.get(url, timeout=10)                          │ │
    │  │  → Downloads HTML/CSS/JavaScript                        │ │
    │  │  → Returns: <html>, <text content>                      │ │
    │  └──────────────────────────────────────────────────────────┘ │
    │                          ↓                                     │
    │  ┌──────────────────────────────────────────────────────────┐ │
    │  │  STEP 2: Run Lighthouse Audit                           │ │
    │  │  ────────────────────────────────────────────────────── │ │
    │  │  subprocess.run(["lighthouse", url, ...])               │ │
    │  │                                                          │ │
    │  │  Outputs: 4 Category Scores                             │ │
    │  │    - Performance: 0-100                                 │ │
    │  │    - Accessibility: 0-100                               │ │
    │  │    - Best Practices: 0-100                              │ │
    │  │    - SEO: 0-100                                         │ │
    │  │                                                          │ │
    │  │  And Core Web Vitals:                                   │ │
    │  │    - LCP (Largest Contentful Paint)                     │ │
    │  │    - FID (First Input Delay)                            │ │
    │  │    - CLS (Cumulative Layout Shift)                      │ │
    │  └──────────────────────────────────────────────────────────┘ │
    │                          ↓                                     │
    │  ┌──────────────────────────────────────────────────────────┐ │
    │  │  STEP 3: Parse HTML with BeautifulSoup                  │ │
    │  │  ────────────────────────────────────────────────────── │ │
    │  │  soup = BeautifulSoup(html, "html.parser")              │ │
    │  │                                                          │ │
    │  │  Extract:                                                │ │
    │  │    - Number of tables                                   │ │
    │  │    - Number of lists                                    │ │
    │  │    - Schema markup (JSON-LD)                            │ │
    │  │    - Heading structure                                  │ │
    │  │    - Outbound links                                     │ │
    │  │    - First 100 words of content                         │ │
    │  └──────────────────────────────────────────────────────────┘ │
    │                          ↓                                     │
    │  ┌──────────────────────────────────────────────────────────┐ │
    │  │  STEP 4: Calculate GEO Signals                           │ │
    │  │  ────────────────────────────────────────────────────── │ │
    │  │                                                          │ │
    │  │  [4.A] Answer Nugget Score                              │ │
    │  │  ─────────────────────────────                          │ │
    │  │    Input: First 100 words of text                       │ │
    │  │    Analysis:                                             │ │
    │  │      • Word count 40-80? → +50                         │ │
    │  │      • 2+ sentences? → +30                              │ │
    │  │      • Marketing words? → -5 each                       │ │
    │  │    Output: 0-100 score                                  │ │
    │  │                                                          │ │
    │  │  [4.B] Extractability Score                             │ │
    │  │  ────────────────────────────                           │ │
    │  │    Input: HTML structure                                │ │
    │  │    Analysis:                                             │ │
    │  │      • Tables: +20 each (max 40)                        │ │
    │  │      • Lists: +10 each (max 30)                         │ │
    │  │      • Schema markup: +30                               │ │
    │  │      • Headings: +3 each (max 20)                       │ │
    │  │    Output: 0-100 score                                  │ │
    │  │                                                          │ │
    │  │  [4.C] Authority Score                                  │ │
    │  │  ──────────────────────                                 │ │
    │  │    Input: Outbound links                                │ │
    │  │    Analysis:                                             │ │
    │  │      • Links to .gov, .edu, Wikipedia                   │ │
    │  │      • Links to major publishers                        │ │
    │  │      • Ratio calculation                                │ │
    │  │    Output: 0-100 score                                  │ │
    │  │                                                          │ │
    │  │  [4.D] Sentiment Score                                  │ │
    │  │  ──────────────────────                                 │ │
    │  │    Input: Page content                                  │ │
    │  │    Analysis:                                             │ │
    │  │      • Marketing words detection                        │ │
    │  │      • Objectivity assessment                           │ │
    │  │      • LLM sentiment check (optional)                   │ │
    │  │    Output: 0-100 score                                  │ │
    │  │                                                          │ │
    │  └──────────────────────────────────────────────────────────┘ │
    │                          ↓                                     │
    │  ┌──────────────────────────────────────────────────────────┐ │
    │  │  STEP 5: Combine into GEO Score                          │ │
    │  │  ────────────────────────────────────────────────────── │ │
    │  │                                                          │ │
    │  │  GEO = (Answer × 0.25) +                                │ │
    │  │        (Extractability × 0.30) +                        │ │
    │  │        (Authority × 0.25) +                             │ │
    │  │        (Sentiment × 0.20)                               │ │
    │  │                                                          │ │
    │  │  Result: 0-100 final score                              │ │
    │  └──────────────────────────────────────────────────────────┘ │
    │                          ↓                                     │
    │  ┌──────────────────────────────────────────────────────────┐ │
    │  │  STEP 6: Generate Suggestions                           │ │
    │  │  ────────────────────────────────────────────────────── │ │
    │  │                                                          │ │
    │  │  if tables == 0:                                        │ │
    │  │    → Add "Add Comparison Table" suggestion              │ │
    │  │                                                          │ │
    │  │  if answer_nugget < 50:                                 │ │
    │  │    → Add "Add Quick Answer Section"                     │ │
    │  │                                                          │ │
    │  │  if schemas == 0:                                       │ │
    │  │    → Add "Add Schema Markup" suggestion                 │ │
    │  │                                                          │ │
    │  │  if sentiment < 60:                                     │ │
    │  │    → Add "Use Neutral Language" suggestion              │ │
    │  │                                                          │ │
    │  │  Output: Array of suggestions with priority             │ │
    │  └──────────────────────────────────────────────────────────┘ │
    │                          ↓                                     │
    │  ┌──────────────────────────────────────────────────────────┐ │
    │  │  STEP 7: Prepare JSON Response                          │ │
    │  │  ────────────────────────────────────────────────────── │ │
    │  │                                                          │ │
    │  │  {                                                       │ │
    │  │    url: "https://example.com",                         │ │
    │  │    timestamp: "2024-01-31T10:00:00",                   │ │
    │  │    lighthouse: {                                        │ │
    │  │      categories: {...},                                │ │
    │  │      metrics: {...}                                    │ │
    │  │    },                                                   │ │
    │  │    geoScore: 71,                                       │ │
    │  │    geoSignals: {                                       │ │
    │  │      answer_nugget: 65,                                │ │
    │  │      extractability: 78,                               │ │
    │  │      authority: 70,                                    │ │
    │  │      sentiment: 68                                     │ │
    │  │    },                                                   │ │
    │  │    suggestions: [...]                                  │ │
    │  │  }                                                      │ │
    │  │                                                          │ │
    │  └──────────────────────────────────────────────────────────┘ │
    └────────────────────────────────────────────────────────────────┘
                          ↓ HTTP Response
                    JSON with results
                                 │
    ┌────────────────────────────┴──────────────────────────┐
    │                                                       │
    ▼                                                       ▼
┌──────────────────────┐                         ┌──────────────────────┐
│ LIGHTHOUSE TAB       │                         │ GEO TAB              │
│ Displays:            │                         │ Displays:            │
│ - Performance: 95    │                         │ - GEO Score: 71      │
│ - Accessibility: 98  │                         │ - Answer: 65         │
│ - Best Practices: 96 │                         │ - Extractability: 78 │
│ - SEO: 98            │                         │ - Authority: 70      │
│ - Core Web Vitals    │                         │ - Sentiment: 68      │
│ - Opportunities      │                         │ - Suggestions (5)    │
└──────────────────────┘                         └──────────────────────┘
```

---

## GEO Scoring Algorithm Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAGE CONTENT RECEIVED                         │
├─────────────────────────────────────────────────────────────────┤
│  HTML: <html>...</html>                                         │
│  Text: "The best laptops for 2024..."                           │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ Parse    │  │ Extract  │  │ Count    │
    │ HTML     │  │ Text     │  │ Links    │
    │          │  │          │  │          │
    │ Tables   │  │ 1st 100  │  │ To: .gov │
    │ Lists    │  │ words    │  │ To: .edu │
    │ Schema   │  │          │  │ To: Wiki │
    └────┬─────┘  └────┬─────┘  └────┬─────┘
         │             │             │
         ▼             ▼             ▼
    ┌──────────────────────────────────────────┐
    │  Signal 1: Answer Nugget (0-100)         │
    │  ─────────────────────────────────────── │
    │  If 40-80 words: +50                     │
    │  If 2+ sentences: +30                    │
    │  If low marketing: bonus                 │
    │  Result: 65/100                          │
    └──────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────┐
    │  Signal 2: Extractability (0-100)        │
    │  ─────────────────────────────────────── │
    │  2 tables × 20 = 40                      │
    │  3 lists × 10 = 30                       │
    │  1 schema × 30 = 30                      │
    │  4 headings × 3 = 12                     │
    │  Total: 78/100                           │
    └──────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────┐
    │  Signal 3: Authority (0-100)             │
    │  ─────────────────────────────────────── │
    │  3 Wikipedia links                       │
    │  1 .gov link                             │
    │  2 .edu links                            │
    │  Total links: 12                         │
    │  Authority ratio: 6/12 = 50% → 70/100   │
    └──────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────┐
    │  Signal 4: Sentiment (0-100)             │
    │  ─────────────────────────────────────── │
    │  Marketing words found: "best"           │
    │  Base score: 80                          │
    │  Marketing penalty: -10                  │
    │  Result: 68/100                          │
    └──────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────┐
    │  COMBINE SIGNALS                         │
    │  ─────────────────────────────────────── │
    │  GEO = (65 × 0.25) +                     │
    │        (78 × 0.30) +                     │
    │        (70 × 0.25) +                     │
    │        (68 × 0.20)                       │
    │                                          │
    │  = 16.25 + 23.40 + 17.50 + 13.60         │
    │  = 70.75                                 │
    │  = 71/100 (rounded)                      │
    └──────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────┐
    │  GENERATE SUGGESTIONS                    │
    │  ─────────────────────────────────────── │
    │  tables == 2 (OK, but could improve)     │
    │  → "Add comparison table"                │
    │                                          │
    │  answer_nugget == 65 (good)              │
    │  → No suggestion needed                  │
    │                                          │
    │  sentiment == 68 (good)                  │
    │  → "Reduce marketing language"           │
    │                                          │
    │  Output: 2-3 suggestions                 │
    └──────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────┐
    │  FINAL OUTPUT                            │
    │  ─────────────────────────────────────── │
    │  {                                       │
    │    geoScore: 71,                         │
    │    geoSignals: {                         │
    │      answer_nugget: 65,                  │
    │      extractability: 78,                 │
    │      authority: 70,                      │
    │      sentiment: 68                       │
    │    },                                    │
    │    suggestions: [...]                    │
    │  }                                       │
    └──────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App (page.tsx)
├── Header
│   ├── Logo
│   ├── Title
│   └── Theme Toggle
│
├── Main Content
│   ├── Hero Section (when no results)
│   │   ├── Title
│   │   ├── Input Form
│   │   │   ├── URL Input
│   │   │   └── Run Audit Button
│   │   └── Error Alert (if needed)
│   │
│   ├── Loading State (when auditing)
│   │   ├── Spinner
│   │   └── Loading Message
│   │
│   └── Results Section (when report ready)
│       ├── URL Display
│       ├── Run New Audit Button
│       │
│       └── Tabs
│           ├── Lighthouse Tab
│           │   ├── Score Cards (4)
│           │   │   ├── Performance Score
│           │   │   ├── Accessibility Score
│           │   │   ├── Best Practices Score
│           │   │   └── SEO Score
│           │   ├── Core Web Vitals
│           │   │   ├── Metric Badge (LCP)
│           │   │   ├── Metric Badge (FID)
│           │   │   ├── Metric Badge (CLS)
│           │   │   └── Metric Badge (TTFB)
│           │   └── Opportunities Accordion
│           │       └── Opportunity Items
│           │
│           └── GEO Tab
│               ├── GEO Score Card
│               ├── Signal Breakdown (4 cards)
│               │   ├── Answer Nugget Card
│               │   ├── Extractability Card
│               │   ├── Authority Card
│               │   └── Sentiment Card
│               ├── AI Readiness Signals
│               │   └── Signal Items (4)
│               └── Recommendations
│                   └── Suggestion Items (1-5)
```

---

## Data Flow Sequence

```
Time →
│
├─ 0s    User enters URL, clicks "Run Audit"
│
├─ 0s    Frontend validates URL
│        └─ Blocks: localhost, 192.168.x.x, etc.
│        └─ Allows: https://*, http://*
│
├─ 0s    Frontend makes POST request
│        └─ Body: {url: "https://example.com"}
│        └─ Calls: http://localhost:5000/api/audit
│
├─ 1s    Backend receives request
│        └─ Start auditing process
│
├─ 2s    fetch_page_content()
│        └─ requests.get(url, timeout=10)
│        └─ Parse with BeautifulSoup
│        └─ Extract HTML + text content
│
├─ 3s    run_lighthouse_audit()
│        └─ subprocess.run(["lighthouse", url, ...])
│        └─ Lighthouse runs performance audit
│        └─ Takes 30-60 seconds
│
├─ 35s   Lighthouse completes
│        └─ Returns 4 category scores
│        └─ Returns Core Web Vitals
│        └─ Returns audit details
│
├─ 35s   calculate_geo_score()
│        ├─ answer_nugget_score()
│        ├─ extractability_score()
│        ├─ authority_links_score()
│        ├─ sentiment_score()
│        └─ Combine into GEO score
│
├─ 36s   generate_suggestions()
│        └─ Analyze page structure
│        └─ Generate 1-5 suggestions
│        └─ Add priority & boost estimates
│
├─ 37s   Compile JSON response
│        └─ lighthouse: {...}
│        └─ geoScore: 71
│        └─ geoSignals: {...}
│        └─ suggestions: [...]
│
├─ 37s   Return HTTP response
│        └─ Status 200 OK
│        └─ Send JSON to frontend
│
├─ 37s   Frontend receives data
│        ├─ Update report state
│        ├─ Store in global variable
│        └─ Set loading = false
│
├─ 37s   Display results
│        ├─ Render Lighthouse Tab
│        │  └─ Show 4 real scores
│        └─ Render GEO Tab
│           └─ Show real scores + signals
│
└─ ∞     User can run new audit
```

---

## External API Calls

```
Frontend
    └─ fetch() to Backend
         └─ POST http://localhost:5000/api/audit

Backend
    ├─ requests.get() to Target Website
    │  └─ https://example.com
    │
    ├─ subprocess.run() → Lighthouse CLI
    │  └─ CLI → Google Chrome
    │
    └─ requests.post() to Gemini API (optional)
       └─ https://generativelanguage.googleapis.com/v1beta/models/...
          └─ For sentiment analysis
```

---

## Error Handling Flow

```
Frontend
    ├─ No URL entered?
    │  └─ Show: "Please enter a valid URL"
    │
    ├─ Invalid URL format?
    │  └─ Show: "Please enter a valid public HTTPS URL"
    │
    ├─ Private/internal URL?
    │  └─ Show: "Private/internal URLs are not allowed"
    │
    └─ Backend unreachable?
       └─ Show: "Failed to connect to backend..."

Backend
    ├─ Website unreachable?
    │  └─ Return: {"error": "Failed to fetch page"}
    │
    ├─ Lighthouse timeout?
    │  └─ Return: {"error": "Audit timeout"}
    │
    └─ Invalid URL?
       └─ Return: {"error": "Invalid URL format"}
```

---

Last Updated: January 31, 2024
