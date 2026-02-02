import httpx
import asyncio
import os

# Configuration
PERMIFY_URL = os.getenv("PERMIFY_URL", "http://localhost:3476")
SCHEMA_FILE = "backend/app/auth/schema.perm"

async def push_schema():
    if not os.path.exists(SCHEMA_FILE):
        print(f"Schema file not found: {SCHEMA_FILE}")
        return

    with open(SCHEMA_FILE, 'r') as f:
        schema_content = f.read()

    print(f"Connecting to Permify at {PERMIFY_URL}...")
    
    async with httpx.AsyncClient() as client:
        try:
            # Check Health
            resp = await client.get(f"{PERMIFY_URL}/healthz")
            if resp.status_code != 200:
                print("Permify service is not healthy/reachable.")
                return

            # Write Schema (Tenant ID default: t1)
            payload = {
                "tenant_id": "t1",
                "schema": schema_content
            }
            
            # Note: Endpoint might vary based on Permify version (v1/tenants/{id}/schemas/write)
            resp = await client.post(f"{PERMIFY_URL}/v1/tenants/t1/schemas/write", json=payload)
            
            if resp.status_code == 200:
                print("✅ Schema successfully applied to Permify!")
                print("Version:", resp.json().get("conf_token"))
            else:
                print(f"❌ Failed to write schema: {resp.text}")

        except Exception as e:
            print(f"Connection Error: {e}")

if __name__ == "__main__":
    asyncio.run(push_schema())
