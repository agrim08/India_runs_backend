# pyrefly: ignore [missing-import]
from google import genai
import json
from backend.app.core.config import settings

# Initialize the new Google GenAI client
client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else genai.Client()

MODEL_NAME = "gemini-2.5-flash"
EMBEDDING_MODEL = "gemini-embedding-2"

def get_gemini_client():
    return client

async def generate_embeddings(text: str) -> list[float]:
    """Generates embeddings for a given text using text-embedding-004."""
    response = await client.aio.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
    )
    return response.embeddings[0].values
