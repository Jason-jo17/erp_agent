# Enabling Real AI Agents

The backend agents ("Faculty", "Admin", "Orchestrator") have been upgraded to use **Real LLMs** and **RAG (Retrieval Augmented Generation)**.

## 1. Configuration
To make the agents work, you **MUST** set your API Key in the `backend/.env` file.

```bash
# backend/.env
OPENAI_API_KEY=sk-... 
# OR
GEMINI_API_KEY=... (If you modify llm_service.py to use Gemini)
```

The system currently uses **LangChain with OpenAI** (`gpt-3.5-turbo`) by default suitable for general tasks.

## 2. Knowledge Base
The agents now read from `backend/app/data/knowledge_base/`.
The following documents have been loaded from your provided text:
- `naac_ssr.md`: NAAC Accreditation Standards
- `nba_sar.md`: NBA Accreditation Standards
- `general_info.md`: General Schedule & Info

## 3. How it Works
1. When you send a message, the **Knowledge Service** scans these documents for keywords.
2. Relevant sections are retrieved.
3. The **LLM Service** constructs a response using the context + your query.
4. It returns structured JSON with:
   - `content`: The answer (Markdown).
   - `action_items`: Clickable actions.
   - `suggested_prompts`: Follow-up questions.

## 4. Troubleshooting
- **Response Error**: If the chat says "LLM Error", check your API Key in the console logs.
- **Context Missing**: Add more information to the `.md` files in `backend/app/data/knowledge_base/`.
