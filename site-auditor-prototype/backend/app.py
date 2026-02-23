from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json
import requests
from bs4 import BeautifulSoup
import re
import time
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Groq API Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in environment variables. Please check your .env file.")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# ============================================================
# GEO SCORING SYSTEM
# ============================================================

def answer_nugget_score(text):
    """Score how well a page answers a question directly."""
    if not text:
        return 0
    
    first_100_words = " ".join(text.split()[:100])
    length = len(first_100_words.split())
    
    score = 0
    # Perfect summary window: 40-80 words for direct answers
    if 40 <= length <= 80:
        score += 50
    elif 20 <= length < 40:
        score += 30
    elif length > 100:
        score += 20
    
    # Factual tone: multiple sentences
    sentence_count = first_100_words.count(".") + first_100_words.count("!") + first_100_words.count("?")
    if sentence_count >= 2:
        score += 30
    elif sentence_count == 1:
        score += 15
    
    # Avoid marketing language
    marketing_words = ["best", "amazing", "incredible", "revolutionary", "game-changer", "must-have"]
    marketing_count = sum(1 for word in marketing_words if word.lower() in first_100_words.lower())
    if marketing_count > 2:
        score -= 20
    
    return min(max(score, 0), 100)


def extractability_score(html):
    """Score how well structured HTML is for AI extraction."""
    if not html:
        return 0
    
    soup = BeautifulSoup(html, "html.parser")
    
    # Count structured elements
    tables = len(soup.find_all("table"))
    lists = len(soup.find_all(["ul", "ol"]))
    schemas = len(soup.find_all("script", {"type": "application/ld+json"}))
    headings = len(soup.find_all(["h1", "h2", "h3"]))
    
    score = 0
    score += min(tables * 20, 40)  # Tables are goldmines for AI
    score += min(lists * 10, 30)   # Lists structure data nicely
    score += min(schemas * 30, 30) # Schema = machine-readable gold
    score += min(headings * 3, 20) # Clear hierarchy helps
    
    return min(score, 100)


def authority_links_score(html):
    """Score based on authoritative external citations."""
    if not html:
        return 0
    
    soup = BeautifulSoup(html, "html.parser")
    links = [a.get("href", "") for a in soup.find_all("a", href=True)]
    
    authority_domains = [
        "wikipedia.org", ".gov", ".edu", "nytimes.com", "bbc.com",
        "nature.com", "science.org", "github.com", "stackoverflow.com",
        "arxiv.org", "ieee.org", "acm.org"
    ]
    
    authority_count = sum(1 for link in links if any(domain in link for domain in authority_domains))
    total_links = len(links)
    
    if total_links == 0:
        return 0
    
    authority_ratio = authority_count / total_links
    return min(int(authority_ratio * 100), 100)


def sentiment_score(text):
    """Use Groq LLM to score objectivity/factuality of content."""
    if not text:
        return 50
    
    try:
        # Use Groq API with mixtral model
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {
                    "role": "user",
                    "content": f"""Rate this text for objectivity and factuality on a scale of 1-10.
1 = Pure marketing/opinion/biased
10 = Neutral, fact-based, objective

TEXT:
{text[:1000]}

Respond with ONLY a single number 1-10, no explanation."""
                }
            ],
            "temperature": 0.3,
            "max_tokens": 10
        }
        
        response = requests.post(
            GROQ_API_URL,
            json=payload,
            headers=headers,
            timeout=15
        )
        
        if response.status_code == 200:
            result = response.json()
            text_response = result["choices"][0]["message"]["content"].strip()
            # Extract first number from response
            numbers = ''.join(filter(str.isdigit, text_response))
            if numbers:
                score = int(numbers[0])
                return min(max(score, 1), 10) * 10
        
        # Fallback: Use heuristics if API fails
        return 50
    except Exception as e:
        print(f"Groq sentiment score error: {e}")
        return 50  # Default middle score


def calculate_geo_score(html, text):
    """Calculate comprehensive GEO score using Groq for sentiment analysis."""
    nugget = answer_nugget_score(text)
    extractability = extractability_score(html)
    authority = authority_links_score(html)
    
    # Use Groq LLM for sentiment/objectivity scoring
    sentiment = sentiment_score(text)
    
    geo_score = round(
        nugget * 0.25 +
        extractability * 0.3 +
        authority * 0.25 +
        sentiment * 0.2
    )
    
    return min(max(geo_score, 0), 100), {
        "answer_nugget": nugget,
        "extractability": extractability,
        "authority": authority,
        "sentiment": sentiment
    }


def generate_suggestions(html, text, geo_signals):
    """Generate actionable suggestions based on signals."""
    soup = BeautifulSoup(html, "html.parser")
    suggestions = []
    
    tables = len(soup.find_all("table"))
    lists = len(soup.find_all(["ul", "ol"]))
    schemas = len(soup.find_all("script", {"type": "application/ld+json"}))
    
    if tables == 0:
        suggestions.append({
            "title": "Add a Comparison Table",
            "description": "AI systems extract data from tables 3x more effectively. Add a table comparing top options.",
            "priority": "high",
            "estimatedBoost": 15
        })
    
    if geo_signals.get("answer_nugget", 0) < 50:
        suggestions.append({
            "title": "Add a Quick Answer Section",
            "description": "Place a 40-80 word direct answer at the top of your content. AI systems prioritize this.",
            "priority": "high",
            "estimatedBoost": 20
        })
    
    if schemas == 0:
        suggestions.append({
            "title": "Add Schema Markup",
            "description": "Add FAQ or Product schema. This makes your content machine-readable.",
            "priority": "medium",
            "estimatedBoost": 15
        })
    
    if lists < 2:
        suggestions.append({
            "title": "Use Lists for Structure",
            "description": "Break key points into bullet or numbered lists. AI crawlers love structured data.",
            "priority": "medium",
            "estimatedBoost": 10
        })
    
    if geo_signals.get("sentiment", 0) < 60:
        suggestions.append({
            "title": "Use Neutral Language",
            "description": "Reduce marketing words like 'best', 'amazing', 'revolutionary'. Use facts instead.",
            "priority": "high",
            "estimatedBoost": 12
        })
    
    return suggestions[:5]  # Top 5 suggestions


# ============================================================
# LIGHTHOUSE INTEGRATION
# ============================================================

def run_lighthouse_audit(url):
    """Run real Lighthouse audit using CLI."""
    try:
        # Create temp file path that works on Windows/Linux
        import tempfile
        import platform
        
        temp_dir = tempfile.gettempdir()
        output_path = os.path.join(temp_dir, f"lighthouse_{int(time.time())}.json")
        
        # Windows needs shell=True to find 'lighthouse.cmd'
        # or we explicitly call 'lighthouse.cmd'
        command = [
            "lighthouse.cmd" if platform.system() == "Windows" else "lighthouse",
            url,
            "--output=json",
            f"--output-path={output_path}",
            "--chrome-flags=--headless",
            "--quiet"
        ]
        
        print(f"Starting Lighthouse audit for {url}...")
        result = subprocess.run(
            command,
            timeout=120, # Increased timeout for slow sites
            capture_output=True,
            shell=(platform.system() == "Windows") 
        )
        print("Lighthouse audit finished.")
        
        if result.returncode != 0:
            print(f"Lighthouse failed: {result.stderr.decode()}")
            return None
        
        with open(output_path, "r") as f:
            lighthouse_report = json.load(f)
        
        return {
            "categories": {
                "performance": lighthouse_report["categories"]["performance"]["score"] * 100,
                "accessibility": lighthouse_report["categories"]["accessibility"]["score"] * 100,
                "best-practices": lighthouse_report["categories"]["best-practices"]["score"] * 100,
                "seo": lighthouse_report["categories"]["seo"]["score"] * 100,
            },
            "metrics": {
                "lcp": lighthouse_report.get("audits", {}).get("largest-contentful-paint", {}).get("numericValue", 0) / 1000,
                "fid": lighthouse_report.get("audits", {}).get("first-input-delay", {}).get("numericValue", 0),
                "cls": lighthouse_report.get("audits", {}).get("cumulative-layout-shift", {}).get("numericValue", 0),
            }
        }
    except Exception as e:
        print(f"Lighthouse error: {e}")
        return None


# ============================================================
# FETCH PAGE CONTENT
# ============================================================

def fetch_page_content(url):
    """Fetch and parse page content."""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, "html.parser")
        
        # Extract main content
        main_text = ""
        for tag in soup.find_all(["p", "h1", "h2", "h3", "li"]):
            main_text += tag.get_text() + " "
        
        return response.content.decode("utf-8", errors="ignore"), main_text
    except Exception as e:
        print(f"Fetch error: {e}")
        return None, None


# ============================================================
# API ENDPOINTS
# ============================================================

@app.route("/api/audit", methods=["POST"])
def audit_site():
    """Main audit endpoint - runs Lighthouse + GEO analysis."""
    data = request.json
    url = data.get("url")
    
    if not url:
        return jsonify({"error": "URL required"}), 400
    
    # Validate URL
    if not url.startswith(("http://", "https://")):
        url = f"https://{url}"
    
    try:
        # Fetch page content
        html, text = fetch_page_content(url)
        if not html or not text:
            return jsonify({"error": "Failed to fetch page"}), 400
        
        # Run Lighthouse
        lighthouse_data = run_lighthouse_audit(url)
        
        # Calculate GEO score
        geo_score, geo_signals = calculate_geo_score(html, text)
        
        # Generate suggestions
        suggestions = generate_suggestions(html, text, geo_signals)
        
        return jsonify({
            "url": url,
            "timestamp": datetime.now().isoformat(),
            "lighthouse": lighthouse_data,
            "geoScore": geo_score,
            "geoSignals": geo_signals,
            "suggestions": suggestions
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
