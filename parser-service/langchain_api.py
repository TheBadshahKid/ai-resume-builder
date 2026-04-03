from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os

# Stub for future LangChain integrations
# from langchain.prompts import PromptTemplate
# from langchain.chat_models import ChatOpenAI

app = FastAPI(title="AI Resume LangChain Orchestrator")

class StarRequest(BaseModel):
    raw_bullet: str
    job_title: str

class AtsRequest(BaseModel):
    resume_text: str
    job_description: str

@app.post("/rewrite-star")
async def rewrite_star(req: StarRequest):
    """
    Takes a raw bullet and turns it into a Situation-Task-Action-Result format.
    Mocked for MVP.
    """
    # TODO: Connect ChatOpenAI chain here
    mock_result = f"Led {req.job_title} initiatives by implementing X, resulting in 40% increased efficiency."
    return {"original": req.raw_bullet, "rewritten": mock_result}

@app.post("/ats-score")
async def score_ats(req: AtsRequest):
    """
    Calculates semantic distance between JD and Resume.
    """
    # TODO: Connect FAISS/Chroma distance metrics
    return {
        "score": 85,
        "gamified_tier": "Highly Hireable",
        "missing_keywords": ["Kubernetes", "GraphQL"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5003)
