from typing import Dict, Any, Optional, Callable
import asyncio

class AgentCommunicator:
    """
    Facilitates direct communication between agents.
    Acts as a central registry and router for inter-agent requests.
    """
    def __init__(self):
        self._agents: Dict[str, Any] = {}
        
    def register_agent(self, agent_name: str, agent_instance: Any):
        """Register an agent instance to receive requests."""
        self._agents[agent_name.lower()] = agent_instance
        print(f"📡 Agent Registered: {agent_name}")

    async def send_request(self, from_agent: str, to_agent: str, action: str, params: Dict[str, Any] = {}) -> Any:
        """
        Send a request from one agent to another.
        """
        target = self._agents.get(to_agent.lower())
        if not target:
            raise ValueError(f"Target agent '{to_agent}' not found or not online.")
            
        print(f"📞 Agent Call: {from_agent} -> {to_agent} [Action: {action}]")
        
        # Check if target has the specific action method exposed
        # Convention: public methods or specific 'handle_request' 
        if hasattr(target, action) and callable(getattr(target, action)):
            method = getattr(target, action)
            if asyncio.iscoroutinefunction(method):
                return await method(**params)
            else:
                return method(**params)
        elif hasattr(target, "process_inter_agent_request"):
            # Fallback to generic handler if available
            return await target.process_inter_agent_request(from_agent, action, params)
        else:
             raise ValueError(f"Agent '{to_agent}' does not support action '{action}'.")

    def get_online_agents(self):
        return list(self._agents.keys())

# Global Instance
agent_communicator = AgentCommunicator()
