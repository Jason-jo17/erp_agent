from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from app.core.recommendation_engine import recommendation_engine

router = APIRouter()

class RecommendationResponse(BaseModel):
    id: str
    title: str
    description: str
    priority: str
    actions: List[dict]
    created_at: str

class ActiveRecommendationRequest(BaseModel):
    query: str
    context: dict

@router.get("/active", response_model=List[RecommendationResponse])
async def get_active_recommendations(role_id: str = "faculty"):
    """Get pending recommendations for a specific role (Passive)"""
    recs = recommendation_engine.get_pending_recommendations(role_id)
    return recs

@router.post("/generate", response_model=List[RecommendationResponse])
async def generate_recommendations(request: ActiveRecommendationRequest):
    """Generate ACTIVE recommendations based on user query"""
    try:
        print(f"📥 Received Generate Request: {request.query} | Context: {request.context}")
        recs = await recommendation_engine.generate_active_recommendations(request.query, request.context)
        print(f"✅ Generated {len(recs)} recs")
        return [
            {
                "id": r.id, 
                "title": r.title, 
                "description": r.description, 
                "priority": r.priority, 
                "actions": r.suggested_actions,
                "created_at": r.created_at.isoformat()
            } 
            for r in recs
        ]
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"❌ Error generating recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))
