# Site Auditor - Project Structure

## Overview
Full-stack web application with Next.js frontend and Python Flask backend for website auditing.

```
site-auditor/
├── frontend (Next.js)
├── backend (Python Flask)
├── documentation
└── configuration
```

---

## Frontend Structure (Next.js)

```
/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Main audit page (REAL API CALLS)
│   ├── globals.css             # Tailwind CSS config + design tokens
│   └── favicon.ico
│
├── components/
│   ├── ui/                     # Shadcn UI components (auto-imported)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   │
│   ├── header.tsx              # Sticky header with title + theme toggle
│   ├── score-card.tsx          # Circular progress score display
│   ├── metric-badge.tsx        # Core Web Vitals badges
│   ├── suggestion-item.tsx     # Recommendation card component
│   ├── loading-state.tsx       # Loading animation overlay
│   ├── lighthouse-tab.tsx      # Lighthouse results display
│   └── geo-tab.tsx             # GEO scoring display (REAL DATA)
│
├── hooks/
│   ├── use-mobile.ts           # Mobile breakpoint detection
│   └── use-toast.ts            # Toast notifications
│
├── lib/
│   └── utils.ts                # Utility functions (cn, etc)
│
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── next.config.mjs             # Next.js config
└── .env.example                # Environment variables template
```

### Key Components

**Header** (`/components/header.tsx`)
- Logo/title
- Theme toggle button
- Sticky positioning

**ScoreCard** (`/components/score-card.tsx`)
- Circular progress display (0-100)
- Score label
- Color-coded (green/yellow/red)

**LighthouseTab** (`/components/lighthouse-tab.tsx`)
- 4 main category scores
- Core Web Vitals metrics
- Performance opportunities (accordion)
- Expandable audit details

**GEOTab** (`/components/geo-tab.tsx`)
- GEO score (0-100)
- 4 signal breakdown (answer nugget, extractability, authority, sentiment)
- Real suggestions from backend
- AI readiness status

---

## Backend Structure (Python Flask)

```
backend/
├── app.py                      # Main Flask app + all endpoints
├── requirements.txt            # Python dependencies
├── .env.example               # Environment template
│
├── modules/
│   ├── lighthouse_audit.py    # Lighthouse integration (future)
│   ├── geo_scoring.py         # GEO calculation logic (future)
│   └── page_parser.py         # HTML parsing (future)
│
└── tests/
    ├── test_audit.py          # API endpoint tests (future)
    └── test_geo.py            # GEO scoring tests (future)
```

### Current Implementation (In app.py)

```python
# GEO SCORING FUNCTIONS
- answer_nugget_score()      # Measures direct answer quality
- extractability_score()      # Measures HTML structure
- authority_links_score()    # Measures external citations
- sentiment_score()          # Measures objectivity (sync version)
- calculate_geo_score()      # Combines all signals
- generate_suggestions()     # Creates actionable recommendations

# LIGHTHOUSE INTEGRATION
- run_lighthouse_audit()     # Runs real Lighthouse CLI
- fetch_page_content()       # Scrapes page HTML

# API ENDPOINTS
POST /api/audit              # Main audit endpoint
GET  /api/health             # Health check
```

---

## Data Flow

### Audit Request Flow

```
┌─────────────────┐
│  User enters    │
│  URL in form    │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│  Frontend validates URL  │
│  (blocks private URLs)   │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  POST /api/audit         │
│  with URL                │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Backend: Fetch Page Content     │
│  - requests.get(url)             │
│  - BeautifulSoup parse           │
└────────┬─────────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
 ┌─────┐  ┌─────────────────────────┐
 │LH   │  │  GEO Scoring            │
 │CLI  │  │  - answer_nugget()      │
 │     │  │  - extractability()     │
 │     │  │  - authority()          │
 │     │  │  - sentiment()          │
 └──┬──┘  │  - calculate_geo()      │
    │     │  - generate_suggestions │
    └─────┴─────────────────────────┘
         │
         ▼
┌──────────────────────┐
│  Return JSON:        │
│  - lighthouse data   │
│  - geoScore          │
│  - geoSignals        │
│  - suggestions       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Frontend receives   │
│  real data           │
│  (no more mocks!)    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Display results:    │
│  - LighthouseTab     │
│  - GEOTab            │
└──────────────────────┘
```

---

## Key Files Changed

### Frontend
- **`/app/page.tsx`** - Now makes real API calls to backend instead of mocking data
- **`/components/geo-tab.tsx`** - Now displays real GEO data from backend API response

### Backend (New)
- **`/backend/app.py`** - Complete Flask backend with:
  - Real Lighthouse integration
  - GEO scoring algorithm
  - API endpoints
  - Page content fetching

### Documentation (New)
- **`/README.md`** - Complete project documentation
- **`/SETUP_GUIDE.md`** - Step-by-step setup instructions
- **`/PROJECT_STRUCTURE.md`** - This file

---

## API Response Format

```json
{
  "url": "https://example.com",
  "timestamp": "2024-01-31T10:00:00",
  "lighthouse": {
    "categories": {
      "performance": 89,
      "accessibility": 92,
      "best-practices": 88,
      "seo": 95
    },
    "metrics": {
      "lcp": 2.5,
      "fid": 100,
      "cls": 0.1
    }
  },
  "geoScore": 73,
  "geoSignals": {
    "answer_nugget": 65,
    "extractability": 78,
    "authority": 70,
    "sentiment": 68
  },
  "suggestions": [
    {
      "title": "Add a Comparison Table",
      "description": "AI systems extract data from tables 3x more effectively...",
      "priority": "high",
      "estimatedBoost": 15
    }
  ]
}
```

---

## Environment Variables

### Backend (.env)
```
GEMINI_API_KEY=your_api_key_here
FLASK_ENV=development
FLASK_DEBUG=False
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Dependencies

### Frontend (package.json)
```json
{
  "next": "^16.0.0",
  "react": "^19.0.0",
  "@radix-ui/react-tabs": "^1.0.4",
  "tailwindcss": "^4.0.0",
  "shadcn-ui": "latest"
}
```

### Backend (requirements.txt)
```
Flask==2.3.3
Flask-CORS==4.0.0
requests==2.31.0
beautifulsoup4==4.12.2
python-dotenv==1.0.0
```

---

## Development Workflow

### Local Development

1. **Start Backend**
   ```bash
   cd backend
   python app.py
   # Runs on http://localhost:5000
   ```

2. **Start Frontend**
   ```bash
   npm run dev
   # Runs on http://localhost:3000
   ```

3. **Test Audit**
   - Open `http://localhost:3000`
   - Enter URL
   - Click "Run Audit"
   - View real Lighthouse + GEO results

### Making Changes

**Backend changes**:
1. Edit `/backend/app.py`
2. Backend auto-reloads (Flask debug mode)
3. Test with: `curl http://localhost:5000/api/audit -X POST ...`

**Frontend changes**:
1. Edit `/app/page.tsx` or components
2. Frontend auto-reloads (Next.js HMR)
3. See changes immediately in browser

---

## Deployment Structure

### Production Backend
```
Backend Server (Render/Railway/AWS)
├── Python runtime
├── Lighthouse CLI
├── Flask app.py
└── Environment: .env
```

### Production Frontend
```
Frontend CDN (Vercel/Netlify)
├── Next.js build (.next/)
├── Static files
└── Environment: NEXT_PUBLIC_API_URL
```

---

## Testing Checklist

- [ ] Backend health check: `curl http://localhost:5000/api/health`
- [ ] Audit endpoint works: `curl -X POST http://localhost:5000/api/audit ...`
- [ ] Frontend connects to backend
- [ ] Lighthouse audit runs successfully
- [ ] GEO score calculations work
- [ ] Suggestions generate properly
- [ ] URL validation blocks private URLs
- [ ] Error handling shows proper messages

---

## Future Improvements

```
backend/
├── api/
│   ├── audit.py              # Extract audit endpoint logic
│   ├── reports.py            # Historical reports
│   └── webhooks.py           # Async job webhooks
├── database/
│   ├── models.py             # SQLAlchemy models
│   └── migrations/           # Alembic migrations
├── services/
│   ├── lighthouse_service.py # LH wrapper
│   ├── geo_service.py        # GEO scoring service
│   └── cache_service.py      # Redis caching
└── tests/
    ├── unit/
    ├── integration/
    └── fixtures/
```

---

## Key Metrics (Real Data!)

✅ Lighthouse Performance: Real Google Lighthouse audit
✅ GEO Score: Calculated from 4 honest signals (not magic)
✅ Suggestions: Generated based on actual page analysis
✅ Core Web Vitals: Real measurements from Lighthouse
✅ Authority Scoring: Based on actual outbound links
✅ Extractability: Measured from real HTML structure
✅ Answer Nugget: Analyzed from actual page content

**No fake data, no arbitrary scoring!**

---

Last Updated: January 31, 2024
