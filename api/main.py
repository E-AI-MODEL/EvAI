from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
from core_runtime.EvAIRuntime import EvAIRuntime
from core_runtime.logger import evai_logger
from .config import settings

app = FastAPI(title="EvAI API", description="API for the EvAI reflective AI system")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API key dependency
async def verify_api_key(x_api_key: str = Header(None)):
    if x_api_key != settings.API_KEY:
        raise HTTPException(
            status_code=403,
            detail="Invalid API key"
        )
    return x_api_key

# Initialize EvAI runtime
evai = EvAIRuntime()

class Query(BaseModel):
    text: str
    context: Optional[Dict] = None
    lim_profile: Optional[str] = None

class Response(BaseModel):
    answer: str
    reasoning_steps: List[Dict]
    active_seeds: List[Dict]
    validation_score: float
    confidence: float

@app.post("/query", response_model=Response)
async def process_query(query: Query, api_key: str = Depends(verify_api_key)):
    """Process a query through EvAI"""
    try:
        # Log the interaction
        evai_logger.log_interaction({
            "query": query.text,
            "context": query.context,
            "lim_profile": query.lim_profile
        })

        # Process the query
        result = evai.generate_cot({
            "query": query.text,
            "context": query.context or {},
            "lim_profile": query.lim_profile
        })

        # Log the response
        evai_logger.log_interaction({
            "response": result,
            "query": query.text
        })

        return Response(
            answer=result["answer"],
            reasoning_steps=result["reasoning_steps"],
            active_seeds=result["active_seeds"],
            validation_score=result.get("validation_score", 0.0),
            confidence=result.get("confidence", 0.0)
        )

    except Exception as e:
        evai_logger.log_error({"error": str(e)})
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Check if the API is running"""
    return {"status": "healthy"}

@app.get("/seeds")
async def get_active_seeds():
    """Get currently active seeds"""
    try:
        seeds = evai.seed_memory.get_active_seeds({})
        return {"seeds": seeds}
    except Exception as e:
        evai_logger.log_error({"error": str(e)})
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 