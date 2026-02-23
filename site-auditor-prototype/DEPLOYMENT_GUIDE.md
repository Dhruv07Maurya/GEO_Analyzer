# Site Auditor - Deployment Guide

## Overview

This is a production-ready Site Auditor application that combines Lighthouse performance metrics with AI-powered GEO (Generative Engine Optimization) analysis using Groq LLM.

## Architecture

```
User visits: localhost:4000
    ↓
Input URL → Click "Analyze"
    ↓
Redirect to: localhost:4000/geo/{encodedURL}
    ↓
Loading Screen (5-10 seconds random)
    ↓
Parallel Processing:
  1. Lighthouse Audit (/api/audit)
  2. Fetch Content (/api/fetch-content)
  3. GEO Analysis (/api/geo) using Groq LLM
    ↓
Display Results in Tabs
```

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Groq API Key (Required for GEO analysis)
GROQ_API_KEY=your_groq_api_key_here

# Optional: Lighthouse API Key (if using paid Lighthouse API)
# LIGHTHOUSE_API_KEY=your_key_here
```

**Get Groq API Key:**
1. Visit https://console.groq.com
2. Sign up or log in
3. Create a new API key
4. Copy and paste into `.env.local`

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Server runs on: **http://localhost:4000**

### 4. Build for Production

```bash
npm run build
npm start
```

## Key Features

### 1. Minimalist Loading Experience
- Random 5-10 second loading duration for authentic feel
- Smooth animations and progress indicator
- Shows processing steps in real-time

### 2. Lighthouse Performance Audit
- Real Google Lighthouse audits
- 4 category scores: Performance, Accessibility, Best Practices, SEO
- Core Web Vitals metrics (LCP, FID, CLS, TTFB)
- Detailed optimization opportunities

### 3. GEO Analysis (AI-Powered)
- Uses Groq LLM for content analysis
- 4 key signals:
  - **Answer Nugget**: How well first paragraph answers the topic
  - **Extractability**: HTML structure quality for AI parsing
  - **Authority**: Quality of external citations
  - **Sentiment**: Content objectivity
- Generates actionable recommendations

### 4. Beautiful Animations
- Fade-in on page load
- Slide-up with staggered delays
- Smooth transitions throughout

## API Endpoints

### GET `/api/audit?url=<URL>`
Runs Lighthouse audit on the given URL
- Returns: Lighthouse scores and audits

### GET `/api/fetch-content?url=<URL>`
Fetches and cleans HTML content from URL
- Returns: Plain text content for analysis

### POST `/api/geo`
Analyzes page content using Groq LLM
- Body: `{ url: string, content: string }`
- Returns: JSON with GEO scores and recommendations

## Dynamic Routes

### `GET /geo/[url]`
Main audit results page
- URL parameter is the website to analyze
- Shows loading state during processing
- Displays Lighthouse and GEO tabs

## Deployment to Vercel

### 1. Connect GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/site-auditor.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Visit https://vercel.com/new
2. Import your GitHub repository
3. Add environment variables:
   - `GROQ_API_KEY`: Your Groq API key
4. Click Deploy

### 3. Update Custom Domain

After deployment:
1. Go to Vercel project settings
2. Add custom domain under "Domains"
3. Update DNS records as instructed

## Embedding in Another Site

To embed the auditor in an iframe on another site:

```html
<!-- On your external site -->
<iframe 
  src="https://your-auditor-domain.com" 
  width="100%" 
  height="600"
  frameborder="0"
  allowfullscreen>
</iframe>
```

**Or create a button that redirects:**

```html
<button onclick="
  const url = prompt('Enter website URL:');
  if (url) {
    window.open('https://your-auditor-domain.com/geo/' + encodeURIComponent(url));
  }
">Analyze Website</button>
```

## Troubleshooting

### Issue: "Groq API key not configured"
**Solution:** 
- Ensure `.env.local` has `GROQ_API_KEY`
- Restart development server
- Check key is valid at https://console.groq.com

### Issue: "Failed to fetch page content"
**Solution:**
- URL may be blocking automated requests
- Try different URL
- Check if site requires JavaScript rendering (Lighthouse handles this)

### Issue: Loading takes too long
**Solution:**
- Lighthouse audits can take 30-90 seconds
- This is normal for real audits
- Groq API adds 2-5 seconds for analysis

### Issue: Port 4000 already in use
**Solution:**
```bash
# Find process using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>

# Or run on different port
npm run dev -- -p 5000
```

## Performance Optimization

### Current Limitations
- Lighthouse audits are run sequentially (not parallelized)
- Content fetch timeout: 10 seconds
- Groq response max tokens: 1024
- Page content limit: 3000 characters

### Recommendations for Scale
1. Add caching for repeated URLs
2. Use background jobs for audits
3. Implement rate limiting per IP
4. Add database for result history
5. Use Redis for queue management

## Security Considerations

- URL validation prevents localhost/private IP access
- Content fetch has 10-second timeout to prevent DoS
- API key stored in environment variables only
- No user data stored (stateless)
- CORS properly configured

## Monitoring

### Track Important Metrics
- Audit success rate
- Average audit duration
- API error rates
- Page load times

### Recommended Tools
- Vercel Analytics (automatic)
- Sentry for error tracking
- LogRocket for user sessions

## Support

For issues or questions:
1. Check TROUBLESHOOTING.md
2. Review API responses in browser console
3. Check environment variables
4. Verify Groq API key validity

---

**Last Updated:** 2026-02-01
**Version:** 1.0.0
