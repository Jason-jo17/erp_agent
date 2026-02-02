
import os
import asyncio
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
import httpx

load_dotenv()

async def test_keys():
    print("Locked & Loaded Environment Variables:")
    
    keys = [
        os.getenv("GOOGLE_API_KEY"),
        os.getenv("GOOGLE_API_KEY_BACKUP")
    ]
    openrouter_key = os.getenv("OPENROUTER_API_KEY") 
    
    print(f"🔑 Google Primary: {keys[0][:10]}..." if keys[0] else "❌ Missing Primary")
    print(f"🔑 Google Backup: {keys[1][:10]}..." if keys[1] else "❌ Missing Backup")
    print(f"🔑 OpenRouter: {openrouter_key[:10]}..." if openrouter_key else "❌ Missing OpenRouter")
    print("-" * 40)

    # Test Google Keys
    for idx, key in enumerate(keys):
        if not key: continue
        print(f"\n🧪 Testing Google Key #{idx+1}...")
        try:
            llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                google_api_key=key,
                temperature=0.1
            )
            resp = await llm.ainvoke([HumanMessage(content="Hello")])
            print(f"✅ Success! Response: {resp.content}")
        except Exception as e:
            print(f"❌ Failed: {e}")

    # Test OpenRouter
    if openrouter_key:
        print(f"\n🧪 Testing OpenRouter (Free Model)...")
        try:
            url = "https://openrouter.ai/api/v1/chat/completions"
            headers = {"Authorization": f"Bearer {openrouter_key}"}
            payload = {
                "model": "google/gemini-2.0-flash-exp:free",
                "messages": [{"role": "user", "content": "Hello"}],
            }
            async with httpx.AsyncClient() as client:
                resp = await client.post(url, json=payload, headers=headers)
                if resp.status_code == 200:
                    print(f"✅ Success! Response: {resp.json()['choices'][0]['message']['content']}")
                else:
                    print(f"❌ Failed ({resp.status_code}): {resp.text}")
        except Exception as e:
            print(f"❌ OpenRouter Exception: {e}")

if __name__ == "__main__":
    asyncio.run(test_keys())
