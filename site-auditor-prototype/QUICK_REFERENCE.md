# Quick Reference - Site Auditor

## 🚀 Getting Started (5 Minutes)

### 1. Get Groq API Key
Visit https://console.groq.com and create a free API key

### 2. Setup
```bash
# Create .env.local
echo "GROQ_API_KEY=your_key_here" > .env.local

# Install and run
npm install
npm run dev
```

### 3. Visit
Open browser: `http://localhost:4000`

## 📋 User Flow

```
Input URL → Click "Analyze" → Redirect to /geo/[url]
    ↓
Loading (5-10s random) ← Animations running
    ↓
Results Page with 2 Tabs:
├── Lighthouse Performance (Real audit scores)
└── GEO Analysis (Groq AI analysis)
```

## 🔑 Key Features

| Feature | Details |
|---------|---------|
| **Port** | 4000 |
| **Main Route** | `GET /` |
| **Audit Route** | `GET /geo/[url]` |
| **Loading** | 5-10s random duration |
| **GEO Engine** | Groq LLM (mixtral-8x7b) |
| **Lighthouse** | Real Google audits |

## 📊 GEO Signals

1. **Answer Nugget** - Does first 100 words answer the topic?
2. **Extractability** - How well structured for AI parsing?
3. **Authority** - Quality of external citations?
4. **Sentiment** - How objective/factual is content?

Each scored 0-100

## 🛠️ API Endpoints

```bash
# Lighthouse audit
GET /api/audit?url=https://example.com

# Fetch page content
GET /api/fetch-content?url=https://example.com

# GEO analysis (requires content)
POST /api/geo
Body: { url: string, content: string }
```

## 🎨 UI Components

- **Header** - Title + theme toggle
- **LoadingState** - 5-10s with progress
- **LighthouseTab** - Performance scores + opportunities
- **GEOAnalysisTab** - Signal scores + recommendations
- **ScoreCard** - Circular score display
- **SuggestionItem** - Recommendation cards

## 🔐 Environment Variables

```env
GROQ_API_KEY=<your-groq-api-key>
```

**Only required variable**

## ✨ Animations

- Fade-in: 0.5s ease-out
- Slide-up: 0.6s ease-out
- Staggered delays: 0.1s increments
- Defined in `globals.css`

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| Port 4000 in use | `lsof -i :4000` then kill process |
| "Groq key not configured" | Restart dev server after `.env.local` |
| Failed to fetch page | URL may block automated requests |
| Lighthouse returns 0s | Wait 30-90 seconds, it's running |

## 📱 Embedding

### In iframe:
```html
<iframe src="http://localhost:4000" width="100%" height="600"></iframe>
```

### As redirect button:
```html
<button onclick="
  const url = prompt('URL to audit:');
  window.open('http://localhost:4000/geo/' + encodeURIComponent(url));
">Audit Site</button>
```

## 📦 Dependencies Added

- `groq-sdk`: ^0.3.0

Already installed:
- next, react, tailwindcss, shadcn/ui, etc.

## 🎯 Main Files

| File | Purpose |
|------|---------|
| `/app/page.tsx` | Home page with input |
| `/app/geo/[url]/page.tsx` | Audit results page |
| `/app/api/geo/route.ts` | Groq analysis endpoint |
| `/app/api/fetch-content/route.ts` | Content fetching |
| `/components/geo-analysis-tab.tsx` | GEO results display |
| `/app/globals.css` | Animations |

## 📈 Performance

- Page load: 200-500ms
- Loading screen: 5-10s
- Lighthouse: 30-90s
- Content fetch: 2-5s
- GEO analysis: 2-5s

**Total time:** 40-110 seconds per audit

## 🔄 Data Flow

```
User Input URL
    ↓
Validate URL (localhost/private IP check)
    ↓
Redirect to /geo/[encodedURL]
    ↓
Start Loading (5-10s random timer)
    ↓
Parallel:
├─ Lighthouse Audit
├─ Fetch Page Content
└─ Groq GEO Analysis (after content)
    ↓
Store in window.__auditData
    ↓
When timer completes: Show Results
```

## 💾 No Database Required

Everything is **stateless**:
- No user accounts
- No result storage
- No authentication
- No cookies/sessions

Perfect for embedding!

## 🚢 Deploy to Vercel

```bash
git add .
git commit -m "Site auditor"
git push

# Then:
# 1. Visit vercel.com/new
# 2. Import repo
# 3. Add GROQ_API_KEY env var
# 4. Deploy
```

## 📞 Support

Check these files in order:
1. `DEPLOYMENT_GUIDE.md` - Setup & deployment
2. `IMPLEMENTATION_NOTES.md` - Architecture & details
3. Browser console - Error logs
4. Network tab - API responses

---

**Version:** 2.0.0 | **Updated:** 2026-02-01
