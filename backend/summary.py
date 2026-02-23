import os 
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY not found in environment variables")

client = Groq(api_key=api_key)


def summarize_with_cohere(text: str, query: str = None) -> str:
    """
    Summarize text using Groq (renamed from Cohere for compatibility)
    """
    if not text.strip():
        return "No content to summarize."

    try:
        # Limit text length to avoid token limits
        max_chars = 6000 # Increased character limit
        if len(text) > max_chars:
            text = text[:max_chars] + "..."
        
        if query:
            prompt = f"""User Question: "{query}"

Please extract the specific answer to the User Question from the content below. 
If the content contains the answer, summarize THAT part in detail.
If the content mentions relevant concepts, explain them.
If the content is unrelated, provide a brief general summary.

Content:
{text}"""
        else:
            prompt = f"""Please provide a comprehensive summary of the following content. 
Focus on:
1. The main topic and core definition
2. Key features, components, or technical details
3. Specific capabilities or benefits mentioned

Content:
{text}"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a helpful assistant. Your goal is to extract the answer to the user's question from the provided text."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=400 
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        # Return error message instead of crashing
        error_msg = str(e)
        return f"Error summarizing content: {error_msg}"
