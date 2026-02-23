# Site Auditor - Quick Start (5 Minutes)

## 🚀 Start Backend (Terminal 1)

```bash
cd backend
pip install -r requirements.txt
npm install -g lighthouse
python app.py
```

✅ Should show: `Running on http://127.0.0.1:5000`

---

## 🚀 Start Frontend (Terminal 2)

```bash
npm run dev
```

✅ Should show: `Local: http://localhost:3000`

---

## 🌐 Open Browser

```
http://localhost:3000
```

---

## ✅ Test Audit

1. Paste URL: `https://example.com` (or any public site)
2. Click "Run Audit"
3. Wait 30-90 seconds (real Lighthouse is working)
4. See real results! 🎉

---

## 📊 What You'll See

### Lighthouse Tab
- Performance: Real score
- Accessibility: Real score  
- Best Practices: Real score
- SEO: Real score

### GEO Tab
- GEO Score: Calculated from 4 signals
- Answer Nugget: How well intro answers question
- Extractability: HTML structure quality
- Authority: External links quality
- Sentiment: Content objectivity
- Suggestions: Real recommendations

---

## ❌ Issues?

### "Command not found: lighthouse"
```bash
npm install -g lighthouse
```

### "Port 5000 already in use"
```bash
lsof -ti:5000 | xargs kill -9
```

### "Failed to connect to backend"
- Make sure backend is running on Terminal 1
- Check http://localhost:5000/api/health in browser

### "Please enter valid URL"
- Only public URLs work (not localhost, 192.168.x.x)
- Try: `https://google.com`

---

## 📚 Full Documentation

| Document | Purpose |
|----------|---------|
| README.md | Project overview & features |
| SETUP_GUIDE.md | Detailed installation |
| PROJECT_STRUCTURE.md | File organization |
| TROUBLESHOOTING.md | Debug guide |
| IMPLEMENTATION_SUMMARY.md | What changed from mock to real |

---

## 🔧 Development Commands

```bash
# Backend
cd backend
python app.py                    # Run backend
FLASK_DEBUG=True python app.py  # Run with debug

# Frontend
npm run dev                      # Development
npm run build                    # Production build
npm run lint                     # Code quality
npm start                        # Production server
```

---

## 🌍 Test Different Sites

```
✅ Works:
- https://google.com
- https://github.com
- https://twitter.com
- https://wikipedia.org

❌ Won't work:
- http://localhost:3000
- http://192.168.1.100
- http://example.local
```

---

## 🎯 What's Real

✅ Lighthouse audits (Google's official tool)
✅ GEO scoring (4 real signals)
✅ Suggestions (based on actual page analysis)
✅ Performance metrics (real Core Web Vitals)

---

## 💡 Pro Tips

1. **First audit takes longest** - Lighthouse needs time to measure
2. **Same site = similar results** - Minor variance is normal (±5 points)
3. **Simpler sites audit faster** - Mobile sites < large corporate sites
4. **Check browser console** - F12 shows API calls and errors
5. **Backend logs show details** - Check Terminal 1 for debugging

---

## 📋 Checklist

- [ ] Node.js installed (`node --version`)
- [ ] Python installed (`python --version`)
- [ ] Lighthouse installed (`lighthouse --version`)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Audit runs and shows results

---

## 🚢 Deploy to Production

### Backend (Python)
- Deploy to: Render, Railway, AWS Lambda, or Hercel
- Set env vars: `GEMINI_API_KEY`, `FLASK_ENV=production`
- Ensure: Lighthouse, Python, Chrome/Chromium installed

### Frontend (Next.js)
- Deploy to: Vercel, Netlify, or any Node.js host
- Set env var: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`
- Build: `npm run build`

---

## 🆘 Emergency Resets

```bash
# Kill all Node/Python processes
killall node
killall python

# Clear cache
rm -rf node_modules .next
npm install
npm run dev

# Reinstall backend
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```

---

## 📞 Quick Support

1. **Check terminal output** - First place to look
2. **Check browser console** - F12 → Console tab
3. **Run health check** - `curl http://localhost:5000/api/health`
4. **Check documentation** - See list above
5. **Review TROUBLESHOOTING.md** - Most issues covered there

---

## 🎓 Learn More

- How it works: See `/backend/app.py` - it's well-commented
- GEO algorithm: Lines 10-150 in app.py
- Frontend integration: Lines 110-160 in /app/page.tsx
- Component structure: /components/ folder

---

## ✨ You're All Set!

You now have a **production-ready** Site Auditor that:
- Runs real Lighthouse audits
- Calculates honest GEO scores
- Generates actionable suggestions
- Shows all results in real-time

Start auditing! 🚀

---

Questions? See TROUBLESHOOTING.md or check the full documentation.
