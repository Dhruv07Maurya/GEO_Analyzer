# How to Integrate with Your Main Site

## Overview
Your Site Auditor widget runs on **port 4000** and is designed to be embedded in/linked from your main site.

---

## Method 1: Simple Button Link (Recommended)

### Your Main Site HTML
```html
<!-- On your main website -->
<button onclick="openGEOAnalysis()">Analyze Site with GEO</button>

<script>
function openGEOAnalysis() {
  // The URL you want to analyze
  const targetUrl = 'https://example.com';
  
  // Encode it for the URL
  const encodedUrl = encodeURIComponent(targetUrl);
  
  // Redirect to the analysis page
  window.location.href = `http://localhost:4000/geo/${encodedUrl}`;
  
  // OR open in new tab:
  // window.open(`http://localhost:4000/geo/${encodedUrl}`, '_blank');
}
</script>
```

### User Flow
1. User is on your main site
2. Clicks "Analyze" button
3. Gets redirected to `http://localhost:4000/geo/{encoded_url}`
4. Sees loading screen (5-10 seconds with progress)
5. Sees analysis results (Lighthouse + GEO)

---

## Method 2: Embed in iFrame

### Your Main Site HTML
```html
<!-- On your main website -->
<div id="geoContainer" style="width: 100%; height: 100vh; border: none;">
  <iframe 
    id="geoFrame"
    style="width: 100%; height: 100%; border: none;"
    allow="microphone; camera"
  ></iframe>
</div>

<script>
function analyzeInIframe(url) {
  const encodedUrl = encodeURIComponent(url);
  const iframe = document.getElementById('geoFrame');
  iframe.src = `http://localhost:4000/geo/${encodedUrl}`;
}

// Example usage:
analyzeInIframe('https://example.com');
</script>
```

---

## Method 3: Dynamic Analysis Page

### Your Main Site
```html
<!-- On your main website -->
<input type="url" id="urlInput" placeholder="https://example.com">
<button onclick="analyzeUrl()">Analyze</button>

<script>
function analyzeUrl() {
  const url = document.getElementById('urlInput').value;
  if (!url) {
    alert('Please enter a URL');
    return;
  }
  
  const encodedUrl = encodeURIComponent(url);
  window.open(`http://localhost:4000/geo/${encodedUrl}`, '_blank');
}
</script>
```

---

## What Happens When User Visits `/geo/[url]`

```
User visits: http://localhost:4000/geo/https%3A%2F%2Fexample.com
                                          ↓
Step 1: Route Parameter Decoded
  - URL decoded: https://example.com
                                          ↓
Step 2: Loading Screen Shows (5-10 sec)
  - Progress bar 0-100%
  - "Analyzing your website..."
  - Fetching content...
  - Running Lighthouse...
  - Analyzing with AI...
                                          ↓
Step 3: Background APIs Run
  - /api/fetch-content?url=... → Gets page content
  - /api/audit?url=... → Runs Lighthouse audit
  - /api/geo (POST) → Sends content + URL to Groq
                                          ↓
Step 4: Groq Returns JSON
  {
    "answer_nugget": { "score": 78, "explanation": "..." },
    "extractability": { "score": 85, "explanation": "..." },
    "authority": { "score": 72, "explanation": "..." },
    "sentiment": { "score": 81, "explanation": "..." },
    "key_findings": ["Finding 1", "Finding 2", ...],
    "recommendations": [...],
    "overall_analysis": "..."
  }
                                          ↓
Step 5: Results Display
  - GEO Readiness Score (calculated)
  - 4 Signal Scores
  - Key Findings
  - Recommendations
  - Lighthouse tab with performance scores
```

---

## URL Encoding Examples

### Single Page
```javascript
const url = 'https://example.com/page';
const encoded = encodeURIComponent(url);
// Result: https%3A%2F%2Fexample.com%2Fpage
// Full URL: http://localhost:4000/geo/https%3A%2F%2Fexample.com%2Fpage
```

### With Query Parameters
```javascript
const url = 'https://example.com/search?q=hello&sort=date';
const encoded = encodeURIComponent(url);
// Result: https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%26sort%3Ddate
// Full URL: http://localhost:4000/geo/https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%26sort%3Ddate
```

---

## Configuration

### Environment Variables Needed
```bash
# .env.local
GROQ_API_KEY=your_groq_key_here
```

### Port Configuration
- Widget runs on: **localhost:4000**
- Change in: `package.json` → `scripts.dev`

---

## What User Sees

### On Load (First 5-10 seconds)
```
┌─────────────────────────────────────┐
│       Analyzing your website         │
│                                     │
│         ◯  ◯  ◯                    │
│        (spinning rings)             │
│                                     │
│            78%                      │
│         ████████░░ Progress        │
│                                     │
│ • Fetching website content          │
│ • Running Lighthouse audit          │
│ • Analyzing with AI (Groq)          │
└─────────────────────────────────────┘
```

### After Loading
```
Audit results for: https://example.com

┌─ Lighthouse Performance ─ GEO Optimization ─┐

Category Scores:
┌──────────────┐ ┌──────────────┐
│ Performance  │ │ Accessibility│
│      89      │ │      92      │
└──────────────┘ └──────────────┘

Core Web Vitals:
LCP: 2.5s | FID: 45ms | CLS: 0.08 | TTFB: 0.6s
```

---

## Testing the Widget

### Test 1: Basic URL
```bash
npm run dev
# Visit: http://localhost:4000/geo/https%3A%2F%2Fgoogle.com
```

### Test 2: With Port
```bash
# Visit: http://localhost:4000/geo/http%3A%2F%2Fexample.com%3A8080
```

### Test 3: With Path
```bash
# Visit: http://localhost:4000/geo/https%3A%2F%2Fexample.com%2Fblog%2Farticle
```

---

## Troubleshooting

### "Groq API key not configured"
- **Solution**: Add `GROQ_API_KEY` to `.env.local`

### Blank page on `/geo/[url]`
- **Check**: Console for errors (F12 → Console)
- **Solution**: Verify URL is properly encoded

### Loading never finishes
- **Check**: Network tab (F12 → Network)
- **Solution**: Verify APIs are returning data

### No GEO analysis showing
- **Check**: If `/api/geo` returns error
- **Solution**: Verify Groq API key and content fetching works

---

## Integration Checklist

- [ ] Site Auditor running on port 4000
- [ ] GROQ_API_KEY added to .env.local
- [ ] Button/link created on main site
- [ ] Button correctly encodes URL
- [ ] Button redirects to `localhost:4000/geo/{encoded_url}`
- [ ] Tested with sample URLs
- [ ] Loading screen appears
- [ ] Results display after 5-10 seconds
- [ ] All scores visible (Lighthouse + GEO)

---

## Notes

- The home page `/` with input form can be removed if not needed
- Everything happens automatically - no user input after initial redirect
- Loading duration is random 5-10 seconds (intentional for "realistic" feel)
- Groq takes ~2-5 seconds, so timing varies per website
- All data flows through Next.js APIs for security
