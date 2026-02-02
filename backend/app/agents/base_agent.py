from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from ..core.openrouter_client import openrouter_client
import json

class BaseAgent(ABC):
    """Abstract base class for all specialized agents using FREE Grok via OpenRouter."""
    
    def __init__(self, agent_name: str, agent_description: str):
        self.agent_name = agent_name
        self.agent_description = agent_description
        self.llm_client = openrouter_client
        self.tools = self._initialize_tools()
        self.system_prompt = self._build_system_prompt()
    
    @abstractmethod
    def _initialize_tools(self) -> List[Dict]:
        """Initialize agent-specific tools in OpenAI function format."""
        pass
    
    @abstractmethod
    def _build_system_prompt(self) -> str:
        """Build system prompt with role-specific AICTE knowledge."""
        pass
    
    async def process_request(
        self,
        user_query: str,
        user_role: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Process user request with permission checking."""
        try:
            if not self._check_permissions(user_role):
                return {
                    "success": False,
                    "message": "You do not have permission to perform this action.",
                    "requires_escalation": True
                }
            
            result = await self._execute_agent_logic(user_query, context)
            
            return {
                "success": True,
                "agent_name": self.agent_name,
                "response": result["response"],
                "actions_taken": result.get("actions_taken", []),
                "documents_generated": result.get("documents_generated", []),
                "requires_approval": result.get("requires_approval", False),
                "metadata": result.get("metadata", {}),
                "model_used": "x-ai/grok-2-1212"
            }
            
        except Exception as e:
            return {"success": False, "error": str(e), "agent_name": self.agent_name}
    
    @abstractmethod
    async def _execute_agent_logic(
        self, query: str, context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Core agent execution logic."""
        pass
    
    def _check_permissions(self, user_role: str) -> bool:
        """Check if user role has permission. Override in subclasses if strict permissioning needed."""
        return True
    
    async def _call_llm(
        self,
        messages: List[Dict[str, str]],
        tools: Optional[List[Dict]] = None
    ) -> Dict[str, Any]:
        """Call FREE Grok model via OpenRouter."""
        try:
            completion = await self.llm_client.chat.completions.create(
                model="x-ai/grok-2-1212",
                messages=[{"role": "system", "content": self.system_prompt}] + messages,
                tools=tools,
                tool_choice="auto" if tools else None,
                temperature=0.7
            )
            return completion.choices[0].message
        except Exception as e:
            # Fallback or error handling
            print(f"LLM Call Error: {e}")
            raise e
    
    async def _execute_tool_calls(self, tool_calls: List[Any]) -> List[Dict]:
        """Execute tool calls and return results."""
        results = []
        for tool_call in tool_calls:
            try:
                # Handle OpenAI tool call object
                func_name = tool_call.function.name
                func_args = json.loads(tool_call.function.arguments)
                
                result = await self._execute_tool(func_name, func_args)
                
                results.append({
                    "tool_call_id": tool_call.id,
                    "function_name": func_name,
                    "result": result,
                    "success": True
                })
            except Exception as e:
                results.append({
                    "tool_call_id": tool_call.id,
                    "function_name": getattr(tool_call.function, 'name', 'unknown'),
                    "error": str(e),
                    "success": False
                })
        return results
    
    @abstractmethod
    async def _execute_tool(self, tool_name: str, tool_args: Dict) -> Any:
        """Execute specific tool."""
        pass
