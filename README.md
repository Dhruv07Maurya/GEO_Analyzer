# Site Auditor Prototype

Site Auditor is a web application prototype focused on Generative Engine Optimization (GEO) analysis. It audits websites by comparing their content and structure against AI-generated answers and competitor pages. The tool identifies content gaps, strengths and weaknesses, standout structural elements that improve AI visibility (tables, conclusions, FAQs, schemas, lists), and provides specific, actionable recommendations.

It uses strict, hallucination-resistant prompts with fast LLM inference to deliver reliable comparisons.

## Features

- Website content fetching and summarization
- GEO content comparison:
  - Topics competitors cover that the target site misses
  - Strengths and weaknesses in depth, clarity, and completeness
  - Identification of the competitor most aligned with typical AI-generated answers
- Structural GEO analysis:
  - Detection of elements that aid AI extractability (tables, lists, conclusions, headings, schema markup, etc.)
- Targeted recommendations focused on improving clarity, structure, and AI-friendliness
- High-speed LLM integration for summarization and analysis

## Tech Stack

- Frontend: Next.js 14+, React, Tailwind CSS
- Backend: FastAPI (Python) + Next.js API routes
- AI/LLM: Groq API (primary), Cohere (support), Gemini-compatible structured prompting
- Web tools: requests, BeautifulSoup4
- Environment: python-dotenv
- No database (stateless prototype)

## Installation

1. Clone the repository:

   git clone https://github.com/hohohoKirmada/geo-analyzer.git
   cd geo-analyzer

2. Install backend dependencies:

   pip install -r requirements.txt

3. Install frontend dependencies:

   cd site-auditor-prototype
   npm install

4. Set up environment variables:

   cp .env.example .env

Add your API keys (Groq, Cohere, etc.) in `.env`

5. Run the backend (from root):

   uvicorn backend.main:app --reload

or

   python backend/main.py

6. Run the frontend (separate terminal):

   cd site-auditor-prototype
   npm run dev

Open http://localhost:3000 (frontend) or http://localhost:8000/docs (FastAPI docs).

## Usage

1. Start both frontend and backend
2. Enter a target website URL
3. (Optional) Add 2–4 competitor URLs
4. Click Analyze
5. View:
- Sample AI-generated answer
- Content comparison report
- Structural GEO insights
- Improvement recommendations

## Project Structure

.
├── backend/
│   ├── main.py              # API entry point (FastAPI / Flask)
│   ├── llm.py               # LLM calls and prompt logic
│   ├── crawler.py           # Web scraping and content extraction
│   ├── summary.py           # Summarization logic
│   └── ...
├── site-auditor-prototype/  # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── api/
│   │   │   ├── audit/route.ts
│   │   │   ├── geo/route.ts
│   │   │   └── fetch-content/route.ts
│   ├── next.config.mjs
│   └── package.json
├── .env.example
├── requirements.txt
└── README.md

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Contributions are welcome, especially in prompt engineering, additional LLM support, UI improvements, or caching.

## License

MIT License

