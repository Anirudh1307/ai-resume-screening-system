from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import get_settings
from backend.database import init_db
from routes.ats import router as ats_router
from routes.health import router as health_router
from routes.jobs import router as jobs_router
from routes.resumes import router as resumes_router
from routes.screening import router as screening_router


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    version="1.0.0",
    description=(
        "AI-powered applicant tracking system for uploading resumes, processing job "
        "descriptions, and returning ranked candidates."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "AI Resume Screening System is running."}


app.include_router(health_router, prefix=settings.api_prefix)
app.include_router(ats_router, prefix=settings.api_prefix)
app.include_router(resumes_router, prefix=settings.api_prefix)
app.include_router(jobs_router, prefix=settings.api_prefix)
app.include_router(screening_router, prefix=settings.api_prefix)
