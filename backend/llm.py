import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def query_groq_llm(prompt: str, model: str = "llama-3.1-8b-instant") -> str:
    if not prompt or not prompt.strip():
        return ""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.5,
        max_tokens=1500
    )

    return response.choices[0].message.content.strip()
