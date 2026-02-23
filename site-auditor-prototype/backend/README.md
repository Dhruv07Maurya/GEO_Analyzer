# Site Auditor Backend

Flask backend for the Site Auditor - Lighthouse + GEO analysis tool.

## Prerequisites

- Python 3.8 or higher
- Node.js (for Lighthouse CLI)
- Lighthouse CLI installed globally

## Setup Instructions

### 1. Install Lighthouse CLI

```bash
npm install -g lighthouse
```

### 2. Create Virtual Environment

```bash
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

**How to get API key:**
- **Groq API Key**: Sign up at [https://console.groq.com](https://console.groq.com)

### 5. Run the Backend Server

```bash
python app.py
```

The server will start at `http://127.0.0.1:5000`

## API Endpoints

### Audit Site
```
POST /api/audit
```
**Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "timestamp": "2026-02-01T10:00:00",
  "lighthouse": {
    "categories": {
      "performance": 85,
      "accessibility": 92,
      "best-practices": 88,
      "seo": 90
    },
    "metrics": {
      "lcp": 2.5,
      "fid": 100,
      "cls": 0.1
    }
  },
  "geoScore": 75,
  "geoSignals": {
    "answer_nugget": 60,
    "extractability": 80,
    "authority": 70,
    "sentiment": 85
  },
  "suggestions": [...]
}
```

### Health Check
```
GET /api/health
```

## GEO Scoring System

The backend calculates a GEO (Generative Engine Optimization) score based on 4 signals:

1. **Answer Nugget** (25%) - How well the page answers questions directly
2. **Extractability** (30%) - How well-structured the HTML is for AI extraction
3. **Authority** (25%) - Quality of external citations
4. **Sentiment** (20%) - Objectivity and factuality (powered by Groq LLM)

## Features

- ✅ Real Lighthouse audits using Google's official CLI
- ✅ GEO scoring with 4 real signals
- ✅ AI-powered sentiment analysis using Groq
- ✅ Actionable suggestions for improvement
- ✅ Real Core Web Vitals metrics

## Troubleshooting

- **"Command not found: lighthouse"**: Run `npm install -g lighthouse`
- **"Port 5000 already in use"**: Kill the process using port 5000
- **"GROQ_API_KEY not found"**: Make sure your `.env` file exists and has the API key
- **Lighthouse timeout**: Some sites take longer to audit, increase timeout in code if needed

## Security

- ✅ API keys stored in `.env` file (not committed to git)
- ✅ `.env` is in `.gitignore`
- ✅ `.env.example` provided as template
