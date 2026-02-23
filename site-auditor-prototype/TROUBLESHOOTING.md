# Site Auditor - Troubleshooting Guide

## Quick Checklist

```
□ Backend running on port 5000?
□ Frontend running on port 3000?
□ CORS enabled in Flask?
□ Lighthouse CLI installed?
□ Chrome/Chromium installed?
□ Internet connection active?
□ URL is public (not localhost)?
```

---

## Frontend Issues

### 1. "Failed to connect to backend" Error

**Error Message**:
```
Failed to connect to backend. Make sure Python backend is running on http://localhost:5000
```

**Causes & Solutions**:

✅ **Backend not running**
```bash
# In terminal 1: Start backend
cd backend
python app.py
# Should see: Running on http://127.0.0.1:5000
```

✅ **Wrong port**
- Frontend expects: `http://localhost:5000`
- Check in `/app/page.tsx` line ~125
- Backend should be running on 5000

✅ **CORS blocked**
- Backend has CORS enabled by default
- If you see CORS error in browser console:
  ```python
  # In backend/app.py, check:
  from flask_cors import CORS
  CORS(app)  # Must be present
  ```

✅ **Firewall/Network**
```bash
# Test backend is accessible
curl http://localhost:5000/api/health
# Should return: {"status":"ok"}
```

---

### 2. Blank Page on http://localhost:3000

**Causes & Solutions**:

✅ **Build errors**
```bash
# Check console for errors
npm run build
# If fails, try:
rm -rf .next node_modules
npm install
npm run dev
```

✅ **Module not found**
```bash
# Reinstall dependencies
npm install
npm run dev
```

✅ **Port 3000 in use**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

---

### 3. "Please enter a valid URL" When URL IS Valid

**Cause**: URL validation is too strict.

**Check**:
```typescript
// In /app/page.tsx, validateUrl() function
// Should accept:
✅ https://example.com
✅ http://example.com  
✅ example.com (will add https://)

❌ localhost:3000 (blocked - private)
❌ 192.168.x.x (blocked - private)
❌ example.local (blocked - private)
```

**Solution**: Use public URLs only.

---

### 4. Loading Indicator Spins Forever

**Cause**: Backend is hung or taking too long.

**Solutions**:

✅ **Lighthouse timeout**
- Lighthouse takes 30-90 seconds for real audits
- Try with simpler website (Google.com)
- Check backend console for errors

✅ **Backend crashed**
```bash
# Check backend terminal for errors
# Restart backend
python app.py
```

✅ **URL unreachable**
- Try manually visiting the URL in browser
- Ensure URL is publicly accessible

---

### 5. Results Show But No GEO Data

**Cause**: GEO data not passed to component.

**Check**: Browser console for errors:
```javascript
// Open DevTools (F12) → Console
// Look for errors about geoScore, geoSignals
```

**Solution**:
```javascript
// In /app/page.tsx, ensure:
(window as any).__auditData = data;  // This line exists
```

---

## Backend Issues

### 1. "Command 'lighthouse' not found"

**Error**:
```
FileNotFoundError: [Errno 2] No such file or directory: 'lighthouse'
```

**Solution**:
```bash
# Install lighthouse globally
npm install -g lighthouse

# Verify installation
lighthouse --version
# Should show: 12.1.0 (or similar)

# If still not found, check PATH
which lighthouse  # macOS/Linux
where lighthouse  # Windows
```

---

### 2. "Chrome not found" / Lighthouse Won't Run

**Error**:
```
Error: No Chrome instances found
```

**Solution**:

✅ **Install Chrome**
- macOS: `brew install chromium`
- Linux: `apt-get install chromium-browser`
- Windows: Download from google.com/chrome

✅ **Use Chromium instead**
```python
# In backend/app.py, modify subprocess call:
subprocess.run(
    [
        "lighthouse",
        url,
        "--chrome-flags=--headless --no-sandbox",
        # Add this flag for Linux servers:
    ],
    # ...
)
```

---

### 3. Lighthouse Audit Takes Too Long

**Normal behavior**: 30-90 seconds is expected.

**If taking longer than 2+ minutes**:

✅ **Kill and restart**
```bash
# Find lighthouse processes
ps aux | grep lighthouse
# Kill them
kill -9 <PID>
```

✅ **Try with simpler site**
- Large sites take longer
- Try: `https://google.com` first

✅ **Increase timeout**
```python
# In backend/app.py:
subprocess.run(
    [...],
    timeout=120,  # Increase from 60 to 120 seconds
)
```

---

### 4. "Port 5000 Already in Use"

**Error**:
```
Address already in use
```

**Solution**:
```bash
# Find process on port 5000
lsof -i :5000

# Kill it
kill -9 <PID>

# Or use different port
python app.py --port 5001
# Then update frontend to http://localhost:5001
```

---

### 5. BeautifulSoup Parse Errors

**Error**:
```
ParserWarning: No parser specified for HTML
```

**Solution**:
```python
# In backend/app.py, ensure:
soup = BeautifulSoup(html, "html.parser")
# NOT:
soup = BeautifulSoup(html)  # Wrong - no parser
```

---

### 6. Gemini API Errors

**Error**:
```
Error calling Gemini API / Invalid API key
```

**Solutions**:

✅ **Check API key**
```bash
# In backend/.env:
GEMINI_API_KEY=AIzaSyAcUVLcAlnZESyBIp3iyPsrMUZCKJa9738
# Make sure no spaces or quotes
```

✅ **Verify key is valid**
- Visit: https://makersuite.google.com/app/apikey
- Create new key if needed

✅ **API rate limited**
- Gemini API has usage limits
- Wait 1 hour before retrying

---

### 7. Page Fetch Timeout

**Error**:
```
requests.exceptions.Timeout: Connection timeout
```

**Causes**:
- Website very slow
- Website blocks requests
- Internet connection down

**Solution**:
```python
# In backend/app.py, increase timeout:
response = requests.get(
    url,
    headers=headers,
    timeout=30  # Increase from 10 to 30 seconds
)
```

---

### 8. "Failed to run audit" on Frontend

**Debug steps**:

1. **Check backend logs**:
   ```
   Look at terminal where python app.py is running
   See actual error message
   ```

2. **Test endpoint directly**:
   ```bash
   curl -X POST http://localhost:5000/api/audit \
     -H "Content-Type: application/json" \
     -d '{"url":"https://example.com"}'
   ```

3. **Check request format**:
   ```javascript
   // In browser console, manually test:
   fetch('http://localhost:5000/api/audit', {
     method: 'POST',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify({url: 'https://example.com'})
   }).then(r => r.json()).then(console.log)
   ```

---

## Network Issues

### CORS Errors in Browser Console

**Error**:
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution**: Already handled by Flask-CORS, but if issues:

```python
# In backend/app.py:
from flask_cors import CORS

CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
```

---

### Can't Reach Backend From Browser

**Test**:
```bash
# In browser console:
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**If fails**:
1. Ensure backend is running
2. Check port is 5000 (not 5001, etc)
3. Try `http://127.0.0.1:5000` instead of `localhost`
4. Check firewall not blocking

---

## Data Issues

### GEO Score is 0 or Too Low

**Likely causes**:
- Website has no HTML structure (plain text)
- Website uses heavy JavaScript rendering
- Website blocks scraping

**Solutions**:
1. Try different website
2. Check GEO signal breakdown (which score is low?)
3. Improve target website:
   - Add tables/lists
   - Add schema markup
   - Write clearer intro

---

### Lighthouse Scores Don't Make Sense

**Examples**:
- Lighthouse says 100 in Lighthouse tab, but backend returned different number
- Scores fluctuate between audits

**Explanation**:
- Lighthouse scores vary slightly between runs (normal)
- Network/system load affects results
- Expected variance: ±5 points

**Solution**: Re-run audit if you doubt results.

---

### Empty Suggestions

**Cause**: Website is already well-optimized.

**What to do**:
- Congratulations! Website is GEO-ready
- Focus on other optimizations
- Check GEO signals for any weakness

---

## Performance Issues

### Frontend Slow / Laggy

**Solutions**:
```bash
# Clear cache
rm -rf .next

# Rebuild
npm run build

# Check bundle size
npm run build
# Look for large dependencies
```

---

### Backend Slow

**Solutions**:
```bash
# Check system resources
top  # or Task Manager on Windows

# Profile with timing
# Add to backend/app.py:
import time
start = time.time()
# ... code ...
print(f"Time taken: {time.time() - start}s")
```

---

## Production Issues

### Backend Deployment Error

**Ensure in production environment**:
- [ ] All environment variables set
- [ ] Python 3.8+ installed
- [ ] Lighthouse CLI installed
- [ ] Chrome/Chromium available
- [ ] Can write to /tmp directory

```bash
# Test production deployment locally:
FLASK_ENV=production python app.py
```

---

### Frontend Deployment Error

**Ensure**:
- [ ] `NEXT_PUBLIC_API_URL` set correctly
- [ ] Backend API accessible from frontend
- [ ] Build succeeds: `npm run build`
- [ ] No hardcoded localhost URLs

---

## Getting Help

### 1. Check the Logs

**Backend**:
```bash
# Terminal where python app.py is running
# Look for error messages
```

**Frontend**:
```bash
# Browser console (F12)
# Check for error messages
# Look for network tab → XHR requests
```

### 2. Test Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Audit endpoint
curl -X POST http://localhost:5000/api/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

### 3. Enable Debug Mode

**Backend**:
```bash
# Run with debug info
FLASK_DEBUG=True python app.py
```

**Frontend**:
```bash
# Add to /app/page.tsx
console.log("[v0] Audit result:", data);
console.log("[v0] GEO signals:", data.geoSignals);
```

### 4. Check Documentation

- [ ] README.md - Full project overview
- [ ] SETUP_GUIDE.md - Step-by-step setup
- [ ] PROJECT_STRUCTURE.md - File organization

---

## System Requirements Checker

Run this to verify your system:

**macOS/Linux**:
```bash
#!/bin/bash
echo "Node.js:" && node --version
echo "Python:" && python3 --version
echo "Lighthouse:" && lighthouse --version
echo "Chrome:" && which google-chrome || which chromium || which "Google Chrome"
echo "npm:" && npm --version
```

**Windows**:
```cmd
node --version
python --version
npm list -g lighthouse
where chrome
npm --version
```

---

## Still Stuck?

1. **Review error message carefully** - Most issues are self-explanatory
2. **Check the logs** - Terminal output usually has the answer
3. **Try the simplest test** - Basic health check endpoint
4. **Restart everything** - Often solves temporary issues
5. **Check prerequisites** - Node.js, Python, Chrome installed?
6. **Review setup guide** - Did you follow all steps?

---

## Common Mistakes

❌ **Running backend without Lighthouse installed**
✅ Solution: `npm install -g lighthouse`

❌ **Using private URL (localhost, 192.168.x.x)**
✅ Solution: Use public URL

❌ **Port conflicts (5000 or 3000 already in use)**
✅ Solution: Kill old processes or use different ports

❌ **Frontend looking for backend on wrong port**
✅ Solution: Update `/app/page.tsx` fetch URL

❌ **Not waiting long enough for Lighthouse**
✅ Solution: Lighthouse audits take 30-90 seconds normally

❌ **env file not loaded**
✅ Solution: Restart backend after changing .env

---

Last Updated: January 31, 2024
