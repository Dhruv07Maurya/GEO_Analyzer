# GeoHouse Backend

FastAPI backend for GeoHouse - Generative Engine Optimization analysis tool.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Setup Instructions

### 1. Create Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory with your API keys:

```bash
GROQ_API_KEY=your_groq_api_key_here
COHERE_API_KEY=your_cohere_api_key_here
```

**How to get API keys:**
- **Groq API Key**: Sign up at [https://console.groq.com](https://console.groq.com)
- **Cohere API Key**: Sign up at [https://dashboard.cohere.com](https://dashboard.cohere.com)

### 4. Run the Backend Server

```bash
uvicorn main:app --reload
```

The server will start at `http://localhost:8000`

**Alternative port:**
```bash
uvicorn main:app --reload --port 8080
```

## API Endpoints

### Health Check
```
GET /
```
Returns server health status.

### Generate Summary
```
POST /generate/summary
```
**Body:**
```json
{
  "user_url": "https://yoursite.com",
  "urls": [
    "https://competitor1.com",
    "https://competitor2.com"
  ]
}
```

### Generate LLM Response
```
POST /generate_llm_response
```
**Body:**
```json
{
  "query": "Your question here"
}
```

### Compare Analysis
```
POST /compare
```
Compares user URL with competitors based on previous summaries and LLM response.

## Testing

Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

## Troubleshooting

- **Import errors**: Make sure all dependencies are installed via `pip install -r requirements.txt`
- **API key errors**: Verify your `.env` file has valid API keys
- **Port already in use**: Use a different port with `--port` flag
