# Site Auditor - Complete Setup Guide

## Quick Start (5 minutes)

### 1. Start Backend
```bash
cd backend
pip install -r requirements.txt
npm install -g lighthouse  # If not already installed
python app.py
```

Backend runs on: `http://localhost:5000`

### 2. Start Frontend
```bash
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

### 3. Test Audit
1. Open `http://localhost:3000`
2. Enter any public URL (e.g., `https://google.com`)
3. Click "Run Audit"

---

## Detailed Setup

### Prerequisites

#### Node.js
- **Required**: Node.js 18+
- **Check version**: `node --version`
- **Download**: https://nodejs.org/

#### Python
- **Required**: Python 3.8+
- **Check version**: `python --version` or `python3 --version`
- **Download**: https://www.python.org/

#### Chrome/Chromium
- **Required**: For Lighthouse CLI
- **Check**: Chrome should be installed already on most systems
- **Alternative**: Can use puppeteer or playwright

---

## Backend Setup (Python)

### Step 1: Install Python Dependencies

```bash
cd backend
python -m venv venv  # Optional: create virtual environment

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

**Installed packages**:
- `Flask==2.3.3` - Web framework
- `Flask-CORS==4.0.0` - CORS support
- `requests==2.31.0` - HTTP library
- `beautifulsoup4==4.12.2` - HTML parsing
- `python-dotenv==1.0.0` - Environment variables

### Step 2: Install Lighthouse CLI

**Option A: Global npm install** (Recommended)
```bash
npm install -g lighthouse
```

**Option B: Local npm install**
```bash
cd backend
npm init -y
npm install lighthouse
```

**Verify installation**:
```bash
lighthouse --version
```

### Step 3: Set Up Environment Variables

```bash
cd backend

# Copy example file
cp .env.example .env

# Edit .env with your editor
# GEMINI_API_KEY=your_key_here
```

**Available environment variables**:
```
GEMINI_API_KEY=AIzaSyAcUVLcAlnZESyBIp3iyPsrMUZCKJa9738
FLASK_ENV=development
FLASK_DEBUG=False
```

### Step 4: Run Backend

```bash
python app.py
```

**Expected output**:
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

✅ Backend is running! Keep this terminal open.

---

## Frontend Setup (Next.js)

### Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Next.js 16
- React 19
- Shadcn UI components
- Tailwind CSS
- Lucide icons

### Step 2: Run Development Server

```bash
npm run dev
```

**Expected output**:
```
▲ Next.js 16.x
  - Local:        http://localhost:3000
  - Environments: .env.local
```

✅ Frontend is running! Open `http://localhost:3000` in your browser.

---

## Testing the Setup

### 1. Check Backend Health
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok"}
```

### 2. Manual Audit Test
```bash
curl -X POST http://localhost:5000/api/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

### 3. Frontend Test
1. Open `http://localhost:3000`
2. Paste URL: `https://example.com`
3. Click "Run Audit"
4. Wait 30-60 seconds for results

---

## Common Issues & Solutions

### Issue: "Python command not found"
**Solution**:
```bash
# Try python3
python3 --version

# If that works, use:
python3 -m pip install -r requirements.txt
python3 app.py
```

### Issue: "pip: command not found"
**Solution**:
```bash
# Use Python's pip module directly
python -m pip install -r requirements.txt
```

### Issue: "lighthouse: command not found"
**Solution**:
```bash
# Install globally
npm install -g lighthouse

# Or verify installation
which lighthouse  # macOS/Linux
where lighthouse  # Windows
```

### Issue: "Connection refused" (frontend to backend)
**Solution**:
1. Verify backend is running: `curl http://localhost:5000/api/health`
2. Check backend URL in frontend code
3. Ensure CORS is enabled (it is by default in Flask-CORS)
4. Try `http://127.0.0.1:5000` instead of `localhost:5000`

### Issue: "Cannot find module" (Next.js)
**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Then restart dev server
npm run dev
```

### Issue: "Port 5000/3000 already in use"
**Solution**:

```bash
# Kill process on port 5000 (Python)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (Node)
lsof -ti:3000 | xargs kill -9

# Or use different ports
python app.py --port 5001
npm run dev -- --port 3001
```

### Issue: "Timeout waiting for Lighthouse"
**Solution**:
- Lighthouse takes 30-60 seconds for large sites
- Check Chrome is installed
- Try with a smaller/faster website first

---

## Environment Variables for Production

### Backend (.env)
```bash
GEMINI_API_KEY=your_gemini_key_here
FLASK_ENV=production
FLASK_DEBUG=False
ALLOWED_DOMAINS=yourdomain.com,other.com
RATE_LIMIT=10/hour
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] Backend tested locally
- [ ] Frontend tested locally
- [ ] All environment variables set
- [ ] API keys secured (never commit)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Error handling tested

### Backend Deployment
- [ ] Push code to GitHub
- [ ] Connect to hosting (Render, Railway, Heroku)
- [ ] Set environment variables in dashboard
- [ ] Test API endpoints
- [ ] Set up logging

### Frontend Deployment
- [ ] Connect GitHub repo to Vercel/Netlify
- [ ] Set backend API URL
- [ ] Test all audit flows
- [ ] Set up monitoring
- [ ] Configure custom domain

---

## Development Commands

### Backend
```bash
# Run with auto-reload
python app.py

# Run in production mode
FLASK_ENV=production python app.py

# Run with custom port
python app.py --port 5001
```

### Frontend
```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Frontend)                        │
│                    http://localhost:3000                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Next.js + React 19 + Shadcn UI             │  │
│  │  - URL Input Form                                    │  │
│  │  - Lighthouse Results Display                        │  │
│  │  - GEO Score Visualization                           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ HTTP POST
        ┌──────────────────────────────────────┐
        │    Backend API (Flask)               │
        │    http://localhost:5000             │
        │  POST /api/audit                     │
        └──────────────────────────────────────┘
                ↙             ↓              ↘
        ┌──────────┐   ┌────────────┐  ┌──────────┐
        │Lighthouse│   │BeautifulSoup│  │ Gemini   │
        │   CLI    │   │(HTML Parse) │  │   API    │
        └──────────┘   └────────────┘  └──────────┘
```

---

## Next Steps

1. **Get Gemini API Key** (optional but recommended)
   - Visit: https://makersuite.google.com/app/apikey
   - Create API key
   - Add to `.env` file

2. **Customize GEO Scoring**
   - Edit `backend/app.py`
   - Modify `calculate_geo_score()` function
   - Add custom signals

3. **Add Database**
   - Install PostgreSQL or MongoDB
   - Add audit history tracking
   - Generate historical reports

4. **Deploy to Production**
   - Follow deployment checklist above
   - Set up CI/CD with GitHub Actions
   - Monitor with Sentry or similar

---

## Support Resources

- **Flask Documentation**: https://flask.palletsprojects.com/
- **Lighthouse CLI**: https://github.com/GoogleChrome/lighthouse
- **Next.js Documentation**: https://nextjs.org/docs
- **BeautifulSoup Docs**: https://www.crummy.com/software/BeautifulSoup/
- **Gemini API**: https://makersuite.google.com/

---

## Version Info

- Node.js: 18+
- Python: 3.8+
- Next.js: 16
- React: 19
- Flask: 2.3.3
- Lighthouse: Latest

Last updated: January 31, 2024
