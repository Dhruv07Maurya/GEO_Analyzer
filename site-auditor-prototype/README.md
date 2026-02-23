# Site Auditor - Production-Ready GEO & Performance Analysis Tool

A comprehensive web audit tool that combines **Lighthouse Performance** metrics with **GEO (Generative Engine Optimization)** scoring to measure how well your site is optimized for AI search engines.

## Architecture

```
Frontend (Next.js)  ←→  Backend (Python Flask)  ←→  External APIs
   React 19              Lighthouse CLI              Google Gemini
   Next.js 16           Beautiful Soup             Rich Results Test
   Shadcn UI            Playwright                 Google Search Console
```

## Features

### Lighthouse Performance (Real Data)
- **4 Core Metrics**: Performance, Accessibility, Best Practices, SEO
- **Core Web Vitals**: LCP, FID, CLS, TTFB measurements
- **Performance Opportunities**: Actionable recommendations with savings estimates
- **Real Lighthouse CLI Integration**: Actual Google Lighthouse audits

### GEO Optimization (Honest Scoring)
- **Answer Nugget Score** (25%): How well your intro directly answers questions
- **Extractability Score** (30%): HTML structure quality (tables, lists, schema)
- **Authority Score** (25%): External citations to authoritative sources
- **Sentiment Score** (20%): Objectivity vs marketing language analysis

All metrics are **100% reproducible and measurable** — not arbitrary "AI rank predictions".

## Setup Instructions

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.8+ (for backend)
- Chrome/Chromium (required for Lighthouse)

### Backend Setup (Python)

1. **Install dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Install Lighthouse globally** (if not already installed):
```bash
npm install -g lighthouse
```

3. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env and add your Gemini API key if needed
```

4. **Start the backend**:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup (Next.js)

1. **Install dependencies**:
```bash
npm install
```

2. **Run development server**:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### POST `/api/audit`
Runs a complete audit on a website.

**Request**:
```json
{
  "url": "https://example.com"
}
```

**Response**:
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

### GET `/api/health`
Health check endpoint.

## GEO Scoring Breakdown

### Answer Nugget Score
Measures how well your page's opening directly answers the main question.

- **40-80 words** in first paragraph: +50 points
- **2+ sentences**: +30 points
- **Reduced marketing language**: Better score
- Formula: Rewards concise, factual introductions

### Extractability Score
Measures how well HTML structure supports AI extraction.

- **Tables**: +20 points each (max 40)
- **Lists** (ul/ol): +10 points each (max 30)
- **Schema markup** (JSON-LD): +30 points
- **Heading hierarchy**: +3 points each (max 20)

### Authority Score
Measures quality of external citations.

- Links to .gov, .edu, Wikipedia: +15% each
- Links to major publishers: +10% each
- Ratio-based scoring from 0-100

### Sentiment Score
Measures objectivity vs marketing language.

- Marketing words ("best", "amazing", "revolutionary"): -5 points each
- Factual language: +points
- Uses Gemini for deeper analysis

## Example Audit Results

### High-Performing Page
- **GEO Score**: 85+
- Strong: Clear summary, structured data, authoritative sources, objective tone
- Suggestions: Minor optimizations only

### Medium-Performing Page
- **GEO Score**: 50-75
- Needs: Better HTML structure, clearer summary, more authoritative citations
- Suggestions: Add tables, schema markup, improve intro

### Low-Performing Page
- **GEO Score**: <50
- Issues: Sales-heavy language, no structure, no citations
- Suggestions: Rewrite objectively, add comparison tables, add schema

## Production Deployment

### Deploy Backend
**Option 1: Render/Railway**
```bash
# Push to GitHub, connect to Render/Railway
# Set environment variables in dashboard
# Auto-deploy on push
```

**Option 2: AWS Lambda + API Gateway**
```bash
# Package as serverless function
# Set up CORS for frontend domain
# Configure environment variables
```

### Deploy Frontend
**Option 1: Vercel (Recommended)**
```bash
# Connect GitHub repo to Vercel
# Vercel auto-deploys on push
# Set backend URL in environment variables
```

**Option 2: Netlify**
```bash
# Connect GitHub repo
# Set build command: npm run build
# Set publish directory: .next
```

## Security Considerations

1. **API Key Management**
   - Never commit `.env` files
   - Use environment variables for secrets
   - Rotate Gemini API key periodically

2. **URL Validation**
   - Blocks private/internal URLs
   - Validates HTTPS for public audits
   - Prevents SSRF attacks

3. **Rate Limiting**
   - Implement rate limiting on backend
   - Add queue system for large-scale audits
   - Monitor API usage

4. **CORS**
   - Frontend and backend same origin or proper CORS headers
   - Whitelist frontend domains

## Performance Optimization

1. **Caching**
   - Cache Lighthouse results for 24 hours
   - Cache GEO scores for 48 hours
   - Invalidate on request

2. **Async Processing**
   - Use background jobs for Lighthouse audits
   - Return webhook URLs instead of long-polling
   - Store results in database

3. **Database Integration** (Production)
   ```python
   # Add PostgreSQL/MongoDB
   # Store audit history
   # Track improvements over time
   # Generate reports
   ```

## Troubleshooting

### Backend Connection Error
```
Error: Failed to connect to backend. Make sure Python backend is running on http://localhost:5000
```

**Solution**: 
- Ensure backend is running: `python app.py`
- Check backend URL in frontend code
- Verify CORS is enabled

### Lighthouse Not Found
```
Error: Command 'lighthouse' not found
```

**Solution**:
```bash
npm install -g lighthouse
# Or use: npx lighthouse
```

### API Key Issues
```
Error: GEMINI_API_KEY not set
```

**Solution**:
```bash
# Set in .env file
GEMINI_API_KEY=your_key_here
# Restart backend
```

## Future Enhancements

- [ ] Real-time crawling with Playwright
- [ ] Mobile vs Desktop audit comparison
- [ ] Historical data tracking
- [ ] Custom audit templates
- [ ] Email report generation
- [ ] Slack/Teams integration
- [ ] Multi-page site scanning
- [ ] Competitive analysis
- [ ] AI citation simulation (with real APIs)
- [ ] Database for storing audit history

## License

MIT

## Support

For issues or questions:
1. Check Troubleshooting section
2. Review backend logs: `python app.py`
3. Check frontend console: Browser DevTools → Console
4. Create issue on GitHub
