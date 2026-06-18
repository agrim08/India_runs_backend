from fastapi import APIRouter, FastAPI

from backend.api.ranking import router as ranking_router
from backend.api.candidates import router as candidates_router
from backend.api.jd import router as jd_router

app = FastAPI(
    title="India Runs Candidate Ranking Service API",
    description="Backend service api for Candidate Discovery, Validation, Embedding and Ranking.",
    version="1.0.0",
)

# Base API Router
router = APIRouter()


@router.get("/", summary="Root status endpoint.")
def read_root() -> dict:
    """
    Returns the running status of the API server.
    """
    return {"status": "running"}


@router.get("/health", summary="Health check endpoint.")
def read_health() -> dict:
    """
    Returns health status of the application.
    """
    return {"health": "ok"}


# Include routers
app.include_router(router)
app.include_router(ranking_router)
app.include_router(candidates_router)
app.include_router(jd_router)
