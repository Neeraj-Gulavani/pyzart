from google import genai
from google.genai import types
from dotenv import load_dotenv
import os
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)
def askGemini(query):
    with open("external/system_instructions.txt", "r") as f:
        required_instructions = f.read()
    response = client.models.generate_content(
        model = "gemini-2.5-pro",
        config=types.GenerateContentConfig(
        system_instruction=required_instructions),
        contents = query
    )
    return response.text