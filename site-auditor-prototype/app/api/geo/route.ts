import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const runtime = 'nodejs';

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const { url, content } = await request.json();

    if (!url || !content) {
      return NextResponse.json(
        { error: 'URL and content are required' },
        { status: 400 }
      );
    }

    // Groq API key from environment variables
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Initialize Groq client
    const groq = new Groq({ apiKey: groqApiKey });

    // Clean content to avoid token overflow
    const cleanContent = content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/g, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000);

    const analysisPrompt = `Analyze this website content for GEO (Generative Engine Optimization) - how well it's optimized for AI search engines and LLMs.

Website URL: ${url}
Content (first 3000 chars): ${cleanContent}

Provide ONLY a valid JSON response with this exact structure (no markdown, no extra text):
{
  "answer_nugget": {
    "score": 75,
    "explanation": "explanation here"
  },
  "extractability": {
    "score": 80,
    "explanation": "explanation here"
  },
  "authority": {
    "score": 85,
    "explanation": "explanation here"
  },
  "sentiment": {
    "score": 78,
    "explanation": "explanation here"
  },
  "key_findings": [
    "finding 1",
    "finding 2",
    "finding 3"
  ],
  "recommendations": [
    {
      "title": "title",
      "description": "description",
      "priority": "high",
      "estimatedBoost": 10
    }
  ],
  "overall_analysis": "summary here"
}

Scoring guidelines:
- Answer Nugget (0-100): Does the first paragraph directly answer the main topic?
- Extractability (0-100): How well structured is the HTML for AI parsing?
- Authority (0-100): Does the content cite authoritative sources?
- Sentiment (0-100): How objective and factual is the content?

Return ONLY the JSON object, nothing else.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: analysisPrompt,
        },
      ],
    });

    const responseText = completion.choices[0]?.message?.content || '';

    if (!responseText) {
      return NextResponse.json(
        { error: 'No response from Groq' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(responseText);
    } catch (e) {
      // Try to extract JSON from the response if it contains other text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysisResult = JSON.parse(jsonMatch[0]);
        } catch {
          return NextResponse.json(
            { error: 'Failed to parse Groq response as JSON' },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'No JSON found in Groq response' },
          { status: 500 }
        );
      }
    }

    return addCorsHeaders(NextResponse.json(analysisResult));
  } catch (error) {
    console.error('GEO analysis error:', error);
    return addCorsHeaders(
      NextResponse.json(
        { error: 'Failed to analyze page with Groq' },
        { status: 500 }
      )
    );
  }
}
