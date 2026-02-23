from typing import List
from fastapi import FastAPI, Request
from crawler import scrape_page
from summary import summarize_with_cohere
from llm import query_groq_llm
from fastapi.middleware.cors import CORSMiddleware

import os

PROMPT = """
You are a Generative Engine Optimization (GEO) analyst.

Your task is to analyze how an AI-generated answer aligns with:
1) The user's webpage content
2) Each competitor webpage content

You MUST prioritize the user's webpage in depth and recommendations.

--------------------
INPUTS YOU WILL RECEIVE
--------------------
- An AI-generated answer
- A summary of the user's webpage
- Summaries of multiple competitor webpages (each with its URL)

--------------------
ANALYSIS REQUIREMENTS
--------------------

For EACH URL (user + competitors), analyze:

1. Alignment with the AI-generated answer
   - Which topics from the AI answer are present
   - Which topics are missing or weak
   - Approximate relevance percentage (0–100)

2. Structural comparison
   - Content structure used (definitions, steps, lists, examples, FAQs)
   - Structural strengths that help AI extraction
   - Structural weaknesses or gaps

3. AI selection reasoning
   - Which content elements the AI answer appears to reuse or prefer
   - Why those elements are favored by generative models
   - Which URL is the closest match to the AI answer overall

--------------------
USER vs COMPETITOR COMPARISON (IMPORTANT)
--------------------
Specifically compare:
- What competitors include that the user's page does not
- What the user's page includes that competitors do not
- Where competitors outperform the user in clarity, completeness, or structure

--------------------
GEO OPTIMIZATION RECOMMENDATIONS
--------------------

Provide recommendations for EACH URL.

For competitor URLs:
- Brief suggestions (optional improvements)

For the USER URL (highest priority):
- Missing sections or concepts to add
- Recommended content formats (FAQ, step-by-step, glossary, definitions, examples)
- Structural improvements (clear headings, concise summaries, reusable chunks)
- Each recommendation must answer:
  "What should be added or modified so that generative AI engines can better understand, extract, and reuse this content?"

Focus on clarity, structure, and completeness.
Do NOT mention SEO keywords or search engines.

--------------------
OUTPUT FORMAT (STRICT)
--------------------
Return ONLY valid JSON in the following structure:

{
  "overall_alignment": {
    "most_aligned_url": "<url>",
    "reason": "<why this URL aligns best with the AI answer>"
  },
  "url_analysis": {
    "user_url": {
      "relevance_percent": number,
      "topics_covered": [string],
      "topics_missing": [string],
      "structural_strengths": [string],
      "structural_gaps": [string],
      "ai_preferred_elements": [string],
      "comparison_with_competitors": {
        "advantages": [string],
        "disadvantages": [string]
      },
      "geo_recommendations": [
        {
          "recommendation": string,
          "why_it_helps_ai_generation": string
        }
      ]
    },
    "competitors": [
      {
        "url": "<competitor_url>",
        "relevance_percent": number,
        "topics_covered": [string],
        "topics_missing": [string],
        "structural_strengths": [string],
        "structural_gaps": [string],
        "ai_preferred_elements": [string],
        "geo_recommendations": [string]
      }
    ]
  }
}

--------------------
IMPORTANT RULES
--------------------
- Do not include explanations outside the JSON.
- Do not repeat the input text verbatim.
- Be concise but precise.
- Prioritize the user's webpage in depth and detail.
For the competitors section:

- You will receive multiple competitor URLs.
- You MUST analyze EVERY competitor URL separately.
- Create EXACTLY ONE object in the "competitors" array per competitor URL provided.
- Do NOT merge competitors.
- Do NOT omit any competitor, even if relevance is low.
- Preserve the original order of competitor URLs as provided.

"""

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # allow all origins
    allow_credentials=True,
    allow_methods=["*"],        # allow all HTTP methods
    allow_headers=["*"],        # allow all headers
)


summaries = []

@app.get("/")
async def health():
    return {"message":"Health ok"}

@app.post("/generate/summary")
async def crawl_and_summarize(request: Request):
    try:
        body = await request.json()  
        user_url = body.get("user_url")
        urls: List[str] = body.get("urls", [])
        query = body.get("query")  # Extract user question

        if not user_url or not urls:
            return {"error": "Please provide 'user_url' and 'urls' list in JSON body."}

        # Scrape user URL
        try:
            output = scrape_page(user_url)
            content = output.get("content", "")
            if not content:
                return {"error": f"Failed to scrape content from {user_url}"}
            user_summary = summarize_with_cohere(content, query)
        except Exception as e:
            return {"error": f"Error processing user URL: {str(e)}"}

        # Scrape competitor URLs
        summaries_list = []
        for url in urls:
            try:
                output = scrape_page(url)
                content = output.get("content", "")
                if content:
                    summary = summarize_with_cohere(content, query)
                    summaries_list.append({"url": url, "summary": summary})
                else:
                    summaries_list.append({"url": url, "summary": "Failed to scrape content"})
            except Exception as e:
                summaries_list.append({"url": url, "summary": f"Error: {str(e)}"})

        summaries.append({"user_summary": user_summary, "competitor_summaries": summaries_list})
        return {"count": len(urls), "user_summary": user_summary, "competitor_summaries": summaries_list}
    
    except Exception as e:
        return {"error": f"Server error: {str(e)}"}


@app.post("/generate_llm_response")
async def generate_llm_response(request: Request):
    try:
        body = await request.json()  
        user_query = body.get("query")
        if not user_query:
            return {"error": "Please provide 'query' in JSON body."}
        response = query_groq_llm(user_query)
        summaries.append({"llm_resp":response})
        return {"response":response}
    except Exception as e:
        return {"error": f"Server error: {str(e)}"}

@app.post("/compare")
async def compare():
    try:
        if len(summaries) < 2:
            return {
                "error": "Not enough data. Call /generate/summary and /generate_llm_response first."
            }
        llm_resp = None
        user_summary = None
        competitor_summaries = None

        for item in reversed(summaries):
            if "llm_resp" in item and llm_resp is None:
                llm_resp = item["llm_resp"]
            if "user_summary" in item and user_summary is None:
                user_summary = item["user_summary"]
                competitor_summaries = item["competitor_summaries"]

            if llm_resp and user_summary and competitor_summaries:
                break

        if not llm_resp or not user_summary or not competitor_summaries:
            return {"error": "Missing required summaries for comparison."}

        # Build competitor text
        competitor_text = ""
        for comp in competitor_summaries:
            competitor_text += f"""
URL: {comp['url']}
Summary:
{comp['summary']}
"""

        final_prompt = f"""
{PROMPT}

=== AI GENERATED ANSWER ===
{llm_resp}

=== USER PAGE SUMMARY ===
{user_summary}

=== COMPETITOR PAGE SUMMARIES ===
{competitor_text}
"""

        geo_analysis = query_groq_llm(final_prompt)

        return {
            "geo_analysis": geo_analysis
        }
    except Exception as e:
        return {"error": f"Server error: {str(e)}"}
