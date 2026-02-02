from typing import Dict, List, Any, Optional
from .base_agent import BaseAgent
from ..tools.database_tools import DatabaseTools
from ..tools.calculation_tools import CalculationTools
from ..tools.document_tools import DocumentTools
import json

class AcademicAgent(BaseAgent):
    """Academic Operations Agent using FREE Grok model."""
    
    def __init__(self):
        super().__init__(
            agent_name="Academic Agent",
            agent_description="Manages timetables, attendance, workload, and OBE"
        )
        self.db_tools = DatabaseTools()
        self.calc_tools = CalculationTools()
        self.doc_tools = DocumentTools()
    
    def _initialize_tools(self) -> List[Dict]:
        return [
            {
                "type": "function",
                "function": {
                    "name": "fetch_attendance",
                    "description": "Fetch attendance records for students/courses with filters",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "student_id": {"type": "string"},
                            "course_id": {"type": "string"},
                            "date_range": {
                                "type": "object",
                                "properties": {
                                    "start": {"type": "string", "format": "date"},
                                    "end": {"type": "string", "format": "date"}
                                }
                            }
                        }
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "calculate_co_attainment",
                    "description": "Calculate Course Outcome attainment for NBA",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "course_id": {"type": "string"},
                            "academic_year": {"type": "string"},
                            "semester": {"type": "integer"}
                        },
                        "required": ["course_id", "academic_year", "semester"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "identify_attendance_shortage",
                    "description": "Identify students with attendance below 75%",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "course_id": {"type": "string"},
                            "threshold": {"type": "number", "description": "Default 75"}
                        },
                        "required": ["course_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "generate_shortage_letters",
                    "description": "Generate attendance shortage letters",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "student_ids": {"type": "array", "items": {"type": "string"}},
                            "course_id": {"type": "string"}
                        },
                        "required": ["student_ids", "course_id"]
                    }
                }
            }
        ]
    
    def _build_system_prompt(self) -> str:
        return """You are the Academic Operations Agent for an AICTE-compliant engineering college.

AICTE EXPERTISE:
- Faculty Workload Norms:
  * Assistant Professor: 16 hours/week
  * Associate Professor: 12-14 hours/week
  * Professor: 8-10 hours/week
- Attendance: 75% minimum requirement
- OBE Framework: CO (6) → PO (12) → PSO (2-4) mapping

CAPABILITIES:
1. Fetch and analyze attendance data
2. Generate optimized timetables
3. Calculate CO-PO attainment
4. Identify attendance shortages
5. Generate letters and reports

ALWAYS:
- Cite specific AICTE regulations
- Provide actionable insights
- Maintain professional tone
- Ensure compliance"""
    
    async def _execute_agent_logic(
        self, query: str, context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Execute academic operations using FREE Grok."""
        
        messages = [{"role": "user", "content": query}]
        if context and context.get("conversation_history"):
            messages = context["conversation_history"] + messages
        
        # Call LLM
        response = await self._call_llm(messages, tools=self.tools)
        
        actions_taken = []
        documents_generated = []
        
        # Check if the model wants to call a tool
        if response.tool_calls:
            tool_results = await self._execute_tool_calls(response.tool_calls)
            
            # Add results to conversation
            messages.append(response) # Add the assistant's tool call message
            
            for result in tool_results:
                messages.append({
                    "role": "tool",
                    "tool_call_id": result["tool_call_id"],
                    "content": json.dumps(result["result"])
                })
                actions_taken.append(result)
            
            # Get final response after tools
            # Note: Need to provide tools again if we want it to potentially call more, but usually one round is enough
            final_response = await self._call_llm(messages)
            text_response = final_response.content
        else:
            text_response = response.content
        
        return {
            "response": text_response,
            "actions_taken": actions_taken,
            "documents_generated": documents_generated,
            "metadata": {
                "cost": 0.0
            }
        }
    
    async def _execute_tool(self, tool_name: str, tool_args: Dict) -> Any:
        try:
            if tool_name == "fetch_attendance":
                return await self.db_tools.fetch_attendance(**tool_args)
            elif tool_name == "calculate_co_attainment":
                return await self.calc_tools.calculate_co_attainment(**tool_args)
            elif tool_name == "identify_attendance_shortage":
                threshold = tool_args.get("threshold", 75.0)
                return await self.db_tools.fetch_students_below_attendance_threshold(
                    course_id=tool_args["course_id"], threshold=threshold
                )
            elif tool_name == "generate_shortage_letters":
                letters = []
                for student_id in tool_args["student_ids"]:
                    student_data = await self.db_tools.get_student_data(student_id)
                    course_data = await self.db_tools.get_course_data(tool_args["course_id"])
                    letter_url = await self.doc_tools.generate_attendance_shortage_letter(
                        student_data=student_data, course_data=course_data
                    )
                    letters.append(letter_url)
                return {"status": "success", "letters_generated": len(letters), "letter_urls": letters}
            else:
                return {"error": f"Unknown tool: {tool_name}"}
        except Exception as e:
            return {"error": str(e)}
